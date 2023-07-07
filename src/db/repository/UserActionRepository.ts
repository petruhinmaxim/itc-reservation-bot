import {ClientBase, QueryResultRow} from 'pg'
import {VpnDBClientLocator, VpnDBConnection, VpnDB} from '../VpnDB'
import {UserAction} from '../../model/vpn-user-types'

export interface UserActionRepository {
    insertAction(
        connection: VpnDBConnection,
        userAction: UserAction
    ): Promise<UserAction>
}

export function makeUserActionRepository(db: VpnDB): UserActionRepository {
    return new ActionRepositoryImpl(db)
}

class ActionRepositoryImpl implements UserActionRepository {
    private clientLocator: VpnDBClientLocator

    constructor(clientLocator: VpnDBClientLocator) {
        this.clientLocator = clientLocator;
    }

    async insertAction(
        connection: VpnDBConnection,
        userAction: UserAction
    ): Promise<UserAction> {
        return sql.insertAction(
            await this.clientLocator.ensureClient(connection),
            userAction
        )
    }
}

// sql
namespace sql {
    function UserActionRowMapping(row: QueryResultRow): UserAction {
        return {
            telegramUserId: Number(row.config_id),
            scene: row.user_scene
        }
    }

    export async function insertAction(
        client: ClientBase,
        UserAction: UserAction
    ): Promise<UserAction> {
        const {telegramUserId, actionAt, scene} = UserAction
        await client.query(
            `
                INSERT INTO vpn_user_action (telegram_user_id, action_at, user_scene)
                VALUES ($1, $2, $3)
            `,
            [telegramUserId, actionAt, scene]
        )
        return {
            telegramUserId,
            actionAt,
            scene
        }
    }
}
