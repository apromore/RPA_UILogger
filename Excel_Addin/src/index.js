/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

import * as OfficeHelpers from '@microsoft/office-js-helpers';

//import * as events from './eventHandlers';

// The initialize function must be run each time a new page is loaded
Office.initialize = (reason) => {
    if (!Office.context.requirements.isSetSupported('ExcelApi', '1.7')) {
        console.log("Sorry, this add-in only works with newer versions of Excel.");
    }
    $('#sideload-msg').hide();
    $('#app-body').show();

    $(document).ready(() => {
        switch (reason) {
            case 'inserted': console.log('The add-in was just inserted.');
            case 'documentOpened': console.log('The add-in is already part of the document.');
        }
        OfficeHelpers.UI.notify(`The document was loaded`);
        $('#run').click(changeColor);


        // Event Listeners   --- move to other page?
        Excel.run(function (context) {
            var worksheet = context.workbook.worksheets.getActiveWorksheet();
            
            worksheet.onChanged.add(handleChange);
            worksheet.onSelectionChanged.add(handleSelectionChange);
            // var Wb_name = context.workbook.load('name');
            // console.log(Object.keys(Wb_name));
            // console.log(Wb_name);

            // setTimeout(function(){
            //     console.log(Wb_name._N);
            // },1000 );

            context.workbook.worksheets.onActivated.add(({ worksheetId}) => {
                Excel.run(function (context) {
                worksheet = context.workbook.worksheets.getActiveWorksheet();
                console.log(worksheetId);
                worksheet.onChanged.add(handleChange);
                worksheet.onSelectionChanged.add(handleSelectionChange);  
                //OfficeHelpers.UI.notify("Selected worksheet" + worksheetId);
                return context.sync()
                .then(function () {
                    console.log("Sheet changed.");
                    // OfficeHelpers.UI.notify("Event Handlers Registered");
                });
                }).catch(errorHandle);
            })
            return context.sync()
                .then(function () {
                    console.log("Event handler successfully registered for onChanged event in the worksheet.");
                    console.log("Event handler successfully registered for onSelectionChanged event in the worksheet.");
                    // OfficeHelpers.UI.notify("Event Handlers Registered");
                });
        
            }).catch(errorHandle);
    });
};




//change colour function
async function changeColor() {
    try {
        await Excel.run(async context => {
            /**
             * Insert your Excel code here
             */
            var workbook_name = context.workbook.load('name');
            const range = context.workbook.getSelectedRange();

            // Read the range address
            range.load('address');
            range.load('values');
            // Update the fill color
            range.format.fill.color = 'yellow';

            await context.sync();
            //console.log(`LOG: The range address was ${range.address}.`);
            //OfficeHelpers.UI.notify(`The range address was ${range.address} and value was ${range.values}.`);
            //OfficeHelpers.UI.notify(`Excel,ColorChange: ${range.address}, ${range.values}`);
            
            var req = {targetApp:"Excel", eventType:"ColorChange",target:{workbookName: workbook_name._N ,sheetName: name.name, id: range.address, value:range.values}};
            console.log(req);
            postRest(req);
            
        });
    } catch (error) {
        OfficeHelpers.UI.notify(error);
        OfficeHelpers.Utilities.log(error);
    };

}


// Event Handlers
function handleChange(event) {
    return Excel.run(function (context) {
        var range = context.workbook.worksheets.getActiveWorksheet().getRange(event.address);
        var name = context.workbook.worksheets.getActiveWorksheet();
        var workbook_name = context.workbook.load('name');
        name.load("name");
        range.load(['address', 'values', 'name']);
        var timeStamp = new Date(Date.now());
        return context.sync()
            .then(function () {
                console.log("Change type of event: " + event.changeType);
                console.log("Address of event: " + event.address);
                console.log("Content of range: " + range.values);
                var tmp = range.values;
                if (!event.address.includes(":")) {
                    var eventType = "editCell";
					var eventObj = { timeStamp: timeStamp, targetApp: "Excel", eventType: eventType, target: { workbookName: workbook_name._N ,sheetName: name.name, id: event.address, value: tmp[0].toString() } };
					// postRest(eventObj);
                } else {
                    var eventType = "editRange";
                }
                // console.log("name is: " + name.name);
                var eventObj = { timeStamp: timeStamp, targetApp: "Excel", eventType: eventType, target: { workbookName: workbook_name._N, sheetName: name.name, id: event.address, value: range.values } }
                postRest(eventObj);
                
                // console.log(eventObj);
                OfficeHelpers.UI.notify("Change type of event: " + event.changeType + " Address of event: " + event.address + " Value: " + range.values);
            });
    }).catch(errorHandle)
}

function handleSelectionChange(event) {
    return Excel.run(function (context) {
        var range = context.workbook.worksheets.getActiveWorksheet().getRange(event.address);
        var name = context.workbook.worksheets.getActiveWorksheet();
        var workbook_name = context.workbook.load('name');
        name.load("name");
        range.load(['address', 'values']);
        var timeStamp = new Date(Date.now());
        return context.sync()
            .then(function () {
                console.log("Workbook name: " + workbook_name._N);
                console.log("Change type of event: Selection Changed");
                console.log("Address of event: " + event.address);
                console.log("Content of range: " + range.values);
                var tmp = range.values;
				if (!event.address.includes(":")) {
                    var eventType = "getCell";
					var eventObj = { timeStamp: timeStamp, targetApp: "Excel", eventType: eventType, target: { workbookName: workbook_name._N ,sheetName: name.name, id: event.address, value: tmp[0].toString() } };
					// postRest(eventObj);
                } else {
                    var eventType = "getRange";
					var eventObj = { timeStamp: timeStamp, targetApp: "Excel", eventType: eventType, target: { workbookName: workbook_name._N ,sheetName: name.name, id: event.address, value: tmp } };
					// postRest(eventObj);
                }
                var eventObj = { timeStamp: timeStamp, targetApp: "Excel", eventType: eventType, target: { workbookName: workbook_name._N ,sheetName: name.name, id: event.address, value: range.values } };
                postRest(eventObj);
                // }
                //console.log("Source of event: " + event.source);
                // OfficeHelpers.UI.notify("Selection Change type of event: " + event.changeType + " Address of event: " + event.address + " Value: " +range.values);
                OfficeHelpers.UI.notify("obj: " + JSON.stringify(eventObj))
            });
    }).catch(errorHandle)
}

function postRest(req) {
    if ($('#onoff').prop('checked')) {
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
    } else { console.log("Recording Disabled") }
}

function errorHandle(error) {
    console.log("An error has occured" + error)
    OfficeHelpers.UI.notify("An error has occurred")
}
/////

