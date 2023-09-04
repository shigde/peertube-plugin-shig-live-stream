function register ({ registerHook, registerSettingsScript, registerClientRoute, peertubeHelpers }) {
  registerHook({
    target: 'action:application.init',
    handler: () => onApplicationInit(peertubeHelpers)
  })

  registerHook({
    target: 'action:auth-user.information-loaded',
    handler: ({ user }) => {
      console.log('User information loaded.', user)

      fetch('/api/v1/users/me', {
        method: 'GET',
        headers: peertubeHelpers.getAuthHeader()
      }).then(res => res.json())
        .then(data => console.log('Hi %s.', data.username))
    }
  })

  registerHook({
    target: 'action:auth-user.logged-in',
    handler: () => console.log('User logged in.')
  })

  registerHook({
    target: 'action:auth-user.logged-out',
    handler: () => console.log('User logged out.')
  })

  // Videos list

  registerHook({
    target: 'filter:api.trending-videos.videos.list.params',
    handler: params => Object.assign({}, params, { sort: '-views' })
  })

  registerHook({
    target: 'filter:api.trending-videos.videos.list.result',
    handler: result => addSymbolToVideoNameResult(result, '<3')
  })

  registerHook({
    target: 'filter:api.local-videos.videos.list.params',
    handler: params => Object.assign({}, params, { sort: '-views' })
  })

  registerHook({
    target: 'filter:api.local-videos.videos.list.result',
    handler: result => addSymbolToVideoNameResult(result, ':)')
  })

  registerHook({
    target: 'filter:api.recently-added-videos.videos.list.params',
    handler: params => Object.assign({}, params, { filter: 'all-local' })
  })

  registerHook({
    target: 'filter:api.recently-added-videos.videos.list.result',
    handler: result => addSymbolToVideoNameResult(result, 'o/')
  })

  registerHook({
    target: 'filter:api.user-subscriptions-videos.videos.list.params',
    handler: params => Object.assign({}, params, { sort: '-views' })
  })

  registerHook({
    target: 'filter:api.user-subscriptions-videos.videos.list.result',
    handler: result => addSymbolToVideoNameResult(result, ':D')
  })

  registerHook({
    target: 'filter:internal.common.svg-icons.get-content.result',
    handler: (result, params) => {
      if (params.name === 'syndication') {
        return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50"/></svg>'
      }

      return result
    }
  })

  registerHook({
    target: 'filter:left-menu.links.create.result',
    handler: (result) => {
      return [
        {
          key: 'in-my-stuff',
          title: 'In my stuff',
          links: [
            {
              path: '/about',
              icon: 'alert',
              shortLabel: 'About',
              label: 'About'
            },

            {
              path: peertubeHelpers.getBasePluginClientPath() + '/my-super/route',
              icon: '',
              shortLabel: 'super route',
              label: 'Super route'
            }
          ]
        }
      ].concat(result)
    }
  })

  // Router hooks

  registerHook({
    target: 'action:router.navigation-end',
    handler: params => console.log('New URL! %s.', params.path)
  })

  // Modal hooks

  registerHook({
    target: 'action:modal.video-download.shown',
    handler: () => {
      console.log('Video download modal shown')

      document.getElementById('download-torrent').checked = true
      document.getElementById('download-direct').parentElement.style.display = 'none'
    }
  })

  // Fake hook

  registerHook({
    target: 'fakeHook',
    handler: () => console.log('fake hook')
  })


  // Settings

  registerSettingsScript({
    isSettingHidden: options => {
      if (options.setting.name === 'my-markdown-area' && options.formValues.select === '2') {
        return true
      }

      return false
    }
  })

  // Routes

  registerClientRoute({
    route: 'my-super/route',
    onMount: ({ rootEl }) => {
      rootEl.innerHTML = 'hello'
    }
  })

  // WebSocket

  const baseScheme = window.location.protocol === 'https:'
    ? 'wss:'
    : 'ws:'

  const socket = new WebSocket(baseScheme + '//' + window.location.host + peertubeHelpers.getBaseWebSocketRoute() + '/toto');

  socket.addEventListener('message', (event) => {
    console.log(event.data)
  })
}

export {
  register
}

function onApplicationInit (peertubeHelpers) {
  console.log('Hello application world')

  const baseStaticUrl = peertubeHelpers.getBaseStaticRoute()
  const imageUrl = baseStaticUrl + '/images/chocobo.png'

  const topLeftBlock = document.querySelector('.top-left-block')

  topLeftBlock.style.backgroundImage = 'url(' + imageUrl + ')'

  peertubeHelpers.translate('User name')
   .then(translation => console.log('Translated User name by ' + translation))

  peertubeHelpers.getServerConfig()
    .then(config => console.log('Got server config.', config))
}

function addSymbolToVideoNameResult (result, symbol) {
  result.data.forEach(v => v.name += ' ' + symbol)

  return {
    data: result.data,
    total: result.total
  }
}
