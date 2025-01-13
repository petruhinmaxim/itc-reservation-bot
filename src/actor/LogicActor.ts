import { Actor } from 'comedy'
import { actorLogger, Logger } from '../util/Logger'
import * as tg from '../model/telegram-massege-types'
import {
    ServerReservation,
    TelegramUserData,
    telegramUserEquals, UserAction,
    UserConfigs,
    UserFeedback,
    VpnConfig,
    VpnUser
} from '../model/vpn-user-types'
import { VpnDB, VpnDBConnection } from '../db/VpnDB'
import { makeTelegramUserDataRepository, TelegramUserDataRepository } from '../db/repository/TelegramUserDataRepository'
import { makeVpnUserRepository, VpnUserRepository } from "../db/repository/VpnUserRepository"
import { markupDataParseSceneTpe } from '../scenes/scene-markup'
import { ConfigRepository, makeConfigRepository } from "../db/repository/ConfigRepository"
import { makeUserConfigRepository, UserConfigRepository } from "../db/repository/UserConfigRepository"
import { OutputPayload } from "../model/telegram-massege-types"
import { makeUserFeedbackRepository, UserFeedbackRepository } from "../db/repository/UserFeedbackRepository";
import { makeUserActionRepository, UserActionRepository } from "../db/repository/UserActionRepository";
import { makeServerReservationRepository, ServerReservationRepository } from '../db/repository/ServerReservationRepository'

export default class LogicActor {
    private readonly vpnDB: VpnDB
    private log!: Logger
    private selfActor!: Actor
    private telegramUserDataRepo!: TelegramUserDataRepository
    private vpnUserRepo!: VpnUserRepository
    private configRepo!: ConfigRepository
    private userConfigsRepo!: UserConfigRepository
    private userFeedbackRepo!: UserFeedbackRepository
    private userActionRepo!: UserActionRepository
    private serverReservationRepo!: ServerReservationRepository

    static inject() {
        return ['VpnDBResource']
    }

    constructor(vpnDB: VpnDB) {
        this.vpnDB = vpnDB
    }

