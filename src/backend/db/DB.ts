import path from 'path'
import logger from '@logger'
import { Pool, PoolClient } from 'pg'

const moduleName = path.parse(__filename).name
const log = logger({ name: moduleName })

export type DBConnection = string

export interface DBClientLocator {
  ensureClient(
    connection: DBConnection
  ): Promise<PoolClient>
}

export type TransactionIsolation =
  'readUncommitted' | 'readCommitted' | 'repeatableRead' | 'serializable'

export interface DB extends DBClientLocator {
  withConnection<T>(
    fn: (connection: DBConnection) => Promise<T>
  ): Promise<T>

  withTransaction<T>(
    fn: (connection: DBConnection) => Promise<T>
  ): Promise<T>

  withTransactionIsolation<T>(
    isolation: TransactionIsolation,
    retryAllowed: boolean,
    fn: (connection: DBConnection) => Promise<T>
  ): Promise<T>

  end(): Promise<void>
}

export function makeDB(dbPool: Pool): DB {
  return new DBImpl(dbPool)
}

class DBImpl implements DB {

  private dbPool: Pool
  private connections: { [connection: DBConnection]: PoolClient } = {}
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
    connection: DBConnection
  ): Promise<PoolClient> {
    const client = this.connections[connection]
    return client == undefined
      ? Promise.reject(`Unknown connection ${connection}`)
      : Promise.resolve(client)
  }

  async connect(): Promise<DBConnection> {
    const client = await this.dbPool.connect()
    const connection = `${this.connectionsCounter++}`
    this.connections[connection] = client
    return connection
  }

  async release(connection: DBConnection): Promise<void> {
    const client = await this.ensureClient(connection)
    await client.release()
    delete this.connections[connection]
  }

  async withConnection<T>(
    fn: (connection: DBConnection) => Promise<T>
  ): Promise<T> {
    const connection = await this.connect()
    try {
      return await fn(connection)
    } catch (e) {
      log.error(e)
      return Promise.reject(e)
    } finally {
      await this.release(connection)
    }
  }

  async withTransaction<T>(
    fn: (connection: DBConnection) => Promise<T>
  ): Promise<T> {
    return this.withTransactionIsolation('readCommitted', false, fn)
  }

  /**
   *  fn:
   *  - Всегда возвращает результат (нельзя void!)
   *  - Рекомендуется использовать union-тип для возврата
   *  - Бросает исключение для роллбэка транзакции
   */
  async withTransactionIsolation<T>(
    isolation: TransactionIsolation,
    retryAllowed: boolean,
    fn: (connection: DBConnection) => Promise<T>
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