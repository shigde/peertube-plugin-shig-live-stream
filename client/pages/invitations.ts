import {ShowPageOptions} from './show-page-options';

const invitationSubmenu: { menuObj: any[] } = {
    menuObj: []
}

function buildInvitationSubMenu(): string {
    let menu = ''
    // if (invitationSubmenu.menuObj.length > 0) {
    //     invitationSubmenu.menuObj.forEach((menuItem) => {
    //         let item: string
    //         if (menuItem.path == '/my-library/subscriptions') {
    //             item = buildFollowersDropDown()
    //         } else if (menuItem.path == '/my-library/followers') {
    //             item = ''
    //         } else {
    //             item = `<a class="sub-menu-entry ng-star-inserted" href="${menuItem.path}"> ${menuItem.shortLabel} </a>`
    //         }
    //         menu = `${menu} ${item}`
    //     })
    // }
    menu = menu + '<a class="sub-menu-entry ng-star-inserted active" href="/p/invitations"> Invitations </a>'
    return `<div class="sub-menu sub-menu-fixed">${menu}</div>`
}

// function buildFollowersDropDown() {
//     return `<div class="parent-entry ng-star-inserted dropdown">
//   <span  tabindex="0"  role="button" class="dropdown-toggle sub-menu-entry ng-star-inserted" aria-expanded="false">Follows</span>
//   <div class="dropdown-menu">
//
//     <a class="dropdown-item icon ng-star-inserted" href="/my-library/subscriptions">
//       <my-global-icon aria-hidden="true" class="ng-star-inserted">
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="material" width="24px" height="24px">
//           <path d="M20 8H4V6h16v2zm-2-6H6v2h12V2zm4 10v8c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-8c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2zm-6 4l-6-3.27v6.53L16 16z"></path>
//           <path d="M0 0h24v24H0z" fill="none"></path>
//         </svg>
//       </my-global-icon> Subscriptions
//     </a>
//
//     <a class="dropdown-item icon ng-star-inserted" href="/my-library/followers">
//       <my-global-icon  aria-hidden="true" class="ng-star-inserted">
//         <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="1em" height="1em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
//           <path d="M18 21l-3-3l3-3v2h4v2h-4v2M10 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c1.15 0 2.25.12 3.24.34A5.964 5.964 0 0 0 12 18c0 .7.12 1.37.34 2H2v-2c0-2.21 3.58-4 8-4z" fill="currentColor" class="material"></path>
//         </svg>
//       </my-global-icon>Followers
//     </a>
//   </div>
// </div>
//     `
// }

async function showInvitationPage({
                                      rootEl,
                                      peertubeHelpers
                                  }: ShowPageOptions) {
    // Redirect to login page if not auth
    if (!peertubeHelpers.isLoggedIn()) return (window.location.href = '/login');
    const submenu = buildInvitationSubMenu()
    rootEl.innerHTML = `${submenu}`
    return
}

export {
    showInvitationPage,
    invitationSubmenu
}
