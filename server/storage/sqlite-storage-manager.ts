import {Logger} from 'winston';
import sqlite3, {Database} from 'sqlite3';

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
        if(db !== null) {
            db.serialize(() => {
                db.run("DROP TABLE IF EXISTS notifications");
                db.run("CREATE TABLE notifications(" +
                    "[id] INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL," +
                    "[type] INTEGER NOT NULL," +
                    "[isRead] NUMERIC NOT NULL," +
                    "[userId] INTEGER NOT NULL," +
                    "[accountId] INTEGER NOT NULL," +
                    "[videoId] INTEGER NOT NULL," +
                    "[videoUrl] TEXT NOT NULL," +
                    "[createdAt] TIMESTAMP WITH TIME ZONE NOT NULL," +
                    "[updatedAt] TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL," +
                    "[CONSTRAINT] Notification_ck_read CHECK (isRead IN (0, 1))" +
                    ")"
                );
            });
        }
    }

    connect(): Promise<Database | null> {
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
}
