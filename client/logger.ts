const logger = {
    log: (s: string) => console.log('[peertube-plugin-shig-live-stream] ' + s),
    info: (s: string) => console.info('[peertube-plugin-shig-live-stream] ' + s),
    error: (s: string) => console.error('[peertube-plugin-shig-live-stream] ' + s),
    warn: (s: string) => console.warn('[peertube-plugin-shig-live-stream] ' + s)
}

export {
    logger
}
