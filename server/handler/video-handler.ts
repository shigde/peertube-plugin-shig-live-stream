import {PluginStorageManager, Video} from '@peertube/peertube-types';
import {Logger} from 'winston';
import {FileStorageManager} from '../storage/file-storage-manager';
import {ShigCustomFieldsVideo} from '../types';

export class VideoHandler {
    constructor(
        private pluginStorageManager: PluginStorageManager,
        private fileStorageManager: FileStorageManager,
        private logger: Logger
    ) {
    }

    public async saveShigData(params: any): Promise<void> {
        this.logger.debug('Saving a video, checking for custom fields')
        const body: any = params.body
        const video: Video | undefined = params.video
        if (!video || !video.id) {
            return
        }

        if (!body.pluginData) return

        const shigActive = body.pluginData['shigActive']
        // NB: on Peertube 3.2.1, value is "true", "false", or "null", as strings.


        if (shigActive === true || shigActive === 'true') {
            this.logger.info(`Saving shig-active=true for video ${video.id.toString()}`)
            await this.pluginStorageManager.storeData(`shigActive-${video.id.toString()}`, true)
            await this.fileStorageManager.storePluginData(video.uuid, body.pluginData)

        } else if (shigActive === false || shigActive === 'false' || shigActive === 'null') {
            this.logger.info(`Saving shig-active=false for video ${video.id.toString()}`)
            await this.pluginStorageManager.storeData(`shigActive-${video.id.toString()}`, false)
            await this.fileStorageManager.removePluginData(video.uuid)
        } else {
            this.logger.error('Unknown value ' + JSON.stringify(shigActive) + ' for shig-active field.')
        }
    }


    public async fillVideoShigFields(video: ShigCustomFieldsVideo): Promise<any> {
        if (!video) return video

        if (!video.pluginData) video.pluginData = {}
        if (!video.id || !video.uuid) return

        if (video.isLive) {
            const result: any = await this.pluginStorageManager.getData(`shigActive-${video.id.toString()}`)
            this.logger.debug(`Video ${video.id.toString()} has shig-active=` + JSON.stringify(result))
            // NB: I got weird stuff here. Maybe Peertube 3.2.1 bug?
            if (result === true || result === 'true') {
                video.pluginData = await this.fileStorageManager.getPluginData(video.uuid)
                video.pluginData['shigActive'] = true
            } else if (result === false || result === 'false' || result === 'null') {
                video.pluginData['shigActive'] = false
            }
        }
    }
}
