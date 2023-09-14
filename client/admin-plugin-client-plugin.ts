import type { RegisterClientOptions } from '@peertube/peertube-types/client'

const PLUGIN_SHIG_PACKAGE_NAME = "peertube-plugin-shig-live-stream"
interface ActionPluginSettingsParams {
  npmName: string
}

function register ({ registerHook, registerSettingsScript, peertubeHelpers }: RegisterClientOptions): void {

  registerHook({
    target: 'action:admin-plugin-settings.init',
    handler: ({ npmName }: ActionPluginSettingsParams) => {
      if (PLUGIN_SHIG_PACKAGE_NAME !== npmName) {
        return;
      }
    },
  });
}

export {
  register
}
