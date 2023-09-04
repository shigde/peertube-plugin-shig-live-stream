function register ({ registerHook, peertubeHelpers }) {

  registerHook({
    target: 'action:login.init',
    handler: () => {
      console.log('Login init')
      document.querySelector('.looking-for-account > div').innerHTML = 'Hello'
    }
  })

  registerHook({
    target: 'filter:login.instance-about-plugin-panels.create.result',
    handler: result => {
      return result.concat([
        {
          id: 'riri',
          title: 'Riri',
          html: 'Riri <strong>Duck</strong>'
        }
      ])
    }
  })
}

export {
  register
}
