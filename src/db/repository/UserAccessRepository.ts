import { ClientBase, DatabaseError, QueryResultRow } from 'pg'
import { VpnDBClientLocator, VpnDBConnection, VpnDB } from '../VpnDB'
import { UserAccess } from '../../model/vpn-user-types'

export interface UserAccessRepository {
    insertUserAccess(
        connection: VpnDBConnection,
        userAccess: UserAccess
    ): Promise<UserAccess>

    selectUserAccessByTelegramId(
        connection: VpnDBConnection,
        telegramUserId: number
    ): Promise<UserAccess | undefined>


}

export function makeUserAccessRepository(db: VpnDB): UserAccessRepository {
    return new UserAccessRepositoryImpl(db)
}

class UserAccessRepositoryImpl implements UserAccessRepository {
    private clientLocator: VpnDBClientLocator

    constructor(clientLocator: VpnDBClientLocator) {
        this.clientLocator = clientLocator;
    }

    async insertUserAccess(
        connection: VpnDBConnection,
        userAccess: UserAccess
    ): Promise<UserAccess> {
        return sql.insertUserAccess(
            await this.clientLocator.ensureClient(connection),
            userAccess
        )
    }

    async selectUserAccessByTelegramId(
        connection: VpnDBConnection,
        telegramUserId: number
    ): Promise<UserAccess | undefined> {
        return sql.selectUserAccessByTelegramId(
            await this.clientLocator.ensureClient(connection),
            telegramUserId
        )
    }

}

// sql
namespace sql {
    function userAccessRowMapping(row: QueryResultRow): UserAccess {
        return {
            telegramUserId: Number(row.telegram_user_id),
            startTrialTime: new Date(row.start_trial),
            userAccess: Boolean(row.user_access)
        }
    }

    export async function insertUserAccess(
        client: ClientBase,
        userAccess: UserAccess
    ): Promise<UserAccess> {
        const { telegramUserId, startTrialTime } = userAccess
        let access = true
        await client.query(
            `
                INSERT INTO user_server_access (telegram_user_id, start_trial, user_access)
                VALUES ($1, $2, $3)
            `,
            [telegramUserId, startTrialTime, access]
        )
        return {
            telegramUserId: telegramUserId,
            startTrialTime: startTrialTime
        }
    }

    export async function selectUserAccessByTelegramId(
        client: ClientBase,
        telegramUserId: number
    ): Promise<UserAccess | undefined> {
        const res = await client.query(
            `SELECT *
             FROM user_server_access
             WHERE telegram_user_id = $1
             `,
            [telegramUserId]
        )
        return res.rows.map(userAccessRowMapping).shift()
    }
}
