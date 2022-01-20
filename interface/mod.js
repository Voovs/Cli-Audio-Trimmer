exports.startInterface = startInterface;
exports.eraseInterface = eraseInterface;
exports.updateDisplay = updateDisplay;


// Initialize interface without overwriting scrollback
function startInterface() {
    // Clear the screen without overwriting scrollback, on supported terminals
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
    process.stdout.moveCursor(0, -24);

    let str = interfaceString(global.keybinds, global.state).split(/\r?\n/);
    //console.log(str.length);

    for (let r = 0; r < 24; r++) {
        process.stdout.clearLine();
        process.stdout.write(str[r]);

        if (r == 15 && key) {
            process.stdout.cursorTo(50);
            process.stdout.write(`Last key: ${formatKey(key)}`);
            //process.stdout.write(`Key: ${formatKey(key)}` + " ".repeat(14));
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
        start: formatMilli(state.timeline.start_time),
        end: formatMilli(state.timeline.end_time),
    };
    let sel = {
        start:  formatMilli(state.selection.start_time),
        end:    formatMilli(state.selection.end_time),
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

        this[action] = formatKey(key);
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
        this[prop] = formatMilli(g[prop]);
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
// Helper functions
// ==================================================================
//
// Args:
//   key (str | object): Object must follow format below:
//       { sequence: str, name: str, ctrl: bool, meta: bool, shift: bool }
//
//       { sequence: 'k', name: 'k', ctrl: false, meta: false, shift: false }
//       { sequence: '\x03', name: 'c', ctrl: true, meta: false, shift: false }
function formatKey(key, field_width = 9) {
    let left, right, key_str;

    if (typeof key === "string") {
        key_str = key;
    } else {
        key_str = (key.ctrl  ? "C-" : "")
                + (key.meta  ? "M-" : "")
                + (key.shift ? "S-" : "")
                + key.name;
    }

    if (key_str.length == 1) {
        left = right = 4;
    } else {
        key_str = `<${key_str.charAt(0).toUpperCase() + key_str.slice(1)}>`;

        let spacing = (field_width - key.length) / 2 - 1;

        left = Math.floor(spacing);  // Bias toward left align
        right = Math.ceil(spacing);
    }

    return " ".repeat(left) + key_str + " ".repeat(right);
}

// Human readable string for milliseconds
// Examples:
//     formatMilli(42709)   == "00:00:42.709"
//     formatMilli(3738472) == "01:02:18.472"
function formatMilli(milli) {
    if (milli === null || typeof milli === "undefined")
        return "01:02:18.472";

    let hours = 0;
    let mins  = 0;
    let secs  = Math.floor(milli / 10**3);

    while (secs >= 3600) {
        secs -= 3600;
        hours++;
    }
    while (secs >= 60) {
        secs -= 60;
        mins++;
    }

    let hours_str = (hours >= 10 ? "" : "0") + hours;
    let mins_str  = (mins  >= 10 ? "" : "0") + mins;
    let secs_str  = (secs  >= 10 ? "" : "0") + secs;
    let ms_str = "0".repeat(Math.max(0, 3 - String(milli).length))
               + String(milli).slice(-3);

    return `${hours_str}:${mins_str}:${secs_str}.${ms_str}`
}


// Converts the .srt time format to milliseconds
// Examples:
//     timeInMilli("00:00:26,059") == 26059
//     timeInMilli("20:23:35,647") == 73415647
function timeInMilli(time_str) {
    let a = time_str.split(",");
    let b = a[0].split(":");

    let secs = (b[0] * 3600) + (b[1] * 60) + b[2];

    return secs * 1000 + a[1]
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
