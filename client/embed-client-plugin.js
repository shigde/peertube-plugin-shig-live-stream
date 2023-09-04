function register ({ registerHook, peertubeHelpers }) {
  registerHook({
    target: 'action:embed.player.loaded',
    handler: () => alert('video loaded')
  })

  registerHook({
    target: 'filter:internal.player.videojs.options.result',
    handler: (options) => {
      options.poster = 'https://joinpeertube.org/img/brand-with-v3.png'
      return options
    }
  })

  console.log(peertubeHelpers.translate('toto'))
}

export {
  register
}
