import type { RegisterServerOptions, Video, MVideoThumbnail } from '@peertube/peertube-types'

async function initCustomFields (options: RegisterServerOptions): Promise<void> {
  const registerHook = options.registerHook
  const storageManager = options.storageManager
  const logger = options.peertubeHelpers.logger

  registerHook({
    target: 'action:api.video.updated',
    handler: async (params: any) => {
      logger.debug('Saving a video, checking for custom fields')

      const body: any = params.body
      const video: Video | undefined = params.video
      if (!video || !video.id) {
        return
      }
      if (!body.pluginData) return
      const value = body.pluginData['shig-active']
      // NB: on Peertube 3.2.1, value is "true", "false", or "null", as strings.
      if (value === true || value === 'true') {
        logger.info(`Saving shig-active=true for video ${video.id.toString()}`)
        await storageManager.storeData(`shig-active-${video.id.toString()}`, true)
      } else if (value === false || value === 'false' || value === 'null') {
        logger.info(`Saving shig-active=false for video ${video.id.toString()}`)
        await storageManager.storeData(`shig-active-${video.id.toString()}`, false)
      } else {
        logger.error('Unknown value ' + JSON.stringify(value) + ' for shig-active field.')
      }
    }
  })

  registerHook({
    target: 'filter:api.video.get.result',
    handler: async (video: Video): Promise<Video> => {
      logger.debug('Getting a video, searching for custom fields and data')
      await fillVideoCustomFields(options, video)
      if (!video.isLocal) {
        await fillVideoRemoteShig(options, video)
      }
      return video
    }
  })
}

// FIXME: @peertube/peertype-types@4.2.2: wrongly thinks that loadByIdOrUUID return a MVideoThumbnail.
//      So we create this custom interface for fillVideoCustomFields to accept Video and MVideoThumbnail types.
interface ShigCustomFieldsVideo {
  id?: number | string
  isLive: boolean
  pluginData?: {
    'shig-active'?: boolean
    'shig-remote'?: boolean
  }
}

async function fillVideoCustomFields (options: RegisterServerOptions, video: ShigCustomFieldsVideo): Promise<void> {
  if (!video) return video
  if (!video.pluginData) video.pluginData = {}
  if (!video.id) return
  const storageManager = options.storageManager
  const logger = options.peertubeHelpers.logger

  if (video.isLive) {
    const result: any = await storageManager.getData(`shig-active-${video.id as string}`)
    logger.debug(`Video ${video.id as string} has shig-active=` + JSON.stringify(result))
    // NB: I got weird stuff here. Maybe Peertube 3.2.1 bug?
    if (result === true || result === 'true') {
      video.pluginData['shig-active'] = true
    } else if (result === false || result === 'false' || result === 'null') {
      video.pluginData['shig-active'] = false
    }
  }
}

async function fillVideoRemoteShig (
  options: RegisterServerOptions,
  video: Video | MVideoThumbnail
): Promise<void> {
  if (('remote' in video) && !video.remote) { return }
  if (('isLocal' in video) && video.isLocal) { return }
  return
}

export {
  initCustomFields,
  fillVideoCustomFields,
  fillVideoRemoteShig
}
