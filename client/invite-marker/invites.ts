function addInvitation() {
    let count = window.localStorage.getItem("invitations");
    let newCount = 1;
    if(count) {
        newCount = +count + 1;
    }
    window.localStorage.setItem("invitations", `${newCount}`);
    const invite = document.getElementById('unread-invite-notifications');
    if(invite) {
        invite.style.display = "flex"
        invite.innerHTML = `${newCount}`
    }
}

function getInvitations(): null | string {
    return window.localStorage.getItem("invitations");
}

function resetInvitations(): void {
    window.localStorage.removeItem("invitations");
    const invite = document.getElementById('unread-invite-notifications');
    if(invite) {
        invite.style.display = "none"
        invite.innerHTML = `0`
    }
}

function buildInvitationNotification(): void {
    const div = document.createElement('div')
    div.id = 'unread-invite-notifications'
    div.style.position = 'absolute';
    div.style.top = '-8px';
    div.style.left= '10px';
    div.style.display= 'flex';
    div.style.alignItems= 'center';
    div.style.justifyContent= 'center';
    div.style.backgroundColor= ' var(--mainColor)';
    div.style.color= ' #fff';
    div.style.fontSize= '10px';
    div.style.fontWeight= '600';
    div.style.borderRadius= '15px';
    div.style.width= '15px';
    div.style.height= '15px';
    div.classList.add('unread-invite-notifications')

    const invitations = getInvitations()
    if(invitations == null) {
        div.innerHTML = "0"
        div.style.display= 'none';
    } else {
        div.innerHTML = invitations
        div.style.display= 'flex';
    }

    const els = document.querySelectorAll('a[href=\'/p/invitations\']');
    if (els.length !== 0) {
        els.forEach((el) => {
            if (el.classList.contains('menu-link')) {
                el.firstChild?.appendChild(div)
            }
        })
    }
}

export {
    addInvitation,
    resetInvitations,
    buildInvitationNotification,
}

