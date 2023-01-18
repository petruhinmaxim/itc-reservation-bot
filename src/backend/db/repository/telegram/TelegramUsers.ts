import * as pg from 'pg'
import { DB, DBConnection, DBClientLocator } from '@db'
import { TelegramUser } from '@entity'

/**
 * TelegramUsers repository
 */
export interface TelegramUsers {
  insert(
    connection: DBConnection,
    telegramUser: TelegramUser
  ): Promise<TelegramUser>
  
  update(
    connection: DBConnection,
    telegramUser: TelegramUser
  ): Promise<number>
  
  selectById(
    connection: DBConnection,
    id: string
  ): Promise<TelegramUser | undefined>
  
  selectByIds(
    connection: DBConnection,
    ids: string[]
  ): Promise<TelegramUser[]>
  
  selectAll(
    connection: DBConnection,
    sortField: 'id' | 'username' | 'firstName' | 'lastName' | 'languageCode' | 'createdAt',
    sortDirection: 'asc' | 'desc' | 'asc nulls first' | 'desc nulls first',
    offset: number,
    limit: number | 'all'
  ): Promise<TelegramUser[]>
}

export function makeTelegramUsers(db: DB): TelegramUsers {
  return new TelegramUsersImpl(db)
}

/**
 * TelegramUsers repository implementation
 */
export class TelegramUsersImpl implements TelegramUsers {
  constructor(private readonly clientLocator: DBClientLocator) {}
  
  /*
  create table if not exists "TelegramUsers" (
    "id" text primary key,
    "username" text,
    "firstName" text,
    "lastName" text,
    "languageCode" text,
    "createdAt" timestamptz not null
  )
  */
  
  public static telegramUserRowMapping(row: pg.QueryResultRow): TelegramUser {
    return {
      id: row.id,
      username: row.username,
      firstName: row.firstName,
      lastName: row.lastName,
      languageCode: row.languageCode,
      createdAt: row.createdAt
    }
  }
  
  public static telegramUserParamsMapping(telegramUser: Partial<TelegramUser>): any[] {
    const params: any[] = []
    if (telegramUser.id != null) params.push(telegramUser.id)
    params.push(
      telegramUser.username,
      telegramUser.firstName,
      telegramUser.lastName,
      telegramUser.languageCode,
      telegramUser.createdAt
    )
    return params
  }
  
  //
  // TelegramUsers repository methods implementation
  //
  
  async insert(
    connection: DBConnection,
    telegramUser: TelegramUser
  ): Promise<TelegramUser> {
    const sql = `
      insert into "TelegramUsers" (
        "id",
        "username",
        "firstName",
        "lastName",
        "languageCode",
        "createdAt"
      )
      values ($1, $2, $3, $4, $5, $6)
    `
    
    const params: any[] = TelegramUsersImpl.telegramUserParamsMapping(telegramUser)
    
    const client = await this.clientLocator.ensureClient(connection)
    const res = await client.query(sql, params)
    return {
      ...telegramUser
    }
  }
  
  async update(
    connection: DBConnection,
    telegramUser: TelegramUser
  ): Promise<number> {
    const sql = `
      update "TelegramUsers" set
        "username" = $2,
        "firstName" = $3,
        "lastName" = $4,
        "languageCode" = $5,
        "createdAt" = $6
      where "id" = $1
    `
    
    const params: any[] = TelegramUsersImpl.telegramUserParamsMapping(telegramUser)
    
    const client = await this.clientLocator.ensureClient(connection)
    const res = await client.query(sql, params)
    return res.rowCount
  }
  
  async selectById(
    connection: DBConnection,
    id: string
  ): Promise<TelegramUser | undefined> {
    const sql = `
      select * from "TelegramUsers" where "id" = $1
    `
    
    const params: any[] = [id]
    
    const client = await this.clientLocator.ensureClient(connection)
    const res = await client.query(sql, params)
    return res.rows.map(TelegramUsersImpl.telegramUserRowMapping).shift()
  }
  
  async selectByIds(
    connection: DBConnection,
    ids: string[]
  ): Promise<TelegramUser[]> {
    const sql = `
      select * from "TelegramUsers" where "id" = any($1)
    `
    
    const params: any[] = [ids]
    
    const client = await this.clientLocator.ensureClient(connection)
    const res = await client.query(sql, params)
    return res.rows.map(TelegramUsersImpl.telegramUserRowMapping)
  }
  
  async selectAll(
    connection: DBConnection,
    sortField: 'id' | 'username' | 'firstName' | 'lastName' | 'languageCode' | 'createdAt',
    sortDirection: 'asc' | 'desc' | 'asc nulls first' | 'desc nulls first',
    offset: number,
    limit: number | 'all'
  ): Promise<TelegramUser[]> {
    const sql = `
      select * from "TelegramUsers"
      order by "${sortField}" ${sortDirection}
      ${['asc', 'desc'].includes(sortDirection) ? 'nulls last' : ''}
      limit ${limit} offset ${offset}
    `
    
    const params: any[] = []
    
    const client = await this.clientLocator.ensureClient(connection)
    const res = await client.query(sql, params)
    return res.rows.map(TelegramUsersImpl.telegramUserRowMapping)
  }
}
