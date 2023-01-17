import path from 'path'
import logger from '@logger'
import { ActorSystem } from 'comedy'
import { Pool } from 'pg'
import config from '@config/backend'

const moduleName = path.parse(__filename).name
const log = logger({ name: moduleName })

// noinspection JSUnusedGlobalSymbols
export default class DBPoolResource {
  private pool?: Pool
  
  // noinspection JSUnusedLocalSymbols
  async initialize(system: ActorSystem) {
    this.pool = new Pool(config.db)
    log.info('Resource init')
  }

  async destroy() {
    await this.pool?.end()
    log.info('Resource destroy')
  }

  getResource() {
    return this.pool
  }
}