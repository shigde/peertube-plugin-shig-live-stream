import {RegisterServerOptions} from '@peertube/peertube-types';
import proxy from 'express-http-proxy';
// @TODO fix this with real authorisation
const bearer = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNTE2MjM5MDIyLCJ1dWlkIjoiOWJlZGMwZDktZWM2MS00ZmY0LWI4MWEtOGZkZGU0NWY3MzI3In0.831begOFS84xV-7BpXYlVgg3A2hMf4xbPWoXRs4m0qg'

async function initProxy(options: RegisterServerOptions): Promise<void> {
    const router = options.getRouter()

    router.all('/space*',  proxy('http://localhost:8080', {
        proxyReqOptDecorator:  (proxyReqOpts, srcReq) => {
            proxyReqOpts.headers = {"Authorization": bearer};
            return proxyReqOpts;
        }
    }));
}

export {
    initProxy
}
