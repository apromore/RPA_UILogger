/*-
 * Copyright (C) 2019 - 2020 Apromore Pty Ltd.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Lesser Public License for more details.
 *
 * You should have received a copy of the GNU General Lesser Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/lgpl-3.0.html>.
 */
var regex = /apromore/;
// popup message when apromore is found
if (regex.test(document.body.innerText)) {
    chrome.runtime.sendMessage("my request message", function (response_str) { alert(response_str) });
}
















// // // Mouse Over Event
// // function moveMouse(e) {
// //     var eventObj = {};

// //     var evt = window.event || e;
// //     eventObj.eventType=evt.type;
    
// //     if (evt.type == "mouseover") { //for onmouseover event
// //         var element = evt.fromElement || evt.relatedTarget;
// //     }
// //     else { //for onmouseout event
// //         var element = evt.toElement || evt.relatedTarget;
// //     }

// //     eventObj.element.name=element.id;
// //     eventObj.element.tagName=element.tagName;

// //     if (fromElement.id != null || fromElement.id != undefined) {
// //         var message = "current id: " + element.id;
// //     }
// //     else {
// //         var message = "current tag: " + element.tagName;
// //     }

// //     if (element.tagName != "BODY" || element.tagName != HTML) {
// //        // console.log("content :" + fromElement.innerText);
// //        //chrome.runtime.sendMessage(eventObj);
// //     }
// // }

// function buildTarget(target){
//     targetObj = {}
//     if (target.id != null || target.id != undefined) {
//         targetObj.id = target.id;    
//     }
//     if (target.tagName !=null || target.tagName !=undefined){
//         var tagName = target.tagName;
//         targetObj.tagName = tagName;

//        // if (tagName == "input"){
//             if (target.type !=null || target.type !=undefined){
//                 targetObj.type = target.type;
//             }
//             if (target.name !=null || target.name !=undefined){
//                 targetObj.name = target.name;
//             }
//             if (target.value !=null || target.value !=undefined){
//                 targetObj.value = target.value;
//             }
//             if (target.checked !=null || target.checked !=undefined){
//                 targetObj.checked = target.checked;
//             }
//        // }
//         if (tagName == "button"){
//             targetObj.innerText = target.innerText;
//         }  
//         if (target.option !=null || target.option !=undefined){
//             targetObj.option = target.option;
//         }
//     }
//     return targetObj;
// }