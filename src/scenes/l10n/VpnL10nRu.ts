import {VpnL10n} from './VpnL10n'
import * as s from '../../model/scene-types'
import {escapeString} from "../text-util";

export class VpnL10nRu implements VpnL10n {

    start(scene: s.Start): string {
        let userName = scene.userName
        if (!userName) {
            userName = 'Симпотяга'
        }
        return  `Привет, ${userName}.\n` +
            'Я помогу тебе настроить VPN на твоем устройстве.\n' +
            `Для этого просто скачай конфиги, нажав на кнопку ниже, и переходи к соответствующей инструкции.\n` +
            'Не забудь ознакомиться с дополнительной информацией.'
    }

    iphoneInstruction(scene: s.IphoneInstruction): string {
        return 'Для настройки VPN на Iphone следуйте инструкции:\n' +
            "1) Скачайте и установите клиент OpenVPN. [Ссылка для скачивания](https://apps.apple.com/ru/app/openvpn-connect/id590379981)\n" +
            '2) Откройте загруженный ранее конфиг с помощью программы OpenVPN \n' +
            '3) Активируйте в программе конфиг бла бла бла.... \n' +
            'Теперь вы сможете включать VPN в настройках одним кликом'
    }

    macInstruction(scene: s.MacInstruction): string {
        return 'Для настройки VPN на Iphone следуйте инструкции:\n' +
            "1) Скачайте и установите клиент OpenVPN. [Ссылка для скачивания](https://apps.apple.com/ru/app/openvpn-connect/id590379981)\n" +
            '2) Откройте загруженный ранее конфиг с помощью программы OpenVPN \n' +
            '3) Активируйте в программе конфиг бла бла бла.... \n' +
            'Теперь вы сможете включать VPN в настройках одним кликом'
    }

    androidInstruction(scene: s.AndroidInstruction): string {
        return 'Для настройки VPN на Iphone следуйте инструкции:\n' +
            "1) Скачайте и установите клиент OpenVPN. [Ссылка для скачивания](https://apps.apple.com/ru/app/openvpn-connect/id590379981)\n" +
            '2) Откройте загруженный ранее конфиг с помощью программы OpenVPN \n' +
            '3) Активируйте в программе конфиг бла бла бла.... \n' +
            'Теперь вы сможете включать VPN в настройках одним кликом'
    }

    windowsInstruction(scene: s.WindowsInstruction): string {
        return 'Для настройки VPN на Iphone следуйте инструкции:\n' +
            "1) Скачайте и установите клиент OpenVPN. [Ссылка для скачивания](https://apps.apple.com/ru/app/openvpn-connect/id590379981)\n" +
            '2) Откройте загруженный ранее конфиг с помощью программы OpenVPN \n' +
            '3) Активируйте в программе конфиг бла бла бла.... \n' +
            'Теперь вы сможете включать VPN в настройках одним кликом'
    }

    generalInfo(scene: s.GeneralInfo): string {
        return 'Технические характеристики. Немного о проекте. Контакты. Выделенный сервер'
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
    goToGetConfigs(): string {
        return escapeString(
            'Скачать конфиги'
        )
    }

    getText(scene: s.Scene): string {
        let text = ''
        switch (scene.tpe) {
            case 'Start':
                text = this.start(scene)
                break
            case "IphoneInstruction":
                text = this.iphoneInstruction(scene)
                break
            case "MacInstruction":
                text = this.macInstruction(scene)
                break
            case "AndroidInstruction":
                text = this.androidInstruction(scene)
                break
            case "WindowsInstruction":
                text = this.windowsInstruction(scene)
                break
            case "GeneralInfo":
                text = this.generalInfo(scene)
                break
        }
        return text
    }
}
