import { Pool, PoolClient } from 'pg'
import { Logger } from '../util/Logger'

export type VpnDBConnection = string

export type TransactionIsolation =
    'readUncommitted' | 'readCommitted' | 'repeatableRead' | 'serializable'

export interface VpnDBClientLocator {
  ensureClient(
    connection: VpnDBConnection
  ): Promise<PoolClient>
}

export interface VpnDB extends VpnDBClientLocator {
  withConnection<T>(
    log: Logger,
    fn: (connection: VpnDBConnection) => Promise<T>
  ): Promise<T>

  withTransaction<T>(
    log: Logger,
    fn: (connection: VpnDBConnection) => Promise<T>
  ): Promise<T>

  withTransactionIsolation<T>(
      log: Logger,
      isolation: TransactionIsolation,
      retryAllowed: boolean,
      fn: (connection: VpnDBConnection) => Promise<T>
  ): Promise<T>

  end(): Promise<void>
}

export function makeVpnDB(dbPool: Pool): VpnDB {
  return new VpnDBImpl(dbPool)
}

class VpnDBImpl implements VpnDB {

  private dbPool: Pool
  private connections: { [connection: VpnDBConnection]: PoolClient } = {}
  private connectionsCounter: number = 0

  constructor(dbPool: Pool) {
    this.dbPool = dbPool
  }

  async end(): Promise<void> {
    for (const connection in this.connections) {
      await this.release(connection)
    }
  }

  ensureClient(
    connection: VpnDBConnection
  ): Promise<PoolClient> {
    const client = this.connections[connection]
    return client == null
      ? Promise.reject(`Unknown connection ${connection}`)
      : Promise.resolve(client)
  }

  async connect(): Promise<VpnDBConnection> {
    const client = await this.dbPool.connect()
    const connection = `${this.connectionsCounter++}`
    this.connections[connection] = client
    return connection
  }

  async release(connection: VpnDBConnection): Promise<void> {
    const client = await this.ensureClient(connection)
    await client.release()
    delete this.connections[connection]
  }

  async withConnection<T>(
    log: Logger,
    fn: (connection: VpnDBConnection) => Promise<T>
  ): Promise<T> {
    const connection = await this.connect()
    try {
      return await fn(connection)
    } catch (e) {
      log.error(`${e}`)
      return Promise.reject(e)
    } finally {
      await this.release(connection)
    }
  }

  async withTransaction<T>(
    log: Logger,
    fn: (connection: VpnDBConnection) => Promise<T>
  ): Promise<T> {
    const connection = await this.connect()
    const client = await this.ensureClient(connection)
    try {
      await client.query('BEGIN')
      const res = await fn(connection)
      await client.query('COMMIT')
      return res
    } catch (e) {
      try {
        await client.query('ROLLBACK')
      } catch (rollbackError) {
        log.error(`ROLLBACK failed: ${rollbackError}`)
      }
      log.error(`${e}`)
      return Promise.reject(e)
    } finally {
      await this.release(connection)
    }
  }

  async withTransactionIsolation<T>(
      log: Logger,
      isolation: TransactionIsolation,
      retryAllowed: boolean,
      fn: (connection: VpnDBConnection) => Promise<T>
  ): Promise<T> {
    const connection = await this.connect()
    const client = await this.ensureClient(connection)

    const txIsolation =
        isolation == 'serializable' ? 'SERIALIZABLE'
            : isolation == 'readCommitted' ? 'READ COMMITTED'
                : isolation == 'repeatableRead' ? 'REPEATABLE READ'
                    : 'READ UNCOMMITTED'

    let error: any | undefined = undefined
    let result: T | undefined = undefined

    try {
      let canTry = true
      while (canTry) {
        try {
          await client.query('BEGIN')
          await client.query(`SET TRANSACTION ISOLATION LEVEL ${txIsolation}`)
          result = await fn(connection)
          await client.query('COMMIT')
          canTry = false
        } catch (e: any) {
          canTry = retryAllowed
              && e.hint != null
              && e.hint.indexOf('transaction might succeed if retried') != -1
          if (!canTry) {
            error = e
          }
          try {
            await client.query('ROLLBACK')
          } catch (rollbackError) {
            if (!canTry) {
              log.error(rollbackError, `ROLLBACK failed`)
            }
          }
        }
      }
    } finally {
      await this.release(connection)
    }

    if (result != null) {
      return result
    } else if (error != null) {
      return Promise.reject(error)
    } else {
      return Promise.reject(new Error('Something went wrong in withTransactionIsolation'))
    }
  }
}
