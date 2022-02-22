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

    ffmpeg.stopPlayback();

    interface.savePrompt((given_path) => {
        if (global.runtime.last_save_path === given_path) return;

        const fs = require('fs');

        if (global.runtime.last_save_path !== given_path
            && fs.existsSync(given_path)) {
            interface.drawMsg(`This path already exists: ${given_path}`,
                                "Failed to save audio");
        } else if (given_path !== "") {
            global.runtime.last_save_path = given_path;
            ffmpeg.exportSelection(given_path);
        }

        global.runtime.display_mode.save_prompt = false;
    });
}
