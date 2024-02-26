import fetch from 'node-fetch';
import http from 'http';
import * as https from 'https';
import {signRequest} from 'http-signature/lib/signer';
import {buildDigest} from '../crypto/peertube-crypto';
import {Logger} from 'winston';

export async function registerShigInstance(shigUrl: string, instanceActorUrl: string, token: string) {
    const payload = {
        'accountUrl': instanceActorUrl,
        'registerToken': token
    }
    const response = await fetch(`${shigUrl}/federation/register`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type': 'application/json'}
    });
    await response.json();
}

const tokenMap = new Map<string, string>()

export async function getToken(shigUrl: string, user: string, token: string) {
    if (tokenMap.has(user)) {
        return `Bearer ${tokenMap.get(user)}`
    }

    const payload = {
        'user': user,
        'token': token,
        'client': 'client-id'
    }
    const response = await fetch(`${shigUrl}/authenticate`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {'Content-Type': 'application/json'}
    });

    if (response.status == 200) {
        const toke = await (response.json()) as token;
        tokenMap.set(user, toke.jwt);
        return `Bearer ${toke.jwt}`
    }
    return
}

interface token {
    jwt: string
}

export async function announceVideoToShigInstance(shigUrl: string, payload: any, signOpt: {
    key: string,
    keyId: string,
}, logger: Logger) {
    const url = new URL(shigUrl);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/activity+json',
            'Accept': 'application/activity+json, application/ld+json',
            'digest': buildDigest(payload),
        }
    };

    return new Promise((resolve, reject) => {
        let req: http.ClientRequest;
        const callBack = (res: http.IncomingMessage) => {
            if (!!res.statusCode && res.statusCode >= 400) {
                reject()
            }
            resolve(null);
        }

        if (url.protocol === 'https') {
            req = https.request(shigUrl + '/federation/inbox', options, callBack);
        } else {
            req = http.request(shigUrl + '/federation/inbox', options, callBack);
        }

        signRequest(req, {
            ...signOpt,
            headers: ['(request-target)', 'host', 'date', 'digest']
        });

        const signature = req.getHeader('Authorization') as string
        req.appendHeader('Signature', signature.slice('Signature '.length))
        req.removeHeader('Authorization')
        req.write(JSON.stringify(payload));

        req.end();
    });
}