    async initialize(selfActor: Actor) {
        this.log = actorLogger(selfActor)
        this.selfActor = selfActor
        this.telegramUserDataRepo = makeTelegramUserDataRepository(this.vpnDB)
        this.vpnUserRepo = makeVpnUserRepository(this.vpnDB)
        this.configRepo = makeConfigRepository(this.vpnDB)
        this.userConfigsRepo = makeUserConfigRepository(this.vpnDB)
        this.userFeedbackRepo = makeUserFeedbackRepository(this.vpnDB)
        this.userActionRepo = makeUserActionRepository(this.vpnDB)
        this.serverReservationRepo = makeServerReservationRepository(this.vpnDB)
        this.log.info('init')

        async () => {
            const lustReservation = await this.vpnDB.withTransaction(
                this.log, async con => {
                    return await this.serverReservationRepo.selectLastReservation(con)
                })
            const lustReservationDate = lustReservation?.reservationDate

            const moscowOffset = 3 * 60
            const now = new Date();
            const moscowTime = new Date(now.getTime() + (now.getTimezoneOffset() + moscowOffset) * 60000);

            const dayTodat = String(moscowTime.getDate()).padStart(2, '0');
            const monthToday = String(moscowTime.getMonth() + 1).padStart(2, '0');
            let dateForCompere = `${dayTodat}.${monthToday}`

            if (!lustReservationDate) {
                await insertServerReservationsByDate(dateForCompere, this.vpnDB, this.log, this.serverReservationRepo)

                moscowTime.setDate(moscowTime.getDate() + 1);
                const dayOne = String(moscowTime.getDate()).padStart(2, '0');
                const monthOne = String(moscowTime.getMonth() + 1).padStart(2, '0');
                dateForCompere = `${dayOne}.${monthOne}`
                await insertServerReservationsByDate(dateForCompere, this.vpnDB, this.log, this.serverReservationRepo)

                moscowTime.setDate(moscowTime.getDate() + 1);
                const day2 = String(moscowTime.getDate()).padStart(2, '0');
                const month2 = String(moscowTime.getMonth() + 1).padStart(2, '0');
                dateForCompere = `${day2}.${month2}`
                await insertServerReservationsByDate(dateForCompere, this.vpnDB, this.log, this.serverReservationRepo)

                moscowTime.setDate(moscowTime.getDate() + 1);
                const day3 = String(moscowTime.getDate()).padStart(2, '0');
                const month3 = String(moscowTime.getMonth() + 1).padStart(2, '0');
                dateForCompere = `${day3}.${month3}`
                await insertServerReservationsByDate(dateForCompere, this.vpnDB, this.log, this.serverReservationRepo)

            }
            else {
                moscowTime.setDate(moscowTime.getDate() + 1);
                const dayOne = String(moscowTime.getDate()).padStart(2, '0');
                const monthOne = String(moscowTime.getMonth() + 1).padStart(2, '0');
                let dateForCompere = `${dayOne}.${monthOne}`

                let compareRes = compareDates(lustReservationDate, dateForCompere)
                if (compareRes === -1) {
                    await insertServerReservationsByDate(dateForCompere, this.vpnDB, this.log, this.serverReservationRepo)
                }
                moscowTime.setDate(moscowTime.getDate() + 1);
                const day2 = String(moscowTime.getDate()).padStart(2, '0');
                const month2 = String(moscowTime.getMonth() + 1).padStart(2, '0');
                dateForCompere = `${day2}.${month2}`
                compareRes = compareDates(lustReservationDate, dateForCompere)
                if (compareRes === -1) {
                    await insertServerReservationsByDate(dateForCompere, this.vpnDB, this.log, this.serverReservationRepo)
                }
                moscowTime.setDate(moscowTime.getDate() + 1);
                const day3 = String(moscowTime.getDate()).padStart(2, '0');
                const month3 = String(moscowTime.getMonth() + 1).padStart(2, '0');
                dateForCompere = `${day3}.${month3}`
                compareRes = compareDates(lustReservationDate, dateForCompere)
                if (compareRes === -1) {
                    await insertServerReservationsByDate(dateForCompere, this.vpnDB, this.log, this.serverReservationRepo)
                }
            }
        }

        setInterval(async () => {
            console.log("INIT SLOTS")
            const lustReservation = await this.vpnDB.withTransaction(
                this.log, async con => {
                    return await this.serverReservationRepo.selectLastReservation(con)
                })
            const lustReservationDate = lustReservation?.reservationDate

            const moscowOffset = 3 * 60
            const now = new Date();
            const moscowTime = new Date(now.getTime() + (now.getTimezoneOffset() + moscowOffset) * 60000);

            const dayTodat = String(moscowTime.getDate()).padStart(2, '0');
            const monthToday = String(moscowTime.getMonth() + 1).padStart(2, '0');
            let dateForCompere = `${dayTodat}.${monthToday}`

            if (!lustReservationDate) {
                await insertServerReservationsByDate(dateForCompere, this.vpnDB, this.log, this.serverReservationRepo)

                moscowTime.setDate(moscowTime.getDate() + 1);
                const dayOne = String(moscowTime.getDate()).padStart(2, '0');
                const monthOne = String(moscowTime.getMonth() + 1).padStart(2, '0');
                dateForCompere = `${dayOne}.${monthOne}`
                await insertServerReservationsByDate(dateForCompere, this.vpnDB, this.log, this.serverReservationRepo)

                moscowTime.setDate(moscowTime.getDate() + 1);
                const day2 = String(moscowTime.getDate()).padStart(2, '0');
                const month2 = String(moscowTime.getMonth() + 1).padStart(2, '0');
                dateForCompere = `${day2}.${month2}`
                await insertServerReservationsByDate(dateForCompere, this.vpnDB, this.log, this.serverReservationRepo)

                moscowTime.setDate(moscowTime.getDate() + 1);
                const day3 = String(moscowTime.getDate()).padStart(2, '0');
                const month3 = String(moscowTime.getMonth() + 1).padStart(2, '0');
                dateForCompere = `${day3}.${month3}`
                await insertServerReservationsByDate(dateForCompere, this.vpnDB, this.log, this.serverReservationRepo)

            }
            else {
                moscowTime.setDate(moscowTime.getDate() + 1);
                const dayOne = String(moscowTime.getDate()).padStart(2, '0');
                const monthOne = String(moscowTime.getMonth() + 1).padStart(2, '0');
                let dateForCompere = `${dayOne}.${monthOne}`

                let compareRes = compareDates(lustReservationDate, dateForCompere)
                if (compareRes === -1) {
                    await insertServerReservationsByDate(dateForCompere, this.vpnDB, this.log, this.serverReservationRepo)
                }
                moscowTime.setDate(moscowTime.getDate() + 1);
                const day2 = String(moscowTime.getDate()).padStart(2, '0');
                const month2 = String(moscowTime.getMonth() + 1).padStart(2, '0');
                dateForCompere = `${day2}.${month2}`
                compareRes = compareDates(lustReservationDate, dateForCompere)
                if (compareRes === -1) {
                    await insertServerReservationsByDate(dateForCompere, this.vpnDB, this.log, this.serverReservationRepo)
                }
                moscowTime.setDate(moscowTime.getDate() + 1);
                const day3 = String(moscowTime.getDate()).padStart(2, '0');
                const month3 = String(moscowTime.getMonth() + 1).padStart(2, '0');
                dateForCompere = `${day3}.${month3}`
                compareRes = compareDates(lustReservationDate, dateForCompere)
                if (compareRes === -1) {
                    await insertServerReservationsByDate(dateForCompere, this.vpnDB, this.log, this.serverReservationRepo)
                }
            }
        }
            , 20000)

        async function insertServerReservationsByDate(dateForInsert: string, vpnDB: VpnDB, log: Logger, serverReservationRepo: ServerReservationRepository) {
            let serverReservation: ServerReservation = {
                reservationDate: dateForInsert,
                reservationTime: "00:00 - 02:00 МСК"
            }
            await vpnDB.withTransaction(
                log, async con => {
                    return await serverReservationRepo.insertServerReservation(con, serverReservation)
                })


            serverReservation = {
                reservationDate: dateForInsert,
                reservationTime: "02:00 - 04:00 МСК"
            }
            await vpnDB.withTransaction(
                log, async con => {
                    return await serverReservationRepo.insertServerReservation(con, serverReservation)
                })

            serverReservation = {
                reservationDate: dateForInsert,
                reservationTime: "04:00 - 06:00 МСК"
            }
            await vpnDB.withTransaction(
                log, async con => {
                    return await serverReservationRepo.insertServerReservation(con, serverReservation)
                })

            serverReservation = {
                reservationDate: dateForInsert,
                reservationTime: "06:00 - 08:00 МСК"
            }
            await vpnDB.withTransaction(
                log, async con => {
                    return await serverReservationRepo.insertServerReservation(con, serverReservation)
                })

            serverReservation = {
                reservationDate: dateForInsert,
                reservationTime: "08:00 - 10:00 МСК"
            }
            await vpnDB.withTransaction(
                log, async con => {
                    return await serverReservationRepo.insertServerReservation(con, serverReservation)
                })

            serverReservation = {
                reservationDate: dateForInsert,
                reservationTime: "10:00 - 12:00 МСК"
            }
            await vpnDB.withTransaction(
                log, async con => {
                    return await serverReservationRepo.insertServerReservation(con, serverReservation)
                })

            serverReservation = {
                reservationDate: dateForInsert,
                reservationTime: "12:00 - 14:00 МСК"
            }
            await vpnDB.withTransaction(
                log, async con => {
                    return await serverReservationRepo.insertServerReservation(con, serverReservation)
                })

            serverReservation = {
                reservationDate: dateForInsert,
                reservationTime: "14:00 - 16:00 МСК"
            }
            await vpnDB.withTransaction(
                log, async con => {
                    return await serverReservationRepo.insertServerReservation(con, serverReservation)
                })

            serverReservation = {
                reservationDate: dateForInsert,
                reservationTime: "16:00 - 18:00 МСК"
            }
            await vpnDB.withTransaction(
                log, async con => {
                    return await serverReservationRepo.insertServerReservation(con, serverReservation)
                })

            serverReservation = {
                reservationDate: dateForInsert,
                reservationTime: "18:00 - 20:00 МСК"
            }
            await vpnDB.withTransaction(
                log, async con => {
                    return await serverReservationRepo.insertServerReservation(con, serverReservation)
                })

            serverReservation = {
                reservationDate: dateForInsert,
                reservationTime: "20:00 - 22:00 МСК"
            }
            await vpnDB.withTransaction(
                log, async con => {
                    return await serverReservationRepo.insertServerReservation(con, serverReservation)
                })

            serverReservation = {
                reservationDate: dateForInsert,
                reservationTime: "22:00 - 00:00 МСК"
            }
            await vpnDB.withTransaction(
                log, async con => {
                    return await serverReservationRepo.insertServerReservation(con, serverReservation)
                })
        }

        function compareDates(date1: string, date2: string) {
            try {
                // Разбиваем строки на день и месяц
                const [day1, month1] = date1.split('.').map(Number);
                const [day2, month2] = date2.split('.').map(Number);

                // Создаем фиктивный год (например, 2000) для сравнения
                const d1 = new Date(2000, month1 - 1, day1);
                const d2 = new Date(2000, month2 - 1, day2);

                // Сравниваем даты
                if (d1 < d2) {
                    return -1;
                } else if (d1 > d2) {
                    return 1;
                } else {
                    return 0;
                }
            } catch (error) {
                throw new Error("Неверный формат даты. Ожидается формат 'ДД.ММ'.");
            }
        }
    }

