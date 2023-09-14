import {ShigPluginData} from 'shared/lib/video';

function sanitizePeertubeShigPluginData(content: any, referenceUrl: string): ShigPluginData {
    const shigDeactivated: ShigPluginData = {
        url: referenceUrl,
        shigActive: false
    }

    if (content === undefined) {
        return shigDeactivated
    }

    if (typeof content !== 'object') {
        return shigDeactivated
    }

    if (!content?.url || content.url !== referenceUrl) {
        return shigDeactivated
    }

    if (!!content?.shigRemote && (typeof content.shigRemote) !== 'boolean') {
        return shigDeactivated
    }
    if (!!content?.firstGuest && (typeof content.firstGuest) !== 'string') {
        return shigDeactivated
    }
    if (!!content?.secondGuest && (typeof content.secondGuest) !== 'string') {
        return shigDeactivated
    }
    if (!!content?.thirdGuest && (typeof content.thirdGuest) !== 'string') {
        return shigDeactivated
    }
    if (!!content?.customMessage && (typeof content.customMessage) !== 'string') {
        return shigDeactivated
    }
    return content as ShigPluginData
}


export {
    sanitizePeertubeShigPluginData
}
