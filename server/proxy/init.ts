import {MUserDefault, RegisterServerOptions} from '@peertube/peertube-types';
import proxy from 'express-http-proxy';
import {NextFunction, Response} from 'express';
import {getShigSettings} from '../../shared/lib/video';
// @TODO fix this with real authorisation
const bearer = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJ1dWlkIjoiOWJlZGMwZDktZWM2MS00ZmY0LWI4MWEtOGZkZGU0NWY3MzI3In0.831begOFS84xV-7BpXYlVgg3A2hMf4xbPWoXRs4m0qg'

async function initProxy(options: RegisterServerOptions): Promise<void> {
    const router = options.getRouter()
    const settings = await getShigSettings(options.settingsManager)

    if (!settings['shig-plugin-active'] || !settings['shig-server-url']) {
        return;
    }

    const shigUrl = settings['shig-server-url']

    router.all('/space*', proxy(shigUrl, {
        filter: (req, res) => {
            return new Promise((resolve, reject) => {
                options.peertubeHelpers.user.getAuthUser(res).then((user: MUserDefault) => {
                    if (!user) {
                        reject({code: 'UNAUTHORISED'})
                    } else {
                        resolve(true)
                    }
                })
            });
        },
        proxyErrorHandler: (
            err: any,
            res: Response,
            next: NextFunction
        ): any | undefined => {
            switch (err && err.code) {
                case 'UNAUTHORISED': {
                    return res.status(401).send('Unauthorised');
                }
                default: {
                    next(err);
                }
            }
        },
        proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers = {
                ...proxyReqOpts.headers,
                'authorization': bearer
            };
            return proxyReqOpts;
        },
        parseReqBody: false,
    }));

}

export {
    initProxy
}
