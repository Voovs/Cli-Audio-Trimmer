const fmt = require.main.require('./utils/key_format.js');

const ffmpeg = require('./ffmpeg.js');
const selection = require('./selection.js');

exports.handleKeyPress = handleKeyPress;
exports.audioLength = ffmpeg.getAudioLength;

function handleKeyPress(key_obj) {
    const k = new fixedKeyBinds();
    const key_str = fmt.keyStrID(key_obj);

    switch (key_str) {
        case k.play:
            //TODO: This freezes nodejs until playback is over
            ffmpeg.togglePlay();
            break;

        // Increase/decrease selection slightly ====
        case k.start_increase:
            selection.incStart();
            break;
        case k.end_increase:
            selection.incEnd();
            break;
        case k.start_decrease:
            selection.decStart();
            break;
        case k.end_decrease:
            selection.decEnd();
            break;

        // Mark jumping ====
        case k.new_start:
        case k.new_end:
            global.events.off('handle_keypress', handleKeyPress);

            process.stdin.once('keypress', c => {
                selection.jumpToMark(k.new_start === key_str, c);
                global.events.on('handle_keypress', handleKeyPress);
            });
            break;

        // Mark setting ====
        case k.mark_start:
        case k.mark_end:
            selection.setMark(k.mark_start === key_str);
            break;

        // Export ====
        case k.export:
            ffmpeg.exportSelection();
            break;

        //TODO:
        case k.trim_timeline:
        case k.undo_trim:
            throw new Error("Unimplemented behaviour");
            break;
    }
}


// Collapse keybinds into interpretable strings
//
// Example:
// global.keybinds === {
//     play: "<Space>",
//     undo_trim: "k",
//     export: "<C-M-[>",
// };
//
// new fixedKeybinds() === {
//     play:  "space::false::false::false",
//     undo_trim: "k::false::false::false",
//     export:    "[::true::true::false",
// }
function fixedKeyBinds() {
    for (binding in global.keybinds) {
        this[binding] = fmt.keyStrID(
            new fmt.unformatKey(global.keybinds[binding])
        );
    }
}
