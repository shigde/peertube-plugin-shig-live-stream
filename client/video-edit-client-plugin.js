function register ({ registerHook, registerVideoField }) {
  console.log('loading video edit stuff')

  {
    const commonOptions1 = {
      name: 'hello-world-field',
      label: 'Super field',
      type: 'input',
      default: 'hello'
    }

    const commonOptions2 = {
      name: 'hello-world-field-2',
      label: 'Super field 2',
      type: 'input',
      hidden: ({ liveVideo, videoToUpdate, formValues }) => {
        console.log('check hidden field', { videoToUpdate, liveVideo, formValues })

        return formValues.pluginData['hello-world-field'] === 'toto'
      }
    }

    const commonOptions3 = {
      name: 'hello-world-field-3',
      label: 'Super field 3',
      type: 'input-checkbox'
    }

    const commonOptions4 = {
      name: 'hello-world-field-4',
      label: 'Super field 4 in main tab',
      type: 'input-checkbox',
      hidden: ({ formValues }) => {
        return formValues['privacy'] !== 1 && formValues['privacy'] !== 2
      },
      error: ({ formValues, value }) => {
        if (formValues['privacy'] !== 1 && formValues['privacy'] !== 2) return { error: false }
        if (value === true) return { error: false }

        return { error: true, text: 'Should be enabled' }
      }
    }

    for (const type of [ 'upload', 'import-url', 'update' ]) {
      registerVideoField(commonOptions1, { type })
      registerVideoField(commonOptions2, { type })
      registerVideoField(commonOptions3, { type })
      registerVideoField(commonOptions4, { type, tab: 'main' })
    }
  }

  {
    const hooks = [
      'action:video-upload.init',
      'action:video-url-import.init',
      'action:video-torrent-import.init',
      'action:go-live.init'
    ]

    for (const h of hooks) {
      registerHook({
        target: h,
        handler: () => {
          const event = new Event('change', {
              bubbles: true,
              cancelable: true,
          });
          const selects = document.querySelectorAll('label[for=first-step-privacy] + my-select-options')

          console.log(selects)

          selects.forEach(s => {
            s.value = 2 // Unlisted
            s.dispatchEvent(event)
          })
        }
      })
    }
  }
}

export {
  register
}
