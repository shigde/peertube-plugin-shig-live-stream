import {RegisterClientHelpers} from '@peertube/peertube-types/client/types/register-client-option.model';

interface ShowPageOptions  {
    rootEl: HTMLElement,
    peertubeHelpers: RegisterClientHelpers;
}


async function showLobbyPage( {rootEl  , peertubeHelpers} : ShowPageOptions ) {
    // Redirect to login page if not auth
    if (!peertubeHelpers.isLoggedIn()) return (window.location.href = "/login");

    const loading = await peertubeHelpers.translate("Loading");
    rootEl.innerHTML = loading + "...";

    return Promise.resolve();


    // // Get settings
    // const baseUrl = peertubeHelpers.getBaseRouterRoute();
    //
    // let dateFrom = new Date().getTime() - 1000 * 60 * 60 * 24 * 28;
    // let dateFromString = new Date(dateFrom).toISOString().split("T")[0];
    //
    // // Fetch admin stats
    // const response = await fetch(baseUrl + "/stats?from=" + dateFromString, {
    //     method: "GET",
    //     headers: peertubeHelpers.getAuthHeader(),
    // });
    // const data = await response.json();
    //
    // // If have error
    // if (!data || !data.status || (data.status && data.status !== "success")) {
    //     peertubeHelpers.notifier.error(data.message || "Unknown error");
    //     rootEl.innerHTML = `<h1>${data.message || "Unknown error"}</h1>`;
    //     return;
    // }
    //
    // rootEl.innerHTML = `
    //     <div class="orion-content">
    //         <h1>${await peertubeHelpers.translate("Instance statistics")}</h1>
    //
    //         <div class="card mt-4">
    //             <div class="row">
    //                 <div class="col-sm-12 col-md-6 col-lg-2">
    //                     <div class="card-body text-center">
    //                         <h5 class="card-title">${await peertubeHelpers.translate("Total Accounts")}</h5>
    //                         <p class="card-text">${data.data.usersCount}</p>
    //                     </div>
    //                 </div>
    //                 <div class="col-sm-12 col-md-6 col-lg-2">
    //                     <div class="card-body text-center">
    //                         <h5 class="card-title">${await peertubeHelpers.translate("Registered this month")}</h5>
    //                         <p class="card-text">${data.data.usersThisMonth}</p>
    //                     </div>
    //                 </div>
    //                 <div class="col-sm-12 col-md-6 col-lg-2">
    //                     <div class="card-body text-center">
    //                         <h5 class="card-title">${await peertubeHelpers.translate("Total Videos")}</h5>
    //                         <p class="card-text">${data.data.videosCount}</p>
    //                     </div>
    //                 </div>
    //                 <div class="col-sm-12 col-md-6 col-lg-2">
    //                     <div class="card-body text-center">
    //                         <h5 class="card-title">${await peertubeHelpers.translate("Uploaded this month")}</h5>
    //                         <p class="card-text">${data.data.videosThisMonth}</p>
    //                     </div>
    //                 </div>
    //                 <div class="col-sm-12 col-md-6 col-lg-2">
    //                     <div class="card-body text-center">
    //                         <h5 class="card-title">${await peertubeHelpers.translate("Open abuses")}</h5>
    //                         <p class="card-text">${data.data.openAbusesCount}</p>
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>
    //
    //         <div class="card mt-4">
    //             <div class="card-body">
    //                 <form method="GET" action="#" id="refresh-stats">
    //                     <div class="row">
    //                         <h5 class="col-sm-12 col-lg-2 card-title">${await peertubeHelpers.translate("Filter")}</h5>
    //                         <div class="col-sm-12 col-md-6 col-lg-2 form-group">
    //                             <label for="dateFrom">${await peertubeHelpers.translate("Date from")}</label>
    //                             <input type="date" class="form-control" id="dateFrom" placeholder="${await peertubeHelpers.translate("Date from")}">
    //                         </div>
    //                         <div class="col-sm-12 col-md-6 col-lg-2 form-group">
    //                             <label for="dateTo">${await peertubeHelpers.translate("Date to")}</label>
    //                             <input type="date" class="form-control" id="dateTo" placeholder="${await peertubeHelpers.translate("Date to")}">
    //                         </div>
    //
    //                         <div class="col-sm-12 col-md-6 col-lg-2 form-group">
    //                             <label for="groupBy">${await peertubeHelpers.translate("Group by")}</label>
    //                             <select class="form-control" id="groupBy">
    //                                 <option value="day">${await peertubeHelpers.translate("Day")}</option>
    //                                 <option value="month">${await peertubeHelpers.translate("Month")}</option>
    //                                 <option value="year">${await peertubeHelpers.translate("Year")}</option>
    //                             </select>
    //                         </div>
    //
    //                         <button type="submit" class="col-sm-12 col-md-6 col-lg-2 btn btn-primary">${await peertubeHelpers.translate("Filter")}</button>
    //                     </div>
    //                 </form>
    //             </div>
    //         </div>
    //     </div>
    //
    //     <div id="chart_div" class="mt-4" style="width: 100%; height: 500px;"></div>
    // `;


    // Insert Google chart javascript to the dom
    // const googleChart = document.createElement("script");
    // googleChart.type = "text/javascript";
    // googleChart.src = "https://www.gstatic.com/charts/loader.js";
    // document.body.appendChild(googleChart);
    //
    // googleChart.onload = () => {
    //     refreshChart(data, null, null, peertubeHelpers);
    //     document.getElementById("refresh-stats").onsubmit = (e) => {
    //         e.preventDefault();
    //         refreshChart(null, {
    //             from: document.getElementById("dateFrom").value,
    //             to: document.getElementById("dateTo").value,
    //             groupBy: document.getElementById("groupBy").value,
    //         }, baseUrl, peertubeHelpers);
    //     };
    // };

}

export type {
    ShowPageOptions
}

export { showLobbyPage };
