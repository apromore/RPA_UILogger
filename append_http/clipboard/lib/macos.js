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

const env = Object.assign({}, process.env, {LC_CTYPE: 'UTF-8'});

module.exports = {
	copy: opts => execa('pbcopy', Object.assign({}, opts, {env})),
	paste: opts => execa.stdout('pbpaste', Object.assign({}, opts, {env})),
	copySync: opts => execa.sync('pbcopy', Object.assign({}, opts, {env})),
	pasteSync: opts => execa.sync('pbpaste', Object.assign({}, opts, {env}))
};
