import { ClientBase, QueryResultRow } from 'pg'
import { VpnDBClientLocator, VpnDBConnection, VpnDB } from '../VpnDB'
import { ServerReservation } from '../../model/vpn-user-types'

export interface ServerReservationRepository {
    insertServerReservation(
        connection: VpnDBConnection,
        serverReservation: ServerReservation
    ): Promise<ServerReservation>

    selectConfigsById(
        connection: VpnDBConnection,
        telegramUserId: number
    ): Promise<ServerReservation | undefined>

    selectLastReservation(
        connection: VpnDBConnection
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

    async selectConfigsById(
        connection: VpnDBConnection,
        telegramUserId: number
    ): Promise<ServerReservation | undefined> {
        return sql.selectConfigsById(
            await this.clientLocator.ensureClient(connection),
            telegramUserId
        )
    }

    async selectLastReservation(
        connection: VpnDBConnection,
    ): Promise<ServerReservation | undefined> {
        return sql.selectLastReservation(
            await this.clientLocator.ensureClient(connection)
        )
    }


}

// sql
namespace sql {
    function serverReservationRowMapping(row: QueryResultRow): ServerReservation {
        return {
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

    export async function selectConfigsById(
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
}
