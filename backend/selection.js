const interface = require.main.require('./interface/timeline.js');

exports.updateMarks = updateMarks;
exports.jumpToMark  = jumpToMark;
exports.setMark     = setMark;

exports.incStart = () => moveSelection(true, true);
exports.decStart = () => moveSelection(true, false);
exports.incEnd   = () => moveSelection(false, true);
exports.decEnd   = () => moveSelection(false, false);


function moveSelection(is_start, is_increase) {
    const sel = global.state.selection;
    const tl  = global.state.timeline;
    const inc = global.state.user_opts.increment_size;

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
//     Mutates `global.state.marks`. Updated array is guarenteeded to be sorted
//     with no visually overlapping marks
function updateMarks() {
    // Filter out overlapping marks and update characters associated with marks
    const filter_map = function (filtered, mark, i) {
        if (filtered === null)
            filtered = Array();

        // Keep mark if it's visible ====
        const pos = interface.nearestPosition(mark.time);

        if (! filtered.map(e => e.pos).includes(pos))
            filtered.push(new markObject(mark, filtered.length, pos));

        return filtered
    };

    global.state.marks = global.state.marks
        .sort((a, b) => a.time - b.time)     // Acending order by time
        .reduce(filter_map, null);
}


// Create a new mark object
function markObject(mark, char_code, pos) {
    this.time = mark.time;
    this.char = String.fromCharCode(char_code + 97);  // "a" === 97
    this.pos  = pos;
}


// Moves edge of selection to a given mark
function jumpToMark(is_start, char) {
    const sel   = is_start ? "start" : "end";
    const other = is_start ? "end" : "start";

    const sel_time   = global.state.selection[sel];
    const other_time = global.state.selection[other];

    // Jump to predefined start/end of timeline ====
    if (char === "0" && sel === "start")
        global.state.selection[sel] = global.state.timeline.start_time;

    if (char === "$" && sel === "end")
        global.state.selection[sel] = global.state.timeline.end_time;

    // Find matching mark ====
    global.state.marks.forEach(obj => {
        // Prevent jump from making end < start
        const is_valid_jump = (is_start && obj.time <= other_time)
                           || (!is_start && obj.time >= other_time);

        if (obj.char === char && is_valid_jump)
            global.state.selection[sel] = obj.time;
    });

    updateMarks();
    global.events.emit('redraw_interface', null);
}


// Set mark at the current position. Overwrites existing mark if a conflict
// exits for the same visible position
function setMark(is_start) {
    const side = is_start ? "start" : "end";

    const insert_time = global.state.selection[side];
    const pos = interface.nearestPosition(insert_time);

    updateMarks();

    for (let i = 0; i < global.state.marks.length; i++) {
        if (global.state.marks[i].pos === pos) {    // Overwrite
            global.state.marks[i] = {
                time: insert_time,
                char: global.state.marks[i].char,
                pos: pos,
            };

            break;
        } else if (global.state.marks[i].pos > pos) {  // Insert
            global.state.marks.splice(i, 0, {
                time: insert_time,
                char: null,
                pos: pos,
            });

            updateMarks();
            break;
        }
    }

    global.events.emit('redraw_interface', null);
}
