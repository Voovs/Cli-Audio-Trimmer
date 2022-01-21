const fmt    = require.main.require('./utils/key_format.js');
const fmt_ms = require.main.require('./utils/time_format.js');

exports.startInterface = startInterface;
exports.eraseInterface = eraseInterface;
exports.updateDisplay = updateDisplay;


// Initialize interface without overwriting scrollback. Only works on flashier
// terminals, others still lose their scrollback
function startInterface() {
    process.stdout.moveCursor(0, -process.stdout.rows);  // Cursor to bottom
        // Sets the current bottom row as one above the new top row
    process.stdout.clearScreenDown();

    updateDisplay(null);
}


// TODO: Store initial lines somewhere to write them back
function eraseInterface() {
    process.stdout.moveCursor(0, -24);
    process.stdout.clearScreenDown();
    process.stdout.cursorTo(0, Math.floor(process.stdout.rows / 2));
}


// Redraw updated interface
// Args:
//   key (obj | null): Seconds argument returned by 'keypress' event
function updateDisplay(key) {
    if (key && key.name === "return")
        process.stdout.moveCursor(0, -1);

    process.stdout.moveCursor(0, -24);

    let str = interfaceString(global.keybinds, global.state).split(/\r?\n/);

    for (let r = 0; r < 24; r++) {
        process.stdout.clearLine();
        process.stdout.write(str[r]);

        if (r == 15 && key) {
            process.stdout.cursorTo(50);
            process.stdout.write(`Last key: ${fmt.formatDisplayKey(key, 9)}`);
        }
        process.stdout.moveCursor(0, 1);
        process.stdout.cursorTo(0);
    }
}


// Returns 80x24 string for the interface
// Args:
//   keybinds (Object): Dictionary of user-specified keybinds
//   global_state (Object): Object for the current state of the program
function interfaceString(keybinds, state) {
    let k = new formattedKeybinds(keybinds);
    let tl = {
        start: fmt_ms.formatMilli(state.timeline.start_time),
        end: fmt_ms.formatMilli(state.timeline.end_time),
    };
    let sel = {
        start:  fmt_ms.formatMilli(state.selection.start),
        end:    fmt_ms.formatMilli(state.selection.end),
        s_mark: state.selection.start_mark ? state.selection.start_mark : "-",
        e_mark: state.selection.end_mark    ? state.selection.end_mark  : "-",
    };

    return `
                                  Audio Trimmer

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
------------------------------------------

${timelineStr(state)}
${tl.start}              ${sel.start} -> ${sel.end}              ${tl.end}`;
}



// ==================================================================
// Formatted objects
// ==================================================================
// Format keybinds into human-friendly strings
// Args:
//   keybinds (object: <action_name: key>): Map of actions to their keybind
function formattedKeybinds(keybinds) {
    for (action in keybinds) {
        let key = keybinds[action];

        this[action] = fmt.formatDisplayKey(key, 9);
    }
}


// Convert millisecond times to human-friendly string
// Args:
//   g (object): Object must contain relevent time information
function formattedTimes(g) {
    let times = [
            "timeline_start",
            "start_time",
            "end_time",
            "timeline_end",
    ];

    for (prop of times)
        this[prop] = fmt_ms.formatMilli(g[prop]);
};


// ==================================================================
// Timeline
// ==================================================================
// Return a string representation of the timeline
// Args:
//   g (object): Global object for state of the program
function timelineStr(g) {
    return timelineTop(g) + timelineBottom(g);
}


// Return string indicating current marks on timeline
function timelineTop(g) {
    return `\
                            6                                           e
                            |                                           |       \n`
+
`\
 1    2         3 45        |  7   8    9  ab           c      d        |     $
 |    |         | ||        |  |   |    |  ||           |      |        |     | \n`
}


// Return string for the bottom bar of the timeline
function timelineBottom(g) {
    let left_char = g.is_trimmed_start ? "=" : "<";
    let right_char = g.is_trimmed_end  ? "=" : ">";

    return left_char + "=".repeat(78) + right_char;
}


// ==================================================================
// Sample visual
// ==================================================================
let visual_str = `\
                                                                                
                                 Audio Trimmer                                  
                                                                                
------------------------------------------      ------------------------------- 
| Keybind | Action                       |      |      Current selection      | 
|---------|------------------------------|      ------------------------------- 
| <Space> | Pause/Play selection         |      |  Start time  |   End time   | 
|    ,    | Choose new start             |      | -------------|--------------| 
|    .    | Choose new end               |      | 03:12:20.342 | 03:12:30.342 | 
| <Enter> | Trim timeline to selection   |      |      f       |      n       | 
|    -    | Undo timeline trim           |      ------------------------------- 
|    [    | -100ms to start              |                                      
|    ]    | +100ms to end                |                                      
|    {    | +100ms to start              |                                      
|    }    | -100ms to end                |                                      
|  <Esc>  | Export selection             |                                      
------------------------------------------                                      
                                                                                
                            f                                           n       
                            |                                           |       
 a    b         c de        |  g   h    i  jk           l      m        |     $ 
 |    |         | ||        |  |   |    |  ||           |      |        |     | 
<==============================================================================>
03:10:12.333              03:12:20.342 -> 03:12:30.342              03:40:12.333\
`;
