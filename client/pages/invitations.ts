import {ShowPageOptions} from './show-page-options';
import {guestSVG} from '../items/svg';

const invitationSubmenu: { menuObj: any[] } = {
    menuObj: []
}

function buildInvitationSubMenu(): string {
    let menu = '<a class="sub-menu-entry ng-star-inserted active" href="/p/invitations"> Invitations </a>'
    return `<div class="sub-menu sub-menu-fixed">${menu}</div>`
}

async function showInvitationPage({
                                      rootEl,
                                      peertubeHelpers
                                  }: ShowPageOptions) {
    // Redirect to login page if not auth
    if (!peertubeHelpers.isLoggedIn()) return (window.location.href = '/login');
    const submenu = buildInvitationSubMenu()
    const invitations = await buildInvitations()
    const headline = buildHeadline()
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


async function buildInvitations() {
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
    return `

<my-user-notifications >
    <div class="notifications">
        <div class="notification ng-star-inserted" ${style}>
            <my-global-icon iconname="film" aria-hidden="true" class="ng-star-inserted" style="margin-inline-start: 11px; margin-inline-end: 11px">
            ${guestSVG()}
            </my-global-icon>
            <div class="message ng-star-inserted" style="flex-grow: 1;"> You have received a guest streaming invitation for 
                <a href="/w/dhDhuqxNvziWQGDZTMey6D">What else Shig</a>
            </div>
            <div class="from-date" title="2023-09-05T11:41:50.610Z" ${styleDate}>3 days ago</div>
        </div>
        
        <div class="notification ng-star-inserted" ${style}>
            <my-global-icon iconname="film" aria-hidden="true" class="ng-star-inserted" style="margin-inline-start: 11px; margin-inline-end: 11px">
            ${guestSVG()}
            </my-global-icon>
            <div class="message ng-star-inserted" style="flex-grow: 1;"> You have received a guest streaming invitation for 
                <a href="/w/dhDhuqxNvziWQGDZTMey6D">LiveShig</a>
            </div>
            <div class="from-date" title="2023-09-05T11:41:50.610Z" ${styleDate}>2 weeks ago</div>
        </div>
    </div>
</my-user-notifications>
`
}

export {
    showInvitationPage,
    invitationSubmenu
}
