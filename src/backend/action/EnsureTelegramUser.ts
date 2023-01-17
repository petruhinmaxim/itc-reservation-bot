import logger from '@logger'

export type EnsureTelegramUser =
  (query: EnsureTelegramUserQuery) =>
    Promise<EnsureTelegramUserResult>

export type EnsureTelegramUserQuery = {
  seed: number
}

export type EnsureTelegramUserResult = {
  random: number
}

type EnsureTelegramUserCtx = {
}

export function makeEnsureTelegramUser(
  x: EnsureTelegramUserCtx
): EnsureTelegramUser {
  const log = logger({ name: 'EnsureTelegramUser' })
  return async (
    { seed }: EnsureTelegramUserQuery
  ) => {
    const random = Math.random()
    return { random }
  }
}
