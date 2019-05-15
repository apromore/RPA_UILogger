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
                postRest("Excel", event.changeType, event.address, range.values);
                //console.log("Source of event: " + event.source);
                OfficeHelpers.UI.notify("Change type of event: " + event.changeType + " Address of event: " + event.address + " Value: ");
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
                postRest("Excel", "SelectionChanged", event.address, range.values);
                //console.log("Source of event: " + event.source);
                OfficeHelpers.UI.notify("Change type of event: " + event.changeType + " Address of event: " + event.address + " Value: ");
            });
    }).catch(errorHandle)
}

//generic error handler function
function errorHandle(error) {
    console.log("Error: " + error);
    if (error instanceof OfficeExtension.Error) {
        console.log("Debug info: " + JSON.stringify(error.debugInfo));
        OfficeHelpers.UI.notify("Debug info: " + JSON.stringify(error.debugInfo));
    }
}


