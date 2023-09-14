
import {Logger} from 'winston';
import {MVideoAP, MVideoFullLight, MVideoThumbnail, Video} from '@peertube/peertube-types';
import {URL} from 'url';
import path from 'path';
import fs from 'fs';
import {sanitizePeertubeShigPluginData} from '../federation/sanitize';
import {ShigPluginData} from 'shared/lib/video';

const cache: Map<string, ShigPluginData | undefined> = new Map<string, ShigPluginData | undefined>()

type VideoObjectType = MVideoFullLight | MVideoAP | Video | MVideoThumbnail

export class FileStorageManager {
    constructor(
        private serverInfosDir: string,
        private logger: Logger
    ) {
    }

    public async removePluginData(video: VideoObjectType): Promise<any> {
        const remote = this.isRemote(video)
        this.logger.debug(`${remote ? 'Remote' : 'Local'} video ${video.uuid} has no shig infos, removing if necessary`)
        const filePath = await this.getFilePath(remote, video.uuid, video.url)

        if (!!filePath) {
            await this.del(filePath)
        }
        // Delete the cache again, just in case.
        cache.delete(video.url)
        return
    }

    public async storePluginData(video: VideoObjectType, shigPluginData: ShigPluginData): Promise<void> {
        if (cache.has(video.url)) {
            cache.delete(video.url);
        }

        const remote = this.isRemote(video)
        const filePath = await this.getFilePath(remote, video.uuid, video.url)

        if (!filePath) {
            this.logger.error('Cant compute the file path for storing shig data for video ' + video.uuid)
            return
        }

        this.logger.debug(`Video ${video.uuid} data should be stored in ${filePath}`)

        if (!shigPluginData) {
            this.logger.debug(`${remote ? 'Remote' : 'Local'} video ${video.uuid} has no shig infos, removing if necessary`)
            await this.del(filePath)
            // Delete the cache again, just in case.
            cache.delete(video.url)
            return
        }

        this.logger.debug(`${remote ? 'Remote' : 'Local'} video ${video.uuid} has shig data to store`)
        await this.store(filePath, shigPluginData)
        // Delete the cache again... in case a read failed because we were writing at the same time.
        cache.delete(video.url);
        return Promise.resolve();
    }

    public async getPluginData(video: VideoObjectType): Promise<ShigPluginData | undefined> {
        const cached = cache.get(video.url)
        if (cached !== undefined) {
            return cached;
        }

        const remote = this.isRemote(video);
        const filePath = await this.getFilePath(remote, video.uuid, video.url);
        if (!filePath) {
            this.logger.error('Cant compute the file path for storing shig infos for video ' + video.uuid)
            cache.set(video.url, undefined)
            return
        }

        const content = await this.get(filePath)
        if (content === null) {
            cache.set(video.url, undefined)
            return
        }
        // We must sanitize here, in case a previous plugin version did not sanitize enougth.
        const r = sanitizePeertubeShigPluginData(content, video.url)
        cache.set(video.url, r)
        return r
    }

    private async getFilePath(remote: boolean, uuid: string, videoUrl: string): Promise<string | null> {
        try {
            // some sanitization, just in case...
            if (!/^(\w|-)+$/.test(uuid)) {
                this.logger.error(`Video uuid seems not correct: ${uuid}`)
                return null
            }

            let subFolders: string[]
            if (remote) {
                const u = new URL(videoUrl)
                const host = u.hostname

                if (host.includes('..')) {
                    // to prevent exploits that could go outside the plugin data dir.
                    this.logger.error(`Video host seems not correct, contains ..: ${host}`)
                    return null
                }
                subFolders = ['remote', host]
            } else {
                subFolders = ['local']
            }

            return path.resolve(this.serverInfosDir, 'videoInfos', ...subFolders, uuid + '.json')
        } catch (err) {
            this.logger.error(err)
            return null
        }
    }

    private async store(filePath: string, content: ShigPluginData): Promise<void> {
        try {
            const jsonContent = JSON.stringify(content)
            if (!fs.existsSync(filePath)) {
                const dir = path.dirname(filePath)
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, {recursive: true})
                }
            } else {
                // only write if the content is different
                try {
                    const currentJSONContent = await fs.promises.readFile(filePath, {
                        encoding: 'utf-8'
                    })
                    if (currentJSONContent === jsonContent) {
                        return
                    }
                } catch (_err) {
                }
            }
            await fs.promises.writeFile(filePath, jsonContent, {
                encoding: 'utf-8'
            })
        } catch (err) {
            this.logger.error(err)
        }
    }

    private async del(filePath: string): Promise<void> {
        try {
            if (!fs.existsSync(filePath)) {
                return
            }
            this.logger.info('Deleting file ' + filePath)
            fs.rmSync(filePath)
        } catch (err) {
            this.logger.error(err)
        }
    }

    private async get(filePath: string): Promise<ShigPluginData | null> {
        try {
            if (!fs.existsSync(filePath)) {
                return null
            }
            const content = await fs.promises.readFile(filePath, {
                encoding: 'utf-8'
            })
            return JSON.parse(content)
        } catch (err) {
            this.logger.error(err)
            return null
        }
    }

    private isRemote(video: VideoObjectType): boolean {
        return ('remote' in video) ? video.remote : !video.isLocal
    }
}
