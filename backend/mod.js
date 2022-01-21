const fmt = require.main.require('./utils/key_format.js');

const ffmpeg = require('./ffmpeg.js');
const selection = require('./selection.js');

exports.handleKeyPress = handleKeyPress;
exports.audioLength = ffmpeg.getAudioLength;

function handleKeyPress(key_obj) {
    const k = new fixedKeyBinds();

    const key_str = fmt.keyStrID(key_obj);

    let opts = global.state.user_opts;
    let sel  = global.state.selection;
    let tl   = global.state.timeline;

    const inc = global.state.user_opts.increment_size;

    switch (key_str) {
        case k.play:
            //TODO: This freezes nodejs until playback is over
            //ffmpeg.togglePlay(opts.input_name);
            break;

        case k.start_increase:
            sel.start =
                Math.max(sel.start - inc, 0);
            break;

        case k.end_increase:
            sel.end =
                Math.min(sel.end + inc, tl.end_time);
            break;

        case k.start_decrease:
            sel.start =
                Math.min(sel.start + inc, sel.end);
            break;

        case k.end_decrease:
            sel.end =
                Math.max(sel.end - inc, sel.start);
            break;

        case k.export:
            ffmpeg.exportSelection(
                opts.input_name,
                opts.output_name,
                sel.start_time,
                sel.end_time,
            );
            break;

        case k.new_start:
        case k.new_end:
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
                //fmt.formatKey(global.keybinds[binding]).trim()
            //)
        );
    }
}
