import moment from 'moment';

export async function getUserIdByOAuthToken({query}: any, token: string) {

    const startOfMonth = moment().startOf('month');
    const result = await query(
        'SELECT userId AS "count" FROM "oAuthToken" WHERE "accessToken" = $token AND "accessTokenExpiresAt" > $dat',
        {
            type: "SELECT",
            bind: { token: token, dat: startOfMonth.format('YYYY-MM-DD HH:mm:ss') }
        }
    );
    if(result && result.length != 1) {
        return -1
    }
    return result.userId

}
