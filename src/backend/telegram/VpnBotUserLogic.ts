import logger from '@logger'
import { Ctx } from '@backend/ctx'
import { TelegramInput, TelegramUser } from '@entity'

export type VpnBotUserLogic =
  (query: VpnBotUserLogicQuery) =>
    Promise<VpnBotUserLogicResult>

export type VpnBotUserLogicQuery = {
  telegramUser: TelegramUser
  channel: string
  input: TelegramInput
}

export type VpnBotUserLogicResult =
  'ok'


type VpnBotUserLogicCtx = Ctx

export function makeVpnBotUserLogic(
  x: VpnBotUserLogicCtx
): VpnBotUserLogic {
  const log = logger({ name: 'VpnBotUserLogic' })
  return async (
    { telegramUser, channel, input }: VpnBotUserLogicQuery
  ) => {
    await x.db.withTransaction(async con => {
      const existing = await x.telegramUsers.selectById(con, telegramUser.id)
      // ...
    })

    return 'ok'
  }
}

// const logicF = makeVpnBotUserLogic({})
// async function logicF(query: VpnBotUserLogicQuery): Promise<VpnBotUserLogicResult>
