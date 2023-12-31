import {Logger} from 'winston';
import sqlite3, {Database} from 'sqlite3';
import {InvitationModel} from '../invitation/invitation-model';

export class SQLiteStorageManager {

    private readonly FILE = 'shig.db'

    constructor(
        private serverInfosDir: string,
        private logger: Logger,
    ) {
        this.logger.info(`Build SQLite database ${serverInfosDir}/${this.FILE}`)
    }

    async migrate() {
        const db = await this.connect();
        if (db !== null) {
            db.serialize(() => {
                db.run('DROP TABLE IF EXISTS invitations');
                db.run('CREATE TABLE IF NOT EXISTS invitations(' +
                    '[id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,' +
                    '[type] INTEGER NOT NULL,' +
                    '[isRead] NUMERIC NOT NULL,' +
                    '[userId] INTEGER NOT NULL,' +
                    '[accountId] INTEGER NOT NULL,' +
                    '[videoId] INTEGER NOT NULL,' +
                    '[videoUrl] TEXT NOT NULL,' +
                    '[videoName] TEXT NOT NULL,' +
                    '[createdAt] TIMESTAMP WITH TIME ZONE NOT NULL,' +
                    '[updatedAt] TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,' +
                    '[CONSTRAINT] Invitation_ck_read CHECK (isRead IN (0, 1))' +
                    ')'
                );
            });
        }
        db?.close();
    }

    private connect(): Promise<Database | null> {
        return new Promise<Database | null>((resolve) => {
            const db = new sqlite3.Database(`${this.serverInfosDir}/${this.FILE}`, (err) => {
                if (err) {
                    this.logger.error(`connecting to SQLite database ${this.serverInfosDir}/${this.FILE}: ${err}`)
                    resolve(null)
                    return
                }
                this.logger.debug(`connected to SQLite database ${this.serverInfosDir}/${this.FILE}`)
                resolve(db)
            })
        })
    }

    public async saveInvitation(invitation: InvitationModel): Promise<void> {
        const db = await this.connect()
        return new Promise((resolve) => {
            db?.run('INSERT INTO invitations(type, isRead, userId, accountId, videoId, videoUrl, videoName, createdAt) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
                [
                    invitation.type,
                    invitation.isRead,
                    invitation.userId,
                    invitation.accountId,
                    invitation.videoId,
                    invitation.videoUrl,
                    invitation.videoName,
                    invitation.createdAt
                ], (err: any, row: any) =>  {
                    if (err) {
                        this.logger.error(err.message);
                    }
                    this.logger.debug('Row was added to the table: ${this.lastID}');
                    resolve(null);
                })
        }).then(() => {
            db?.close()
        })
    }

    public async getInvitationsFromUser(userId: number) {
        const invitations: InvitationModel[] = []
        const db = await this.connect()
        return new Promise<any[]>((resolve) => {
            try {
                db?.all('SELECT * FROM invitations WHERE userId = ?', [userId],
                    (err: any, rows: any) => {
                        if (err) {
                            this.logger.error(err)
                            throw err
                        }
                        if (rows) {
                            rows.forEach((row: any) => {
                                invitations.push({
                                    id: row.id,
                                    type: row.type,
                                    isRead: row.isRead,
                                    userId: row.userId,
                                    accountId: row.accountId,
                                    videoId: row.videoId,
                                    videoUrl: row.videoUrl,
                                    videoName: row.videoName,
                                    createdAt: row.createdAt,
                                    updatedAt: row.updatedAt
                                } as InvitationModel)
                            });
                        }
                        resolve(invitations)
                    }
                );
            } catch (e) {
                this.logger.error(e)

                resolve([])
            }
        }).then((data) => {
            db?.close()
            return data;
        })
    }

    public async hasUserAnInvitationForVideo(userId: number, videoId: number) {
        const db = await this.connect()
        return new Promise<boolean>((resolve) => {
            try {
                db?.all('SELECT * FROM invitations WHERE userId = ? AND videoId = ?', [userId, videoId], (err: any, rows: any[]) => {
                    if (err) {
                        throw err
                    }
                    this.logger.debug(rows)
                    if (rows && rows.length > 0) {
                        resolve(true)
                    } else {
                        resolve(false)
                    }
                })
            } catch (e) {
                this.logger.error(e)
                resolve(false)
            }
        }).then((data) => {
            db?.close()
            return data;
        })

    }
}
