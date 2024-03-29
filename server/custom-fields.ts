import type {RegisterServerOptions, Video} from '@peertube/peertube-types'
import {VideoHandler} from './handler/video-handler';
import {InvitationService} from './invitation/invitation-service';
import {getShigSettings} from '../shared/lib/video';

async function initCustomFields(
    options: RegisterServerOptions,
    videoHandler: VideoHandler,
    invitationService: InvitationService
): Promise<void> {
    const registerHook = options.registerHook
    const logger = options.peertubeHelpers.logger

    registerHook({
        target: 'action:api.video.updated',
        handler: async (params: any): Promise<void> => {
            const settings = await getShigSettings(options.settingsManager)
            const data = await videoHandler.saveShigData(params, settings)

            const video: Video | undefined = params.video
            if (!video || !video.id || !video.url) {
                return
            }

            if(data) {
                await invitationService.inviteUserAsGuest(data, video)
            }
        }
    })

    registerHook({
        target: 'filter:api.video.get.result',
        handler: async (video: Video): Promise<Video> => {
            logger.debug('Getting a video, searching for custom fields and data')
            await videoHandler.fillVideoShigFields(video)
            if (!video.isLocal) {
                // await fillVideoRemoteShig(options, video)
            }
            return video
        }
    })
}

// async function fillVideoCustomFields(options: RegisterServerOptions, video: ShigCustomFieldsVideo): Promise<void> {
//     if (!video) return video
//
//     if (!video.pluginData) video.pluginData = {}
//     if (!video.id) return
//     const storageManager = options.storageManager
//     const logger = options.peertubeHelpers.logger
//
//     if (video.isLive) {
//         const result: any = await storageManager.getData(`shig-active-${video.id as string}`)
//         logger.debug(`Video ${video.id as string} has shig-active=` + JSON.stringify(result))
//         // NB: I got weird stuff here. Maybe Peertube 3.2.1 bug?
//         if (result === true || result === 'true') {
//             video.pluginData['shig-active'] = true
//         } else if (result === false || result === 'false' || result === 'null') {
//             video.pluginData['shig-active'] = false
//         }
//     }
// }
//
// async function fillVideoRemoteShig(
//     options: RegisterServerOptions,
//     video: Video | MVideoThumbnail
// ): Promise<void> {
//     if (('remote' in video) && !video.remote) {
//         return
//     }
//     if (('isLocal' in video) && video.isLocal) {
//         return
//     }
//     return
// }

export {
    initCustomFields
}
