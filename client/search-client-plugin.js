function register ({ registerHook, peertubeHelpers }) {

  registerHook({
    target: 'action:search.init',
    handler: () => console.log('Search init')
  })

  registerHook({
    target: 'filter:api.search.videos.list.result',
    handler: result => {
      result.data.forEach(v => v.name += ' SEARCH')

      return {
        total: result.total,
        data: result.data
      }
    }
  })

  registerHook({
    target: 'filter:api.search.video-channels.list.result',
    handler: result => {
      result.data.forEach(v => v.displayName += ' :p')

      return {
        total: result.total,
        data: result.data
      }
    }
  })

  peertubeHelpers.showModal({
    title: 'my super modal',
    content: 'hello, do you like my modal?',
    close: true,
    cancel: {
      value: 'Cancel',
      action: () => console.log('Canceled')
    },
    confirm: {
      value: 'Confirm',
      action: () => console.log('Confirmed')
    }
  })


  peertubeHelpers.markdownRenderer.textMarkdownToHTML('**My Bold Text**')
    .then(v => console.log(v))
}

export {
  register
}
