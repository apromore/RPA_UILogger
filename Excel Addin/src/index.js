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
        // Event Listeners
        Excel.run(function (context) {
            var toggle = $('#onoff').prop('checked');
            var worksheet = context.workbook.worksheets.getActiveWorksheet();
            worksheet.onChanged.add(handleChange);
            worksheet.onSelectionChanged.add(handleSelectionChange);

            return context.sync()
                .then(function () {
                    console.log("Event handler successfully registered for onChanged event in the worksheet.");
                    console.log("Event handler successfully registered for onSelectionChanged event in the worksheet.");
                    OfficeHelpers.UI.notify("Event Handlers Registered");
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
            const range = context.workbook.getSelectedRange();

            // Read the range address
            range.load('address');
            range.load('values');
            // Update the fill color
            range.format.fill.color = 'yellow';

            await context.sync();
            console.log(`LOG: The range address was ${range.address}.`);
            //OfficeHelpers.UI.notify(`The range address was ${range.address} and value was ${range.values}.`);
            //OfficeHelpers.UI.notify(`Excel,ColorChange: ${range.address}, ${range.values}`);
            if ($('#onoff').prop('checked')) {
                postRest("Excel", "ColorChange", range.address, range.values);
            }

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
        range.load(['address', 'values']);
        return context.sync()
            .then(function () {
                //var timestamp = Date.now();
                console.log("Change type of event: " + event.changeType);
                console.log("Address of event: " + event.address);
                console.log("Content of range: " + range.values);
                //console.log("Timestamp " = timestamp);
                if ($('#onoff').prop('checked')) {
                    postRest("Excel", event.changeType, event.address, range.values);
                }
                //console.log("Source of event: " + event.source);
                OfficeHelpers.UI.notify("Change type of event: " + event.changeType + " Address of event: " + event.address + " Value: " + range.values);
            });
    }).catch(errorHandle)
}

function handleSelectionChange(event) {
    return Excel.run(function (context) {
        var range = context.workbook.worksheets.getActiveWorksheet().getRange(event.address);
        range.load(['address', 'values']);
        return context.sync()
            .then(function () {
                console.log("Change type of event: Selection Changed");
                console.log("Address of event: " + event.address);
                console.log("Content of range: " + range.values);
                if ($('#onoff').prop('checked')) {
                    postRest("Excel", event.changeType, event.address, range.values);
                }
                //console.log("Source of event: " + event.source);
                //OfficeHelpers.UI.notify("Selection Change type of event: " + event.changeType + " Address of event: " + event.address + " Value: " +range.values);
            });
    }).catch(errorHandle)
}

function postRest(source, type, address, values) {
    //OfficeHelpers.UI.notify("postRest reached");
    var obj = { a: source, b: type, c: address, d: values };

    //OfficeHelpers.UI.notify(JSON.stringify(obj));
    $.ajax({
        type: "POST",
        url: "http://127.0.0.1:8080",
        // url: "https://httpslogger-yili-handy-apps.apps.dev.ldcloud.com.au",
        crossDomain: true,
        contentType: 'application/json',
        data: JSON.stringify(obj),
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

function errorHandle() {
    console.log("An error has occured")
    OfficeHelpers.UI.notify("An error has occurred")
}
/////

