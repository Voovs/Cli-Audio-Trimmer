const fmt  = require.main.require('./utils/mod.js');

exports.menuStr = menuStr;
exports.writeFFPlayTime = writeFFPlayTime;

// Returns 80x24 string for the interface
// Args:
//   keybinds (Object): Dictionary of user-specified keybinds
//   global_state (Object): Object for the current state of the program
function menuStr() {
    const selection = global.selection;
    const k = global.keybinds.display_format;

    const sel = {
        start:  fmt.formatMilli(selection.start),
        end:    fmt.formatMilli(selection.end),
        s_mark: selection.start_mark ? selection.start_mark : "-",
        e_mark: selection.end_mark   ? selection.end_mark   : "-",
    };

    const inc = global.user_opts.increment_size;

    return `\
------------------------------------------      -------------------------------
| Keybind | Action                       |      |      Current selection      |
|---------|------------------------------|      -------------------------------
|${k.play}| ${fmt.leftAlignStr("Pause/Play selection", 28)} |      |  Start time  |   End time   |
|${k.new_start}| ${fmt.leftAlignStr("Choose new start", 28)} |      | -------------|--------------|
|${k.new_end}| ${fmt.leftAlignStr("Choose new end", 28)} |      | ${sel.start} | ${sel.end} |
|${k.trim_timeline}| ${fmt.leftAlignStr("Trim timeline to selection", 28)} |      |${fmt.centerStr(sel.s_mark, 14)}|${fmt.centerStr(sel.e_mark, 14)}|
|${k.undo_trim}| ${fmt.leftAlignStr("Undo timeline trim", 28)} |      -------------------------------
|${k.start_increase}| ${fmt.leftAlignStr(`-${inc}ms to start`, 28)} |
|${k.start_decrease}| ${fmt.leftAlignStr(`+${inc}ms to start`, 28)} |
|${k.end_decrease}| ${fmt.leftAlignStr(`-${inc}ms to end`, 28)} |        Play time:  Paused
|${k.end_increase}| ${fmt.leftAlignStr(`+${inc}ms to end`, 28)} |
|${k.export}| ${fmt.leftAlignStr("Export selection", 28)} |
------------------------------------------                                      `
}


function writeFFPlayTime(ffplay_line) {
    process.stdout.cursorTo(62, 13);

    if (ffplay_line === null || typeof ffplay_line === "undefined") {
        process.stdout.write("Paused");
    } else {
        let t = ffplay_line.toString().trim();

        if (t.includes("Metadata")) return;  // Not a timestamp line

        t = t.match(/^\d+\.\d{2}[^\d]/);

        if (t) {
            process.stdout.write(fmt.leftAlignStr(fmt.formatSeconds(t[0]), 6));
        }
    }
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
