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
 
 'use strict';
const termux = require('./lib/termux.js');
const linux = require('./lib/linux.js');
const macos = require('./lib/macos.js');
const windows = require('./lib/windows.js');

function platform() {
	switch (process.platform) {
		case 'darwin':
			return macos;
		case 'win32':
			return windows;
		case 'android':
			if (process.env.PREFIX !== '/data/data/com.termux/files/usr') {
				throw new Error('You need to install Termux for this module to work on Android: https://termux.com');
			}
			return termux;
		default:
			return linux;
	}
}

exports.write = input => {
	if (typeof input !== 'string') {
		return Promise.reject(new TypeError(`Expected a string, got ${typeof input}`));
	}

	return platform().copy({ input }).then(() => { });
};

exports.read = () => platform().paste({ stripEof: false }).catch( function(e){ return "Invalid Content"});

exports.writeSync = input => {
	if (typeof input !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof input}`);
	}

	platform().copySync({ input });
};

exports.readSync = () => platform().pasteSync({ stripEof: false }).stdout;
