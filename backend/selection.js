const nearestPosition = require.main.require('./utils/marks.js').nearestPosition;
const markObject = require.main.require('./utils/marks.js').markObject;

exports.updateMarks = updateMarks;
exports.jumpToMark  = jumpToMark;
exports.setMark     = setMark;

exports.incStart = () => moveSelection(true, true);
exports.decStart = () => moveSelection(true, false);
exports.incEnd   = () => moveSelection(false, true);
exports.decEnd   = () => moveSelection(false, false);


function moveSelection(is_start, is_increase) {
    const sel = global.selection;
    const tl  = global.timeline;
    const inc = global.user_opts.increment_size;

    if (is_start && is_increase)
        sel.start = Math.max(sel.start - inc, 0);
    else if (!is_start && is_increase)
        sel.end   = Math.min(sel.end + inc, tl.end_time);
    else if (is_start)
        sel.start = Math.min(sel.start + inc, sel.end);
    else
        sel.end   = Math.max(sel.end - inc, sel.start);
};


// Updates the global marks array. Called from various other modules
//
// Returns: None
//     Mutates `global.timeline.marks`. Updated array is guarenteeded to be
//     sorted with no visually overlapping marks
function updateMarks(is_redraw) {
    // Filter out overlapping marks and update characters associated with marks
    const filter_map = function (filtered, mark, i) {
        if (filtered === null)
            filtered = Array();

        // Keep mark if it's visible ====
        const tl = global.timeline;
        const count = global.user_opts.window_width - 2;
        const weight = (tl.end_time - tl.start_time) / count;

        const pos = nearestPosition(mark.time, count, weight);

        if (! filtered.map(e => e.pos).includes(pos))
            filtered.push(new markObject(mark.time, filtered.length, pos));

        return filtered
    };

    global.timeline.marks = global.timeline.marks
        .sort((a, b) => a.time - b.time)     // Acending order by time
        .reduce(filter_map, null);

    if (global.timeline.marks === null)
        global.timeline.marks = new Array();  // Blank array not null

    // TODO: Redraw
    // if (is_redraw)
    //     interface.redraw();
}


// Moves edge of selection to a given mark
function jumpToMark(is_start, char) {
    const sel   = is_start ? "start" : "end";
    const other = is_start ? "end" : "start";

    const sel_time   = global.selection[sel];
    const other_time = global.selection[other];

    // Jump to predefined start/end of timeline ====
    if (char === "0" && sel === "start")
        global.selection[sel] = global.timeline.start_time;

    if (char === "$" && sel === "end")
        global.selection[sel] = global.timeline.end_time;

    // Find matching mark ====
    global.timeline.marks.forEach(obj => {
        // Prevent jump from making end < start
        const is_valid_jump = (is_start && obj.time <= other_time)
                           || (!is_start && obj.time >= other_time);

        if (obj.char === char && is_valid_jump)
            global.selection[sel] = obj.time;
    });

    updateMarks();
}


// Set mark at the current position. Overwrites existing mark if a conflict
// exits for the same visible position
function setMark(is_start) {
    const side = is_start ? "start" : "end";

    const insert_time = global.selection[side];

    const count = global.user_opts.window_width - 2;
    const weight = (global.timeline.end_time - global.timeline.start_time) / count;
    const pos = nearestPosition(insert_time, count, weight);

    updateMarks();

    for (let i = 0; i <= global.timeline.marks.length; i++) {
        if (i === global.timeline.marks.length) {  // Last mark
            global.timeline.marks.push(new markObject(insert_time, null, pos));
            break;
        } else if (global.timeline.marks[i].pos === pos) {  // Overwrite
            global.timeline.marks[i] =
                new markObject(insert_time, global.timeline.marks[i].char, pos);
            break;
        } else if (global.timeline.marks[i].pos > pos) {  // Insert
            global.timeline.marks.splice(i, 0,
                new markObject(insert_time, null, pos));
            break;
        }
    }

    updateMarks();
}
