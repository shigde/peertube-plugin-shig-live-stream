import {PeerTubeHelpers} from '@peertube/peertube-types/server/types/plugins/register-server-option.model';
import moment from 'moment/moment';

export class PostgreSqlStorageManager {

    constructor(private helper: PeerTubeHelpers) {
    }

    public async getUserIdByOAuthToken(token: string) {
        const helper = this.helper
        try {
            const startOfMonth = moment().startOf('month');
            const result = await helper.database.query(
                'SELECT "userId" FROM "oAuthToken" WHERE "accessToken" = $token AND "accessTokenExpiresAt" > $dat',
                {
                    type: 'SELECT',
                    bind: {
                        token: token,
                        dat: startOfMonth.format('YYYY-MM-DD HH:mm:ss')
                    }
                }
            );

            if (result && result.length != 1) {
                return -1
            }
            return result[0].userId
        } catch (e) {
            helper.logger.error(e)
            return -1
        }
    }

    public async getUserIdByUserName(name: string): Promise<number> {
        const helper = this.helper
        try {
            const result = await helper.database.query(
                'SELECT * FROM "user" WHERE "username" = $name', {
                    type: 'SELECT',
                    bind: {name: name}
                }
            );

            if (result && result.length != 1) {
                return -1
            }
            return result[0].id
        } catch (e) {
            helper.logger.error(e)
            return -1
        }
    }

    public async getAccountByUserId(userId: number): Promise<any> {
        const helper = this.helper
        try {
            const result = await helper.database.query(
                'SELECT * FROM "account" WHERE "userId" = $userId', {
                    type: 'SELECT',
                    bind: {userId: userId}
                }
            );

            if (result && result.length != 1) {
                return null
            }
            return result[0]
        } catch (e) {
            helper.logger.error(e)
            return null
        }
    }
}
