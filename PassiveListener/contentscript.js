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
    var eventObj = { timeStamp: new Date(Date.now()) };
    var evt = window.event || e;
    eventObj.eventType = "paste";
    var target = buildTarget(evt);
	var regex = /\r|\n|\t/g;
    eventObj.content = evt.clipboardData.getData('text/plain').replace(regex,'');
    eventObj.target = target;
    console.log(eventObj);
    myPort.postMessage(eventObj);
}

function copy(e) {
    var eventObj = { timeStamp: new Date(Date.now()) };
    var evt = window.event || e;
    eventObj.eventType = evt.type;
    var target = buildTarget(evt);
    var copydata = document.getSelection();
    console.log("copypaste: " + copydata);
	var regex = /\r|\n|\t/g;
    eventObj.content = copydata.toString().replace(regex,'');
    eventObj.target = target;
    console.log("eventObj: " + JSON.stringify(eventObj));
    myPort.postMessage(eventObj);
}

function keyPress(e) {
    var eventObj = { timeStamp: new Date(Date.now()) };
    eventObj.eventType = "pressKey";
    eventObj.target = targetNaming(e.target);
    console.log(JSON.stringify(eventObj));
}

// onChange procs every time there an element has finished changed
function onChange(e) {
    var eventObj = { timeStamp: new Date(Date.now()) };
    var evt = window.event || e;
    eventObj.eventType = "editField";
    var target = buildTarget(evt);
    eventObj.target = target;
    console.log("eventObj: " + JSON.stringify(eventObj));
    myPort.postMessage(eventObj);
}

// onInput procs every time there is a change to an element's value (procs for each key stroke)
function onInput(e) {
    var eventObj = { timeStamp: new Date(Date.now()) };
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
    var eventObj = { timeStamp: new Date(Date.now()) };
    var evt = window.event || e;
    eventObj.eventType = "mouseClick";
    var dt1 = getDataT1Class(evt);
    console.log("eventObj: "+JSON.stringify(dt1));
    if (dt1 != null && dt1 != undefined) {
        // specific for student 1 application
        eventObj.target = dt1;
        myPort.postMessage(eventObj);
    } else {
        var target = buildTarget(evt);
        eventObj.target = target;

        if (target.tagName == "INPUT" || target.tagName == "BUTTON" || target.href != null) {
        myPort.postMessage(eventObj); // need to change this to make it generic
        }
    }
    console.log("eventObj: " + JSON.stringify(eventObj));
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
        if (target.class != null && target.class != undefined && target.class != "") {
            targetObj.class = target.class;
        }
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
    console.log("function entered")
    var test = true;
    var target = mye.target;
    var dt1 = {};
    while (test) {
        var dataT1 = {};
        dataT1.ctrl = target.getAttribute("data-t1-control");
        dataT1.class = target.getAttribute("class");
        dataT1.type = target.getAttribute("data-t1-control-type");
        dataT1.id = target.getAttribute("id");
        dataT1.title = target.getAttribute("title");
       // console.log("type" + dataT1.type)

        if (dataT1.ctrl != undefined || dataT1.ctrl != null) {
            //console.log("dataT1 found")
            var dt1ctrl = JSON.parse(dataT1.ctrl);
            dt1.class = dataT1.class;
            test = false;
            if (dt1ctrl.LabelText != undefined ) {
                dt1.innerText = dt1ctrl.LabelText;    
            }
            if (dataT1.title != null && dataT1.title != undefined){
                dt1.name = dataT1.title;
            }
            if (dataT1.type != undefined && dataT1.type != null) {
                if (dataT1.type.toLowerCase() == "checkbox") {
                    //console.log("checkbox found");
                    dataT1.class.includes(" checked") ? dt1.checked = true : dt1.checked = false;
                }
            }
        } else {
            target = target.parentNode;
            //console.log("ptarget" + target)     
            //console.log("parentname: " + target.tagName)
            if (target.tagName == "BODY") {
                test = false;
            }

        }
    }
    //console.log("end cycle" + JSON.stringify(dt1));
    return dt1;
}

