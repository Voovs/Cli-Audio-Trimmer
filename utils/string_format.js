exports.centerStr = centerStr;

// Center text in a string with given width. Pad both sides with spaces
//
// Args:
//     str (str): String being centered
//     field_width (int): Length of resulting string
//     is_left_bias (bool): Left align when centering characters are odd
//
// Examples:
//     centerStr("!", 3) === " ! "
//     centerStr("Simmer", 21, true)  === "       Simmer        "
//     centerStr("Simmer", 21, false) === "        Simmer       "
function centerStr(str, field_width, is_left_bias = true) {
    let left =  Math.floor((field_width - str.length) / 2);
    let right = Math.floor((field_width - str.length) / 2);

    // Adjust for uneven center ====
    const is_odd = (field_width - str.length) % 2;

    if (is_odd && is_left_bias)
        right += 1;
    else if (is_odd)
        left += 1;

    return " ".repeat(left) + str + " ".repeat(right)
}