    private async ensureUser(
        con: VpnDBConnection,
        telegramUserData: TelegramUserData
    ): Promise<VpnUser> {
        let vpnUser: VpnUser | undefined
        const telegramUserId = telegramUserData.telegramUserId
        let userData = await this.telegramUserDataRepo.selectTelegramUserDataByUserId(con, telegramUserId)
        if (!userData) {
            await this.telegramUserDataRepo.insertTelegramUserData(con, telegramUserData)
            vpnUser = {
                telegramUserId: telegramUserData.telegramUserId,
                currentScene: { tpe: "Start" }
            }
        } else {
            if (!telegramUserEquals(telegramUserData, userData)) {
                await this.telegramUserDataRepo.updateTelegramUserData(con, telegramUserData)
            }
            vpnUser = await this.vpnUserRepo.selectVpnUserByUserId(con, telegramUserId)
            if (!vpnUser) {
                vpnUser = {
                    telegramUserId: telegramUserData.telegramUserId,
                    currentScene: { tpe: "Start" }
                }
            }
        }
        const userAction: UserAction = {
            telegramUserId: telegramUserData.telegramUserId,
            actionAt: new Date(),
            scene: vpnUser.currentScene.tpe
        }
        await this.userActionRepo.insertAction(con, userAction)
        return vpnUser
    }

