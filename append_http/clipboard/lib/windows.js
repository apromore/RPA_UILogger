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
const arch = require('arch');

// Binaries from: https://github.com/sindresorhus/win-clipboard
const winBinPath = arch() === 'x64' ?
	path.join(__dirname, '../fallbacks/windows/clipboard_x86_64.exe') :
	path.join(__dirname, '../fallbacks/windows/clipboard_i686.exe');

module.exports = {
	copy: opts => execa(winBinPath, ['--copy'], opts),
	paste: opts => execa.stdout(winBinPath, ['--paste'], opts),
	copySync: opts => execa.sync(winBinPath, ['--copy'], opts),
	pasteSync: opts => execa.sync(winBinPath, ['--paste'], opts)
};
