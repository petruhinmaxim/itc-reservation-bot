import * as pg from 'pg'
import { DB, DBConnection, DBClientLocator } from '@db'
import { SystemProperty } from '@entity'

/**
 * SystemProperties repository
 */
export interface SystemProperties {
  insert(
    connection: DBConnection,
    systemProperty: SystemProperty
  ): Promise<SystemProperty>
  
  update(
    connection: DBConnection,
    systemProperty: SystemProperty
  ): Promise<number>
  
  selectById(
    connection: DBConnection,
    systemPropertyKey: string
  ): Promise<SystemProperty | undefined>
  
  selectByIds(
    connection: DBConnection,
    systemPropertyKeys: string[]
  ): Promise<SystemProperty[]>
  
  selectAll(
    connection: DBConnection,
    sortField: 'systemPropertyKey' | 'systemPropertyValue',
    sortDirection: 'asc' | 'desc',
    offset: number,
    limit: number | 'all'
  ): Promise<SystemProperty[]>
}

export function makeSystemProperties(db: DB): SystemProperties {
  return new SystemPropertiesImpl(db)
}

/**
 * SystemProperties repository implementation
 */
export class SystemPropertiesImpl implements SystemProperties {
  constructor(private readonly clientLocator: DBClientLocator) {}
  
  /*
  create table if not exists "SystemProperties" (
    "systemPropertyKey" text primary key,
    "systemPropertyValue" text not null
  )
  */
  
  public static systemPropertyRowMapping(row: pg.QueryResultRow): SystemProperty {
    return {
      systemPropertyKey: row.systemPropertyKey,
      systemPropertyValue: row.systemPropertyValue
    }
  }
  
  public static systemPropertyParamsMapping(systemProperty: Partial<SystemProperty>): any[] {
    const params: any[] = []
    if (systemProperty.systemPropertyKey != null) params.push(systemProperty.systemPropertyKey)
    params.push(
      systemProperty.systemPropertyValue
    )
    return params
  }
  
  //
  // SystemProperties repository methods implementation
  //
  
  async insert(
    connection: DBConnection,
    systemProperty: SystemProperty
  ): Promise<SystemProperty> {
    const sql = `
      insert into "SystemProperties" (
        "systemPropertyKey",
        "systemPropertyValue"
      )
      values ($1, $2)
    `
    
    const params: any[] = SystemPropertiesImpl.systemPropertyParamsMapping(systemProperty)
    
    const client = await this.clientLocator.ensureClient(connection)
    const res = await client.query(sql, params)
    return {
      ...systemProperty
    }
  }
  
  async update(
    connection: DBConnection,
    systemProperty: SystemProperty
  ): Promise<number> {
    const sql = `
      update "SystemProperties" set
        "systemPropertyValue" = $2
      where "systemPropertyKey" = $1
    `
    
    const params: any[] = SystemPropertiesImpl.systemPropertyParamsMapping(systemProperty)
    
    const client = await this.clientLocator.ensureClient(connection)
    const res = await client.query(sql, params)
    return res.rowCount
  }
  
  async selectById(
    connection: DBConnection,
    systemPropertyKey: string
  ): Promise<SystemProperty | undefined> {
    const sql = `
      select * from "SystemProperties" where "systemPropertyKey" = $1
    `
    
    const params: any[] = [systemPropertyKey]
    
    const client = await this.clientLocator.ensureClient(connection)
    const res = await client.query(sql, params)
    return res.rows.map(SystemPropertiesImpl.systemPropertyRowMapping).shift()
  }
  
  async selectByIds(
    connection: DBConnection,
    systemPropertyKeys: string[]
  ): Promise<SystemProperty[]> {
    const sql = `
      select * from "SystemProperties" where "systemPropertyKey" = any($1)
    `
    
    const params: any[] = [systemPropertyKeys]
    
    const client = await this.clientLocator.ensureClient(connection)
    const res = await client.query(sql, params)
    return res.rows.map(SystemPropertiesImpl.systemPropertyRowMapping)
  }
  
  async selectAll(
    connection: DBConnection,
    sortField: 'systemPropertyKey' | 'systemPropertyValue',
    sortDirection: 'asc' | 'desc',
    offset: number,
    limit: number | 'all'
  ): Promise<SystemProperty[]> {
    const sql = `
      select * from "SystemProperties"
      order by "${sortField}" ${sortDirection}
      ${['asc', 'desc'].includes(sortDirection) ? 'nulls last' : ''}
      limit ${limit} offset ${offset}
    `
    
    const params: any[] = []
    
    const client = await this.clientLocator.ensureClient(connection)
    const res = await client.query(sql, params)
    return res.rows.map(SystemPropertiesImpl.systemPropertyRowMapping)
  }
}
