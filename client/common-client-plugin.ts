import type {RegisterClientOptions} from '@peertube/peertube-types/client'
import type {RegisterClientFormFieldOptions} from '@peertube/peertube-types'
import {showLobbyPage} from './pages/lobby';

/*
NB: if you need some types like `video`, `playlist`, ..., you can import them like that:
import type { Video } from '@peertube/peertube-types'
*/

async function register({
                            peertubeHelpers,
                            registerHook,
                            registerVideoField,
                            registerClientRoute
                        }: RegisterClientOptions): Promise<void> {

    registerHook({
        target: 'action:router.navigation-end',
        handler: () => {
            const container = document.querySelector('#peertube-plugin-shig-live-stream-container')
            if (container) {
                const url = container.getAttribute('peertube-plugin-shig-live-stream-current-url')
                if (url && url === window.location.href) {
                    console.warn(
                        '[peertube-plugin-livechat navigation-end] ' +
                        'It seems that action:router.navigation-end was called after action:video-watch.video.loaded. ' +
                        'No removing the chat from the DOM.'
                    )
                    return
                }
                container.remove()
            }
        }
    })

    // Register the admin stats route
    registerClientRoute({
        route: 'lobby',
        onMount: ({rootEl}) => {
            showLobbyPage({rootEl, peertubeHelpers});
        },
    });


    const [label, description, settings] = await Promise.all([
        peertubeHelpers.translate('Use Shig lobby'),
        peertubeHelpers.translate('The Shig lobby is a Video Streaming Studio.'),
        peertubeHelpers.getSettings()
    ])
    // @TODO: Create Admin setup
    settings['shig-server-exists'] = true
    settings['shig-all-lives'] = false

    const shigFieldOptions: RegisterClientFormFieldOptions = {
        name: 'shig-active',
        label: label,
        descriptionHTML: description,
        type: 'input-checkbox',
        default: true,
        hidden: ({liveVideo}) => {
            // if (!liveVideo) {
            //     return true
            // }
            // if (!settings['shig-server-exists']) {
            //     return true
            // }
            // if (settings['shig-all-lives']) {
            //     // No need to add this field if live is active for all live videos
            //     return true
            // }
            return false
        }
    }
    registerVideoField(shigFieldOptions, {type: 'update'})
    registerVideoField(shigFieldOptions, {type: 'go-live'})
}

export {
    register
}
