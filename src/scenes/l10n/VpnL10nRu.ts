import { VpnL10n } from "./VpnL10n"
import * as s from "../../model/scene-types"
import { escapeString } from "../text-util";
import { ServerReservation } from "../../model/vpn-user-types";
import config from "../../config/config";


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
            return `Привет, ${userName}\n` +
                `Я помогу тебе забронировать и получить доступ к серверу с покерными тренажерами. Для этого выбери удобное для тебя время в разделе «Забронировать по времени» или нажми на кнопку «Забронировать сейчас», если сервер свободен \n` +
                `Обрати внимание, что работа ведется по московскому времени, а интервал бронирования равен двум часам \n` +
                `Не забудь ознакомиться с инструкцией и правилами работы на сервере \n \n` +
                `Статус сервера: ${status} ${date} ${tyme} МСК \n` +
                this.addMyReservationInfo(scene.myReservation1, scene.myReservation2)
        }
        else if (date) {
            return `Привет, ${userName}.\n` +
                `Я помогу тебе забронировать и получить доступ к серверу с покерными тренажерами. Для этого выбери удобное для тебя время в разделе «Забронировать по времени» или нажми на кнопку «Забронировать сейчас», если сервер свободен \n` +
                `Обрати внимание, что работа ведется по московскому времени, а интервал бронирования равен двум часам \n` +
                `Не забудь ознакомиться с инструкцией и правилами работы на сервере \n \n` +
                `Статус сервера: ${status} до ${date} ${tyme} МСК \n` +
                this.addMyReservationInfo(scene.myReservation1, scene.myReservation2)
        }
        else {
            return `Привет, ${userName}.\n` +
                `Я помогу тебе забронировать и получить доступ к серверу с покерными тренажерами. Для этого выбери удобное для тебя время в разделе «Забронировать по времени» или нажми на кнопку «Забронировать сейчас», если сервер свободен \n` +
                `Обрати внимание, что работа ведется по московскому времени, а интервал бронирования равен двум часам \n` +
                `Не забудь ознакомиться с инструкцией и правилами работы на сервере \n \n` +
                `Статус сервера: ${status}  \n` +
                this.addMyReservationInfo(scene.myReservation1, scene.myReservation2)
        }
    }

    addMyReservationInfo(reservation1: ServerReservation | undefined, reservation2: ServerReservation | undefined) {
        if (!reservation1) {
            return "Мои бронирование: отсутствуют"
        }
        else if (!reservation2) {
            return `Мое бронирование: ${reservation1.reservationDate} ${reservation1.reservationTime} \n \n` +
            `Данные для подключения: \n` +
            `IP сервера: ${config.server.ip} \n` +
            `Логин: ${config.server.login} Пароль: ` + this.getPass()
        }
        else {
            return `Мои ближайшие бронирования: \n` +
                `1) ${reservation1.reservationDate} ${reservation1.reservationTime} \n` +
                `2) ${reservation2.reservationDate} ${reservation2.reservationTime}\n \n` +
            `Данные для подключения: \n` +
            `IP сервера: ${config.server.ip} \n` +
            `Логин: ${config.server.login} Пароль: ` + this.getPass()
        }
    }
    getPass(){
        return escapeString(config.server.pass).replace("\\","").replace("\\","").replace("\\","")
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
            '2) После окончания триального периода доступ возобновляется при генерации 300+$ рейка в месяц при игре от себя и для всех игроков фонда ITC cash \n' +
            `3) Данные для подключения будут предоставлены в приветственном сообщение после успешного бронирования. Если не удается подключиться к серверу, перезапустите бота нажав menu->start в левом нижнем углу диалогового окна и проверьте, правильный ли вы вводите пароль\n \n` +
            'Инструкция: \n' +
            '1) Для подключения к серверу используйте Пуск(кнопка windows/start)  -> "Подключение к удаленному рабочему столу" \n' +
            '2) Не забывайте закрыть все запущенные программы после завершения тренировки \n' +
            '3) Если вы закончили работу с сервером, раньше таймаута 2 часа, пожалуйста, нажмите кнопку "Отменить бронирование"\n \n' 
        )

    }

    reservationNow(scene: s.ReservationNow): string {
        if (!scene.myReservation2 && scene.myReservation1) {
            return (`Сервер успешно забронирован. Дата: ${scene.myReservation1?.reservationDate} Время: ${scene.myReservation1?.reservationTime}`)
        }
        else {
            return (`Сервер успешно забронирован на два интервала: \n` +
                `1) ${scene.myReservation1?.reservationDate} ${scene.myReservation1?.reservationTime} \n` +
                `2) ${scene.myReservation2?.reservationDate} ${scene.myReservation2?.reservationTime} `)
        }
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

    reservationByTime(scene: s.ReservationByTime): string {
        return (`Выберите время бронирования сервера`)
    }


    sendMassageToUser(scene: s.SendMassageToUser): string {
        let userName = scene.userName
        if (!userName) {
            userName = `Симпотяга`
        }
        return `Привет, ${userName}.\n` +
            scene.text
    }

    confermReservation(scene: s.ConfermReservation): string {
        return (`Сервер успешно забронирован на ${scene.dateSlot} ${scene.timeSlot}`)
    }

    //navigation
    goToMainMenu(): string {
        return escapeString(
            `<< приветсвенное меню`
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
            ).replace("\\", "")
        else {
            return ""
        }
    }

    goToDateSlot2(scene: s.Scene): string {
        if (scene.tpe == "ReservationByDate")
            return escapeString(
                `${scene.dateSlot2}`
            ).replace("\\", "")
        else {
            return ""
        }
    }

    goToDateSlot3(scene: s.Scene): string {
        if (scene.tpe == "ReservationByDate")
            return escapeString(
                `${scene.dateSlot3}`
            ).replace("\\", "")
        else {
            return ""
        }
    }

    goToTimeSlot1(scene: s.Scene): string {
        if (scene.tpe == "ReservationByTime")
            return escapeString(
                `${scene.timeSlots[0]}`
            )
        else {
            return ""
        }
    }

    goToTime(scene: s.Scene, timeSlot: string): string {
        if (scene.tpe == "ReservationByTime" && timeSlot)
            return timeSlot
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
            case "ReservationByTime":
                text = this.reservationByTime(scene)
                break
            case "ConfermReservation":
                text = this.confermReservation(scene)
                break
        }
        return text
    }
}
