import logger from '@logger'

export type EnsureVpnBotUser =
  (query: EnsureVpnBotUserQuery) =>
    Promise<EnsureVpnBotUserResult>

export type EnsureVpnBotUserQuery = {
  seed: number
}

export type EnsureVpnBotUserResult = {
  random: number
}

type EnsureVpnBotUserCtx = {
}

export function makeEnsureVpnBotUser(
  x: EnsureVpnBotUserCtx
): EnsureVpnBotUser {
  const log = logger({ name: 'EnsureVpnBotUser' })
  return async (
    { seed }: EnsureVpnBotUserQuery
  ) => {
    const random = Math.random()
    return { random }
  }
}
