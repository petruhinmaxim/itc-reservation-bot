
export type TelegramInput = TextInput | CallbackInput | MessageIdInput

export type HasMessageId = {
  messageId: number
}

export type TextInput = {
  tpe: 'TextInput'
  text: string
} & HasMessageId

export type CallbackInput = {
  tpe: 'CallbackInput'
  data: string
} & HasMessageId

export type MessageIdInput = {
  tpe: 'MessageIdInput'
} & HasMessageId
