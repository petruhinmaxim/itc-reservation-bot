export type Scene =
    Start | DeleteMassage | IphoneInstruction | MacInstruction |
    AndroidInstruction | WindowsInstruction | GetConfigs | GeneralInfo |
    SendMassageToUser | Feedback | Instruction | ReservationNow | ReservationByDate

export type Start =  {
  tpe: 'Start'
  messageId?: number
  userName?: string
}

export type DeleteMassage =  {
  tpe: 'DeleteMassage'
  messageId?: number
}

export type ReservationNow = {
  tpe: 'ReservationNow',
  messageId?: number
}

export type ReservationByDate = {
  tpe: 'ReservationByDate',
  messageId?: number
}

export type Instruction = {
  tpe: 'Instruction',
  messageId?: number
}


export type IphoneInstruction =  {
  tpe: 'IphoneInstruction'
  messageId?: number
  filename: string
  source: string
}

export type MacInstruction =  {
  tpe: 'MacInstruction'
  messageId?: number
  filename: string
  source: string
}

export type AndroidInstruction =  {
  tpe: 'AndroidInstruction'
  messageId?: number
  filename: string
  source: string
}

export type WindowsInstruction =  {
  tpe: 'WindowsInstruction'
  messageId?: number
  filename: string
  source: string
}

export type GetConfigs =  {
  tpe: 'GetConfigs'
  messageId?: number
  mobileConfigData: string
  pcConfigData: string
}

export type GeneralInfo =  {
  tpe: 'GeneralInfo'
  messageId?: number
}

export type SendMassageToUser =  {
  tpe: 'SendMassageToUser'
  messageId?: number
  userName?: string
  text: string
}

export type Feedback =  {
  tpe: 'Feedback'
  messageId?: number
}
