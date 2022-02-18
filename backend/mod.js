const selection = require('./selection.js');

exports.jumpToMark = selection.jumpToMark;
exports.incStart = selection.incStart;
exports.incEnd   = selection.incEnd;
exports.decStart = selection.decStart;
exports.decEnd   = selection.decEnd;
exports.setMark  = selection.setMark;

const ffmpeg = require('./ffmpeg.js');

exports.togglePlay = ffmpeg.togglePlay;
exports.exportSelection = exportSelection;
exports.getAudioLength  = ffmpeg.getAudioLength;

function exportSelection() {
    const interface = require.main.require('./interface/mod.js');

    global.runtime.display_mode.editor = false;
    global.runtime.display_mode.save_prompt = true;

    const restore_editor = () => {
        global.runtime.display_mode.save_prompt = false;
        global.runtime.display_mode.editor = true;
    };

    interface.savePrompt((given_path) => {
        const fs = require('fs');

        if (fs.existsSync(given_path)) {
            interface.drawError(`This path already exists: ${given_path}`);
            setTimeout(restore_editor, 2000);
        } else {
            ffmpeg.exportSelection(given_path);
            restore_editor();
        }
    });
}
