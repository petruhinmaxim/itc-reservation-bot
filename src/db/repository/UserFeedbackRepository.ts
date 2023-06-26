import {ClientBase, QueryResultRow} from 'pg'
import {VpnDBClientLocator, VpnDBConnection, VpnDB} from '../VpnDB'
import {UserFeedback} from '../../model/vpn-user-types'

export interface UserFeedbackRepository {
    insertFeedback(
        connection: VpnDBConnection,
        userFeedback: UserFeedback
    ): Promise<UserFeedback>
}

export function makeUserFeedbackRepository(db: VpnDB): UserFeedbackRepository {
    return new FeedbackRepositoryImpl(db)
}

class FeedbackRepositoryImpl implements UserFeedbackRepository {
    private clientLocator: VpnDBClientLocator

    constructor(clientLocator: VpnDBClientLocator) {
        this.clientLocator = clientLocator;
    }

    async insertFeedback(
        connection: VpnDBConnection,
        userFeedback: UserFeedback
    ): Promise<UserFeedback> {
        return sql.insertFeedback(
            await this.clientLocator.ensureClient(connection),
            userFeedback
        )
    }
}

// sql
namespace sql {
    function userFeedbackRowMapping(row: QueryResultRow): UserFeedback {
        return {
            telegramUserId: Number(row.config_id),
            feedback: row.user_feedback
        }
    }

    export async function insertFeedback(
        client: ClientBase,
        userFeedback: UserFeedback
    ): Promise<UserFeedback> {
        const {telegramUserId, feedback} = userFeedback
        await client.query(
            `
                INSERT INTO vpn_user_feedback (telegram_user_id, user_feedback)
                VALUES ($1, $2)
            `,
            [telegramUserId, feedback]
        )
        return {
            telegramUserId,
            feedback,
        }
    }
}
