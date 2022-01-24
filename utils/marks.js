exports.markObject = markObject;
exports.nearestPosition = nearestPosition;

// Create a new mark object
function markObject(time, index, pos) {
    this.time = time;
    this.char = index ? String.fromCharCode(index + 97) : null;  // "a" === 97
    this.pos  = pos || null;
}


// Use a binary search to find the nearest position on a value, based on fixed
// incremental weights for each position
//
// Args:
//     value_weight (Number):
//         Weight of the value being positioned. Usually the time in ms
//     pos_count (Int): Number of available spots
//     pos_weight (Number): Absolute difference in weight between adjacent spots
//
// Returns:
//     int: Index of nearest position, starting at 1
function nearestPosition(value_weight, pos_count, pos_weight) {
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
        return l + 1
    else
        return u + 1
}
