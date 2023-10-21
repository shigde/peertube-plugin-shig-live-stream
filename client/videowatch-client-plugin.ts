import type {Video} from '@peertube/peertube-types'
import type {RegisterClientOptions} from '@peertube/peertube-types/client'
import {videoHasShig, videoHasRemoteShig} from 'shared/lib/video'
import {logger} from './logger'
import {lobbySVG, askToJoinSVG} from './items/svg'
import {displayButton, displayButtonOptions} from './items/button';
import {RegisterClientHelpers} from '@peertube/peertube-types/client/types/register-client-option.model';

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

        if (username !== video.account?.name && !isGuest(video.pluginData, username)) {
            return false
        }

        return true
    } catch (err) {
        logger.error(err as string)
        return false
    }
}

function isGuest(data: any, username: string): boolean {
    if (!data) {
        return false
    }
    if (!!data?.firstGuest && isUsername(data.firstGuest, username)) {
        return true
    }

    if (!!data?.secondGuest && isUsername(data.secondGuest, username)) {
        return true
    }

    if (!!data?.thirdGuest && isUsername(data.thirdGuest, username)) {
        return true
    }
    return false
}

function isUsername(guest: string, username: string): boolean {
    const splitted = guest.split('@', 1);
    if (splitted.length > 0 && splitted[0] === username) {
        return true
    }
    return false
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

async function register(registerOptions: RegisterClientOptions): Promise<void> {
    const {
        registerHook,
        peertubeHelpers
    } = registerOptions

    let settings: any = {}
    async function insertShigDom(container: HTMLElement, video: Video, showOpenLobbyButton: boolean): Promise<void> {
        logger.log('Adding Shig in the DOM...')
        const p = new Promise<void>((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            Promise.all([
                peertubeHelpers.translate('Ask to Join'),
                peertubeHelpers.translate('Open Shig Lobby'),
                peertubeHelpers.translate('Ask for live stream participation'),
                peertubeHelpers.translate('Do you wont ask the owner to participate in the live stream?'),
                peertubeHelpers.translate('Confirm'),
                peertubeHelpers.translate('Cancel'),
            ]).then(labels => {
                const labelAskToJoin = labels[0]
                const labelOpenShigLobby = labels[1]
                const modalTitle = labels[2]
                const modalContent = labels[3]
                const modalConfirm = labels[4]
                const modalCancel = labels[5]

                let buttonOptions: displayButtonOptions;
                if (showOpenLobbyButton) {
                    buttonOptions = {
                        buttonContainer: container,
                        name: 'open',
                        label: labelOpenShigLobby,
                        // callback: () => openLobby(video),
                        href: `/p/lobby?s=${video.uuid}&c=${video.channel.name}@${video.channel.host}`,
                        icon: lobbySVG,
                        additionalClasses: ['orange-button']
                    }
                } else {
                    buttonOptions = {
                        buttonContainer: container,
                        name: 'join',
                        label: labelAskToJoin,
                        callback: () => openLobbyRequest(
                            video,
                            peertubeHelpers,
                            modalTitle,
                            modalContent,
                            modalConfirm,
                            modalCancel
                        ),
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
            settings['shig-plugin-active'] = true

            logger.log('Checking if this video should have a Shig setup...')
            if (settings['shig-plugin-active'] !== true) {
                logger.log('No Shig supported')
                return
            }

            if (!settings['shig-server-url']) {
                logger.log('No Shig Server')
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

    function openLobbyRequest(
        video: Video,
        peertubeHelpers: RegisterClientHelpers,
        modalTitle: string,
        modalContent: string,
        modalConfirm: string,
        modalCancel: string,
    ): void | boolean {
        if (!video) {
            logger.log('No video.')
            return false
        }

        peertubeHelpers.showModal({
            title: modalTitle,
            content: '<p>' + modalContent + '</p>',
            // Optionals parameters :
            // show close icon
            close: true,
            // show cancel button and call action() after hiding modal
            cancel: {
                value: modalCancel,
                action: () => {
                }
            },
            // show confirm button and call action() after hiding modal
            confirm: {
                value: modalConfirm,
                action: () => {

                }
            },
        })
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
