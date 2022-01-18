#!/usr/bin/env node
exports.interfaceString = interfaceString;

// Returns 80x24 string for the interface
// Args:
//   keybinds (Object): Dictionary of user-specified keybinds
//   global_state (Object): Object for the current state of the program
function interfaceString(keybinds, global_state) {
    let k = new formattedKeybinds(keybinds);
    let t = new formattedTimes(global_state);
    let g = global_state;

    return `
                                 Audio Trimmer

------------------------------------------      -------------------------------
| Keybind | Action                       |      |      Current selection      |
|---------|------------------------------|      -------------------------------
|${k.play}| Pause/Play selection         |      |  Start time  |   End time   |
|${k.new_selection}| Create new selection         |      | -------------|--------------|
|${k.new_start}| Choose new start             |      | ${t.start_time} | ${t.end_time} |
|${k.new_end}| Choose new end               |      |      ${g.start_mark}       |      ${g.end_mark}       |
|${k.trim_timeline}| Trim timeline to selection   |      -------------------------------
|${k.start_increase}| -100ms to start              |
|${k.end_increase}| +100ms to end                |
|${k.start_decrease}| +100ms to start              |
|${k.end_decrease}| -100ms to end                |
|${k.export}| Export selection             |
------------------------------------------

${timelineStr(g)}
${t.timeline_start}              ${t.start_time} -> ${t.end_time}              ${t.timeline_end}`;
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

        if (key.length == 1) {
            this[action] = `    ${key}    `;
        } else {
            let encased = `<${key.charAt(0).toUpperCase() + key.slice(1)}>`;

            let spacing = (9 - key.length) / 2 - 1;

            let left = Math.floor(spacing);  // Bias toward left align
            let right = Math.ceil(spacing);

            this[action] = " ".repeat(left) + encased + " ".repeat(right);
        }
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
// Human readable string for milliseconds
// Examples:
//     formatMilli(42709)   == "00:00:42.709"
//     formatMilli(3738472) == "01:02:18.472"
function formatMilli(milli) {
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
    let ms_str = String(milli).slice(-3);

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
| <Tab>   | Create new selection         |      | -------------|--------------| 
|    ,    | Choose new start             |      | 03:12:20.342 | 03:12:30.342 | 
|    .    | Choose new end               |      |      6       |      e       | 
| <Enter> | Trim timeline to selection   |      ------------------------------- 
|    [    | -100ms to start              |                                      
|    ]    | +100ms to end                |                                      
|    {    | +100ms to start              |                                      
|    }    | -100ms to end                |                                      
|  <Esc>  | Export selection             |                                      
------------------------------------------                                      
                                                                                
                            6                                           e       
                            |                                           |       
 1    2         3 45        |  7   8    9  ab           c      d        |     $ 
 |    |         | ||        |  |   |    |  ||           |      |        |     | 
<==============================================================================>
03:10:12.333              03:12:20.342 -> 03:12:30.342              03:40:12.333\
`;
