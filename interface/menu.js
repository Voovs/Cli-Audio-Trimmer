const fmt  = require.main.require('./utils/key_format.js');
const fmt_ms = require.main.require('./utils/time_format.js');

exports.menuStr = menuStr;

// Returns 80x24 string for the interface
// Args:
//   keybinds (Object): Dictionary of user-specified keybinds
//   global_state (Object): Object for the current state of the program
function menuStr() {
    const selection = global.selection;
    const k = new formattedKeybinds(keybinds);

    let sel = {
        start:  fmt_ms.formatMilli(selection.start),
        end:    fmt_ms.formatMilli(selection.end),
        s_mark: selection.start_mark ? selection.start_mark : "-",
        e_mark: selection.end_mark   ? selection.end_mark   : "-",
    };

    return `\
------------------------------------------      -------------------------------
| Keybind | Action                       |      |      Current selection      |
|---------|------------------------------|      -------------------------------
|${k.play}| Pause/Play selection         |      |  Start time  |   End time   |
|${k.new_start}| Choose new start             |      | -------------|--------------|
|${k.new_end}| Choose new end               |      | ${sel.start} | ${sel.end} |
|${k.trim_timeline}| Trim timeline to selection   |      |      ${sel.s_mark}       |      ${sel.e_mark}       |
|${k.undo_trim}| Undo timeline trim           |      -------------------------------
|${k.start_increase}| -100ms to start              |
|${k.end_increase}| +100ms to end                |
|${k.start_decrease}| +100ms to start              |
|${k.end_decrease}| -100ms to end                |
|${k.export}| Export selection             |
------------------------------------------                                      `
}


// Format keybinds into human-friendly strings
// Args:
//   keybinds (object: <action_name: key>): Map of actions to their keybind
function formattedKeybinds(keybinds) {
    for (action in keybinds) {
        let key = keybinds[action];

        this[action] = fmt.formatDisplayKey(key, 9);
    }
}
