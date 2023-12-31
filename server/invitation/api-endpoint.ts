import {RegisterServerOptions} from '@peertube/peertube-types';
import {SQLiteStorageManager} from '../storage/sqlite-storage-manager';

async function registerAPIEndpoints (options: RegisterServerOptions, storage: SQLiteStorageManager) {
    const router = options.getRouter();
    router.get("/invitations", async (req, res) => {
        try {
            // Get current user
            const user = await options.peertubeHelpers.user.getAuthUser(res);
            if (!user) {
                res.status(401)
                res.json({
                    status: "Unauthorized"
                });
                return;
            }

            options.peertubeHelpers.logger.debug(`Fetch invitations for user: ${user.id}`)
            const invitationList = await storage.getInvitationsFromUser(user.id)

            res.status(200)
            res.json({
                status: "Ok",
                data: invitationList
            });
        } catch (e) {
            res.status(500)
            res.json({
                status: "Internal Server Error",
                data: []
            });
        }
    })
}

export {
    registerAPIEndpoints
}
