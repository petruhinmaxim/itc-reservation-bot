import { VpnL10n } from "./VpnL10n"
import * as s from "../../model/scene-types"
import { escapeString } from "../text-util";
import { ServerReservation } from "../../model/vpn-user-types";

export class VpnL10nRu implements VpnL10n {

    start(scene: s.Start): string {
        let userName = scene.userName
        if (!userName) {
            userName = `Друг`
        }
        let status: string
        let date: string | undefined
        let tyme: string | undefined
        let myReservationDate: string | undefined
        let myReservationTime: string | undefined
        console.log("Моя бронь" + scene.myReservation)

        if (scene.serverStatus) {
            status = "забронирован до"
            date = scene.lastEamptyReservation?.reservationDate
            tyme = scene.lastEamptyReservation?.reservationTime.split(" ", 2)[0]
        } else {
            status = "свободен"
            date = scene.lustActiveReservation?.reservationDate
            tyme = scene.lustActiveReservation?.reservationTime.split(" ", 1)[0]
        }
        if (scene.serverStatus) {
            return `Привет, ${userName}.\n` +
                `Я помогу тебе забронировать и получить доступ к серверу с покерными тренажерами. Для этого выбери удобное для тебя время в разделе «Забронировать по времени» или нажми на кнопку «Забронировать сейчас», если сервер свободен \n` +
                `Обрати внимание, что работа ведется по московскому времени, а интервал бронирования равен двум часам \n` +
                `Не забудь ознакомиться с инструкцией и правилами работы на сервере \n \n` +
                `Статус сервера: ${status} ${date} ${tyme} МСК \n` +
                this.addMyReservationInfo(scene.myReservation)
        }
        else if (date) {
            return `Привет, ${userName}.\n` +
                `Я помогу тебе забронировать и получить доступ к серверу с покерными тренажерами. Для этого выбери удобное для тебя время в разделе «Забронировать по времени» или нажми на кнопку «Забронировать сейчас», если сервер свободен \n` +
                `Обрати внимание, что работа ведется по московскому времени, а интервал бронирования равен двум часам \n` +
                `Не забудь ознакомиться с инструкцией и правилами работы на сервере \n \n` +
                `Статус сервера: ${status} до ${date} ${tyme} МСК \n` +
                this.addMyReservationInfo(scene.myReservation)
        }
        else {
            return `Привет, ${userName}.\n` +
                `Я помогу тебе забронировать и получить доступ к серверу с покерными тренажерами. Для этого выбери удобное для тебя время в разделе «Забронировать по времени» или нажми на кнопку «Забронировать сейчас», если сервер свободен \n` +
                `Обрати внимание, что работа ведется по московскому времени, а интервал бронирования равен двум часам \n` +
                `Не забудь ознакомиться с инструкцией и правилами работы на сервере \n \n` +
                `Статус сервера: ${status}  \n` +
                this.addMyReservationInfo(scene.myReservation)
        }
    }
    addMyReservationInfo(reservation: ServerReservation | undefined) {
        if (!reservation) {
            return "Мое бронирование: отсутствует"
        }
        else {
            return `Мое бронирование: ${reservation.reservationDate} ${reservation.reservationTime}`
        }
    }

    iphoneInstruction(scene: s.IphoneInstruction): string {
        return `Сообщением выше в ближайшее время будет отправлена видеоинструкция для настройки VPN на Iphone или воспользуйтесь текстовой:\n \n` +
            "1) Скачайте и установите клиент OpenVPN из AppStore. [Ссылка для скачивания](https://apps.apple.com/ru/app/openvpn-connect/id590379981)\n \n" +
            `2) В Telegram нажмите на скаченный ранее файл "mobilecontig.ovpn" => Выберите "Сохранить в файлы" => Нажмите "Сохранить" \n \n` +
            `3) Откройте приложение "Файлы" => Найдите файл "mobilecontig.ovpn" и откройте его с помощью программы OpenVPN` +
            ` => Нажмите "AUD" => Нажмите "CONNECT" => Во всплывающем окне нажмите "Разрешить" \n \n` +
            `VPN подключен`
    }

    macInstruction(scene: s.MacInstruction): string {
        return `Сообщением выше в ближайшее время будет отправлена видеоинструкция для настройки VPN на MAC или воспользуйтесь текстовой:\n \n` +
            "1) Скачайте и установите клиент OpenVPN. [Ссылка для скачивания](https://openvpn.net/client-connect-vpn-for-mac-os/)\n \n" +
            `2) В Telegram нажмите на скаченный ранее файл "pccontiq.ovpn" и откройте с помощью программы OpenVPN =>` +
            ` на вопрос "Import .ovpn profile" нажмите "ОК" => нажмите "CONNECT"  \n \n` +
            `VPN подключен`
    }

