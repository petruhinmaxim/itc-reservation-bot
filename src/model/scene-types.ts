import { ServerReservation } from "./vpn-user-types"

export type Scene =
  Start | DeleteMassage | IphoneInstruction | MacInstruction |
  AndroidInstruction | WindowsInstruction | GetConfigs | GeneralInfo |
  SendMassageToUser | Feedback | Instruction | ReservationNow | ReservationByDate | ReservationByTime | ServerBlock | DeleteMyReservation

export type Start = {
  tpe: 'Start'
  messageId?: number
  userName?: string
  myReservation?: ServerReservation
  lustActiveReservation?: ServerReservation
  lastEamptyReservation?: ServerReservation
  serverStatus?: boolean
}

export type DeleteMassage = {
  tpe: 'DeleteMassage'
  messageId?: number
}

export type ReservationNow = {
  tpe: 'ReservationNow',
  messageId?: number,
  myReservation?: ServerReservation
}

export type ReservationByDate = {
  tpe: 'ReservationByDate',
  messageId?: number,
  dateSlot1: string,
  dateSlot2: string,
  dateSlot3: string
}

export type ReservationByTime = {
  tpe: 'ReservationByTime',
  messageId?: number,
  timeSlot1?: string,
  timeSlot2?: string,
  timeSlot3?: string,
  timeSlot4?: string,
  timeSlot5?: string,
  timeSlot6?: string,
  timeSlot7?: string,
  timeSlot8?: string,
  timeSlot9?: string,
  timeSlot10?: string,
  timeSlot11?: string,
  timeSlot12?: string,
  dateSlot?:string
}

export type Instruction = {
  tpe: 'Instruction',
  messageId?: number
}

export type ServerBlock = {
  tpe: 'ServerBlock',
  messageId?: number,
  
}

export type DeleteMyReservation = {
  tpe: 'DeleteMyReservation',
  messageId?: number,
  
}


export type IphoneInstruction = {
  tpe: 'IphoneInstruction'
  messageId?: number
  filename: string
  source: string
}

export type MacInstruction = {
  tpe: 'MacInstruction'
  messageId?: number
  filename: string
  source: string
}

export type AndroidInstruction = {
  tpe: 'AndroidInstruction'
  messageId?: number
  filename: string
  source: string
}

export type WindowsInstruction = {
  tpe: 'WindowsInstruction'
  messageId?: number
  filename: string
  source: string
}

export type GetConfigs = {
  tpe: 'GetConfigs'
  messageId?: number
  mobileConfigData: string
  pcConfigData: string
}

export type GeneralInfo = {
  tpe: 'GeneralInfo'
  messageId?: number
}

export type SendMassageToUser = {
  tpe: 'SendMassageToUser'
  messageId?: number
  userName?: string
  text: string
}

export type Feedback = {
  tpe: 'Feedback'
  messageId?: number
}
