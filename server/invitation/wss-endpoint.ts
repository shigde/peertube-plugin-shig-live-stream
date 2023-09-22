import {RegisterServerOptions} from '@peertube/peertube-types';
import {WebSocketServer} from 'ws';
import {getUserIdByOAuthToken} from '../storage/oauth-token';

async function registerWssEndpoints (options: RegisterServerOptions) {
    const wss = new WebSocketServer({noServer: true})
    const logger = options.peertubeHelpers.logger
    wss.on('connection', async (ws, request) => {
        ws.on('message', async (token) => {
            const userId = await getUserIdByOAuthToken(options.peertubeHelpers, `${token}`)
            logger.debug(`#################### - connected: ${userId}`)
            ws.send(`connected: ${userId}`)
            // if(userId == -1) {
            //     ws.close(401, 'authentication failed"')
            //     return
            // }
            // ws.removeAllListeners('message')
            // ws.send(`connected: ${userId}`)
            // start handle messages
            // ws.on('message', null)
        })
    })

    options.registerWebSocketRoute({
        route: '/notification',
        handler: async (request, socket, head) => {
            wss.handleUpgrade(request, socket, head, ws => {
                wss.emit('connection', ws, request)
            })
        }
    })
}

export {
    registerWssEndpoints
}
