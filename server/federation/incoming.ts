import {VideoHandler} from '../handler/video-handler';
import {sanitizePeertubeShigPluginData} from './sanitize';
import {RemoteVideoHandlerParams} from './types';

/**
 * This function reads incoming ActivityPub data, to detect Shig informations.
 */
async function readIncomingAPVideo(videoHandler: VideoHandler, {
    video,
    videoAPObject
}: RemoteVideoHandlerParams): Promise<void> {
    let peertubeShig = ('peertubeShig' in videoAPObject) ? videoAPObject.peertubeShig : false

    // We must sanitize peertubeShig, as it comes for the outer world.
    if (peertubeShig !== false) {
        peertubeShig = sanitizePeertubeShigPluginData(peertubeShig, video.url)
        await videoHandler.getFileSoraage().storePluginData(video, peertubeShig)
        if (video.remote) {
            // @TODO save remote shig server data currently we do not have
        }
    }

}

export {
    readIncomingAPVideo
}
