import {RegisterServerOptions} from '@peertube/peertube-types';
import {Notifier} from './notifier';


export async function initNotifikation (options: RegisterServerOptions, notifier: Notifier): Promise<void> {
    const logger = options.peertubeHelpers.logger
    const registerHook = options.registerHook
    logger.info('Registering notification hooks...')

    registerHook({
        target: 'action:application.listening',
        handler: () => {

        }
    })

}
