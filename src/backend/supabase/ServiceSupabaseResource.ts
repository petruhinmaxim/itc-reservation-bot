import logger from '@logger'
import config from '@config/backend'
import { ActorSystem } from 'comedy'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// noinspection JSUnusedGlobalSymbols
export default class ServiceSupabaseResource {
  private static log = logger({ name: 'ServiceSupabaseResource' })
  private serviceSupabase?: SupabaseClient

  // noinspection JSUnusedLocalSymbols
  async initialize(system: ActorSystem) {
    this.serviceSupabase = createClient(
      config.supabaseUrl,
      config.supabaseServiceRoleKey,
      { autoRefreshToken: false, persistSession: false }
    )
    ServiceSupabaseResource.log.info('Resource init')
  }

  async destroy() {
    ServiceSupabaseResource.log.info('Resource destroy')
  }

  getResource() {
    return this.serviceSupabase!
  }
}
