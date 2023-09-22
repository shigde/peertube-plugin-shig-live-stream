import {RegisterServerOptions} from '@peertube/peertube-types';
import {Notifier} from './notifier';
import {registerAPIEndpoints} from './api-endpoint';
import {registerWssEndpoints} from './wss-endpoint';

async function initInvitation(options: RegisterServerOptions, notifier: Notifier): Promise<void> {
    const logger = options.peertubeHelpers.logger
    logger.info('Registering notification hooks...')

    await registerWssEndpoints(options)
    await registerAPIEndpoints(options)
}

export {
    initInvitation
}
