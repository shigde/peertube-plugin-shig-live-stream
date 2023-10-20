import fetch from 'node-fetch';

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
