// Re-exports entire utils module
const time = require('./time_format.js');
const keys = require('./key_format.js');
const strs = require('./string_format.js');

exports.formatMilli   = time.formatMilli;
exports.unformatMilli = time.unformatMilli;

exports.formatKey =        keys.formatKey;
exports.formatDisplayKey = keys.formatDisplayKey;
exports.unformatKey =      keys.unformatKey;
exports.keyStrID =         keys.keyStrID;

exports.centerStr = strs.centerStr;
