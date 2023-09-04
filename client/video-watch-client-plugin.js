function register ({ registerHook, peertubeHelpers }) {
  registerHook({
    target: 'action:video-watch.init',
    handler: () => console.log('Hello video watch world')
  })

  registerHook({
    target: 'action:video-watch.video.loaded',
    handler: ({ videojs, video, playlist }) => {

      if (playlist) {
        console.log('playlist loaded')
      } else {
        console.log('video loaded')
      }

      // Insert element next to the player
      {
        const elem = document.createElement('div')
        elem.className = 'hello-world-h4'
        elem.innerHTML = '<h4>Hello everybody! This is an element next to the player</h4>'
        elem.style = 'background-color: red; '

        document.getElementById('plugin-placeholder-player-next').appendChild(elem)
      }
    }
  })

  registerHook({
    target: 'filter:api.video-watch.video.get.result',
    handler: video => {
      video.name += ' \o/'

      return video
    }
  })

  registerHook({
    target: 'filter:api.video-watch.video-threads.list.result',
    handler: result => {
      result.data.forEach(c => c.text += ' THREAD')

      return result
    }
  })

  registerHook({
    target: 'filter:api.video-watch.video-thread-replies.list.result',
    handler: result => {
      result.children.forEach(c => c.comment.text += ' REPLY DEEP 1')

      return result
    }
  })

  registerHook({
    target: 'filter:internal.video-watch.player.build-options.result',
    handler: (result, params) => {
      console.log('Running player build options hook for video %s.', params.video.name)
      result.playerOptions.common.inactivityTimeout = 10000

      return result
    }
  })

  registerHook({
    target: 'filter:internal.player.videojs.options.result',
    handler: (options) => {
      console.log(options.plugins.p2pMediaLoader)

      options.poster = ''
      return options
    }
  })

  registerHook({
    target: 'action:video-watch.video-threads.loaded',
    handler: () => {
      console.log('Comments found.', document.querySelectorAll('.comment'));
    }
  })

  for (const hook of [
    'filter:api.video-watch.video-playlist-elements.get.result'
  ]) {
    registerHook({
      target: hook,
      handler: (result) => {
        console.log('Running hook %s', hook, result)

        return result
      }
    })
  }

  // ---------------------------------------------------------------------------
  // Share modal
  // ---------------------------------------------------------------------------

  for (const hook of [
    'filter:share.video-embed-code.build.result',
    'filter:share.video-playlist-embed-code.build.result',
    'filter:share.video-embed-url.build.result',
    'filter:share.video-playlist-embed-url.build.result',
    'filter:share.video-url.build.result',
    'filter:share.video-playlist-url.build.result',
  ]) {
    registerHook({
      target: hook,
      handler: (result) => {
        return result + hook
      }
    })
  }

  registerHook({
    target: 'action:modal.share.shown',
    handler: ({ video, playlist }) => {
      if (video) {
        const elem = document.createElement('div')
        elem.innerHTML = 'video ' + video.name
        document.getElementById('plugin-placeholder-share-modal-video-settings').appendChild(elem)
      }

      if (playlist) {
        const elem = document.createElement('div')
        elem.innerHTML = 'playlist ' + playlist.displayName
        document.getElementById('plugin-placeholder-share-modal-playlist-settings').appendChild(elem)
      }
    }
  })

  // ---------------------------------------------------------------------------

  registerHook({
    target: 'action:video-watch.player.loaded',
    handler: ({ videojs }) => {
      console.log(videojs.VERSION)
    }
  })

  // ---------------------------------------------------------------------------

  peertubeHelpers.notifier.info('you are on the watch page', 'useless', 1000)
}

export {
  register
}
