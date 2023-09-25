import type {RegisterClientOptions} from '@peertube/peertube-types/client'
import type {RegisterClientFormFieldOptions} from '@peertube/peertube-types'
import {showLobbyPage} from './pages/lobby';
import {validateTextField, validateUser} from 'shared/lib/validator';
import {invitationSubmenu, showInvitationPage} from './pages/invitations';

/*
NB: if you need some types like `video`, `playlist`, ..., you can import them like that:
import type { Video } from '@peertube/peertube-types'
*/

async function register({
                            peertubeHelpers,
                            registerHook,
                            registerVideoField,
                            registerClientRoute
                        }: RegisterClientOptions): Promise<void> {

    // Register the admin stats route
    registerClientRoute({
        route: 'lobby',
        onMount: ({rootEl}) => {
            showLobbyPage({
                rootEl,
                peertubeHelpers
            });
        },
    });

    registerHook({
        target: 'filter:left-menu.links.create.result',
        handler: async (leftMenu: any[]) => {
            leftMenu.forEach((menu) => {
                if (menu.key == 'in-my-library') {
                    if (invitationSubmenu.menuObj.length == 0) {
                        invitationSubmenu.menuObj = menu.links
                    }
                    menu.links.push({
                        path: '/p/invitations',
                        icon: 'users',
                        shortLabel: 'Invites',
                        label: 'My Invites'
                    })
                }
            })
            return leftMenu
        }
    });

    /**
     * Add link admin page
     */
    registerHook({
        target: 'action:router.navigation-end',
        handler: async (params: any) => {
            if (params.path.startsWith('/my-library/')) {
                if (document.getElementById('invitation-link')) return;

                let href = '/p/invitations';

                // Get menu container
                const menuContainer = document.getElementsByClassName('sub-menu')[0];

                // Create link
                const content = `
          <a _ngcontent-dke-c79="" id="invitation-link" routerlinkactive="active" class="sub-menu-entry ng-star-inserted" href="${href}">
            ${await peertubeHelpers.translate('Invitations')}
          </a>
        `;

                // Create node for it
                const nodeLink = document.createElement('div');
                nodeLink.innerHTML = content.trim();
                // Insert to menu container
                menuContainer.appendChild(nodeLink);
            }
        },
    });

    registerClientRoute({
        route: 'invitations',
        onMount: ({rootEl}) => {
            showInvitationPage({
                rootEl,
                peertubeHelpers
            });
        },
    });

    function hideSettings(option: any): boolean {
        if (!option && !option?.liveVideo) {
            return true
        }

        if (!settings['shig-plugin-active']) {
            return true
        }
        return false
    }

    const [
        headlineShig,
        labelActivate,
        descriptionActivate,
        headLineGuest,
        descriptionGuest,
        descriptionTwoGuest,
        notificationGuest,
        firstGuest,
        secondGuest,
        thirdGuest,
        inputDescriptionGuest,
        messageLabel,
        messageDescription,
        settings
    ] = await Promise.all([
        peertubeHelpers.translate('Shig Settings'),
        peertubeHelpers.translate('Use Shig Lobby'),
        peertubeHelpers.translate('The Shig Lobby is a browser based streaming studio, which you can use directly from PeerTube. You don\'t need any other streaming software to record your live video.'),
        peertubeHelpers.translate('Multi Guest Streaming'),
        peertubeHelpers.translate('Invite Guests to your live streams.'),
        peertubeHelpers.translate('Guests have access and can enter the streaming lobby. With guest\'s you can record a live video together.'),
        peertubeHelpers.translate('If the user exists in PeerTube, We send all quest\'s an invitation to your live video.'),
        peertubeHelpers.translate('First Guest'),
        peertubeHelpers.translate('Second Guest'),
        peertubeHelpers.translate('Third Guest'),
        peertubeHelpers.translate('Enter an existing PeerTube user name.'),
        peertubeHelpers.translate('Custom notification message'),
        peertubeHelpers.translate('You can add a custom message we will send to your guest in the invitation message.'),
        peertubeHelpers.getSettings()
    ])

    const shigHeadline: RegisterClientFormFieldOptions = {
        type: 'html',
        html: `<h3>${headlineShig}</h3>`,
        hidden: hideSettings
    }

    const shigFieldOptions: RegisterClientFormFieldOptions = {
        name: 'shigActive',
        label: labelActivate,
        descriptionHTML: descriptionActivate,
        type: 'input-checkbox',
        default: true,
        hidden: hideSettings
    }

    const shigHeadlineGuestOption: RegisterClientFormFieldOptions = {
        type: 'html',
        html: `<h4>${headLineGuest}</h4><p>${descriptionGuest}</br>${descriptionTwoGuest}</p><p>${notificationGuest}</p>`,
        hidden: hideSettings
    }

    const shigFirstGuestOption: RegisterClientFormFieldOptions = {
        name: 'firstGuest',
        type: 'input',
        label: firstGuest,
        descriptionHTML: inputDescriptionGuest,
        default: '',
        hidden: hideSettings,
        error: validateUser
    }

    const shigSecondGuestOption: RegisterClientFormFieldOptions = {
        name: 'secondGuest',
        type: 'input',
        label: secondGuest,
        descriptionHTML: inputDescriptionGuest,
        default: '',
        hidden: hideSettings,
        error: validateUser
    }

    const shigThirdGuestOption: RegisterClientFormFieldOptions = {
        name: 'thirdGuest',
        type: 'input',
        label: thirdGuest,
        descriptionHTML: inputDescriptionGuest,
        default: '',
        hidden: hideSettings,
        error: validateUser
    }

    const shigCustomMessage: RegisterClientFormFieldOptions = {
        type: 'input-textarea',
        name: 'customMessage',
        label: messageLabel,
        descriptionHTML: messageDescription,
        default: '',
        hidden: hideSettings,
        error: validateTextField
    }

    registerVideoField(shigHeadline, {type: 'update'})
    registerVideoField(shigFieldOptions, {type: 'update'})
    registerVideoField(shigHeadlineGuestOption, {type: 'update'})
    registerVideoField(shigFirstGuestOption, {type: 'update'})
    registerVideoField(shigSecondGuestOption, {type: 'update'})
    registerVideoField(shigThirdGuestOption, {type: 'update'})
    registerVideoField(shigCustomMessage, {type: 'update'})

    registerVideoField(shigHeadline, {type: 'go-live'})
    registerVideoField(shigFieldOptions, {type: 'go-live'})
    registerVideoField(shigHeadlineGuestOption, {type: 'go-live'})
    registerVideoField(shigFirstGuestOption, {type: 'go-live'})
    registerVideoField(shigSecondGuestOption, {type: 'go-live'})
    registerVideoField(shigThirdGuestOption, {type: 'go-live'})
    registerVideoField(shigCustomMessage, {type: 'go-live'})

    registerHook({
        target: 'action:auth-user.information-loaded',
        handler: ({user}: any) => {
            const token = user.access_token
            const baseScheme = window.location.protocol === 'https:'
                ? 'wss:'
                : 'ws:'
            const url = `${baseScheme}//${window.location.host}/plugins/shig-live-stream/ws/invitations`
            const socket = new WebSocket(url);
            socket.onopen = () => socket.send(token);

            let timer: number;
            socket.addEventListener('message', (event) => {
                if (event.data === 'connected') {
                    timer = window.setInterval(() => {
                        socket.send('heartbeat')
                    }, 2000);
                }
                console.log(event.data, token)
            })
            socket.addEventListener('close', (_) => {
                if (timer) {
                    clearInterval(timer)
                }
            })
        },
    });
}

export {
    register
}
