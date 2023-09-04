function register ({ registerHook }) {
  registerHook({
    target: 'action:admin-plugin-settings.init',
    handler: ({ npmName }) => {
      console.log('loaded admin plugin settings %s', npmName)

      const div = document.createElement('div')
      div.innerHTML = '<p>Just after the user name</p>'
      document.querySelector('#user-name-wrapper').appendChild(div)
    }
  })
}

export {
  register
}
