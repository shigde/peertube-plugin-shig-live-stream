import {MUserDefault, RegisterServerOptions} from '@peertube/peertube-types';
import proxy from 'express-http-proxy';
import {NextFunction, Response} from 'express';
import {getShigSettings} from '../../shared/lib/video';
import {getToken} from '../http/client';

async function initProxy(options: RegisterServerOptions): Promise<void> {
    const router = options.getRouter()
    const settings = await getShigSettings(options.settingsManager)

    if (!settings['shig-plugin-active'] || !settings['shig-server-url']) {
        return;
    }

    const shigUrl = settings['shig-server-url']
    const shigToken = settings['shig-access-token']
    let serverDomain = options.peertubeHelpers.config.getWebserverUrl();
    const HTTP = 'http://';
    if (serverDomain.startsWith(HTTP)) {
        // PREFIX is exactly at the beginning
        serverDomain = serverDomain.slice(HTTP.length);
    } else {
        serverDomain = serverDomain.slice(HTTP.length + 1);
    }

    router.all('/space*', proxy(shigUrl, {
        filter: (req, res) => {
            return new Promise((resolve, reject) => {
                options.peertubeHelpers.user.getAuthUser(res)
                    .then((user: MUserDefault) => {
                        if (!user) {
                            reject({code: 'UNAUTHORISED'})
                        }
                        return user.username

                    })
                    .then((userName) => getToken(shigUrl, `${userName}@${serverDomain}`, shigToken))
                    .then((token) => {
                        if (!token) {
                            reject({code: 'UNAUTHORISED'})
                        } else {
                            req.headers['X-Proxy-ACCESS_TOKEN'] = token;
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
                'authorization': srcReq.headers['X-Proxy-ACCESS_TOKEN']
            };
            return proxyReqOpts;
        },
        parseReqBody: false,
    }));

}

export {
    initProxy
}
