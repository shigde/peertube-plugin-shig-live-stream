import {InvitationNotifier} from './invitation-notifier';
import {SQLiteStorageManager} from '../storage/sqlite-storage-manager';
import {PeerTubeHelpers, Video} from '@peertube/peertube-types';
import {ShigPluginData} from '../../shared/lib/video';
import {PostgreSqlStorageManager} from '../storage/postgresql-storage-manager';
import {InvitationModel} from './invitation-model';

export class InvitationService {
    private readonly domain: string

    constructor(
        private readonly helper: PeerTubeHelpers,
        private readonly postgre: PostgreSqlStorageManager,
        private readonly notifier: InvitationNotifier,
        private readonly storage: SQLiteStorageManager
    ) {
        this.domain = this.getDomain()
    }

    public async inviteUserAsGuest(data: ShigPluginData, video: Video | any) {
        if (data.firstGuest) {
            await this.handleGuestInvitation(data.firstGuest, video)
        }
        if (data.secondGuest) {
            await this.handleGuestInvitation(data.secondGuest, video)
        }
        if (data.thirdGuest) {
            await this.handleGuestInvitation(data.thirdGuest, video)
        }
    }

    private async handleGuestInvitation(user: string, video: Video) {
        const looger = this.helper.logger
        const splitted = user.split('@', 2);
        // check valid username
        if (splitted.length !== 2) {
            looger.debug('Can not invite as Guest because not valid username')
            return;
        }
        // check remote user
        if (splitted[1] !== this.domain) {
            looger.debug('Can not invite as Guest because not valid domain')
            return;
        }
        // find user in db
        const userId = await this.postgre.getUserIdByUserName(splitted[0])
        if (userId == -1) {
            looger.debug('Can not invite as Guest because not valid user id')
            return;
        }

        // find account for user. The account is needed to fetch the actor
        const account = await this.postgre.getAccountByUserId(userId)
        if (account === null) {
            looger.debug('Can not invite as Guest because has no account')
            return;
        }

        // check user already has an invitation
        const haInvitation = await this.storage.hasUserAnInvitationForVideo(userId, video.id)
        if (haInvitation) {
            looger.debug('Can not invite as Guest because is already invited')
            return;
        }
        const invitation = this.buildInvitation(userId, account.id, video)
        await this.storage.saveInvitation(invitation)
        await this.notifier.sendInvitation(userId, invitation)
    }

    private getDomain(): string {
        const url = this.helper.config.getWebserverUrl();
        const domainUrl = url.startsWith('https://') ? url.substring(8) : url.substring(7)
        const domainEnd = domainUrl.indexOf('/')
        return (domainEnd === -1) ? domainUrl : domainUrl.substring(0, domainEnd)
    }

    private buildInvitation(userId: number, accountId: number, video: Video): InvitationModel {
        return {
            type: 1,
            isRead: false,
            userId: userId,
            accountId: accountId,
            videoId: video.id,
            videoUrl: this.replaceVideoUrlWithWebserverUrl(video.url),
            videoName: video.name,
            createdAt: new Date(),
        } as InvitationModel
    }

    private replaceVideoUrlWithWebserverUrl(videoUrl: string): string {
        let serverVideoUrl = this.helper.config.getWebserverUrl()
        const words = videoUrl.split('/');

        for (let i = 3; i < words.length; i++) {
            serverVideoUrl += '/' + words[i];
        }
        return serverVideoUrl
    }
}
