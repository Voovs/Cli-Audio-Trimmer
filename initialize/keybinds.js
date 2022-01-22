exports.keybindsDict = keybindsDict;

// TODO: Read user perferences from a json and validate
function keybindsDict() {
    this.play =           "<Space>";
    this.new_start =      "j";
    this.new_end =        "e";
    this.trim_timeline =  "ENTER";
    this.undo_trim =      "-";
    this.start_increase = "1";
    this.end_increase =   "4";
    this.start_decrease = "2";
    this.end_decrease =   "3";
    this.mark_start =     "m";
    this.mark_end =       "k";
    this.export =         "<S-R>";
}
