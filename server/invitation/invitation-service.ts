import {InvitationNotifier} from './invitation-notifier';
import {SQLiteStorageManager} from '../storage/sqlite-storage-manager';
import {Video} from '@peertube/peertube-types';
import {ShigPluginData} from '../../shared/lib/video';
import {PostgreSqlStorageManager} from '../storage/postgresql-storage-manager';

export class InvitationService {
    constructor(
        private postgre: PostgreSqlStorageManager,
        private notifier: InvitationNotifier,
        private storage: SQLiteStorageManager
    ) {
    }

    public inviteUserAsGuest(data: ShigPluginData, video: Video) {

    }
}
