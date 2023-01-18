import path from 'path'
import logger from '@logger'
import { Actor, ActorRef } from 'comedy'
import { Ctx } from '@backend/ctx'

const moduleName = path.parse(__filename).name
const log = logger({ name: moduleName })

export interface BackendRootProps {
}

// noinspection JSUnusedGlobalSymbols
export default class BackendRoot {
  static inject() { return ['CtxResource'] }
  constructor(private readonly ctx: Ctx) {}

  private selfActor!: Actor
  private props!: BackendRootProps

  private allChildren: ActorRef[] = []

  // initialize
  async initialize(selfActor: Actor) {
    this.selfActor = selfActor
    this.props = selfActor.getCustomParameters()
    log.info('init')
    await this.launch()
  }

  // destroy
  async destroy() {
    log.info('destroy')
  }

  // launch
  async launch() {
    // const { } = this.props



  }

  //
  // behaviour
  //
}
