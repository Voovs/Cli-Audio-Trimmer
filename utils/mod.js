// Re-exports entire utils module
const time = require('./time_format.js');
const keys = require('./key_format.js');
const strs = require('./string_format.js');

exports.formatMilli    = time.formatMilli;
exports.unformatMilli  = time.unformatMilli;
exports.secondsToMilli = time.secondsToMilli;
exports.formatSeconds  = time.formatSeconds;

exports.formatKey        = keys.formatKey;
exports.formatDisplayKey = keys.formatDisplayKey;
exports.displayKey       = keys.displayKey;
exports.unformatKey      = keys.unformatKey;
exports.keyStrID         = keys.keyStrID;

exports.centerStr        = strs.centerStr;
exports.alignStrLeft     = strs.alignStrLeft;
exports.alignStrRight    = strs.alignStrRight;
exports.truncateStrRight = strs.truncateStrRight;
exports.truncateStrLeft  = strs.truncateStrLeft;
exports.fitString        = strs.fitString;
exports.textBlock        = strs.textBlock;
exports.revStr           = strs.revStr;
exports.tildeHome        = strs.tildeHome;
