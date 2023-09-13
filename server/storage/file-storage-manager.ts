import {ShigPluginData} from '../types';

export class FileStorageManager {
    public removePluginData(videoUUID: string): Promise<any> {
        return Promise.resolve();
    }

    public storePluginData(videoUUID: string, data: ShigPluginData): Promise<any> {
        return Promise.resolve();
    }

    async getPluginData(videoUUID: string): Promise<ShigPluginData> {
        return {} as ShigPluginData;
    }
}
