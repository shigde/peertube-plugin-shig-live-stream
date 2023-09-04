function register ({ registerHook, peertubeHelpers }) {

  for (const hook of [
    'action:video-channel-create.init',
    'action:video-channel-update.init',
    'action:video-channel-videos.init',
    'action:video-channel-playlists.init'
  ]) {
    registerHook({
      target: hook,
      handler: () => console.log('Hello world', hook)
    })
  }

  registerHook({
    target: 'action:video-channel-update.video-channel.loaded',
    handler: ({ videoChannel }) => console.log('Channel loaded', { videoChannel })
  })

  registerHook({
    target: 'action:video-channel-playlists.video-channel.loaded',
    handler: ({ videoChannel }) => console.log('Channel loaded', { videoChannel })
  })
  registerHook({
    target: 'action:video-channel-playlists.playlists.loaded',
    handler: ({ playlists }) => console.log('Playlists loaded', { playlists })
  })

  registerHook({
    target: 'action:video-channel-videos.video-channel.loaded',
    handler: ({ videoChannel }) => console.log('Channel loaded', { videoChannel })
  })
  registerHook({
    target: 'action:video-channel-videos.videos.loaded',
    handler: ({ videos }) => console.log('Videos loaded', { videos })
  })
}

export {
  register
}
