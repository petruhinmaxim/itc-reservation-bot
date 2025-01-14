import { ServerReservation } from "./vpn-user-types"

export type Scene =
  Start | DeleteMassage | IphoneInstruction | MacInstruction |
  AndroidInstruction | WindowsInstruction | GetConfigs | GeneralInfo |
  SendMassageToUser | Feedback | Instruction | ReservationNow | ReservationByDate | 
  ReservationByTime | ServerBlock | DeleteMyReservation | ConfermReservation

export type Start = {
  tpe: 'Start'
  messageId?: number
  userName?: string
  myReservation1?: ServerReservation
  myReservation2?: ServerReservation
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
  dateSlot1?: string,
  dateSlot2?: string,
  dateSlot3?: string
}

export type ReservationByTime = {
  tpe: 'ReservationByTime',
  messageId?: number,
  timeSlots: string[],
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

export type ConfermReservation = {
  tpe: 'ConfermReservation',
  messageId?: number,
  dateSlot?: string,
  timeSlot?: string
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
