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
'use strict;'


const clipboardy = require('./clipboardy.js'),
    events = require('events'),
    eventEmitter = new events.EventEmitter();

//watch board
var content, stop = false;

function watch(interval) {

    //start the watcher...
    readClip(interval);

    return Object.assign(eventEmitter, {
        end: function () {
            stop = true;
        }
    });
}

function readClip(interval) {
    var self = this;

    self.interval = self.interval || (Number(interval) || 500);
    var abc=true;
    clipboardy.read()
        .then(function (data) {
            //console.log(data)
            //emit copy event if clipboard content changes
            if (data !== content) {
                eventEmitter.emit('copy', data);
                content = data;
            }

            var timeout = setTimeout(function () {
                //clear timeout
                clearTimeout(timeout);  
                
                if(!stop){
                    //recall self
                    process.nextTick(readClip);
                }
               

            }, self.interval);

        })
        .catch(function (err) {
            throw err;
        });

}

//exports
module.exports = watch;