import path from 'path'
import logger from '@logger'
import { Telegraf } from 'telegraf'
import { Actor, ActorRef } from 'comedy'
import { Ctx } from '@backend/ctx'

const moduleName = path.parse(__filename).name
const log = logger({ name: moduleName })

export type TelegramBotProps = {
  token: string
  channel: string
  logic: 'VpnBotUserLogic' | 'VpnBotAdminLogic'
}

// noinspection JSUnusedGlobalSymbols
export default class TelegramBot {
  static inject() { return ['CtxResource'] }
  constructor(private readonly x: Ctx) {}

  private selfActor!: Actor
  private props!: TelegramBotProps
  private telegraf!: Telegraf

  private allChildren: ActorRef[] = []

  // initialize
  async initialize(selfActor: Actor) {
    this.selfActor = selfActor
    this.props = selfActor.getCustomParameters()
    log.info('init')
    await this.selfActor.send('launch')
  }

  // destroy
  async destroy() {
    log.info('destroy')
  }

  // launch
  async launch() {
    const { token, channel, logic } = this.props

    this.telegraf = new Telegraf(token)

    this.telegraf.on('text', async (ctx) => {
      const user = ctx.from
      const messageId = ctx.message.message_id
      const text = ctx.message.text
      const msg: tg.InboundTelegramMessage = {
        channel,
        telegramUser: {
          id: String(user.id),
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          languageCode: user.language_code
        },
        inputPayload: { tpe: 'TextInput', text, messageId }
      }
      // await this.selfActor.getParent().send('processInboundTelegramMessage', msg)
    })

    this.telegraf.on('callback_query', async (ctx) => {
      await ctx.telegram.answerCbQuery(ctx.update.callback_query.id)
      const messageId = ctx.callbackQuery.message?.message_id || 0
      const user = ctx.update.callback_query.from
      const data: string = (<any>ctx.update.callback_query).data ?? ''
      const msg: tg.InboundTelegramMessage = {
        channel: this.props.channel,
        telegramUser: {
          id: String(user.id),
          username: user.username,
          firstName: user.first_name,
          lastName: user.last_name,
          languageCode: user.language_code
        },
        inputPayload: { tpe: 'CallbackInput', data, messageId }
      }
      // await this.selfActor.getParent().send('processInboundTelegramMessage', msg)
    })

    await this.telegraf.launch()
  }
}
