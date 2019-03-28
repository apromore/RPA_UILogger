// triggers every time a new page is activated.
chrome.tabs.onActivated.addListener(function () { printUrl("tab_activated") });

//chrome.webNavigation.onBeforeNavigate.addListener(logOnBefore);
// very spammy!

// chrome.windows.onFocusChanged.addListener(function () { printUrl("focus_window_changed") });
chrome.webNavigation.onCommitted.addListener(navigation);
chrome.tabs.onRemoved.addListener(function () { printUrl("tab_closed") });

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
            if(message != "tab_closed") {
                var activetab = tabs[0].url;
                if (activetab.includes("newtab")) {
                    var req = { timeStamp: new Date(Date.now()), targetApp: "Chrome", eventType: "new_tab_created", url: activetab };
                } else {
                    var req = { timeStamp: new Date(Date.now()), targetApp: "Chrome", eventType: message, url: activetab };
                }
                //alert(req);
                console.log(req);
                postRest(req);
            } else {
                var activetab = tabs[0].url;
                var req = { timeStamp: new Date(Date.now()), targetApp: "Chrome", eventType: message, url: activetab };
                console.log(req);
                postRest(req);
            }
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
        if(req.eventType == "typed" || req.eventType == "auto_bookmark") {
            req.eventType = "navigate_to";
        }


        if(!req.url.includes("newtab")) {
            console.log(req);
            postRest(req);
        }

    }
}


// function logOnBefore(details) {
//     var req = { timeStamp: new Date(Date.now()), eventType: "navigate_to", url: details.url };
//     //alert(req);
//     console.log(req);
//     postRest(req);
// }