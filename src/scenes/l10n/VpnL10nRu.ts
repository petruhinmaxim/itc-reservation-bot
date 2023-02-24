import {VpnL10n} from "./VpnL10n"
import * as s from "../../model/scene-types"
import {escapeString} from "../text-util";

export class VpnL10nRu implements VpnL10n {

    start(scene: s.Start): string {
        let userName = scene.userName
        if (!userName) {
            userName = `Симпотяга`
        }
        return `Привет, ${userName}.\n` +
            `Я помогу тебе настроить VPN на твоем устройстве.\n` +
            `Для этого просто скачай конфиги, нажав на кнопку ниже, и переходи к соответствующей инструкции.\n` +
            `Не забудь ознакомиться с дополнительной информацией.`
    }

    iphoneInstruction(scene: s.IphoneInstruction): string {
        return `Сообщением выше отправлена видеоинструкция для настройки VPN на Iphone или воспользуйтесь текстовой:\n \n`  +
            "1) Скачайте и установите клиент OpenVPN из AppStore. [Ссылка для скачивания](https://apps.apple.com/ru/app/openvpn-connect/id590379981)\n \n" +
            `2) В Telegram нажмите на отправленный ранее файл "mobilecontig.ovpn" => Выберите "Сохранить в файлы" => Нажмите "Сохранить" \n \n` +
            `3) Откройте приложение "Файлы" => Найдите файл "mobilecontig.ovpn" и откройте его с помощью программы OpenVPN` +
            ` => Нажмите "AUD" => Нажмите "CONNECT" => Во всплывающем окне нажмите "Разрешить" \n \n` +
            `VPN подключен.`
    }

    macInstruction(scene: s.MacInstruction): string {
        return `Сообщением выше отправлена видеоинструкция для настройки VPN на MAC или воспользуйтесь текстовой:\n \n`  +
            "1) Скачайте и установите клиент OpenVPN. [Ссылка для скачивания](https://openvpn.net/client-connect-vpn-for-mac-os/)\n \n" +
            `2) В Telegram нажмите на отправленный ранее файл "pccontiq.ovpn" и откройте с помощью программы OpenVPN =>` +
            ` на вопрос "Import .ovpn profile" нажмите "ОК" => нажмите "CONNECT"  \n \n` +
            `VPN подключен.`
    }

    androidInstruction(scene: s.AndroidInstruction): string {
        return `Сообщением выше отправлена видеоинструкция для настройки VPN на Android или воспользуйтесь текстовой:\n \n`  +
            "1) Скачайте и установите клиент OpenVPN из PlayStore. [Ссылка для скачивания](https://play.google.com/store/apps/details?id=net.openvpn.openvpn)\n \n" +
            `2) В Telegram нажмите на отправленный ранее файл "mobilecontig.ovpn" => Выберите "Сохранить в загрузки => ` +
            `Откройте приложение OpenVPN => Перейдите в в раздел "Import ProFile" => "File" => "Browser" => ` +
            `"Скаченные" => Выберите "mobilecontig.ovpn" => на вопрос "Import .ovon protile" нажмите "ОК" => ` +
            `Установите галочку "Connect after import" и нажмите "ADD" \n \n` +
            `VPN подключен.`
    }

    windowsInstruction(scene: s.WindowsInstruction): string {
        return `Сообщением выше отправлена видеоинструкция для настройки VPN на Windows или воспользуйтесь текстовой:\n \n`  +
            "1) Скачайте и установите клиент OpenVPN.  [Ссылка для скачивания](https://openvpn.net/client-connect-vpn-for-windows/)\n \n" +
            `2) В Telegram нажмите на отправленный ранее файл "pccontiq.ovpn" и откройте с помощью программы OpenVPN => ` +
            `на вопрос "Import .ovpn profile" нажмите "ОК" => нажимаем "CONNECT"\n \n` +
            `VPN подключен.`
    }

    generalInfo(scene: s.GeneralInfo): string {
        return (`1) Технические характиристики: \n - входящая скорость 10-50 Mbit \n - исходящая скорость 20-50 Mbit \n ` +
            `- время отклика 100 ms \n - установка соединения до 3 s   \n \n` +
            `2) Месячный трафик на 1 пользователя 320GB. [Инструкция](https://www.youtube.com/watch?v=_a7QSX1EkxI&ab_channel=JustUse)`+
            ` по автоматическому запуску VPN для интересующих приложений \n \n` +
            `3) В случае падения скорости соединения, сязанную с ростом числа пользователей, ` +
            `запустим дополнительные сервера с платной подпиской \n \n` +
            `Администрирование серверов @ASLomonosov \n` +
            `Архитектурные решения @aaltergot \n` +
            `Разработка ботов @petruhinMaks \n`
            )
    }

    //navigation
    goToMainMenu(): string {
        return escapeString(
            `Главное меню`
        )
    }

    goToIphoneInstruction(): string {
        return escapeString(
            `Инструкция Iphone`
        )
    }

    goToMacInstruction(): string {
        return escapeString(
            `Инструкция Mac`
        )
    }

    goToAndroidInstruction(): string {
        return escapeString(
            `Инструкция Android`
        )
    }

    goToWindowsInstruction(): string {
        return escapeString(
            `Инструкция Windows`
        )
    }

    goToGeneralInfo(): string {
        return escapeString(
            `Дополнительная информация`
        )
    }

    goToGetConfigs(): string {
        return escapeString(
            `Скачать конфиги`
        )
    }

    getText(scene: s.Scene): string {
        let text = ``
        switch (scene.tpe) {
            case `Start`:
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
