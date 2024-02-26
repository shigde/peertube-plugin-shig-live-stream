import {VideoHandler} from '../handler/video-handler';
import {sanitizePeertubeShigPluginData} from './sanitize';
import {RemoteVideoHandlerParams} from './types';
import {ActivityPubHandler} from '../handler/activitypub-handler';
import {Logger} from 'winston';

/**
 * This function reads incoming ActivityPub data, to detect Shig informations.
 */
async function readIncomingAPVideo(videoHandler: VideoHandler, apHandler: ActivityPubHandler, logger: Logger, {
    video,
    videoAPObject
}: RemoteVideoHandlerParams): Promise<void> {
    let peertubeShig = ('peertubeShig' in videoAPObject) ? videoAPObject.peertubeShig : false
    if (peertubeShig !== false) {
        // We must sanitize peertubeShig, as it comes for the outer world.
        logger.debug('get remote video that`s has shig plugin active')
        peertubeShig = sanitizePeertubeShigPluginData(peertubeShig, video.url)
        await videoHandler.getFileStorage().storePluginData(video, peertubeShig)
        if (video.remote) {
            logger.debug('send announcement to shig instance')
            await apHandler.sendRemoteAnnounceToShig(videoAPObject)
        }
    }
}

export {
    readIncomingAPVideo
}
