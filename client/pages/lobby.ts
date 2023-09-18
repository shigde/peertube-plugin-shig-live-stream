import {RegisterClientHelpers} from '@peertube/peertube-types/client/types/register-client-option.model';

interface ShowPageOptions  {
    rootEl: HTMLElement,
    peertubeHelpers: RegisterClientHelpers;
}


async function showLobbyPage( {rootEl  , peertubeHelpers} : ShowPageOptions ) {
    // Redirect to login page if not auth
    if (!peertubeHelpers.isLoggedIn()) return (window.location.href = "/login");
    // const loading = await peertubeHelpers.translate("Loading");
    // rootEl.innerHTML = loading + "...";
    rootEl.classList.add("root")
    rootEl.innerHTML = `<div id="wrapper" class="margin-content pb-1 offset-content"></div>`

    const shigLobby = document.createElement("script");
    shigLobby.type = "text/javascript";
    shigLobby.src =  `${peertubeHelpers.getBaseStaticRoute()}/javascript/shig-lobby.js`;
    document.body.appendChild(shigLobby);

    shigLobby.onload = () => {
        const lobby = document.createElement('shig-lobby');
        lobby.addEventListener('loadComp', (event) => {
            console.log("Component loaded successfully!", event);
        });
        // lobby.setAttribute('person', JSON.stringify(person));


        const wrapper = document.getElementById("wrapper");
        wrapper?.appendChild(lobby);
    };

    return Promise.resolve();
}

export type {
    ShowPageOptions
}

export { showLobbyPage };
