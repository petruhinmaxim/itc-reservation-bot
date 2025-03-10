import { Scene } from './scene-types'

export type TelegramUserData = {
  telegramUserId: number
  username?: string
  firstName?: string
  lastName?: string
  languageCode?: string
}

export function telegramUserEquals(
  a: TelegramUserData,
  b: TelegramUserData
): boolean {
  return a.telegramUserId === b.telegramUserId
    && a.username === b.username
    && a.firstName === b.firstName
    && a.lastName === b.lastName
    && a.languageCode === b.languageCode
}

export type VpnUser = {
  telegramUserId: number
  currentScene: Scene
}

export type UserAccess = {
  telegramUserId: number
  startTrialTime?: Date
  userAccess?: boolean
}

export type ServerReservation = {
  reservetionID?: number
  reservationDate: string
  reservationTime: string
  telegramUserId?: number
}

export type ReservationTyme = {
  name: string
  tyme: number
}


export type UserAction = {
  telegramUserId: number,
  actionAt?: Date,
  scene: string
}

export type UserFeedback = {
  telegramUserId: number,
  feedback: string
}

//____________________



export type UserConfigs = {
    telegramUserId: number,
    mobileConfigId: number,
    pcConfigId: number
}



export type VpnServer = {
  serverId: number
  serverName: string
}

export type VpnConfig = {
  configId: number
  configName: string
  serverId: number
  configData: string
}


