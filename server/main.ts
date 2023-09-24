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
import {initInvitation} from './invitation/init';
import {InvitationService} from './invitation/invitation-service';
import {PostgreSqlStorageManager} from './storage/postgresql-storage-manager';
import {InvitationNotifier} from './invitation/invitation-notifier';

// FIXME: Peertube unregister don't have any parameter.
// Using this global variable to fix this, so we can use helpers to unregister.
let OPTIONS: {
    serverOptions?: RegisterServerOptions
    notifier?: InvitationNotifier
} | undefined

async function register(options: RegisterServerOptions): Promise<void> {
    OPTIONS = {
        serverOptions: options
    }
    // This is a trick to check that peertube is at least in version 3.2.0
    if (!options.peertubeHelpers.plugin) {
        throw new Error('Your peertube version is not correct. This plugin is not compatible with Peertube < 3.2.0.')
    }

    const serverInfosDir = path.resolve(options.peertubeHelpers.plugin.getDataDirectoryPath(), 'serverInfos')
    const fileHandler = new FileStorageManager(serverInfosDir, options.peertubeHelpers.logger);
    const videoHandler = new VideoHandler(options.storageManager, fileHandler, options.peertubeHelpers.logger)

    // init invitation objects
    const postgreManager = new PostgreSqlStorageManager(options.peertubeHelpers)
    const sqliteStorageManager = new SQLiteStorageManager(serverInfosDir, options.peertubeHelpers.logger)
    const invitationNotifier = new InvitationNotifier()
    const invitationService = new InvitationService(postgreManager, invitationNotifier, sqliteStorageManager)

    await sqliteStorageManager.migrate()
    await initInvitation(options, postgreManager, invitationNotifier, sqliteStorageManager)
    await initCustomFields(options, videoHandler, invitationService)
    await initSettings(options)
    await initFederation(options, videoHandler)
    await initProxy(options)

    OPTIONS.notifier = invitationNotifier
}

async function unregister(): Promise<void> {
    const module = __filename
    OPTIONS?.serverOptions?.peertubeHelpers.logger.info(`Unloading module ${module}...`)
    // Peertube calls decache(plugin) on register, not unregister.
    // Will do here, to release memory.
    decache(module)
    OPTIONS?.notifier?.stopInterval()
    OPTIONS?.serverOptions?.peertubeHelpers.logger.info(`Successfully unloaded the module ${module}`)
    OPTIONS = undefined
}

module.exports = {
    register,
    unregister
}
