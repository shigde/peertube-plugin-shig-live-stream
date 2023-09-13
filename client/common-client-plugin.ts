import type {RegisterClientOptions} from '@peertube/peertube-types/client'
import type {RegisterClientFormFieldOptions} from '@peertube/peertube-types'
import {showLobbyPage} from './pages/lobby';

/*
NB: if you need some types like `video`, `playlist`, ..., you can import them like that:
import type { Video } from '@peertube/peertube-types'
*/

async function register({
                            peertubeHelpers,
                            registerVideoField,
                            registerClientRoute
                        }: RegisterClientOptions): Promise<void> {

    function hideSettings(option: any): boolean {
        if (!option && !option?.liveVideo) {
            return true
        }
        if (!settings['shig-server-exists']) {
            return true
        }
        if (settings['shig-all-lives']) {
            // No need to add this field if live is active for all live videos
            return true
        }
        return false
    }

    // Register the admin stats route
    registerClientRoute({
        route: 'lobby',
        onMount: ({rootEl}) => {
            showLobbyPage({rootEl, peertubeHelpers});
        },
    });

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
        imputDescriptionGuest,
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
    // @TODO: Create Admin setup
    settings['shig-server-exists'] = true
    settings['shig-all-lives'] = false


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
        descriptionHTML: imputDescriptionGuest,
        default: '',
        hidden: hideSettings
    }

    const shigSecondGuestOption: RegisterClientFormFieldOptions = {
        name: 'secondGuest',
        type: 'input',
        label: secondGuest,
        descriptionHTML: imputDescriptionGuest,
        default: '',
        hidden: hideSettings
    }

    const shigThirdGuestOption: RegisterClientFormFieldOptions = {
        name: 'thirdGuest',
        type: 'input',
        label: thirdGuest,
        descriptionHTML: imputDescriptionGuest,
        default: '',
        hidden: hideSettings
    }

    const shigCustomMessage: RegisterClientFormFieldOptions = {
        type: 'input-textarea',
        name: 'customMessage',
        label: messageLabel,
        descriptionHTML: messageDescription,
        default: '',
        hidden: hideSettings
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
}

export {
    register
}
