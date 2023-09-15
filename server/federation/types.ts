import {MVideoAP, MVideoFullLight, VideoObject} from '@peertube/peertube-types';
import {ShigVideoObject} from '../../shared/lib/video';

interface RemoteVideoHandlerParams {
    video: MVideoFullLight
    videoAPObject: VideoObject | ShigVideoObject
}

interface VideoBuildResultContext {
    video: MVideoAP
}

export type {
    VideoBuildResultContext,
    RemoteVideoHandlerParams
}
