const fmt = require.main.require('./utils/mod.js');

const timeline = require('./timeline.js');
const menu = require('./menu.js');

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


// Erase the interface and center the cursor
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

        // TODO: Remove debugging edit here
        if (r == 15 && key) {
            process.stdout.cursorTo(50);
            process.stdout.write(`Last key: ${fmt.formatDisplayKey(key, 9)}`);
        }
        process.stdout.moveCursor(0, 1);
        process.stdout.cursorTo(0);
    }
}


// Returns 80x24 string for the interface
// TODO: Remove hardcoding for 80 width?
function interfaceString() {
    const timeline_str = timeline.timelineStr(80);

    const title = "\n"
        + fmt.centerStr(`${global.program_name} ${global.version}`, 80, false)
        + "\n\n";

    return title
        + menu.menuStr(80) + "\n\n"
        + timeline_str + "\n"
        + bottomTimeStampsStr(80);
}


// Returns string for the timestamps at the very bottom. Minimum width for this
// to work properly is 52 characters
// Args:
//     width (int): Number of characters the string can take up
function bottomTimeStampsStr(width) {
    const tl_start = fmt.formatMilli(global.state.timeline.start_time);
    const tl_end   = fmt.formatMilli(global.state.timeline.end_time);

    const sel_start = fmt.formatMilli(global.state.selection.start);
    const sel_end = fmt.formatMilli(global.state.selection.end);

    //                                  ┌Number of timestamps
    //                                  |   ┌Width of each timestamp "00:00:00.000"
    //                                  │   │    ┌Middle arrow " -> "
    //                                  │   │    │    ┌Symmetric around middle
    //                                  │   │    │    │
    const spacing = " ".repeat((width - 4 * 12 - 4) / 2);

    return `${tl_start}${ spacing }${sel_start} -> ${sel_end}${ spacing }${tl_end}`
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
| <Enter> | Trim timeline to selection   |      |      -       |      n       | 
|    -    | Undo timeline trim           |      ------------------------------- 
|    [    | -100ms to start              |                                      
|    ]    | +100ms to end                |                                      
|    {    | +100ms to start              |                                      
|    }    | -100ms to end                |                                      
|  <C-[>  | Export selection             |                                      
------------------------------------------                                      
                                                                                
                          <                                             >       
                          |                                             |       
0 a   b         c de      | f  g   h    i  jk           l      m        n      $
| |   |         | ||      | |  |   |    |  ||           |      |        |      |
<-------------------------===============================================------>
03:10:12.333              03:12:20.342 -> 03:12:30.342              03:40:12.333\
`;
