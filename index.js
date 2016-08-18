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
var util = require('util');
var colors = require('colors');

/**
 * create logger instance with the specified name.
 * the return logger instance contains 2 logger streams:
 * - console
 * - file
 * @param name used for the logger file name
 * @param options this is optional and support the following
 *        options:
 *        - fileLevel: specify the log level of logger file, default is INFO
 *        - filename: specify the log file name, default is <name>.log
 *        - consoleLevel: specify the log level of console, default is INFO
 */
exports.createLogger = function(name, options) {
  options = options || {};
  var dir = path.resolve(os.homedir(), '.humix');

  try {
    var stats = fs.statSync(dir);
    if (!stats.isDirectory()) {
      console.error('unable to create .humix in home directory:',
          '.humix already exists');
      return;
    }
  } catch (e) {
    try {
      fs.mkdirSync(dir);
    } catch (e) {
      console.error('unable to create .humix in home directory:', e);
      return;
    }
  }
  var filename = options.filename || (name + '.log');
  var logger = bunyan.createLogger({
    name: name,
    streams: [
      {
        level: options.consoleLevel || 'info',
        stream: consoleStream
      },
      {
        level: options.fileLevel || 'info',
        path: path.resolve(dir, filename)
      }
    ]
  });
  return logger;
};

exports.createConsoleLogger = function(name) {
  var logger = bunyan.createLogger({
    name: name,
    streams: [
      {
        level: options.consoleLevel || 'info',
        stream: consoleStream
      }
    ]
  });
  return logger;
}

var levelIndex = {
  60: 'FATAL',
  50: 'ERROR',
  40: ' WARN',
  30: ' INFO',
  20: 'DEBUG',
  10: 'TRACE'
};

var colorIndex = {
  60: colors.red,
  50: colors.red,
  40: colors.yellow,
  30: colors.cyan,
  20: colors.green,
  10: colors.gray
};

var consoleStream = {
  write: writeToStdOut
};

function writeToStdOut(data) {
  var obj = JSON.parse(data);
  var name = obj.name;
  if (obj.loc) {
    name = name+'/'+obj.loc;
  }
  var msg = util.format('%s [%s] %s: %s', obj.time,
    colorIndex[obj.level](levelIndex[obj.level]), name, obj.msg);
  console.log(msg);
}