    androidInstruction(scene: s.AndroidInstruction): string {
        return `Сообщением выше в ближайшее время будет отправлена видеоинструкция для настройки VPN на Android или воспользуйтесь текстовой:\n \n` +
            "1) Скачайте и установите клиент OpenVPN из PlayStore. [Ссылка для скачивания](https://play.google.com/store/apps/details?id=net.openvpn.openvpn)\n \n" +
            `2) В Telegram нажмите на скаченный ранее файл "mobilecontig.ovpn" => Выберите "Сохранить в загрузки"\n \n` +
            `3) Откройте приложение OpenVPN => Перейдите в в раздел "Import ProFile" => "File" => "Browser" => ` +
            `"Скаченные" => Выберите "mobilecontig.ovpn" => на вопрос "Import .ovon protile" нажмите "ОК" => ` +
            `Установите галочку "Connect after import" и нажмите "ADD" \n \n` +
            `VPN подключен`
    }

    windowsInstruction(scene: s.WindowsInstruction): string {
        return `Сообщением выше в ближайшее время будет отправлена видеоинструкция для настройки VPN на Windows или воспользуйтесь текстовой:\n \n` +
            "1) Скачайте и установите клиент OpenVPN.  [Ссылка для скачивания](https://openvpn.net/client-connect-vpn-for-windows/)\n \n" +
            `2) В Telegram нажмите на скаченный ранее файл "pccontiq.ovpn" и откройте с помощью программы OpenVPN => ` +
            `на вопрос "Import .ovpn profile" нажмите "ОК" => нажимаем "CONNECT"\n \n` +
            `VPN подключен`
    }

    generalInfo(scene: s.GeneralInfo): string {
        return (`1) Технические характиристики: \n - входящая скорость 10-50 Mbit \n - исходящая скорость 10-50 Mbit \n ` +
            `- время отклика 100 ms \n - установка соединения до 3 s   \n \n` +
            `2) Наблюдаются сложности в работе с некоторыми интернет провайдерами, повлиять не это нет в возможности. В редких случаях помогает переустановка программы OpenVPN и повторная загрузка конфигов\n \n` +
            `3) [Инструкция](https://www.youtube.com/shorts/GuLgHMi79VU) по настройке автоматического включения VPN при запуске программ на Iphone \n \n`
        )
    }

    feedback(scene: s.Feedback): string {
        return (`Отправьте сообщением все, что посчитаете важным и не только\n`)
    }

    instruction(scene: s.Instruction): string {
        return (`Доступ: \n` +
            '1) Тестовый доступ к серверу предоставляется на 2 недели \n' +
            '2) После окончания триального периода доступ возобновляется при генерации 300+$ рейка в месяц на афф направление и для всех игроков бекинкового фонда ITC \n \n' +
            'Инструкция: \n' +
            '1) Для подключения к серверу используйте программу: ССЫЛКА \n' +
            '2) За 5 минут до времени бронирования вам придет сообщение с адресом сервера, логином и паролем \n' +
            '3) Не забывайте закрыть все запущенные программы после завершения тренировки \n' +
            '4) За 5 минут до окончания брони вы получите сообщение. Просьба, не занимайте сервер после окончания времени бронирования \n \n' +
            '5) Если заканчиваете работу с сервером до окончания времени бронирования, нажмите, пожалуйста кнопку "Отменить бронирование"\n \n' +
            'Список установленного софта и функционал: \n' +
            '- Софт 1 + ссылка \n' +
            '- Софт 2 + ссылка'
        )

    }

    reservationNow(scene: s.ReservationNow): string {
        return (`Сервер успешно забронирован. Дата: ${scene.myReservation?.reservationDate} Время: ${scene.myReservation?.reservationTime}`)
    }

    deleteMyReservation(scene: s.DeleteMyReservation): string {
        return (`Бронирование сервера отменено`)
    }



    serverBlock(scene: s.ServerBlock): string {
        return (`Сервер сейчас занят, выберите бронирование по времени`)
    }

    reservationByDate(scene: s.ReservationByDate): string {
        return (`Выберите дату для бронирования сервера`)
    }


    sendMassageToUser(scene: s.SendMassageToUser): string {
        let userName = scene.userName
        if (!userName) {
            userName = `Симпотяга`
        }
        return `Привет, ${userName}.\n` +
            scene.text
    }

    //navigation
    goToMainMenu(): string {
        return escapeString(
            `<< Назад`
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

    goToReservationNow(): string {
        return escapeString(
            'Забронировать сейчас'
        )
    }

    goToReservationByDate(): string {
        return escapeString(
            'Забронировать по времени'
        )
    }

    goToInstruction(): string {
        return escapeString(
            'Инструкция и правила'
        )
    }

    goToFeedback(): string {
        return escapeString(
            `Обратная связь`
        )
    }

    goToGetConfigs(): string {
        return escapeString(
            `Скачать конфиги`
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
            case "SendMassageToUser":
                text = this.sendMassageToUser(scene)
                break
            case "Feedback":
                text = this.feedback(scene)
                break
            case "Instruction":
                text = this.instruction(scene)
                break
            case "ReservationNow":
                text = this.reservationNow(scene)
                break
            case "ServerBlock":
                text = this.serverBlock(scene)
                break
            case "DeleteMyReservation":
                text = this.deleteMyReservation(scene)
                break
            case "ReservationByDate":
                text = this.reservationByDate(scene)
                break


        }
        return text
    }
}
