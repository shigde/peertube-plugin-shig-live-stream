import {RegisterServerOptions} from '@peertube/peertube-types';

async function registerAPIEndpoints (options: RegisterServerOptions) {
    const router = options.getRouter();
    router.get("/invitations", async (req, res) => {
        try {
            // Get current user
            const user = await options.peertubeHelpers.user.getAuthUser(res);
                if (!user) {
                    res.json({
                        status: "401",
                        message: "Forbidden"
                    });
                    return;
                }
            //
            //     const {
            //         from,
            //         to,
            //         groupBy
            //     } = req.query;
            //     const fromDate = moment(from);
            //     const toDate = moment(to);
            //     const startOfMonth = moment().startOf('month');
            //
        } catch (e) {
        }
    })
}

export {
    registerAPIEndpoints
}
