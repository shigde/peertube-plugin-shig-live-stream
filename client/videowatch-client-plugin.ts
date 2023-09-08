import type {Video} from '@peertube/peertube-types'
import type {RegisterClientOptions} from '@peertube/peertube-types/client'
import {videoHasShig, videoHasRemoteShig} from 'shared/lib/video'
import {logger} from './videowatch/logger'
import {lobbySVG, askToJoinSVG} from './videowatch/button-svg'
import {displayButton, displayButtonOptions} from './videowatch/button';

interface VideoWatchLoadedHookOptions {
    videojs: any
    video: Video
    playlist?: any
}

function isAnonymousUser(registerOptions: RegisterClientOptions): boolean {
    return !registerOptions.peertubeHelpers.isLoggedIn()
}

function guessIsMine(registerOptions: RegisterClientOptions, video: Video): boolean {
    // Note: this is not safe, but it is not a problem:
    // this function is used for non critical functions
    try {
        if (!video) {
            return false
        }
        if (!video.isLocal) {
            return false
        }
        if (!window.localStorage) {
            return false
        }
        const username = window.localStorage.getItem('username') ?? ''
        if (!username) {
            return false
        }
        if (username !== video.account?.name) {
            return false
        }
        return true
    } catch (err) {
        logger.error(err as string)
        return false
    }
}

function guessIamIModerator(_registerOptions: RegisterClientOptions): boolean {
    // Note: this is not safe, but it is not a problem:
    // this function is used for non critical functions
    try {
        if (!window.localStorage) {
            return false
        }
        const role = window.localStorage.getItem('role') ?? ''
        if (!role) {
            return false
        }
        if (role !== '0' && role !== '1') {
            return false
        }
        return true
    } catch (err) {
        logger.error(err as string)
        return false
    }
}

function register(registerOptions: RegisterClientOptions): void {
    const {registerHook, peertubeHelpers} = registerOptions
    let settings: any = {}

    async function insertShigDom(container: HTMLElement, video: Video, showOpenLobbyButton: boolean): Promise<void> {
        logger.log('Adding Shig in the DOM...')
        const p = new Promise<void>((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Promise.all([
                peertubeHelpers.translate('Ask to Join'),
                peertubeHelpers.translate('Open Shig Lobby'),
            ]).then(labels => {
                const labelAskToJoin = labels[0]
                const labelOpenShigLobby = labels[1]

                console.log("video", video)

                let buttonOptions: displayButtonOptions;
                if (showOpenLobbyButton) {
                    buttonOptions = {
                        buttonContainer: container,
                        name: 'open',
                        label: labelOpenShigLobby,
                        //callback: () => openLobby(video),
                        href: "/p/lobby?stream=" + video.shortUUID,
                        icon: lobbySVG,
                        additionalClasses: ['orange-button']
                    }
                } else {
                    buttonOptions = {
                        buttonContainer: container,
                        name: 'join',
                        label: labelAskToJoin,
                        callback: () => openLobbyRequest(video),
                        icon: askToJoinSVG,
                        additionalClasses: ['action-button']
                    }
                }
                displayButton(buttonOptions)
                resolve()
            })
        })
        return p
    }


    function initShig(video: Video): void {
        if (!video) {
            logger.info('No video provided')
            return
        }
        // document.getElementsByTagName('my-action-button')
        const placeholder = document.getElementsByClassName('video-actions')?.item(0)
        if (!placeholder) {
            logger.error('The required placeholder div is not present in the DOM.')
            return
        }

        let container = placeholder;

        peertubeHelpers.getSettings().then((s: any) => {
            settings = s
            settings['shig-server-exists'] = true
            settings['shig-per-live-video'] = true

            logger.log('Checking if this video should have a Shig setup...')
            if (settings['shig-server-exists'] !== true) {
                logger.log('No Shig supported')
                return
            }

            if (isAnonymousUser(registerOptions)) {
                logger.log('No Shig for anonymous users')
                return
            }

            if (!videoHasShig(s, video) && !videoHasRemoteShig(s, video)) {
                logger.log('This video has no Shig activated')
                return
            }


            let showOpenLobbyButton: boolean = false
            if (guessIsMine(registerOptions, video) || guessIamIModerator(registerOptions)) {
                showOpenLobbyButton = true
            }

            insertShigDom(container as HTMLElement, video, showOpenLobbyButton).then(() => {
                logger.log('insertShigDom has finished')
            }, () => {
                logger.error('insertShigDom has failed')
            })
        }, () => {
            logger.error('Cant get settings')
        })
    }

    // function openLobby(video: Video): void | boolean {
    //     if (!video) {
    //         logger.log('No video.')
    //         return false
    //     }
    // }

    function openLobbyRequest(video: Video): void | boolean {
        if (!video) {
            logger.log('No video.')
            return false
        }
    }

    registerHook({
        target: 'action:video-watch.video.loaded',
        handler: ({
                      video,
                      playlist
                  }: VideoWatchLoadedHookOptions) => {
            if (!video) {
                logger.error('No video argument in hook action:video-watch.video.loaded')
                return
            }
            if (playlist) {
                logger.info('We are in a playlist, we will not use Shig')
                return
            }
            initShig(video)
        }
    })
}

export {
    register
}
