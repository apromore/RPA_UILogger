// communicate with background script via runtime.Port object using runtime.connect API.
var myPort = chrome.runtime.connect({ name: "port-from-cs" });



//list of event listeners

//copy/paste
document.body.oncopy = document.body.oncut = copy;
document.body.onpaste = paste;

// Mouse Events
document.body.onclick = mouseClick;
// Not in use
// document.body.onmouseover = moveMouse; 
// document.body.onmouseout= moveMouse;

//missing:
// highlight Text - doubleclick / click & drag
// dropdown selection

// Keyboard inputs
//document.body.onkeypress = keyPress;

//document.body.oninput = onInput; // works on every incremental change
document.body.onchange = onChange; // works at the end of change

// same as onclick but for keyboard tabbing
//document.body.onfocus = onSelect;


function paste(e) {
    var eventObj = {timeStamp:Date.now()};
    var evt = window.event || e;
    eventObj.eventType = "paste";
    var target = buildTarget(evt);
    eventObj.content = evt.clipboardData.getData('text/plain');
    eventObj.target = target;
    console.log(eventObj);
    myPort.postMessage(eventObj);
}

function copy(e) {
    var eventObj = {timeStamp:Date.now()};
    var evt = window.event || e;
    eventObj.eventType = evt.type;
    var target = buildTarget(evt);
    var copydata = document.getSelection();
    console.log("copypaste: " + copydata);
    eventObj.content = copydata.toString();
    eventObj.target = target;
    console.log("eventObj: " + JSON.stringify(eventObj));
    myPort.postMessage(eventObj);
}

function keyPress(e) {
    var eventObj = {timeStamp:Date.now()};
    eventObj.eventType = "keypress";
    eventObj.target = targetNaming(e.target);
    console.log(JSON.stringify(eventObj));
}

// onChange procs every tiume there an element has finished changed
function onChange(e) {
    var eventObj = {timeStamp:Date.now()};
    var evt = window.event || e;
    eventObj.eventType = "fieldChange";
    var target = buildTarget(evt);
    eventObj.target = target;
    console.log("eventObj: " + JSON.stringify(eventObj));
    myPort.postMessage(eventObj);
}

// onInput procs every time there is a change to an element's value (procs for each key stroke)
function onInput(e) {
    var eventObj = {timeStamp:Date.now()};
    var evt = window.event || e;
    eventObj.eventType = "fieldInput";
    var target = buildTarget(evt);
    eventObj.target = target;
    console.log("eventObj: " + JSON.stringify(eventObj));
    myPort.postMessage(eventObj);
}

function onSelect(e) {
    // var eventObj = {timeStamp:Date.now()};
    // var evt = window.event || e;
    // eventObj.eventType="Selection";
    // var target = buildTarget(evt);
    // eventObj.target = target;
    // console.log("eventObj: "+JSON.stringify(eventObj));
    console.log("onSelectFired");
}


function mouseClick(e) {
    //alert('test');
    var eventObj = {timeStamp:Date.now()};
    var evt = window.event || e;
    //eventObj.timeStamp = Date.now(); // confirm if here or on xes builder
    eventObj.eventType = "mouseClick";

    var target = buildTarget(evt);
    eventObj.target = target;
    console.log("eventObj: " + JSON.stringify(eventObj));
    myPort.postMessage(eventObj);

}


// build the target object
function buildTarget(mye) {
    var target = mye.target;
    var targetObj = {};
    if (target.id != null && target.id != undefined && target.id != "") {
        targetObj.id = target.id;
    }
    if (target.tagName != null && target.tagName != undefined && target.tagName != "") {
        var tagName = target.tagName;
        targetObj.tagName = tagName;

        //if (tagName == "INPUT" || tagName == "SELECT") {
            if (target.type != null && target.type != undefined && target.type != "") {
                targetObj.type = target.type;
            }
            if (target.name != null && target.name != undefined && target.name != "") {
                targetObj.name = target.name;
            }
            if (target.value != null && target.value != undefined) {
                var username= target.name.toString();
                username = username.replace(/\s/g, "");
                console.log(username);
                // do not store passwords
                if (target.type.toLowerCase() == "password") {
                    targetObj.value = "User Password";
                }
                //do not store user names
                else if (username.toLowerCase() == "username" || username.toLowerCase() == "user") {
                    targetObj.value = "UserName"
                }
                else {
                    targetObj.value = target.value;
                }
            }
            if (target.type == "checkbox" || target.type == "radio") {
                if (target.checked != null && target.checked != undefined) {
                    targetObj.checked = target.checked;
                }
            }

       // }
        if (tagName == "BUTTON" || tagName == "A") {
            targetObj.innerText = target.innerText;
        }
        if (target.href != null && target.href != undefined && target.href != "") {
            targetObj.href;
        }
        if (target.option != null && target.option != undefined && target.option != "") {
            targetObj.option = target.option;
        }
        if (tagName == "A") {
            targetObj.innerText = target.innerText;
            targetObj.link = target.href;
        }
    }

    //console.log("targetObj: "+JSON.stringify(targetObj));
    return targetObj;
}