import type {RegisterServerOptions, VideoObject} from '@peertube/peertube-types'
import type {RemoteVideoHandlerParams, VideoBuildResultContext} from './types'
import {videoBuildJSONLD} from './outgoing'
import {readIncomingAPVideo} from './incoming'
import {VideoHandler} from '../handler/video-handler';
import {ActivityPubHandler} from '../handler/activitypub-handler';
import {InvitationService} from '../invitation/invitation-service';

export async function initFederation(options: RegisterServerOptions, videoHandler: VideoHandler, apHandler: ActivityPubHandler, invitationService: InvitationService): Promise<void> {
    const logger = options.peertubeHelpers.logger
    const registerHook = options.registerHook
    logger.info('Registring federation hooks...')

    registerHook({
        target: 'filter:activity-pub.video.json-ld.build.result',
        handler: async (jsonld: VideoObject, context: VideoBuildResultContext) => {
            return videoBuildJSONLD(options, videoHandler, jsonld, context)
        }
    })

    // TODO: we should also register the context.build hook.
    // registerHook({
    //   target: 'filter:activity-pub.activity.context.build.result',
    //   handler: (jsonld: any) => {
    //     return videoContectBuildJSONLD(options, jsonld)
    //   }
    // })

    registerHook({
        target: 'action:activity-pub.remote-video.created',
        handler: async (params: RemoteVideoHandlerParams) => {
            return readIncomingAPVideo(videoHandler, apHandler, invitationService, logger, params, 'announce')
        }
    })
    registerHook({
        target: 'action:activity-pub.remote-video.updated',
        handler: async (params: RemoteVideoHandlerParams) => {
            logger.info('######## ... update -- ##')
            return readIncomingAPVideo(videoHandler, apHandler, invitationService, logger, params, 'update')
        }
    })

    registerHook({
        target: 'action:api.video.deleted',
        handler:  (aa : any) => {
            logger.info('######## ... delete -- ##', aa)
        }
    })
}
