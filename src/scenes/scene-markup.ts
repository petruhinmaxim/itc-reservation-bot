import * as s from '../model/scene-types'
import {Markup} from 'telegraf'
import {InlineKeyboardMarkup} from 'typegram'
import {VpnL10n} from './l10n/VpnL10n'

export function getMarkup(scene: s.Scene, l10n: VpnL10n):
  Markup.Markup<InlineKeyboardMarkup> {
  const buttons = []
  let markup: Markup.Markup<InlineKeyboardMarkup>
  switch (scene.tpe) {
    case 'Start':
      buttons.push([getReservationNow(l10n)])
      buttons.push([getReservationByDate(l10n)])
      buttons.push([getInstruction(l10n)])
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
    case "Instruction":
      buttons.push([getStartButton(l10n)])
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



function markupDataGen(sceneTpe: string, actionInScene?: string) {
  return sceneTpe + '_' + actionInScene
}

export function markupDataParseSceneTpe(data: string): string {
  return data.split('_',)[0]
}

export function markupDataParseActionInScene(markupData: string): string {
  return markupData.split('_',)[1]
}
