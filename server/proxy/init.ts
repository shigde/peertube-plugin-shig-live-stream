import {MUserDefault, RegisterServerOptions} from '@peertube/peertube-types';
import {createProxyMiddleware} from 'http-proxy-middleware';
import {NextFunction, Response} from 'express';
import {getShigSettings} from '../../shared/lib/video';
import {getToken} from '../http/client';
import http from 'http';
import * as httpProxy from 'http-proxy';
import * as querystring from 'querystring';

export type BodyParserLikeRequest = http.IncomingMessage & { body: any };

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
    const entryMiddleware = (req: any, res: Response, next: NextFunction) => {
        options.peertubeHelpers.user.getAuthUser(res)
            .then((user: MUserDefault) => {
                if (!user) {
                    const err = new Error('not authorized') as any;
                    err.status = 401;
                    throw err
                }
                return user.username
            })
            .then((userName) => getToken(shigUrl, `${userName}@${serverDomain}`, shigToken))
            .then((token) => {
                if (!token) {
                    const err = new Error('not authorized') as any;
                    err.status = 401;
                    throw err
                } else {
                    req.locals = {contextToken: token};
                    res.locals.contextToken = token
                    next()
                }
            })
            .catch((err) => {
                next(err)
            })
    };

    router.all('/space*', entryMiddleware, createProxyMiddleware({
        target: shigUrl,
        changeOrigin: true,
        pathRewrite: {
            '^/plugins/shig-live-stream/router/': '/', // remove base path
        },
        onProxyReq: (proxyReq: http.ClientRequest, req: any, res: Response, options: httpProxy.ServerOptions) => {
            proxyReq.setHeader('authorization', req.locals.contextToken)
            const contentType = proxyReq.getHeader('Content-Type') as string;

            if (req.method == 'POST' && contentType && contentType.includes('application/json')) {
                const requestBody = (req as unknown as BodyParserLikeRequest).body;

                if (!requestBody) {
                    return;
                }

                const writeBody = (bodyData: string) => {
                    // deepcode ignore ContentLengthInCode: bodyParser fix
                    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
                    proxyReq.write(bodyData);
                };

                if (contentType && contentType.includes('application/json')) {
                    writeBody(JSON.stringify(requestBody));
                }

                if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
                    writeBody(querystring.stringify(requestBody));
                }
            }
        }
    }));
}

export {
    initProxy
}
