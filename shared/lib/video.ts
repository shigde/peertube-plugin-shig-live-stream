import {VideoObject} from '@peertube/peertube-types';
import {ActivityPubAttributedTo} from '@peertube/peertube-types/shared/models/activitypub/objects/common-objects';
import {PluginSettingsManager} from '@peertube/peertube-types/shared/models';

interface ShigVideoObject extends VideoObject {
    peertubeShig: boolean | ShigPluginData
    guests: ActivityPubAttributedTo[]
}

interface VideoHasShigSettings {
    'shig-plugin-active': boolean
    'shig-server-url': string
    'shig-access-token': string,
    'shig-federation-no-remote': boolean
}

interface ShigPluginData {
    url: string

    shigInstanceUrl?: string

    shigActive?: boolean
    shigRemote?: boolean

    firstGuest?: string
    secondGuest?: string
    thirdGuest?: string

    customMessage?: string
}

interface ShigVideo {
    id: number | string
    uuid: string
    url: string
    isLive: boolean
    pluginData?: ShigPluginData
}

interface SharedVideoFrontend extends ShigVideo {
    isLocal: boolean
}

interface SharedVideoBackend extends ShigVideo {
    remote: boolean
}

type SharedVideo = SharedVideoBackend | SharedVideoFrontend

/**
 * Indicate if the video has shig plugin active.
 * @param settings plugin settings
 * @param video the video
 * @returns true if the video has shig plugin active
 */
function videoHasShig(settings: VideoHasShigSettings, video: SharedVideo): boolean {
    if (settings['shig-plugin-active'] && video.isLive && video.pluginData && video.pluginData['shigActive']) {
        return true
    }

    return false
}

interface VideoHasRemoteShigSettings {
    'shig-federation-no-remote': boolean
}

/**
 * Indicates if the video has a remote .
 */
function videoHasRemoteShig(settings: VideoHasRemoteShigSettings, video: SharedVideo): boolean {
    if (settings['shig-federation-no-remote']) {
        return false
    }
    return true
    // if ('isLocal' in video) {
    //     if (video.isLocal) return false
    // } else {
    //     if (!video.remote) return false
    // }
    // if (!video.pluginData) {
    //     return false
    // }
    // if (!video.pluginData['shigRemote']) {
    //     return false
    // }
}

async function getShigSettings(settingsManager: PluginSettingsManager): Promise<VideoHasShigSettings> {
    const settingEntries = await settingsManager.getSettings([
        'shig-plugin-active',
        'shig-server-url',
        'shig-access-token',
        'shig-federation-no-remote',
    ])
    return castSettingsToShigSettings(settingEntries)
}

function castSettingsToShigSettings(settings: any): VideoHasShigSettings {
    return {
        'shig-plugin-active': !!settings['shig-plugin-active'],
        'shig-server-url': ('shig-server-url' in settings) ? settings['shig-server-url'] : '',
        'shig-access-token': ('shig-access-token' in settings) ? settings['shig-access-token'] : '',
        'shig-federation-no-remote': !!settings['shig-federation-no-remote']
    }
}

export type {
    ShigVideo,
    ShigPluginData,
    ShigVideoObject,
    SharedVideo,
    VideoHasShigSettings,
}

export {
    videoHasShig,
    videoHasRemoteShig,
    castSettingsToShigSettings,
    getShigSettings
}
