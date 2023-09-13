import {VideoObject} from '@peertube/peertube-types';
import {ActivityPubAttributedTo} from '@peertube/peertube-types/shared/models/activitypub/objects/common-objects';


interface ShigVideoObject extends VideoObject {
    guests: ActivityPubAttributedTo[]
}

interface ShigCustomFieldsVideo {
    id?: number | string
    uuid?: string
    isLive: boolean
    pluginData?: ShigPluginData
}

interface ShigPluginData {
    shigActive?: boolean
    shigRemote?: boolean

    firstGuest?: string
    secondGuest?: string
    thirdGuest?: string
}

export {
    ShigVideoObject,
    ShigPluginData,
    ShigCustomFieldsVideo
}
