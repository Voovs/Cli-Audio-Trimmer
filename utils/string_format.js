// A large batch of string formatters, making up for a lack of printf()
exports.centerStr = centerStr;
exports.alignStrLeft = alignStrLeft;
exports.alignStrRight = alignStrRight;
exports.truncateStrRight = truncateStrRight;
exports.truncateStrLeft = truncateStrLeft;
exports.fitString = fitString;
exports.textBlock = textBlock;
exports.revStr = revStr;

// Center text in a string with given width. Pad both sides with spaces
//
// Args:
//     str (str): String being centered
//     field_width (int): Length of resulting string
//     is_left_bias (bool): Left align when centering characters are odd
//
// Examples:
//     centerStr("!", 3) === " ! "
//     centerStr("Simmer", 21, " ", true)  === "       Simmer        "
//     centerStr("Simmer", 21, " ", false) === "        Simmer       "
//     centerStr("Simmer", 21, "-", false) === "--------Simmer-------"
//     centerStr(" Simmer ", 21, "-", false)==="------- Simmer ------"
function centerStr(str, field_width, padding_char = " ", is_left_bias = true) {
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
//   alignStrLeft("String", 10)   === "String    "
//   alignStrLeft("str", 10, "S") === "strSSSSSSS"
function alignStrLeft(string, field_width, padding_char = " ") {
    const padding_len = field_width - string.length;

    if (padding_len <= 0)
        return string
    return string + padding_char.repeat(padding_len)
}

// Returns a string with extra width being padded by padding_char on the left
//
// Examples:
//   alignStrRight("String", 10)   === "    String'
//   alignStrRight(" str", 10, "S") === "SSSSSS str"
function alignStrRight(string, field_width, padding_char = " ") {
    const padding_len = field_width - string.length;

    if (padding_len <= 0)
        return string
    return padding_char.repeat(padding_len) + string
}


// Truncates the end of a string to fit into the field_width
//
// Examples:
//   truncateStrRight("STRING", 7) === "STRING"
//   truncateStrRight("STRING", 6) === "STRING"
//   truncateStrRight("STRING", 5) === "ST..."
//   truncateStrLeft("STRING", 5)  === "...NG"
//   truncateStrRight("STRING", 4) === "S..."
//   truncateStrLeft("STRING", 4)  === "...G"
//   truncateStrRight("STRING", 3) === "..."
//   truncateStrRight("STRING", 1) === "..."
function truncateStrRight(string, field_width, truncation_str = "...") {
    if (string.length <= field_width)
        return string

    const len = Math.max(0, field_width - truncation_str.length);

    return string.slice(0, len) + truncation_str
}

function truncateStrLeft(string, field_width, truncation_str = "...") {
    return revStr(truncateStrRight(revStr(word), field_width, truncation_str))
}


// Fit a string into a given field width. Will pad or truncate. Returned string
// is guarenteed to have length field_width. Arguments must satisfy:
// truncation_str.length <= field_width
//
// Examples:
//   fitString("Simmer ", 9, "#") === "Simmer ##"
//   fitString("Simmer", 9) === "Simmer   "
//   fitString("Simmer", 7) === "Simmer "
//   fitString("Simmer", 6) === "Simmer"
//   fitString("Simmer", 5) === "Si..."
//   fitString("Simmer", 3) === "..."
function fitString(
    string,
    field_width,
    padding_char = " ",
    truncation_str = "...",
    is_right_padding = true,
    is_right_truncate = true)
{
    if (string.length === field_width)
        return string
    else if (string.length < field_width)
        return is_right_padding
            ? alignStrLeft(string, field_width, padding_char)
            : alignStrRight(string, field_width, padding_char)
    else
        return is_right_truncate
            ? truncateStrRight(string, field_width, truncation_str)
            :  truncateStrLeft(string, field_width, truncation_str)
}


// Returns a multiline string. Lines are split on words, when the line gets
// longer than the field width. Similar to vim's {Visual}gq
//
// Examples:
//   textBlock(" Text ", 12, "<", ">", "#")  === "<## Text ##>"
//   textBlock("one two", 6, "<", ">", "#")  === "<one#>\n<two#>"
//   textBlock("one two three four", 4) === "one\ntwo\nt...\nfour"
//   textBlock("one two three four", 4, "", "", " ", false)
//      === "one\ntwo\n...e\nfour"
function textBlock(
    string,
    field_width,
    left_char = "",
    right_char = "",
    padding_char = " ",
    is_right_trim = true)
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
            let word_fit = is_right_trim
                ? truncateStrRight(word, max_line_len, "...")
                : truncateStrLeft(word, max_line_len, "...");

            line_len = 0;
            lines.push(word_fit);
            lines.push("");
        }
    }

    for (let i = 0; i < lines.length; i++) {
        if (lines[i] === "") {
            lines.splice(i, 1);
        } else {
        lines[i] = left_char
            + alignStrLeft(lines[i], max_line_len, padding_char)
            + right_char;
        }
    }

    return lines.join("\n")
}


// Reverses the character order of a string
//
// Examples:
//   rev("string") === "gnirts"
//   rev("two ") === " owt"
function revStr(string) {
    return string.split("").reverse().join("")
}
