
// triggers every time a new page is activated.
chrome.tabs.onActivated.addListener(function () { printUrl("activated") });
chrome.windows.onFocusChanged.addListener(function () { printUrl("focus changed") });

//connect runtime
var portFromCS;
chrome.runtime.onConnect.addListener(connected);

function connected(p) {
    portFromCS = p;
    //portFromCS.postMessage({greeting: "hi there content script!"});
    portFromCS.onMessage.addListener(function (m) {
        //m.timeStamp = Date.now(); moved to event capture
        console.log(m);
        postRest(m);
    });
}

// chrome.windows.on
// function toggle() {
//     document.getElementById("onoff").checked = true;
//     // var togglevar = true;
//     // return togglevar
// }


// chrome.browserAction.onClicked.addListener(function(tab) {
//  alert("you clicked");
// });

function sender() {
    console.log(sender.tab ?
        "from a content script:" + sender.tab.url :
        "from the extension");
    if (request.greeting == "hello")
        sendResponse({ farewell: "goodbye" });
};

function printUrl(message) {
    chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
        var activetab = tabs[0].url;
        var req = { timeStamp: Date.now(), eventType: message, url: activetab };
        //alert(req);
        console.log(req);
        postRest(req);
    });
}


// function onMessage(request, sender, sendResponse) {
//     alert(request);
//     chrome.pageAction.show(sender.tab.id);
//     sendResponse('String was Found!' + sender.tab.url );
// }



function postRest(req) {
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8080",
        // url: "https://httpslogger-yili-handy-apps.apps.dev.ldcloud.com.au",
        crossDomain: true,
        contentType: 'application/json',
        data: JSON.stringify(req),
        //data : '{"a": "Come",            "b": "from",            "c": "Excel"        }',
        //dataType: 'json',
        success: function (responseData, status, xhr) {
            console.log("Request Successful!" + responseData);
            //OfficeHelpers.UI.notify("Request Successful!" + responseData);
        },
        error: function (request, status, error) {
            console.log("Request Failed! " + JSON.stringify(request) + 'Status ' + status + "Error msg: " + error);
            //OfficeHelpers.UI.notify("Request Failed! " + JSON.stringify(request) + 'Status ' + status + "Error msg: " + error);
        }
    });
}