function isEmpty(val: any): boolean {
    return val === null || val === undefined || val === ''
}

function isServerUrl(val: string): boolean {
    if (typeof val !== 'string') {
        return false
    }
    const urlRegexp = new RegExp('^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$')
    return urlRegexp.test(val)
}

function isUser(val: string): boolean {
    if (typeof val !== 'string') {
        return false
    }
    const userRegexp = new RegExp('^[0-9a-zA-Z\\.\\=\\_\\-\\:]{1,}\\@[a-zA-Z0-9.:-_]{1,61}$')
    return userRegexp.test(val)
}

function max(val: string, max: number): boolean {
    if (typeof val !== 'string') {
        return false
    }
    return val.length <= max;
}

function min(val: string, min: number): boolean {
    if (typeof val !== 'string') {
        return false
    }
    return val.length < min;
}

function validateToken({value}: any): Promise<{
    error: boolean;
    text?: string;
}> {
    if (isEmpty(value)) {
        return Promise.resolve({error: false})
    }
    if (!min(value, 16)) {
        return Promise.resolve({
            error: true,
            text: 'Minimum characters has to be: 16'
        })
    }
    return Promise.resolve({error: false})
}

function validateServerUrl({value}: any): Promise<{
    error: boolean;
    text?: string;
}> {
    if (isEmpty(value)) {
        return Promise.resolve({error: false})
    }
    if (!isServerUrl(value)) {
        return Promise.resolve({
            error: true,
            text: 'A server url has to be like: https://domain.org:30000/path'
        })
    }
    return Promise.resolve({error: false})
}

function validateTextField({value}: any): Promise<{
    error: boolean;
    text?: string;
}> {
    if (!max(value, 200)) {
        return Promise.resolve({
            error: true,
            text: 'Maximum characters allowed: 200'
        })
    }
    return Promise.resolve({error: false})
}
function validateUser({value}: any): Promise<{
    error: boolean;
    text?: string;
}> {
    if (isEmpty(value)) {
        return Promise.resolve({error: false})
    }
    if (!isUser(value)) {
        return Promise.resolve({
            error: true,
            text: 'A guest has to be a user identifier like: user-name@domain.org'
        })
    }
    return Promise.resolve({error: false})
}

export {
    isEmpty,
    isServerUrl,
    isUser,
    max,
    min,
    validateServerUrl,
    validateTextField,
    validateToken,
    validateUser
}
