import { VpnL10n } from './VpnL10n'
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
    goToReservationNow(): string {
        return escapeString(
            'Скачать конфиги'
        )
    }

    goToReservationByDate(): string {
        return escapeString(
            'Скачать конфиги'
        )
    }

    goToInstruction(): string {
        return escapeString(
            'Инструкция и правила'
        )
    }

    goToDeleteMyReservation(): string {
        return escapeString(
            `Отменить бронирование`
        )
    }

    goToDateSlot1(scene: s.Scene): string {
        if (scene.tpe == "ReservationByDate")
            return escapeString(
                `${scene.dateSlot1}`
            )
        else {
            return ""
        }
    }

    goToDateSlot2(scene: s.Scene): string {
        if (scene.tpe == "ReservationByDate")
            return escapeString(
                `${scene.dateSlot2}`
            )
        else {
            return ""
        }
    }

    goToDateSlot3(scene: s.Scene): string {
        if (scene.tpe == "ReservationByDate")
            return escapeString(
                `${scene.dateSlot3}`
            )
        else {
            return ""
        }
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
