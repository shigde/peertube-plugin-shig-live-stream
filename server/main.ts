import type { RegisterServerOptions } from '@peertube/peertube-types'

async function register ({ peertubeHelpers }: RegisterServerOptions): Promise<void> {
  peertubeHelpers.logger.info('Hello Shig')
}

async function unregister (): Promise<void> {}

module.exports = {
  register,
  unregister
}
