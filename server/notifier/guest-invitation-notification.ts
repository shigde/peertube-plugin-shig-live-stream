import {UserNotificationModelForApi} from '@peertube/peertube-types/server/types/models';
import {UserNotification, UserNotificationType} from '@peertube/peertube-types';

function createNotification(user: number, video: any): UserNotificationModelForApi {
    const notification = {
        type: UserNotificationType.MY_VIDEO_PUBLISHED,
        userId: user,
        videoId: video.id,
        Video: video,
        toFormattedJSON: () => {
            return {
                id: notification.id,
                type: notification.type,
                video: {
                    id: video.id,
                    uuid: video.uuid,
                    shortUUID: video.shortUUID,
                    name: video.name,
                    channel: {
                        id: video.channel.id,
                        displayName: video.channel.displayName,
                        name: video.channel.name,
                        host: video.channel.host,
                        // avatars: AvatarInfo[];
                        // avatar: AvatarInfo;
                    }

                },

                //userId: notification.userId,
                // video: notification.videoId,
                // Video: notification.Video,
                // createdAt: notification.createdAt?.toString(),
                // updatedAt: notification.updatedAt?.toString(),
            } as UserNotification
        }
    } as UserNotificationModelForApi

    return notification
}

export {
    createNotification
}
