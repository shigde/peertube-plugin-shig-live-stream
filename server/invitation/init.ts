import {RegisterServerOptions} from '@peertube/peertube-types';

import {registerAPIEndpoints} from './api-endpoint';
import {registerWssEndpoints} from './wss-endpoint';
import {SQLiteStorageManager} from '../storage/sqlite-storage-manager';
import {InvitationNotifier} from './invitation-notifier';
import {PostgreSqlStorageManager} from '../storage/postgresql-storage-manager';

async function initInvitation(
    options: RegisterServerOptions,
    postgreManager: PostgreSqlStorageManager,
    notifier: InvitationNotifier,
    storage: SQLiteStorageManager
): Promise<void> {
    const logger = options.peertubeHelpers.logger
    logger.info('Registering notification hooks...')

    await registerWssEndpoints(options, postgreManager, notifier)
    await registerAPIEndpoints(options, storage)
}

export {
    initInvitation
}
