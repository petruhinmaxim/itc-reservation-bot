import { ClientBase, QueryResultRow } from 'pg'
import { VpnDBClientLocator, VpnDBConnection, VpnDB } from '../VpnDB'
import { ServerReservation } from '../../model/vpn-user-types'

export interface ServerReservationRepository {
    insertServerReservation(
        connection: VpnDBConnection,
        serverReservation: ServerReservation
    ): Promise<ServerReservation>

    selectReservationBy(
        connection: VpnDBConnection,
        reservationDate: string,
        reservationTime:string
    ): Promise<ServerReservation | undefined>

    selectLastReservation(
        connection: VpnDBConnection
    ): Promise<ServerReservation | undefined>

    selectLastDaysReservations(
        connection: VpnDBConnection,
        reservationID: number

    ): Promise<ServerReservation[] | undefined>

    addReservation(
        connection: VpnDBConnection,
        telegramUserId: number
    ): Promise<ServerReservation | undefined>

    addUserReservation(
        connection: VpnDBConnection,
        telegramUserId: number,
        reservationID: number
    ): Promise<ServerReservation | undefined>


}

export function makeServerReservationRepository(db: VpnDB): ServerReservationRepository {
    return new ServerReservationRepositoryImpl(db)
}

class ServerReservationRepositoryImpl implements ServerReservationRepository {
    private clientLocator: VpnDBClientLocator

    constructor(clientLocator: VpnDBClientLocator) {
        this.clientLocator = clientLocator;
    }

    async insertServerReservation(
        connection: VpnDBConnection,
        serverReservation: ServerReservation
    ): Promise<ServerReservation> {
        return sql.insertServerReservation(
            await this.clientLocator.ensureClient(connection),
            serverReservation
        )
    }

    async selectReservationBy(
        connection: VpnDBConnection,
        reservationDate: string,
        reservationTime:string
    ): Promise<ServerReservation | undefined> {
        return sql.selectReservationBy(
            await this.clientLocator.ensureClient(connection),
            reservationDate,
            reservationTime
        )
    }

    async selectLastReservation(
        connection: VpnDBConnection,
    ): Promise<ServerReservation | undefined> {
        return sql.selectLastReservation(
            await this.clientLocator.ensureClient(connection)
        )
    }

    async selectLastDaysReservations(
        connection: VpnDBConnection,
        reservationID: number
    ): Promise<ServerReservation[] | undefined> {
        return sql.selectLastDaysReservations(
            await this.clientLocator.ensureClient(connection),
            reservationID
        )
    }

    async addReservation(
        connection: VpnDBConnection,
        telegramUserId: number
    ): Promise<ServerReservation | undefined> {
        return sql.addReservation(
            await this.clientLocator.ensureClient(connection),
            telegramUserId
        )
    }

    async addUserReservation(
        connection: VpnDBConnection,
        telegramUserId: number,
        reservationID: number
    ): Promise<ServerReservation | undefined> {
        return sql.addUserReservation(
            await this.clientLocator.ensureClient(connection),
            telegramUserId,
            reservationID
        )
    }


}

// sql
namespace sql {
    function serverReservationRowMapping(row: QueryResultRow): ServerReservation {
        return {
            reservetionID: Number(row.id),
            reservationDate: String(row.reservation_date),
            reservationTime: String(row.reservation_time),
            telegramUserId: Number(row.telegram_user_id)
        }
    }

    export async function insertServerReservation(
        client: ClientBase,
        serverReservation: ServerReservation
    ): Promise<ServerReservation> {
        const { reservationDate, reservationTime } = serverReservation
        await client.query(
            `
                INSERT INTO server_reservation (reservation_date, reservation_time, telegram_user_id)
                VALUES ($1, $2, $3)
            `,
            [reservationDate, reservationTime, 0]
        )
        return {
            reservationDate,
            reservationTime
        }
    }

    export async function selectReservationBy(
        client: ClientBase,
        reservationDate: string,
        reservationTime: string
    ): Promise<ServerReservation | undefined> {
        const res = await client.query(
            `SELECT *
             FROM server_reservation
             WHERE reservation_date = $1
                AND reservation_time = $2`,
            [reservationDate, reservationTime]
        )
        return res.rows.map(serverReservationRowMapping).shift()
    }

    export async function selectLastReservation(
        client: ClientBase
    ): Promise<ServerReservation | undefined> {
        const res = await client.query(
            `SELECT *
            FROM server_reservation
            ORDER BY id DESC
            LIMIT 1;`
        )
        return res.rows.map(serverReservationRowMapping).shift()
    }

    export async function selectLastDaysReservations(
        client: ClientBase,
        reservationID: number
    ): Promise<ServerReservation[]| undefined> {
        const res = await client.query(
            `SELECT *
            FROM server_reservation
            WHERE id >= $1
            ORDER BY id DESC
            LIMIT 50;`,
            [reservationID]
        )
        return res.rows.map(serverReservationRowMapping)
    }

    export async function addReservation( //TODO
        client: ClientBase,
        telegramUserId: number
    ): Promise<ServerReservation | undefined> {
        const res = await client.query(
            `SELECT *
             FROM user_vpn_config
             WHERE telegram_user_id = $1`,
            [telegramUserId]
        )
        return res.rows.map(serverReservationRowMapping).shift()
    }

    export async function addUserReservation( 
        client: ClientBase,
        telegramUserId: number,
        reservationID: number
    ): Promise<ServerReservation | undefined> {
        const res = await client.query(
            `UPDATE server_reservation 
             SET telegram_user_id = $1
             WHERE id = $2`,
            [telegramUserId, reservationID]
        )
        return res.rows.map(serverReservationRowMapping).shift()
    }
}
