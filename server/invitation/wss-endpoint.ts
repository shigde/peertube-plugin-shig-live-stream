import {RegisterServerOptions} from '@peertube/peertube-types';
import {WebSocketServer} from 'ws';
import {InvitationNotifier} from './invitation-notifier';
import {PostgreSqlStorageManager} from '../storage/postgresql-storage-manager';

async function registerWssEndpoints(
    options: RegisterServerOptions,
    postgre: PostgreSqlStorageManager,
    notifier: InvitationNotifier) {
    const wss = new WebSocketServer({noServer: true})
    const logger = options.peertubeHelpers.logger
    wss.on('connection', async (ws, request) => {
        ws.on('message', async (token) => {
            const userId = await postgre.getUserIdByOAuthToken(`${token}`)
            logger.debug(`user - connected: ${userId}`)
            if (userId == -1) {
                ws.close(401, 'authentication failed"')
                return
            }
            ws.send('connected')
            ws.removeAllListeners('message')

            // @ts-ignore
            ws.is_alive = true;
            ws.on('pong', () => { // @ts-ignore
                ws.is_alive = true;
            });
            notifier.addUserWebSocket(userId, ws)
        })
    })

    options.registerWebSocketRoute({
        route: '/invitations',
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
