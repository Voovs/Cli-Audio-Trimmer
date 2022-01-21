exports.formatKey = formatKey;
exports.formatDisplayKey = formatDisplayKey;
exports.unformatKey = unformatKey;
exports.keyStrID = keyStrID;

// Return string representation of key object. Formatting is similar to Vim's
// keymapping syntax
//
// Args:
//   key (object): Same object as returned by 'keypress' event in Node
//
// Example:
//  formatKey({
//      sequence: '\x03',
//      name: 'c'
//      ctrl: true,
//      meta: false,
//      shift: false
//  } === "<C-c>"
function formatKey(key) {
    let left, right, key_str;

    if (typeof key === "string") {
        key_str = key;
    } else {
        key_str = (key.ctrl  ? "C-" : "")
                + (key.meta  ? "M-" : "")
                + (key.shift ? "S-" : "")
                + typeof key.name === "undefined" ? key.sequence : key.name;
    }

    if (key_str.length > 1)
        key_str = `<${key_str.charAt(0).toUpperCase() + key_str.slice(1)}>`;

    return key_str
}


// Return a human-readable string representing a key press
//
// Args:
//   key (str | object): Object must follow format below:
//       { sequence: str, name: str, ctrl: bool, meta: bool, shift: bool }
//
//       { sequence: 'k', name: 'k', ctrl: false, meta: false, shift: false }
//       { sequence: '\x03', name: 'c', ctrl: true, meta: false, shift: false }
//
// Examples:
//     formatDisplayKey("-", 9)       === "    -    "
//     formatDisplayKey("c-c", 9)     === "  <C-c>  "
//     formatDisplayKey("<tB>", 9)    === "  <Tb>   "
//     formatDisplayKey("<SPACE>", 9) === " <Space> "
//     formatDisplayKey({
//         sequence: '\x03',
//         name: 'c',
//         ctrl: true,
//         meta: false,
//         shift: false
//     }, 9) === "  <C-c>  "
function formatDisplayKey(key, field_width) {
    let key_str;

    if (typeof key == "object")
        key_str = formatKey(key);
     else
        key_str = key.toLowerCase().trim();

    if (key_str.length > 1) {
        // Extract modifiers
        let modifiers = key_str.match(/[cms]-/g);

        if (modifiers)
            modifiers = modifiers.map(s => s.toUpperCase());

        // Slice out key name ====
        if (key_str.match(/>>$/) || key_str.match(/->$/))
            key_str = key_str.slice(-2, -1);
        else if (key_str.match(/[^<-]*>$/))
            key_str = key_str.match(/[^<-]*$/)[0].slice(0, -1);
        else
            key_str = key_str.match(/[^<-]*$/)[0];

        // Titlecase ====
        if (key_str.length > 1)
            key_str = key_str.charAt(0).toUpperCase() + key_str.slice(1);

        key_str = "<" + (modifiers ? modifiers.join("") : "") + key_str + ">";
    }

    // Fit to field width ====
    let spacing = (field_width - key_str.length) / 2;

    left = Math.floor(spacing);  // Bias toward left align
    right = Math.ceil(spacing);

    return " ".repeat(left) + key_str + " ".repeat(right)
}


// Args:
//   key_str: Key press represented in a formatted string, as from formatKey()
//
// Returns (self):
//   Object in a similar style to below. All fields except the .name field are
//   guaranteed to not be null
//       { sequence: 'k', name: 'k', ctrl: false, meta: false, shift: false }
//       { sequence: '\x03', ctrl: true, meta: false, shift: false }
function unformatKey(key_str) {
    key_str = key_str.toLowerCase();

    // Remove encasing
    if (key_str.match(/^<.*>$/))
        key_str = key_str.slice(1, -1);

    // Parse modifier keys
    this.ctrl = this.meta = this.shift = false;

    while (key_str.match(/^[mcs]-/)) {
        if      (key_str.match(/^c-/)) this.ctrl  = true;
        else if (key_str.match(/^m-/)) this.meta  = true;
        else if (key_str.match(/^s-/)) this.shift = true;

        key_str = key_str.slice(2);
    }

    this.name = key_str;
    this.sequence = key_str;
}


// Returns a unique string identifier from a key object. Name and sequence are
// interpreted to have the same value, with `name` taking precedence
//
// Args:
//   key (obj): See formatKey() for specification
//
// Returns (string): Unique for every distinguishable keypress
//
// Examples:
//     keyStrID({
//          sequence: '\x03',
//          name: 'c',
//          ctrl: true,
//          meta: false,
//          shift: false,
//     }) === "c::c::YesCTRL::NoMETA::NoSHIFT"
function keyStrID(key) {
    if (!key.name)
        key.name = key.sequence;
    else
        key.sequence = key.name;

    return `${key.sequence}::${key.name}`
            + "::" + (key.ctrl  ? "YesCTRL"  : "NoCTRL")
            + "::" + (key.meta  ? "YesMETA"  : "NoMETA")
            + "::" + (key.shift ? "YesSHIFT" : "NoSHIFT");
}
