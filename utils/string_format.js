exports.centerStr = centerStr;
exports.leftAlignStr = leftAlignStr;
exports.textBlock = textBlock;

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
function centerStr(str, field_width, is_left_bias = true, padding_char = " ") {
    if (str.length >= field_width)
        return str;

    let left =  Math.floor((field_width - str.length) / 2);
    let right = Math.floor((field_width - str.length) / 2);

    // Adjust for uneven center ====
    const is_odd = (field_width - str.length) % 2;

    if (is_odd && is_left_bias)
        right += 1;
    else if (is_odd)
        left += 1;

    return padding_char.repeat(left) + str + padding_char.repeat(right)
}


// Returns a string with extra width being padded by the padding character
//
// Examples:
//   leftAlignStr("String", 10)   === "String    "
//   leftAlignStr("str", 10, "S") === "strSSSSSSS"
function leftAlignStr(string, field_width, padding_char = " ") {
    string = string.trim();
    const padding = field_width - string.length;

    if (padding <= 0)
        return string
    return string + padding_char.repeat(padding)
}


// Returns a multiline string. Lines are split on words, when the line gets
// longer than the field width
//
// Examples:
//   textBlock(" Text ", 12, "<", ">", "#")  === "<## Text ##>"
//   textBlock("one two", 6, "<", ">", "#")  === "<one#>\n<two#>"
function textBlock(
    string,
    field_width,
    left_char = "",
    right_char = "",
    padding_char = " ")
{
    const words = string.split(" ");

    let lines = [""];
    let line_len = 0
    const max_line_len = field_width - left_char.length - right_char.length;

    for (word of words) {
        line_len += word.length + 1;

        if (line_len <= max_line_len) {
            lines[lines.length - 1] += word + " ";
        } else if (line_len > max_line_len && word.length <= max_line_len) {
            line_len = word.length + " ";
            lines.push(word);
        } else {
            lines.push(word);
        }
    }

    for (let i = 0; i < lines.length; i++) {
        lines[i] = left_char
            + leftAlignStr(lines[i], max_line_len, padding_char)
            + right_char;
    }

    return lines.join("\n")
}
