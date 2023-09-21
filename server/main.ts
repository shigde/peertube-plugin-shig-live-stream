import type {RegisterServerOptions} from '@peertube/peertube-types'
import {initCustomFields} from './custom-fields';
import decache from 'decache'
import {FileStorageManager} from './storage/file-storage-manager';
import {VideoHandler} from './handler/video-handler';
import path from 'path';
import {initSettings} from './settings';
import {initFederation} from './federation/init';
import {initProxy} from './proxy/init';
import {SQLiteStorageManager} from './storage/sqlite-storage-manager';
import {WebSocketServer} from 'ws';
// import {getUserIdByOAuthToken} from './storage/oauth-token';
// import moment from 'moment';

// FIXME: Peertube unregister don't have any parameter.
// Using this global variable to fix this, so we can use helpers to unregister.
let OPTIONS: RegisterServerOptions | undefined

async function register(options: RegisterServerOptions): Promise<void> {
    OPTIONS = options
    // This is a trick to check that peertube is at least in version 3.2.0
    if (!options.peertubeHelpers.plugin) {
        throw new Error('Your peertube version is not correct. This plugin is not compatible with Peertube < 3.2.0.')
    }

    const serverInfosDir = path.resolve(options.peertubeHelpers.plugin.getDataDirectoryPath(), 'serverInfos')
    const fileHandler = new FileStorageManager(serverInfosDir, options.peertubeHelpers.logger);
    const videoHandler = new VideoHandler(options.storageManager, fileHandler, options.peertubeHelpers.logger)

    const sqliteStorageManager = new SQLiteStorageManager(serverInfosDir, options.peertubeHelpers.logger)
    await sqliteStorageManager.migrate()

    const wss = new WebSocketServer({noServer: true})
    const logger = options.peertubeHelpers.logger
    wss.on('connection', async (ws, request) => {
        ws.on('message', async (token) => {
            // const userId = await getUserIdByOAuthToken(options.peertubeHelpers.database, `${token}`)
            logger.debug(`#################### - connected: ${token}`)
            ws.send(`connected`)
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

    await initCustomFields(options, videoHandler)
    await initSettings(options)
    await initFederation(options, videoHandler)
    await initProxy(options)

}

async function unregister(): Promise<void> {
    const module = __filename
    OPTIONS?.peertubeHelpers.logger.info(`Unloading module ${module}...`)
    // Peertube calls decache(plugin) on register, not unregister.
    // Will do here, to release memory.
    decache(module)
    OPTIONS?.peertubeHelpers.logger.info(`Successfully unloaded the module ${module}`)
    OPTIONS = undefined
}

module.exports = {
    register,
    unregister
}
