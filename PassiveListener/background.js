/*
 * Copyright © 2019 The University of Melbourne.
 *
 * This file is part of "Apromore".
 *
 * "Apromore" is free software; you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 3 of the
 * License, or (at your option) any later version.
 *
 * "Apromore" is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty
 * of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this program.
 * If not, see <http://www.gnu.org/licenses/lgpl-3.0.html>.
 */
 
 // triggers every time a new page is activated.
chrome.tabs.onActivated.addListener(function () { printUrl("tab activated") });

//chrome.webNavigation.onBeforeNavigate.addListener(logOnBefore);
// very spammy!

chrome.windows.onFocusChanged.addListener(function () { printUrl("focus window changed") });
chrome.webNavigation.onCommitted.addListener(navigation);
chrome.tabs.onRemoved.addListener(function () { printUrl("tab closed") });

//connect runtime
var portFromCS;
chrome.runtime.onConnect.addListener(connected);

function connected(p) {
    portFromCS = p;
    //portFromCS.postMessage({greeting: "hi there content script!"});
    portFromCS.onMessage.addListener(function (m) {
        console.log(m);
        m.targetApp = "Chrome";
        postRest(m);
    });
}

function printUrl(message) {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
        try {
            var activetab = tabs[0].url;
            if (activetab.includes("newtab")) {
                var req = { timeStamp: new Date(Date.now()), targetApp: "Chrome", eventType: "new tab created", url: activetab };
            } else {
                var req = { timeStamp: new Date(Date.now()), targetApp: "Chrome", eventType: message, url: activetab };
            }
            //alert(req);
            console.log(req);
            postRest(req);
        }
        catch (err) {
            console.log("Platform not supported");
        }
    });
}

function postRest(req) {
    var storage = (localStorage.getItem('checkboxValue') || {}) == 'true';
    if (storage === true) {
        console.log("Recording Enabled")
        $.ajax({
            type: "POST",
            url: "http://127.0.0.1:8080",
            crossDomain: true,
            contentType: 'application/json',
            data: JSON.stringify(req),
            success: function (responseData, status, xhr) {
                console.log("Request Successful!" + responseData);
            },
            error: function (request, status, error) {
                console.log("Request Failed! " + JSON.stringify(request) + 'Status ' + status + "Error msg: " + error);
            }
        });
    } else {
        console.log("Recording Disabled");
    }
}

/*
function navigation(evt){
    var req = { timeStamp: Date.now(), eventType: evt.transitionType, eventQual:JSON.stringify(evt.transitionQualifiers),url: evt.url };
    if (evt.transitionType != "auto_subframe") {
        console.log(req);
        postRest(req);
    }
}
*/

function navigation(evt) {
    var req = { timeStamp: new Date(Date.now()), targetApp: "Chrome", eventType: evt.transitionType, eventQual: JSON.stringify(evt.transitionQualifiers), url: evt.url };
    if (evt.transitionType != "auto_subframe") {
        console.log(req);
        postRest(req);
    }
}


function logOnBefore(details) {
    var req = { timeStamp: new Date(Date.now()), eventType: "navigateTo", url: details.url };
    //alert(req);
    console.log(req);
    postRest(req);
}