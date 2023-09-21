export class Notifier {

    // private readonly route = '/notification';
    // private ws: WebSocketServer | undefined;

    constructor(
        // private options: RegisterServerOptions,
        // private storage: SQLiteStorageManager,
    ) {}

    async init() {
        // const wss = new WebSocketServer({ noServer: true })
        //
        // const logger = this.options.peertubeHelpers.logger
        // wss.on('connection', function connection(ws) {
        //     logger.info('WebSocket connected!')
        //
        //     setInterval(() => {
        //         ws.send('WebSocket message sent by server');
        //     }, 1000)
        // })
        // logger.debug(' Register FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')
        //
        // this.options.registerWebSocketRoute({
        //     route: '/notification',
        //     handler: (request, socket, head) => {
        //         logger.debug('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF')
        //         wss.handleUpgrade(request, socket, head, ws => {
        //             wss.emit('connection', ws, request)
        //         })
        //     }
        // })



        // await this.connect()
        // if (this.options.registerWebSocketRoute) {
        //     this.options.registerWebSocketRoute({
        //         route: this.route,
        //         handler: (request, socket, head) => {
        //             this.ws?.handleUpgrade(request, socket, head, ws => {
        //                 this.options.peertubeHelpers.logger.debug("#################### hallo");
        //                 this.ws?.emit('connection', ws, request)
        //             })
        //         }
        //     })
        // }
    }

    // private connect(): Promise<void> {
    //     const ws = new WebSocketServer({noServer: true})
    //     this.ws = ws
    //     return new Promise((resolve) => {
    //         ws.on('connection', () => {
    //             this.options.peertubeHelpers.logger.info('########################  Websocket connected!')
    //         });
    //         resolve();
    //     });
    // }

    async sendNotification(userId: number, notification: any) {
        // await this.storage.saveNotification(notification);
        // // await this.ws?.emit().send()
    }
}

