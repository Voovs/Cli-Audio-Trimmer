exports.timelineStr = timelineStr;

// Returns a string for a timeline with a given width. Timeline takes up 5 lines
//
// Args:
//     width (int): Number of characters the timeline should take up length wise
//
// Example: (escape codes omitted)
//     timelineStr(80) === `\
//                 <                                                       >
//                 |                                                       |
//     0    a   b  |  c    d          e                      f      g      |         h$
//     |    |   |  |  |    |          |                      |      |      |         ||
//     <-----------=========================================================---------->`
function timelineStr(width) {
    const tl = global.state.timeline;
    const bar_width = width - 2;  // For capped edges
    const character_weight = (tl.end_time - tl.start_time) / bar_width;

    // Rows of string returned
    let timeline_str = {
        sel_top: Array(width).fill(" "),  // Second tier marks
        sel_mid: Array(width).fill(" "),  // Second tier mark stems
        top:     Array(width).fill(" "),  // Marks
        mid:     Array(width).fill(" "),  // Mark stems
        bottom:  "",  // Selected interval as bar
    };

    // Draw marked points ====
    let marks = markedIndicies(character_weight, bar_width);

    let char_code = 97;

    global.state.marks.sort((a, b) => a[0] - b[0]);

    global.state.marks.forEach((el, i) => {
        let pos = nearestPosition(el.time, character_weight, bar_width) + 1;

        if (timeline_str.top[pos] === " ") {
            const char = String.fromCharCode(char_code++);

            timeline_str.top[pos] = char;
            timeline_str.mid[pos] = "|";

            global.state.marks[i].char = char;
        }
    });

    // Draw selection marks and bold selected interval ====
    const start = nearestPosition(global.state.selection.start, character_weight, bar_width) + 1;
    const end   = nearestPosition(global.state.selection.end,   character_weight, bar_width) + 1;

    markSelectedInterval(timeline_str, start, end);

    timeline_str.bottom = timelineBottom(start, end, "-", "=", "<", ">", width);

    // Draw start and end marks ====
    timeline_str.mid[0] = timeline_str.mid[width - 1] = "|";
    timeline_str.top[0]  = "0";
    timeline_str.top[width - 1] = "$";

    return   `${timeline_str.sel_top.join("")}\n`
           + `${timeline_str.sel_mid.join("")}\n`
           + `${timeline_str.top.join("")}\n`
           + `${timeline_str.mid.join("")}\n`
           + timeline_str.bottom;
}


// Draw second tier marks for start and end of selection. These appear two rows
// above the normal marks
//
// Example:
//          <             >
//          |             |
//     0  a | b    f      g   h$
//     |  | | |    |      |   ||
//     <    @@@@@@@@@@@@@@@    >
function markSelectedInterval(timeline_str, start, end) {
    timeline_str.sel_top[start] = "<";
    timeline_str.sel_mid[start] =  timeline_str.mid[start] = "|";

    timeline_str.sel_top[end] = (start === end) ? "V" : ">";
    timeline_str.sel_mid[end] = timeline_str.mid[end] = "|";

    // Set global state for overlap with a timeline mark ====
    if (timeline_str.top[start] !== " ") {
        global.state.selection["start_mark"] = timeline_str.top[start];
    } else {
        global.state.selection["start_mark"] = "-";
        timeline_str.top[start] = "|";
    }

    if (timeline_str.top[end] !== " ") {
        global.state.selection["end_mark"] = timeline_str.top[end];
    } else {
        global.state.selection["end_mark"] = "-";
        timeline_str.top[end] = "|";
    }
}


// Returns string for the bottom of the timeline. Bolds selected interval
//
// Args:
//     start (int): Index of first character in selection, starting at 1
//     end (int):   Index of last character in selection, starting at 1
//     unselected (char): Character for the unselected interval
//     selected (char): Character for the selected interval
//     left (char): Character on the left of the timeline
//     right (char): Character on the right of the timeline
//     width (int): Field width for the entire timeline string
//
// Examples: (escape codes omitted)
//     timelineBottom(3, 8, " ", "@", "[", "]", 20) ===
//     "[  @@@@@@          ]"
//
//     timelineBottom(5, 33, "_", "#", "<", "$", 80) ===
//     "<____#############################_____________________________________________$"
//
//     timelineBottom(7, 76, "-", "=", "<", ">", 80) ===
//     "<------======================================================================-->"
function timelineBottom(start, end, unselected, selected, left, right, length) {
    // See https://stackoverflow.com/a/41407246 for escape codes
    return left
        + unselected.repeat(start - 1)
        + "\x1b[1m"
        + selected.repeat(end - start + 1)
        + "\x1b[0m"
        + unselected.repeat(length - end - 2)
        + right;
}


// Find marked characters on timeline
// Args:
//     character_weight:
//         Difference in milliseconds between adjacent characters on the
//         timeline
// Return: Array of positions that are marked. Assumes 1 based indexing
function markedIndicies(character_weight, bar_width) {
    const mark = global.state.marks;
    let indicies = Array();

    for (let i = 0; i < mark.length; i++) {
        let pos = nearestPosition(mark[i], character_weight, bar_width) + 1;
        indicies.push(pos);
    }

    // Only keep unique indicies and filter ====
    indicies = indicies.filter((v, i, a) => a.indexOf(v) === i);
    indicies.sort((a, b) => a[0] - b[0]);

    return indicies
}


// Use a binary search to find the nearest position on a value, based on fixed
// incremental weights for each position
//
// Args:
//     value_weight: Weight of the value being positioned
//     pos_weight: Difference between any two adjacent position's weigth
//     pos_count: Number of positions available
//
// Returns:
//     int: Index of nearest position, starting at 0
//     false: When the value_weight is over 1 pos_weight greater than the end
function nearestPosition(value_weight, pos_weight, pos_count) {
    let l = 0;
    let u = pos_count - 1;

    while (Math.abs(u - l) > 1) {
        let half = Math.round((u - l) / 2 + l);

        if (value_weight < half * pos_weight)
            u = half;
        else
            l = half;
    }

    if (l <= value_weight && value_weight < u)
        return l
    else
        return u
}
