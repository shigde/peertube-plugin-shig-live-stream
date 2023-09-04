function register ({ registerHook, peertubeHelpers }) {
  registerHook({
    target: 'filter:signup.instance-about-plugin-panels.create.result',
    handler: result => {
      return result.concat([
        {
          id: 'loulou',
          title: 'Loulou',
          html: 'Loulou <strong>Duck</strong>'
        }
      ])
    }
  })
}

export {
  register
}
