import {WebSocket} from 'ws';
import {clearInterval} from 'timers';
import {v4 as uuidv4} from 'uuid';

import {InvitationModel} from './invitation-model';

export class InvitationNotifier {
    private readonly PING_INTERVAL = 5000
    private readonly timer: NodeJS.Timeout

    private clients: Map<string, WsClient> = new Map<string, WsClient>()

    constructor() {
        this.timer = this.startInterval()
    }

    async sendInvitation(userId: number, invitation: InvitationModel) {
        const data = JSON.stringify(invitation)
        this.clients.forEach((client) => {
            if (client.user == userId) {
                client.ws.send(data)
            }
        })
    }

    public addUserWebSocket(userId: number, ws: WebSocket): void {
        const client = new WsClient(userId, ws)
        this.clients.set(client.id, client)
        client.ws.on('close', () => this.clients.delete(client.id))
    }

    private startInterval(): NodeJS.Timeout {
        return setInterval(() => {
            this.clients.forEach((client) => {
                if (!client.isAlive) {
                    client.ws.terminate();
                    this.clients.delete(client.id)
                    return;
                }
                client.isAlive = false;
                client.ws.ping();
            })
        }, this.PING_INTERVAL);
    }

    public stopInterval() {
        clearInterval(this.timer)
    }
}

class WsClient {
    public readonly id = uuidv4()
    public isAlive: boolean = true

    constructor(public readonly user: number, public readonly ws: WebSocket) {
        ws.on('pong', () => {
            this.isAlive = true;
        });
    }

}

