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
    var eventObj = { timeStamp: Date.now() };
    var evt = window.event || e;
    eventObj.eventType = "paste";
    var target = buildTarget(evt);
    eventObj.content = evt.clipboardData.getData('text/plain');
    eventObj.target = target;
    console.log(eventObj);
    myPort.postMessage(eventObj);
}

function copy(e) {
    var eventObj = { timeStamp: Date.now() };
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
    var eventObj = { timeStamp: Date.now() };
    eventObj.eventType = "keypress";
    eventObj.target = targetNaming(e.target);
    console.log(JSON.stringify(eventObj));
}

// onChange procs every tiume there an element has finished changed
function onChange(e) {
    var eventObj = { timeStamp: Date.now() };
    var evt = window.event || e;
    eventObj.eventType = "fieldChange";
    var target = buildTarget(evt);
    eventObj.target = target;
    console.log("eventObj: " + JSON.stringify(eventObj));
    myPort.postMessage(eventObj);
}

// onInput procs every time there is a change to an element's value (procs for each key stroke)
function onInput(e) {
    var eventObj = { timeStamp: Date.now() };
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
    var eventObj = { timeStamp: Date.now() };
    var evt = window.event || e;
    eventObj.eventType = "mouseClick";
    // var dt1 = getDataT1Class(evt);
    // console.log("CLick");
    // if (dt1 != "") {
    //     // specific for student 1 application
    //     console.log("label" + dt1.LabelText)
    // } else {
        var target = buildTarget(evt);
        eventObj.target = target;
        console.log("clicked")
        console.log("eventObj: " + JSON.stringify(eventObj));
        if (target.tagName == "INPUT" || target.tagName == "BUTTON" || target.href != null) {
            myPort.postMessage(eventObj); // need to cahnge this to make it generic
        }
    // }
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
        var username = "";
        if (target.type != null && target.type != undefined && target.type != "") {
            targetObj.type = target.type;
        }
        if (target.name != null && target.name != undefined && target.name != "") {
            targetObj.name = target.name;
            username = target.name.toString();
            username = username.replace(/\s/g, "");
        }
        if (target.value != null && target.value != undefined) {
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
        //Hrefs
        if (target.href != null && target.href != undefined && target.href != "") {
            targetObj.href = target.href;
        } else {
            var href = getParentLink(target);
            if (href != "") { // get the ultimate parent href if exists
                targetObj.href = href;
            }
        }
        // this section might be site specific, needs further testing
        if (target.innerText != null && target.innerText != undefined && target.innerText != "")
            targetObj.innerText = target.innerText;
    }
    if (target.option != null && target.option != undefined && target.option != "") {
        targetObj.option = target.option;
    }
    //console.log("targetObj: "+JSON.stringify(targetObj));
    return targetObj;
}

function getParentLink(target) {
    var href = "";
    var test = true;
    while (test) {
        target = target.parentNode;
        //console.log("parent: " + target.tagName)
        if (target.href != null && target.href != undefined && target.href != "") {
            href = target.href;
            test = false;
        }
        if (target.tagName == "BODY") {
            test = false;
            //console.log("reached body" +target.id)
        }
    }
    return href
}

function getDataT1Class(mye) {
    var test = true;
    var target=mye.target;
    var dt1 = "";
    while (test) {
        var dataT1Ctrl = target.getAttribute("data-t1-control");
        if (dataT1Ctrl != null && dataT1Ctrl != undefined) {
            dt1 = dataT1Ctrl;
            test = false;
            console.log("dt1 found!")
        }
        else {
            target = target.parentNode
            if (target.tagName == "BODY") {
                test = false;
            }

        }
    }
    console.log(dt1);
    return dt1;
}