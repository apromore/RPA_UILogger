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
'use strict';
const execa = require('execa');

const handler = err => {
	if (err.code === 'ENOENT') {
		throw new Error('Couldn\'t find the termux-api scripts. You can install them with: apt install termux-api');
	}

	throw err;
};

module.exports = {
	copy: opts => execa('termux-clipboard-set', opts).catch(handler),
	paste: opts => execa.stdout('termux-clipboard-get', opts).catch(handler),
	copySync: opts => {
		try {
			return execa.sync('termux-clipboard-set', opts);
		} catch (err) {
			handler(err);
		}
	},
	pasteSync: opts => {
		try {
			return execa.sync('termux-clipboard-get', opts);
		} catch (err) {
			handler(err);
		}
	}
};
