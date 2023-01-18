import path from 'path'
import logger from '@logger'
import { ActorSystem } from 'comedy'
import * as pg from 'pg'
import { DB } from '@db'
import * as supabase from '@supabase/supabase-js'
import { Ctx, makeCtxWith } from '@backend/ctx'

const moduleName = path.parse(__filename).name
const log = logger({ name: moduleName })

// noinspection JSUnusedGlobalSymbols
export default class CtxResource {
  static inject() { return [
    'DBPoolResource', 'DBResource', 'ServiceSupabaseResource'
  ]}
  constructor(
    private readonly dbPool: pg.Pool,
    private readonly db: DB,
    private readonly serviceSupabase: supabase.SupabaseClient
  ) {}

  private ctx?: Ctx

  async initialize(system: ActorSystem) {
    this.ctx = makeCtxWith(this.dbPool, this.db, this.serviceSupabase)
    log.info('Resource init')
  }

  async destroy() {
    log.info('Resource destroy')
  }

  getResource() {
    return this.ctx!
  }
}
