import {VideoObject} from '@peertube/peertube-types';
import {ActivityPubAttributedTo} from '@peertube/peertube-types/shared/models/activitypub/objects/common-objects';

interface ShigVideoObject extends VideoObject {
    guests: ActivityPubAttributedTo[]
}

interface VideoHasShigSettings {
    'shig-plugin-active': boolean
    'shig-server-url': boolean
    'shig-access-token': string
}

interface ShigPluginData {
    url: string

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
 * Indicate if the video has a local chat.
 * @param settings plugin settings
 * @param video the video
 * @returns true if the video has a local chat
 */
function videoHasShig(settings: VideoHasShigSettings, video: SharedVideo): boolean {
    // Never use webchat on remote videos.
    if ('isLocal' in video) {
        if (!video.isLocal) return false
    } else {
        if (video.remote) return false
    }

    if (settings['shig-plugin-active'] && video.isLive && video.pluginData && video.pluginData['shigActive']) {
        return true
    }

    return false
}

interface VideoHasRemoteShigSettings {
    'shig-federation-no-remote': boolean
}

/**
 * Indicates if the video has a remote chat.
 * @param settings plugin settings
 * @param video the video
 * @returns true if the video has a remote chat
 */
function videoHasRemoteShig(settings: VideoHasRemoteShigSettings, video: SharedVideo): boolean {
    if (settings['shig-federation-no-remote']) {
        return false
    }
    if ('isLocal' in video) {
        if (video.isLocal) return false
    } else {
        if (!video.remote) return false
    }
    if (!video.pluginData) {
        return false
    }
    if (!video.pluginData['shigRemote']) {
        return false
    }
    return true
}

export type {
    ShigVideo,
    ShigPluginData,
    ShigVideoObject,
}

export {
    videoHasShig,
    videoHasRemoteShig
}
