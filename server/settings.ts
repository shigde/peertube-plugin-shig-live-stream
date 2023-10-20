import type {PeerTubeHelpers, RegisterServerOptions} from '@peertube/peertube-types'
import {validateServerUrl, validateToken} from '../shared/lib/validator';
import {registerShigInstance} from './http/client';

async function initSettings(options: RegisterServerOptions,): Promise<void> {
    const {
        registerSetting,
        settingsManager,
        peertubeHelpers
    } = options

    registerSetting({
        type: 'html',
        private: true,
        descriptionHTML: '<h3>Shig settings</h3>'
    })
    registerSetting({
        type: 'html',
        private: true,
        descriptionHTML: '<p>Setup your Shig Service Instances</p>'
    })
    registerSetting({
        type: 'html',
        private: true,
        descriptionHTML: '<h5>Shig Server Instance</h5>'
    })
    registerSetting({
        name: 'shig-plugin-active',
        label: 'Enable Shig Plugin globally.',
        descriptionHTML: 'With this setting you can switch the Shig plugin Global on or off. If you switch off the plugin, live videos that have the Shig plugin activated can no longer access the Shig lobby.',
        type: 'input-checkbox',
        default: true,
        private: false
    })

    registerSetting({
        name: 'shig-server-url',
        label: 'Shig Server public url',
        descriptionHTML: 'Insert a URL through which the Shig service can be accessed, like: http://localhost:8081',
        type: 'input',
        default: '',
        private: false,
        error: validateServerUrl
    })

    registerSetting({
        name: 'shig-access-token',
        label: 'Shig access token',
        descriptionHTML: 'Insert a service access token.',
        type: 'input',
        default: '',
        private: false,
        error: validateToken
    })

    registerSetting({
        name: 'shig-federation-no-remote',
        label: 'Disable Shig Plugin for remote access.',
        descriptionHTML: 'When you disable remote access, users from other instances may attempt to access your Shig lobby.',
        type: 'input-checkbox',
        default: false,
        private: false
    })

    settingsManager.onSettingsChange(async settings => {
        await updateSettings(peertubeHelpers, settings)
    })

}

async function updateSettings(peertubeHelpers: PeerTubeHelpers, settings: any) {
    if (settings['shig-plugin-active']) {
        let actor = await peertubeHelpers.server.getServerActor()
        await registerShigInstance(settings['shig-server-url'], actor.url, settings['shig-access-token'])
    }
    peertubeHelpers.logger.info('settings changed')
}

export {
    initSettings
}
