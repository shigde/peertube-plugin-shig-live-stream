import moment from 'moment';
import {PeerTubeHelpers} from '@peertube/peertube-types/server/types/plugins/register-server-option.model';

export async function getUserIdByOAuthToken(helper: PeerTubeHelpers, token: string) {
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
