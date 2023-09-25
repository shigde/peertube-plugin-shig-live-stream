import {ShowPageOptions} from './show-page-options';
import {guestSVG} from '../items/svg';
import {RegisterClientHelpers} from '@peertube/peertube-types/client/types/register-client-option.model';
import moment from 'moment';
import {resetInvitations} from '../invite-marker/invites';

const invitationSubmenu: { menuObj: any[] } = {
    menuObj: []
}

function buildInvitationSubMenu(): string {
    let menu = '<a class="sub-menu-entry ng-star-inserted active" href="/p/invitations"> Invitations </a>'
    return `<div class="sub-menu sub-menu-fixed">${menu}</div>`
}

// Main
async function showInvitationPage({
                                      rootEl,
                                      peertubeHelpers
                                  }: ShowPageOptions) {
    // Redirect to login page if not auth
    if (!peertubeHelpers.isLoggedIn()) return (window.location.href = '/login');

    resetInvitations()
    const submenu = buildInvitationSubMenu()
    const headline = buildHeadline()
    const invitationsData = await fetchInvitations(peertubeHelpers)
    const invitations = await buildInvitations(invitationsData)
    rootEl.innerHTML = `${submenu} 
<div class="margin-content pb-5 offset-content">
    <div class="ng-star-inserted">
        ${headline}
        ${invitations}
    </div>    
</div>`
    return
}

function buildHeadline() {
    const style = 'style="' +
        '    font-size: 1.3rem;' +
        '    border-bottom: 2px solid #E5E5E5;' +
        '    padding-bottom: 15px;' +
        '    margin-bottom: 30px;"'
    return `<h1 ${style}><my-global-icon style="margin-inline-end: 0.625rem; vertical-align: top;">${guestSVG()}</my-global-icon>Invitations</h1>`
}

async function buildInvitations(invites: any[]) {
    const style = 'style= "display: flex; ' +
        '    align-items: center; ' +
        '    font-size: inherit; ' +
        '    padding: 15px 5px 15px 10px; ' +
        '    border-bottom: 1px solid rgba(0, 0, 0, 0.1); ' +
        '    word-break: break-word;"'

    const styleDate = 'style= "' +
        '    font-size: 0.85em;' +
        '    color: #333333;' +
        '    min-width: 70px;' +
        '    text-align: end;"'

    let invitationHTML = "";
        invites.forEach((data) => {
        invitationHTML = invitationHTML + `
        <div class="notification ng-star-inserted" ${style}>
            <my-global-icon iconname="film" aria-hidden="true" class="ng-star-inserted" style="margin-inline-start: 11px; margin-inline-end: 11px">
            ${guestSVG()}
            </my-global-icon>
            <div class="message ng-star-inserted" style="flex-grow: 1;"> You have received a guest streaming invitation for 
                <a href="${data.videoUrl}">${data.videoName}</a>
            </div>
            <div class="from-date" title="${data.createdAt}" ${styleDate}>${moment(data.createdAt).fromNow()}</div>
        </div>
        `;
    })

    return `

<my-user-notifications >
    <div class="notifications">
        ${invitationHTML}
    </div>
</my-user-notifications>
`
}

async function fetchInvitations(peertubeHelpers: RegisterClientHelpers, params = null): Promise<any[]> {
    const baseUrl = peertubeHelpers.getBaseRouterRoute();
    const response = await fetch(baseUrl + '/invitations?' + (params ? '&' + new URLSearchParams(params).toString() : ''), {
        method: 'GET',
        headers: await peertubeHelpers.getAuthHeader(),
    });
    const json = await response.json()
    return json.data;
}

export {
    showInvitationPage,
    invitationSubmenu
}
