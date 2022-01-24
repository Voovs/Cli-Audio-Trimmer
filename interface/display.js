const fmt  = require.main.require('./utils/mod.js');

const menu = require('./menu.js');
const timeline = require('./timeline.js');

exports.interfaceString = interfaceString;


// Returns 80x24 string for the interface
function interfaceString() {
    const width = global.user_opts.window_width;
    const timeline_str = timeline.timelineStr(width);


    const title = "\n"
        + fmt.centerStr(`${global.program_name} ${global.version}`, width, false)
        + "\n\n";

    return title
        + menu.menuStr(width) + "\n\n"
        + timeline_str + "\n"
        + bottomTimeStampsStr(width);
}


// Returns string for the timestamps at the very bottom. Minimum width for this
// to work properly is 52 characters
// Args:
//     width (int): Number of characters the string can take up
function bottomTimeStampsStr(width) {
    const tl_start = fmt.formatMilli(global.timeline.start_time);
    const tl_end   = fmt.formatMilli(global.timeline.end_time);

    const sel_start = fmt.formatMilli(global.selection.start);
    const sel_end = fmt.formatMilli(global.selection.end);

    //                                  ┌Number of timestamps
    //                                  |   ┌Width of each timestamp "00:00:00.000"
    //                                  │   │    ┌Middle arrow " -> "
    //                                  │   │    │    ┌Symmetric around middle
    //                                  │   │    │    │
    const spacing = " ".repeat((width - 4 * 12 - 4) / 2);

    return `${tl_start}${ spacing }${sel_start} -> ${sel_end}${ spacing }${tl_end}`
}
