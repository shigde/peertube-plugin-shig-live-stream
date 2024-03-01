import {PluginStorageManager, Video} from '@peertube/peertube-types';
import {Logger} from 'winston';
import {FileStorageManager} from '../storage/file-storage-manager';
import {ShigPluginData} from '../../shared/lib/video';

export class VideoHandler {
    constructor(
        private pluginStorageManager: PluginStorageManager,
        private fileStorageManager: FileStorageManager,
        private logger: Logger
    ) {
    }

    public async saveShigData(params: any, settings: any): Promise<ShigPluginData | void> {
        this.logger.debug('Saving a video, checking for custom fields')
        const body: any = params.body
        const video: Video | undefined = params.video
        if (!video || !video.id || !video.url) {
            return
        }

        if (!body.pluginData || !settings) return

        const shigActive = body.pluginData['shigActive']

        const shigUrl= settings['shig-server-url']
        // NB: on Peertube 3.2.1, value is "true", "false", or "null", as strings.

        if (shigActive === true || shigActive === 'true') {

            const shigPluginData = {
                url: video.url,
                shigActive: shigActive,
                shigInstanceUrl: shigUrl,
                firstGuest: body.pluginData['firstGuest'],
                secondGuest: body.pluginData['secondGuest'],
                thirdGuest: body.pluginData['thirdGuest'],
                customMessage: body.pluginData['customMessage'],
            } as ShigPluginData

            this.logger.info(`Saving shig-active=true for video ${video.id.toString()}`)
            await this.pluginStorageManager.storeData(`shigActive-${video.id.toString()}`, true)
            await this.fileStorageManager.storePluginData(video, shigPluginData)
            return shigPluginData

        } else if (shigActive === false || shigActive === 'false' || shigActive === 'null') {
            this.logger.info(`Saving shig-active=false for video ${video.id.toString()}`)
            await this.pluginStorageManager.storeData(`shigActive-${video.id.toString()}`, false)
            await this.fileStorageManager.removePluginData(video)
        } else {
            this.logger.error('Unknown value ' + JSON.stringify(shigActive) + ' for shig-active field.')
        }
    }

    public async fillVideoShigFields(video: any): Promise<any> {
        if (!video) return video

        if (!video.id || !video.uuid || !video.url) return
        if (!('pluginData' in video)) {
            video['pluginData'] = {url: video.url} as ShigPluginData
        }

        if (video.isLive) {
            const result: any = await this.pluginStorageManager.getData(`shigActive-${video.id.toString()}`)
            this.logger.debug(`Video ${video.id.toString()} has shig-active=` + JSON.stringify(result))
            // NB: I got weird stuff here. Maybe Peertube 3.2.1 bug?
            if (result === true || result === 'true') {
                video.pluginData = await this.fileStorageManager.getPluginData(video)
                video.pluginData['shigActive'] = true
            } else if (result === false || result === 'false' || result === 'null') {
                video.pluginData = await this.fileStorageManager.removePluginData(video)
                video.pluginData['shigActive'] = false
            }
        }
    }

    public getFileStorage(): FileStorageManager {
        return this.fileStorageManager
    }
}
