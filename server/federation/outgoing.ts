import type {RegisterServerOptions, VideoObject} from '@peertube/peertube-types'
import {
    getShigSettings, SharedVideo, ShigPluginData,
    ShigVideoObject,
    videoHasShig,
} from '../../shared/lib/video';
import {VideoHandler} from '../handler/video-handler';
import {VideoBuildResultContext} from './types';

/**
 * This function adds Shig information on video ActivityPub data if relevant.
 */
async function videoBuildJSONLD(options: RegisterServerOptions, videoHandler: VideoHandler, videoObject: VideoObject | ShigVideoObject, context: VideoBuildResultContext
): Promise<VideoObject | ShigVideoObject> {
    const logger = options.peertubeHelpers.logger
    const video = context.video
    if (video.remote) {
        return videoObject
    } // should not happen, but... just in case...

    const settings = await getShigSettings(options.settingsManager)

    if (settings['shig-federation-no-remote']) {
        Object.assign(videoObject, {
            peertubeShig: false
        })
        return videoObject
    }

    await videoHandler.fillVideoShigFields(video)
    const hasChat = videoHasShig(settings, video as SharedVideo)

    if (!hasChat) {
        logger.debug(`Video uuid=${video.uuid} has not livechat, adding peertubeShig=false.`)
        Object.assign(videoObject, {
            peertubeShig: false
        })
        return videoObject
    }

    logger.debug(`Adding Shig data on video uuid=${video.uuid}...`)
    Object.assign(videoObject, {
        peertubeShig: ('pluginData' in video) ? video['pluginData'] : {
            url: video.url,
            shigActive: false
        } as ShigPluginData
    })
    return videoObject
}

export {
    videoBuildJSONLD,
}
