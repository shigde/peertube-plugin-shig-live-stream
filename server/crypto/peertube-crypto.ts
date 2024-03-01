import {BinaryToTextEncoding, createHash, createSign} from 'crypto';
import {cloneDeep} from 'sequelize/lib/utils';

export async function signJsonLDObject <T> (byActor: { url: string, privateKey: string }, data: T) {
    const signature = {
        type: 'RsaSignature2017',
        creator: byActor.url,
        created: new Date().toISOString()
    }

    const [ documentHash, optionsHash ] = await Promise.all([
        createDocWithoutSignatureHash(data),
        createSignatureHash(signature)
    ])

    const toSign = optionsHash + documentHash

    const sign = createSign('RSA-SHA256')
    sign.update(toSign, 'utf8')

    const signatureValue = sign.sign(byActor.privateKey, 'base64')
    Object.assign(signature, { signatureValue })

    // @ts-ignore
    return Object.assign(data, { signature })
}

function createDocWithoutSignatureHash (doc: any) {
    const docWithoutSignature = cloneDeep(doc)
    delete docWithoutSignature.signature

    return hashObject(docWithoutSignature)
}

async function hashObject (obj: any): Promise<any> {
    const { jsonld } = await import('./custom-jsonld-signature.js')

    const res = await (jsonld as any).promises.normalize(obj, {
        safe: false,
        algorithm: 'URDNA2015',
        format: 'application/n-quads'
    })

    return sha256(res)
}


function createSignatureHash (signature: any) {
    const signatureCopy = cloneDeep(signature)
    Object.assign(signatureCopy, {
        '@context': [
            'https://w3id.org/security/v1',
            { RsaSignature2017: 'https://w3id.org/security#RsaSignature2017' }
        ]
    })

    delete signatureCopy.type
    delete signatureCopy.id
    delete signatureCopy.signatureValue

    return hashObject(signatureCopy)
}

function sha256 (str: string | Buffer, encoding: BinaryToTextEncoding = 'hex') {
    return createHash('sha256').update(str).digest(encoding)
}


export function buildDigest (body: any) {
    const rawBody = typeof body === 'string' ? body : JSON.stringify(body)

    return 'SHA-256=' + sha256(rawBody, 'base64')
}
