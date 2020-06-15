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
const path = require('path');
const execa = require('execa');

const handler = err => {
	if (err.code === 'ENOENT') {
		throw new Error('Couldn\'t find the required `xsel` binary. On Debian/Ubuntu you can install it with: sudo apt install xsel');
	}

	throw err;
};

const xsel = path.join(__dirname, '../fallbacks/linux/xsel');

module.exports = {
	copy: opts => {
		return execa(xsel, ['--clipboard', '--input'], opts)
			.catch(() => execa('xsel', ['--clipboard', '--input'], opts))
			.catch(handler);
	},
	paste: opts => {
		return execa.stdout(xsel, ['--clipboard', '--output'], opts)
			.catch(() => execa.stdout('xsel', ['--clipboard', '--output'], opts))
			.catch(handler);
	},
	copySync: opts => {
		try {
			return execa.sync(xsel, ['--clipboard', '--input'], opts);
		} catch (err) {
			try {
				return execa.sync('xsel', ['--clipboard', '--input'], opts);
			} catch (err) {
				handler(err);
			}
		}
	},
	pasteSync: opts => {
		try {
			return execa.sync(xsel, ['--clipboard', '--output'], opts);
		} catch (err) {
			try {
				return execa.sync('xsel', ['--clipboard', '--output'], opts);
			} catch (err) {
				handler(err);
			}
		}
	}
};
