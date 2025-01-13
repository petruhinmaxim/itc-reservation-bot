import * as s from '../model/scene-types'
import { Markup } from 'telegraf'
import { InlineKeyboardMarkup } from 'typegram'
import { VpnL10n } from './l10n/VpnL10n'

export function getMarkup(scene: s.Scene, l10n: VpnL10n):
  Markup.Markup<InlineKeyboardMarkup> {
  const buttons = []
  let markup: Markup.Markup<InlineKeyboardMarkup>
  switch (scene.tpe) {
    case 'Start':
      buttons.push([getReservationNow(l10n)])
      buttons.push([getReservationByDate(l10n)])
      buttons.push([getDeleteMyReservation(l10n)])
      buttons.push([getInstruction(l10n)])
      break
    case "Instruction":
      buttons.push([getStartButton(l10n)])
      break
    case "ReservationNow":
      buttons.push([getStartButton(l10n)])
      break
    case "ServerBlock":
      buttons.push([getStartButton(l10n)])
      break
    case "DeleteMyReservation":
      buttons.push([getStartButton(l10n)])
      break
    case "ReservationByDate":
      buttons.push([getDateSlot1(l10n, scene)])
      buttons.push([getDateSlot2(l10n, scene)])
      buttons.push([getDateSlot3(l10n, scene)])
      break
    case "ReservationByTime":
      if (scene.tpe == "ReservationByTime") {
        for (let i = 0; i < scene.timeSlots.length; i++) {
          buttons.push([getTime(l10n, scene, scene.timeSlots[i])]) 
        }
      }
      buttons.push([getStartButton(l10n)])
      break
    case "IphoneInstruction":
      buttons.push([getStartButton(l10n)])
      break
    case "MacInstruction":
      buttons.push([getStartButton(l10n)])
      break
    case "AndroidInstruction":
      buttons.push([getStartButton(l10n)])
      break
    case "WindowsInstruction":
      buttons.push([getStartButton(l10n)])
      break
    case "GeneralInfo":
      buttons.push([getStartButton(l10n)])
      break
    case "Feedback":
      buttons.push([getStartButton(l10n)])
      break
    case "SendMassageToUser":
      buttons.push([getFeedback(l10n)])
      buttons.push([getStartButton(l10n)])
      break
  }
  markup = Markup.inlineKeyboard(buttons)
  return markup
}

//navigation buttons
function getStartButton(l10n: VpnL10n) {
  return Markup.button.callback(l10n.goToMainMenu(), markupDataGen('Start'))
}

function getIphoneInstruction(l10n: VpnL10n) {
  return Markup.button.callback(l10n.goToIphoneInstruction(), markupDataGen('IphoneInstruction'))
}

function getMacInstruction(l10n: VpnL10n) {
  return Markup.button.callback(l10n.goToMacInstruction(), markupDataGen('MacInstruction'))
}

function getAndroidInstruction(l10n: VpnL10n) {
  return Markup.button.callback(l10n.goToAndroidInstruction(), markupDataGen('AndroidInstruction'))
}

function getWindowsInstruction(l10n: VpnL10n) {
  return Markup.button.callback(l10n.goToWindowsInstruction(), markupDataGen('WindowsInstruction'))
}

function getGeneralInfo(l10n: VpnL10n) {
  return Markup.button.callback(l10n.goToGeneralInfo(), markupDataGen('GeneralInfo'))
}

function getFeedback(l10n: VpnL10n) {
  return Markup.button.callback(l10n.goToFeedback(), markupDataGen('Feedback'))
}

function getConfigs(l10n: VpnL10n) {
  return Markup.button.callback(l10n.goToGetConfigs(), markupDataGen('GetConfigs'))
}

function getReservationNow(l10n: VpnL10n) {
  return Markup.button.callback(l10n.goToReservationNow(), markupDataGen('ReservationNow'))
}

function getReservationByDate(l10n: VpnL10n) {
  return Markup.button.callback(l10n.goToReservationByDate(), markupDataGen('ReservationByDate'))
}

function getInstruction(l10n: VpnL10n) {
  return Markup.button.callback(l10n.goToInstruction(), markupDataGen('Instruction'))
}

function getDeleteMyReservation(l10n: VpnL10n) {
  return Markup.button.callback(l10n.goToDeleteMyReservation(), markupDataGen('DeleteMyReservation'))
}

function getDateSlot1(l10n: VpnL10n, scene: s.Scene) {
  if (scene.tpe == "ReservationByDate")
    return Markup.button.callback(l10n.goToDateSlot1(scene), markupDataGen('ReservationByTime', scene.dateSlot1))
  else {
    return Markup.button.callback(l10n.goToMainMenu(), markupDataGen('Start'))
  }
}

function getDateSlot2(l10n: VpnL10n, scene: s.Scene) {
  if (scene.tpe == "ReservationByDate")
    return Markup.button.callback(l10n.goToDateSlot2(scene), markupDataGen('ReservationByTime', scene.dateSlot2))
  else {
    return Markup.button.callback(l10n.goToMainMenu(), markupDataGen('Start'))
  }
}

function getDateSlot3(l10n: VpnL10n, scene: s.Scene) {
  if (scene.tpe == "ReservationByDate")
    return Markup.button.callback(l10n.goToDateSlot3(scene), markupDataGen('ReservationByTime', scene.dateSlot3))
  else {
    return Markup.button.callback(l10n.goToMainMenu(), markupDataGen('Start'))
  }
}

function getTime(l10n: VpnL10n, scene: s.Scene, timeSlot: string) {
  if (scene.tpe == "ReservationByTime") {
    return Markup.button.callback(l10n.goToTime(scene, timeSlot), markupDataGen('ReservationByTime', timeSlot + "|" +scene.dateSlot ))
  }
  else {
    return Markup.button.callback(l10n.goToMainMenu(), markupDataGen('Start'))
  }
}



function markupDataGen(sceneTpe: string, actionInScene?: string) {
  return sceneTpe + '_' + actionInScene
}

export function markupDataParseSceneTpe(data: string): string {
  return data.split('_',)[0]
}

export function markupDataParseActionInScene(markupData: string): string {
  return markupData.split('_',)[1]
}
