/*******************************************************************************
* Copyright (c) 2016 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* 
* Node module: humix-logger
*******************************************************************************/
'use strict';

var bunyan = require('bunyan');
var path = require('path');
var fs = require('fs');
var os = require('os');

/**
 * create logger instance with the specified name.
 * the return logger instance contains 2 logger streams:
 * - console
 * - file
 * @param name used for the logger file name
 * @param options this is optional and support the following
 *        options:
 *        - fileLevel: specify the log level of logger file
 *        - consoleLevel: specify the log level of console
 */
exports.createLogger = function(name, options) {
  options = options || {};
  var dir = path.resolve(os.homedir(), '.humix');
  var stats = fs.statSync(dir);
  if (!stats.isDirectory()) {
    try {
      fs.mkdirSync(dir);
    } catch (e) {
      console.error('unable to create .humix in home directory:', e);
      return;
    }
  }
  var logger = bunyan.createLogger({
    name: name,
    streams: [
      {
        level: options.consoleLevel || 'info',
        stream: process.stdout
      },
      {
        level: options.fileLevel || 'info',
        path: path.resolve(dir, name + '.log')
      }
    ]
  });
  return logger;
};