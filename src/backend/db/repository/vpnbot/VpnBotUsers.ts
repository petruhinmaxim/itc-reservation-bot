import * as pg from 'pg'
import { DB, DBConnection, DBClientLocator } from '@db'
import { VpnBotUser } from '@entity'

/**
 * VpnBotUsers repository
 */
export interface VpnBotUsers {
  insert(
    connection: DBConnection,
    vpnBotUser: VpnBotUser
  ): Promise<VpnBotUser>
  
  update(
    connection: DBConnection,
    vpnBotUser: VpnBotUser
  ): Promise<number>
  
  selectById(
    connection: DBConnection,
    telegramUserId: string
  ): Promise<VpnBotUser | undefined>
  
  selectByIds(
    connection: DBConnection,
    telegramUserIds: string[]
  ): Promise<VpnBotUser[]>
  
  selectAll(
    connection: DBConnection,
    sortField: 'telegramUserId' | 'role' | 'userSubscription' | 'userSubscriptionHistory' | 'createdAt',
    sortDirection: 'asc' | 'desc' | 'asc nulls first' | 'desc nulls first',
    offset: number,
    limit: number | 'all'
  ): Promise<VpnBotUser[]>
}

export function makeVpnBotUsers(db: DB): VpnBotUsers {
  return new VpnBotUsersImpl(db)
}

/**
 * VpnBotUsers repository implementation
 */
export class VpnBotUsersImpl implements VpnBotUsers {
  constructor(private readonly clientLocator: DBClientLocator) {}
  
  /*
  create table if not exists "VpnBotUsers" (
    "telegramUserId" text primary key,
    "role" citext not null,
    "userSubscription" jsonb,
    "userSubscriptionHistory" jsonb,
    "createdAt" timestamptz not null
  )
  */
  
  public static vpnBotUserRowMapping(row: pg.QueryResultRow): VpnBotUser {
    return {
      telegramUserId: row.telegramUserId,
      role: row.role,
      userSubscription: row.userSubscription,
      userSubscriptionHistory: row.userSubscriptionHistory,
      createdAt: row.createdAt
    }
  }
  
  public static vpnBotUserParamsMapping(vpnBotUser: Partial<VpnBotUser>): any[] {
    const params: any[] = []
    if (vpnBotUser.telegramUserId != null) params.push(vpnBotUser.telegramUserId)
    params.push(
      vpnBotUser.role,
      vpnBotUser.userSubscription,
      vpnBotUser.userSubscriptionHistory,
      vpnBotUser.createdAt
    )
    return params
  }
  
  //
  // VpnBotUsers repository methods implementation
  //
  
  async insert(
    connection: DBConnection,
    vpnBotUser: VpnBotUser
  ): Promise<VpnBotUser> {
    const sql = `
      insert into "VpnBotUsers" (
        "telegramUserId",
        "role",
        "userSubscription",
        "userSubscriptionHistory",
        "createdAt"
      )
      values ($1, $2, $3, $4, $5)
    `
    
    const params: any[] = VpnBotUsersImpl.vpnBotUserParamsMapping(vpnBotUser)
    
    const client = await this.clientLocator.ensureClient(connection)
    const res = await client.query(sql, params)
    return {
      ...vpnBotUser
    }
  }
  
  async update(
    connection: DBConnection,
    vpnBotUser: VpnBotUser
  ): Promise<number> {
    const sql = `
      update "VpnBotUsers" set
        "role" = $2,
        "userSubscription" = $3,
        "userSubscriptionHistory" = $4,
        "createdAt" = $5
      where "telegramUserId" = $1
    `
    
    const params: any[] = VpnBotUsersImpl.vpnBotUserParamsMapping(vpnBotUser)
    
    const client = await this.clientLocator.ensureClient(connection)
    const res = await client.query(sql, params)
    return res.rowCount
  }
  
  async selectById(
    connection: DBConnection,
    telegramUserId: string
  ): Promise<VpnBotUser | undefined> {
    const sql = `
      select * from "VpnBotUsers" where "telegramUserId" = $1
    `
    
    const params: any[] = [telegramUserId]
    
    const client = await this.clientLocator.ensureClient(connection)
    const res = await client.query(sql, params)
    return res.rows.map(VpnBotUsersImpl.vpnBotUserRowMapping).shift()
  }
  
  async selectByIds(
    connection: DBConnection,
    telegramUserIds: string[]
  ): Promise<VpnBotUser[]> {
    const sql = `
      select * from "VpnBotUsers" where "telegramUserId" = any($1)
    `
    
    const params: any[] = [telegramUserIds]
    
    const client = await this.clientLocator.ensureClient(connection)
    const res = await client.query(sql, params)
    return res.rows.map(VpnBotUsersImpl.vpnBotUserRowMapping)
  }
  
  async selectAll(
    connection: DBConnection,
    sortField: 'telegramUserId' | 'role' | 'userSubscription' | 'userSubscriptionHistory' | 'createdAt',
    sortDirection: 'asc' | 'desc' | 'asc nulls first' | 'desc nulls first',
    offset: number,
    limit: number | 'all'
  ): Promise<VpnBotUser[]> {
    const sql = `
      select * from "VpnBotUsers"
      order by "${sortField}" ${sortDirection}
      ${['asc', 'desc'].includes(sortDirection) ? 'nulls last' : ''}
      limit ${limit} offset ${offset}
    `
    
    const params: any[] = []
    
    const client = await this.clientLocator.ensureClient(connection)
    const res = await client.query(sql, params)
    return res.rows.map(VpnBotUsersImpl.vpnBotUserRowMapping)
  }
}
