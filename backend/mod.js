const selection = require('./selection.js');

exports.jumpToMark = selection.jumpToMark;
exports.incStart = selection.incStart;
exports.incEnd   = selection.incEnd;
exports.decStart = selection.decStart;
exports.decEnd   = selection.decEnd;
exports.setMark  = selection.setMark;

const ffmpeg = require('./ffmpeg.js');

exports.togglePlay = ffmpeg.togglePlay;
exports.exportSelection = ffmpeg.exportSelection;
exports.getAudioLength  = ffmpeg.getAudioLength;
