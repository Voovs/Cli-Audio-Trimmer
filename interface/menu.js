const fmt  = require.main.require('./utils/mod.js');

exports.keybindMenuStr = keybindMenuStr;
exports.timeMenuStr = timeMenuStr;
exports.writeFFPlayTime = writeFFPlayTime;

// Returns 80x24 string for the interface
// Args:
//   keybinds (Object): Dictionary of user-specified keybinds
//   global_state (Object): Object for the current state of the program
function keybindMenuStr() {
    const k = global.keybinds.display_format;

    const inc = fmt.alignStrLeft(global.user_opts.increment_size + "ms", 9);

    const trim   = k.trim_timeline;
    const untrim = k.undo_trim;
    const exprt  = k.export;
    const exit   = k.exit;
    const svexit = "  TODO   ";
    const s_jump = k.new_start,     e_jump = k.new_end;
    const s_mark = k.mark_start,    e_mark = k.mark_end;
    const s_inc  = k.start_increase, e_inc = k.end_increase;
    const s_dec  = k.start_decrease, e_dec = k.end_decrease;
    const s_play = k.play,          e_play = k.play_end;

    return `\
┌General Keybinds──────────────────────╥─Selection Keybinds────────────────────┐
│ Keybind │ Action                     ║  Start  │   End   │ Action            │
├─────────┼────────────────────────────╫─────────┼─────────┼───────────────────┤
│${ trim }│ Trim timeline              ║${s_jump}│${e_jump}│ Jump to mark      │
│${untrim}│ Undo timeline trim         ║${s_mark}│${e_mark}│ Set mark          │
│${exprt }│ Export selection           ║${s_inc }│${e_inc }│ Increase ${ inc  }│
│${ exit }│ Exit Simmer                ║${s_dec }│${e_dec }│ Decrease ${ inc  }│
│${svexit}│ Exit. Save current session ║${s_play}│${e_play}│ Play/Pause from   │
└─────────┴────────────────────────────╨─────────┴─────────┴───────────────────┘
`
}


// String for the selection and play time menu
function timeMenuStr() {
    const sel = global.selection;

    const pause_time = global.runtime.last_pause
        ? fmt.centerStr(fmt.formatMilli(global.runtime.last_pause), 14)
        : fmt.centerStr("Paused", 14);
    const start = fmt.centerStr(fmt.formatMilli(sel.start), 14);
    const end   = fmt.centerStr(fmt.formatMilli(sel.end),   14);

    return `\
                ┌──────────────┬──────────────┬──────────────┐
                │  Start Time  │  Play  Head  │   End Time   │
                ├──────────────┼──────────────┼──────────────┤
                │${   start   }│${pause_time }│${    end    }│
                └──────────────┴──────────────┴──────────────┘
`
}


// Write current playback time into play menu, as seen above. Directly
// overwrites the tty display for speed
function writeFFPlayTime(ffplay_line) {
    process.stdout.cursorTo(33, 15);

    if (typeof ffplay_line !== "undefined" && ffplay_line !== null) {
        let t = ffplay_line.toString().trim();

        if (t.includes("Metadata")) return;  // Not a timestamp line

        t = t.match(/^\d+\.\d{2}[^\d]/);

        if (t) {
            const ms = global.runtime.last_pause = fmt.secondsToMilli(t[0]);
            process.stdout.write(fmt.alignStrLeft(fmt.formatMilli(ms), 6));
        }
    }

    // Reset cursor to the bottom
    process.stdout.cursorTo(0, 24);
}
