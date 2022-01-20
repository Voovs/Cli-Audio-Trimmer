exports.keybindsDict = keybindsDict;

// TODO: Read user perferences from a json
function keybindsDict() {
    this.play =           "space";
    this.new_start =      ",";
    this.new_end =        ".";
    this.trim_timeline =  "enter";
    this.undo_trim =      "-";
    this.start_increase = "[";
    this.end_increase =   "]";
    this.start_decrease = "{";
    this.end_decrease =   "}";
    this.export =         "c-[";
}
