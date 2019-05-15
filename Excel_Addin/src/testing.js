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
 
 // failed clipboard monitor
// const clipboardy = require('clipboardy');
// const clipMonit = require('clipboard-monitor');
 
// //initialize & optionally set the interval with which to monitor the clipboard
// var monitor = clipMonit(); // deaults to 500ms
// var initialize = false; 

// //'copy. event is fired every time data is copied to the clipboard
// monitor.on('copy', function (data) {
//     if (initialize == true ) {
//     //do something with the data
//     console.log("Copy event: "+data);
// } else { initialize = true;}
// });




// // Attempt at Copy/paste loader
// var copyElement = document.createElement('input');      
// copyElement.setAttribute('type', 'text');   
// copyElement.setAttribute('value',' ' );  
// document.body.appendChild(copyElement);   

// // Add copy button
// var btn = document.createElement("button");
// btn.textContent = "copy";
// document.body.appendChild(btn)
// btn.addEventListener('click', function(event) {
//   var copyText = document.querySelector('input');
//   copyText.select();
//     document.execCommand('copy');
// });



// Office.context.document.getSelectedDataAsync(Office.CoercionType.Text, function (asyncResult) {
//     if (asyncResult.status == Office.AsyncResultStatus.Failed) {
//         write('Action failed. Error: ' + asyncResult.error.message);
//     }
//     else {
//         write('Selected data: ' + asyncResult.value);
//     }
// });


// // Function that writes to a div with id='message' on the page.
// function write(message){
//     OfficeHelpers.UI.notify(`The selected data is `+message);
//     //document.getElementById('message').innerText += message; 
// }




////

// var clipboard = new ClipboardJS('.btn');
// clipboard.on('success', function (e) {
//     OfficeHelpers.UI.notify("Cliboard Success " + e);
//     console.log(e);
// });
// clipboard.on('error', function (e) {
//     console.log(e);
// });

// function listenClipboard() {
//     var new_clip = getClipboard();
//     if (new_clip !== clipboard) {
//         clipboard = new_clip;
//         //handleClipboardChange(clipboard);
//         console.log("The Clipboard has changed!")
//     }
//     setTimeout(listenClipboard, 100);
// }