    private async sendToUser(
        user: VpnUser,
        outputPayload: tg.OutputPayload,
        channel: tg.Channel = 'main'
    ) {
        await this.selfActor.getParent().send(
            'processOutboundTelegramMessage',
            <tg.OutboundTelegramMessage>{
                chatId: user.telegramUserId,
                outputPayload,
                channel
            }
        )
    }

    async processInboundTelegramMessage(msg: tg.InboundTelegramMessage) {
        const vpnUser: VpnUser = await this.vpnDB.withTransaction(
            this.log, async con => {
                return await this.ensureUser(con, msg.telegramUser)
            })

        await this.vpnDB.withConnection(this.log, async con => {
            switch (msg.inputPayload.tpe) {
                case 'TextInput':
                    await this.processMainText(con, vpnUser, msg.telegramUser, msg.inputPayload)
                    break
                case 'CallbackInput':
                    await this.processMainCallback(con, vpnUser, msg.telegramUser, msg.inputPayload,)
                    break
            }
        })
    }

    private async processMainCallback(
        con: VpnDBConnection,
        user: VpnUser,
        userData: TelegramUserData,
        payload: tg.CallbackInput
    ) {
        const sceneTpeInCallbackData = markupDataParseSceneTpe(payload.data)
        switch (sceneTpeInCallbackData) {
            case 'Start': {
                //TODO получение информации о статусе сервера и времени бронирования
                const moscowOffset = 3 * 60
                const now = new Date();
                const moscowTime = new Date(now.getTime() + (now.getTimezoneOffset() + moscowOffset) * 60000);

                const dayTodat = String(moscowTime.getDate()).padStart(2, '0');
                const monthToday = String(moscowTime.getMonth() + 1).padStart(2, '0');
                let dateToday = `${dayTodat}.${monthToday}`;
                const intervalTyme = getTimeInterval()
                let serverReservation: ServerReservation | undefined
                let serverStatus = false

                await this.vpnDB.withConnection(this.log, async con => {
                    serverReservation = await this.serverReservationRepo.selectReservationBy(con, dateToday, intervalTyme)
                })
                if (serverReservation?.telegramUserId) {
                    serverStatus = true
                    console.log(serverReservation.reservetionID)
                }

                let reservations: ServerReservation[] | undefined
                let reservationId: number = 0
                if (serverReservation?.reservetionID) reservationId = serverReservation.reservetionID
                let lastActiveReservation: ServerReservation | undefined
                let lastEamptyReservation: ServerReservation | undefined
                let myReservation: ServerReservation | undefined

                await this.vpnDB.withConnection(this.log, async con => {
                    reservations = await this.serverReservationRepo.selectLastDaysReservations(con, reservationId)

                    if (reservations?.length) {
                        for (let i = reservations?.length - 1; i >= 0; i--) {
                            if (reservations[i].telegramUserId == 0 && !lastEamptyReservation) {
                                lastEamptyReservation = reservations[i]
                            }
                            if (reservations[i].telegramUserId != 0 && !lastActiveReservation) {
                                lastActiveReservation = reservations[i]
                            }
                            if (reservations[i].telegramUserId == userData.telegramUserId) {
                                myReservation = reservations[i]
                            }
                        }
                    }
                })

                user.currentScene = {
                    tpe: "Start",
                    messageId: payload.messageId,
                    userName: userData.firstName,
                    serverStatus: serverStatus,
                    lastEamptyReservation: lastEamptyReservation,
                    lustActiveReservation: lastActiveReservation,
                    myReservation: myReservation
                }
                break
            }
            case 'ReservationNow': {
                const moscowOffset = 3 * 60
                const now = new Date();
                const moscowTime = new Date(now.getTime() + (now.getTimezoneOffset() + moscowOffset) * 60000);

                const dayTodat = String(moscowTime.getDate()).padStart(2, '0');
                const monthToday = String(moscowTime.getMonth() + 1).padStart(2, '0');
                let dateToday = `${dayTodat}.${monthToday}`;

                const intervalTyme = getTimeInterval()

                const reservation = {
                    reservationDate: dateToday,
                    reservationTime: intervalTyme
                }

                let serverReservation: ServerReservation | undefined

                await this.vpnDB.withConnection(this.log, async con => {
                    serverReservation = await this.serverReservationRepo.selectReservationBy(con, dateToday, intervalTyme)
                })

                if (serverReservation?.telegramUserId == 0 && serverReservation && serverReservation.reservetionID) {
                    let reservationId = serverReservation.reservetionID
                    await this.vpnDB.withConnection(this.log, async con => {
                        serverReservation = await this.serverReservationRepo.addUserReservation(con, userData.telegramUserId, reservationId)
                    })

                    user.currentScene = {
                        tpe: "ReservationNow",
                        messageId: payload.messageId,
                        myReservation: reservation
                    }

                }
                else {
                    user.currentScene = {
                        tpe: "ServerBlock",
                        messageId: payload.messageId
                    }
                }
                break
            }

            case 'DeleteMyReservation': {
                const moscowOffset = 3 * 60
                const now = new Date();
                const moscowTime = new Date(now.getTime() + (now.getTimezoneOffset() + moscowOffset) * 60000);

                const dayTodat = String(moscowTime.getDate()).padStart(2, '0');
                const monthToday = String(moscowTime.getMonth() + 1).padStart(2, '0');
                let dateToday = `${dayTodat}.${monthToday}`;
                const intervalTyme = getTimeInterval()
                let serverReservation: ServerReservation | undefined
                await this.vpnDB.withConnection(this.log, async con => {
                    serverReservation = await this.serverReservationRepo.selectReservationBy(con, dateToday, intervalTyme)
                })

                let reservations: ServerReservation[] | undefined
                let reservationId: number = 0
                if (serverReservation?.reservetionID) reservationId = serverReservation.reservetionID

                await this.vpnDB.withConnection(this.log, async con => {
                    reservations = await this.serverReservationRepo.selectLastDaysReservations(con, reservationId)

                    if (reservations?.length) {
                        for (let i = reservations?.length - 1; i >= 0; i--) {
                            if (reservations[i].telegramUserId == userData.telegramUserId) {
                                let resevationIDTodelete = reservations[i].reservetionID
                                let reservationTelegramIDTosave = reservations[i].telegramUserId
                                if (resevationIDTodelete && reservationTelegramIDTosave) {
                                    let updReservationID: number = resevationIDTodelete
                                    let updTelegramId:number = reservationTelegramIDTosave
                                    await this.vpnDB.withConnection(this.log, async con => {
                                        serverReservation = await this.serverReservationRepo.changeUserReservation(con, 0, updReservationID, updTelegramId)
                                    })
                                }
                            }
                        }
                    }
                })
                user.currentScene = {
                    tpe: "DeleteMyReservation",
                    messageId: payload.messageId
                }
                break


                //TODO получить мои брони на период вперед
                // заменить ID на равное нулю
                // загрузить обновление в базу (метод уже есть)
                // сохранить удаленное обновление брони. НУЖНА СТАТА. Для этого нужно передалать модель



            }

            case 'IphoneInstruction': {
                user.currentScene = {
                    tpe: "IphoneInstruction",
                    messageId: payload.messageId,
                    filename: "Iphone.mp4",
                    source: "media/instruction/Iphone.mp4"
                }
                let out: OutputPayload = {
                    tpe: 'SendFile',
                    scene: user.currentScene
                }
                await this.sendToUser(user, out)
                break
            }
            case 'MacInstruction': {
                user.currentScene = {
                    tpe: "MacInstruction",
                    messageId: payload.messageId,
                    filename: "mac.mp4",
                    source: "media/instruction/mac.mp4"
                }
                let out: OutputPayload = {
                    tpe: 'SendFile',
                    scene: user.currentScene
                }
                await this.sendToUser(user, out)
                break
            }
            case 'AndroidInstruction': {
                user.currentScene = {
                    tpe: "AndroidInstruction",
                    messageId: payload.messageId,
                    filename: "android.mp4",
                    source: "media/instruction/android.mp4"
                }
                let out: OutputPayload = {
                    tpe: 'SendFile',
                    scene: user.currentScene
                }
                await this.sendToUser(user, out)
                break
            }
            case 'WindowsInstruction': {
                user.currentScene = {
                    tpe: "WindowsInstruction",
                    messageId: payload.messageId,
                    filename: "windows.mp4",
                    source: "media/instruction/windows.mp4"
                }
                let out: OutputPayload = {
                    tpe: 'SendFile',
                    scene: user.currentScene
                }
                await this.sendToUser(user, out)
                break
            }
            case 'GetConfigs': {
                let mobileConfigId: number
                let pcConfigId: number
                let userConfigs: UserConfigs | undefined
                await this.vpnDB.withConnection(this.log, async con => {
                    userConfigs = await this.userConfigsRepo.selectConfigsById(con, userData.telegramUserId)
                })

                if (userConfigs) {
                    mobileConfigId = userConfigs.mobileConfigId
                    pcConfigId = userConfigs.pcConfigId
                } else {
                    let newUserConfigs: UserConfigs = await this.vpnDB.withTransactionIsolation(
                        this.log, 'serializable', true, async con => {
                            const userConfigsId: { mobileConfigId: number, pcConfigId: number } =
                                await this.configRepo.selectUnusedConfigs(con)
                            mobileConfigId = userConfigsId.mobileConfigId
                            pcConfigId = userConfigsId.pcConfigId
                            return await this.userConfigsRepo.insertUserConfig(con, {
                                telegramUserId: user.telegramUserId,
                                mobileConfigId,
                                pcConfigId
                            })
                        })
                    if (newUserConfigs) {
                        mobileConfigId = newUserConfigs.mobileConfigId
                        pcConfigId = newUserConfigs.pcConfigId
                    }
                }
                let mobileConfig: VpnConfig | undefined
                let pcConfig: VpnConfig | undefined
                await this.vpnDB.withConnection(this.log, async con => {
                    mobileConfig = await this.configRepo.selectConfigById(con, mobileConfigId)
                    pcConfig = await this.configRepo.selectConfigById(con, pcConfigId)
                })
                if (mobileConfig && pcConfig)
                    user.currentScene = {
                        tpe: "GetConfigs",
                        messageId: payload.messageId,
                        mobileConfigData: mobileConfig.configData,
                        pcConfigData: pcConfig.configData
                    }
                break
            }
            case 'GeneralInfo': {
                user.currentScene = {
                    tpe: "GeneralInfo",
                    messageId: payload.messageId
                }
                break
            }
            case 'Instruction': {
                user.currentScene = {
                    tpe: "Instruction",
                    messageId: payload.messageId
                }
                break
            }
            case 'Feedback': {
                user.currentScene = {
                    tpe: "Feedback",
                    messageId: payload.messageId
                }
                break
            }
            case 'DeleteMassage': {
                user.currentScene = {
                    tpe: "DeleteMassage",
                    messageId: payload.messageId
                }
                break
            }
        }
        let out: tg.OutputPayload
        if (sceneTpeInCallbackData == "GetConfigs") {
            out = {
                tpe: 'SendFile',
                scene: user.currentScene
            }
        } else {
            out = {
                tpe: 'EditOutput',
                scene: user.currentScene
            }
        }
        await this.vpnUserRepo.upsertVpnUser(con, user)
        await this.sendToUser(user, out)

        function getTimeInterval() {
            const now = new Date();
            const moscowOffset = 3 * 60; // Смещение Москвы от UTC в минутах (UTC+3)
            const localTime = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + moscowOffset * 60000);
            const hours = localTime.getHours()
            const intervalStart = Math.floor(hours / 2) * 2;
            let intervalEnd = intervalStart + 2;
            if (intervalStart == 22) {
                intervalEnd = 0;
            }
            let interval = `${String(intervalStart).padStart(2, '0')}:00 - ${String(intervalEnd).padStart(2, '0')}:00 МСК`;
            return interval
        }
    }


    private async processMainText(
        con: VpnDBConnection,
        user: VpnUser,
        userData: TelegramUserData,
        payload: tg.TextInput
    ) {
        if (user.currentScene.tpe == "Feedback") {
            const userFeedback: UserFeedback = {
                telegramUserId: user.telegramUserId,
                feedback: payload.text
            }
            await this.userFeedbackRepo.insertFeedback(con, userFeedback)

            user.currentScene = {
                tpe: "WindowsInstruction",
                messageId: payload.messageId,
                filename: "tnx.mp4",
                source: "media/tnx.mp4"
            }
            let out: OutputPayload = {
                tpe: 'SendFile',
                scene: user.currentScene
            }
            await this.sendToUser(user, out)

            user.currentScene = {
                tpe: "Start",
                messageId: payload.messageId,
                userName: userData.firstName
            }
            await this.vpnUserRepo.upsertVpnUser(con, user)
        } else {
            // dell user message
            let out: tg.OutputPayload = {
                tpe: 'DeleteMessageOutput',
                messageId: payload.messageId
            }
            await this.sendToUser(user, out)

            if (payload.text == '/start') {
                // del previous message
                if (user.currentScene.messageId) {
                    out = {
                        tpe: 'DeleteMessageOutput',
                        messageId: user.currentScene.messageId
                    }
                    await this.sendToUser(user, out)
                }
                user.currentScene = {
                    tpe: 'Start',
                    messageId: payload.messageId,
                    userName: userData.firstName
                }
                out = {
                    tpe: 'SendOutput',
                    scene: user.currentScene
                }
                await this.sendToUser(user, out)
                await this.vpnUserRepo.upsertVpnUser(con, user)
            } else if (payload.text.indexOf("sendToAllUsers424140go") != -1) {
                const textToSend = payload.text.replace("sendToAllUsers424140go", "")
                const allUsers = await this.telegramUserDataRepo.selectAllUsers(con)
                for (const userToSend of allUsers) {
                    user.currentScene = {
                        tpe: 'SendMassageToUser',
                        messageId: payload.messageId,
                        userName: userToSend.firstName,
                        text: textToSend
                    }
                    user.telegramUserId = userToSend.telegramUserId
                    out = {
                        tpe: 'SendAdminMassage',
                        scene: user.currentScene
                    }
                    await this.sendToUser(user, out)
                }
            }
        }
    }

    async processResendOutboundMessage(msg: tg.OutboundTelegramMessage) {
        let user: VpnUser | undefined
        let userData: TelegramUserData | undefined
        await this.vpnDB.withConnection(this.log, async con => {
            user = await this.vpnUserRepo.selectVpnUserByUserId(con, msg.chatId)
            userData = await this.telegramUserDataRepo.selectTelegramUserDataByUserId(con, msg.chatId)
        })
        if (user && userData && user.currentScene.messageId) {
            let out: OutputPayload = {
                tpe: 'DeleteMessageOutput',
                messageId: user.currentScene.messageId
            }
            await this.sendToUser(user, out)
            if (user.currentScene.tpe == "GetConfigs") {
                user.currentScene = {
                    tpe: "Start",
                    userName: userData.firstName
                }
            }
            out = {
                tpe: 'SendOutput',
                scene: user.currentScene
            }
            await this.vpnDB.withConnection(this.log, async con => {
                if (user)
                    await this.vpnUserRepo.upsertVpnUser(con, user)
            })
            await this.sendToUser(user, out)
        }
    }
}
