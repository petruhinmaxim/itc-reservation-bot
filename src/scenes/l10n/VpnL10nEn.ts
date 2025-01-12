import {VpnL10n} from './VpnL10n'
import * as s from '../../model/scene-types'
import {
    escapeString
} from '../text-util'

export class VpnL10nEn implements VpnL10n {
    start(scene: s.Start): string {
        return escapeString(
            `Hello! `
        )
    }

//navigation
    goToMainMenu(): string {
        return escapeString(
            'Главное меню'
        )
    }
    goToIphoneInstruction(): string {
        return escapeString(
            'Инструкция Iphone'
        )
    }
    goToMacInstruction(): string {
        return escapeString(
            'Инструкция Mac'
        )
    }
    goToAndroidInstruction(): string {
        return escapeString(
            'Инструкция Android'
        )
    }
    goToWindowsInstruction(): string {
        return escapeString(
            'Инструкция Windows'
        )
    }
    goToGeneralInfo(): string {
        return escapeString(
            'Дополнительная информация'
        )
    }

    goToFeedback(): string {
        return escapeString(
            `Обратная связь`
        )
    }

    goToGetConfigs(): string {
        return escapeString(
            'Скачать конфиги'
        )
    }
    goToReservationNow():string {
        return escapeString(
            'Скачать конфиги'
        )
    }

    goToReservationByDate():string {
        return escapeString(
            'Скачать конфиги'
        )
    }

    goToInstruction():string {
        return escapeString(
            'Инструкция и правила'
        )
    }

    getText(scene: s.Scene): string {
        let text = ''
        switch (scene.tpe) {
            case 'Start':
                text = this.start(scene)
                break
            case "IphoneInstruction":
                text = this.goToIphoneInstruction()
                break
            case "MacInstruction":
                text = this.goToMacInstruction()
                break
            case "AndroidInstruction":
                text = this.goToAndroidInstruction()
                break
            case "WindowsInstruction":
                text = this.goToWindowsInstruction()
                break
            case "GeneralInfo":
                text = this.goToGeneralInfo()
                break
            case "GetConfigs":
                text = this.goToGetConfigs()
                break
        }
        return text
    }
}
