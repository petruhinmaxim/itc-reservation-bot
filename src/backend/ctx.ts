import * as pg from 'pg'
import { DB, makeDB } from '@db'
import * as supabase from '@supabase/supabase-js'
import {
  SystemProperties,
  makeSystemProperties,
  TelegramUsers,
  makeTelegramUsers,
  VpnBotUsers,
  makeVpnBotUsers
} from '@repository'

export type Ctx = {
  dbPool: pg.Pool
  db: DB
  serviceSupabase: supabase.SupabaseClient
  systemProperties: SystemProperties
  telegramUsers: TelegramUsers
  vpnBotUsers: VpnBotUsers
}

export function makeCtx(config: any): Ctx {
  const dbPool = new pg.Pool(config.db)
  const db = makeDB(dbPool)
  const serviceSupabase = supabase.createClient(
    config.supabaseUrl,
    config.supabaseServiceRoleKey,
    { autoRefreshToken: false, persistSession: false, fetch: fetch }
  )
  return makeCtxWith(dbPool, db, serviceSupabase)
}

export function makeCtxWith(
  dbPool: pg.Pool,
  db: DB,
  serviceSupabase: supabase.SupabaseClient
): Ctx {
  const systemProperties = makeSystemProperties(db)
  const telegramUsers = makeTelegramUsers(db)
  const vpnBotUsers = makeVpnBotUsers(db)

  return {
    dbPool, db, serviceSupabase,
    systemProperties,
    telegramUsers,
    vpnBotUsers
  }
}
