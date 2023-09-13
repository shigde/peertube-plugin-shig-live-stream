import { parseConfigUUIDs } from './config'

interface VideoHasShigSettings {
  'shig-per-live-video': boolean
  'shig-all-lives': boolean
  'shig-videos-list': string
}

interface SharedVideoBase {
  uuid: string
  isLive: boolean
  pluginData?: {
    'shigActive'?: boolean
    'shig-remote'?: boolean
  }
}

interface SharedVideoFrontend extends SharedVideoBase {
  isLocal: boolean
}

interface SharedVideoBackend extends SharedVideoBase {
  remote: boolean
}

type SharedVideo = SharedVideoBackend | SharedVideoFrontend

/**
 * Indicate if the video has a local chat.
 * @param settings plugin settings
 * @param video the video
 * @returns true if the video has a local chat
 */
function videoHasShig (settings: VideoHasShigSettings, video: SharedVideo): boolean {
  // Never use webchat on remote videos.
  if ('isLocal' in video) {
    if (!video.isLocal) return false
  } else {
    if (video.remote) return false
  }

  if (settings['shig-per-live-video'] && video.isLive && video.pluginData && video.pluginData['shigActive']) {
    return true
  }

  if (settings['shig-all-lives']) {
    if (video.isLive) return true
  }

  const uuids = parseConfigUUIDs(settings['shig-videos-list'])
  if (uuids.includes(video.uuid)) {
    return true
  }

  return false
}

interface VideoHasRemoteShigSettings {
  'federation-no-remote-chat': boolean
}

/**
 * Indicates if the video has a remote chat.
 * @param settings plugin settings
 * @param video the video
 * @returns true if the video has a remote chat
 */
function videoHasRemoteShig (settings: VideoHasRemoteShigSettings, video: SharedVideo): boolean {
  if (settings['federation-no-remote-chat']) { return false }
  if ('isLocal' in video) {
    if (video.isLocal) return false
  } else {
    if (!video.remote) return false
  }
  if (!video.pluginData) { return false }
  if (!video.pluginData['shig-remote']) { return false }
  return true
}

export {
  videoHasShig,
  videoHasRemoteShig
}
