import path from 'path'
import logger from '@logger'
import { ActorSystem } from "comedy"
import { Pool } from "pg"
import { makeDB, DB } from "@db/DB"

const moduleName = path.parse(__filename).name
const log = logger({ name: moduleName })

// noinspection JSUnusedGlobalSymbols
export default class DBResource {
  constructor(private readonly dbPool: Pool) {}
  // dependency injection
  static inject() { return ['DBPoolResource'] }

  private db?: DB

  // noinspection JSUnusedLocalSymbols
  async initialize(system: ActorSystem) {
    this.db = makeDB(this.dbPool)
    log.info('Resource init')
  }

  async destroy() {
    await this.db?.end()
    log.info('Resource destroy')
  }

  getResource() {
    return this.db!
  }
}
