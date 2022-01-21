exports.keybindsDict = keybindsDict;

// TODO: Read user perferences from a json and validate
function keybindsDict() {
    this.play =           "<Space>";
    this.new_start =      ",";
    this.new_end =        ".";
    this.trim_timeline =  "ENTER";
    this.undo_trim =      "-";
    this.start_increase = "[";
    this.end_increase =   "]";
    this.start_decrease = "{";
    this.end_decrease =   "}";
    this.export =         "c-m-c";
}
