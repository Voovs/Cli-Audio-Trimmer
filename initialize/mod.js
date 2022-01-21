const backend = require('../backend/mod.js');

const parse_args = require('./parse_args');
const help = require('./help');
const keybinds = require('./keybinds');

exports.globalState = initGlobalState;
exports.keybinds = keybinds.keybindsDict;

function initGlobalState() {
    // Set defaults ====
    this.selection = {
            start:      0,
            end:        null,
            start_mark: null,
            end_mark:   null,
    };

    this.timeline = {
            start_time: 0,
            end_time:   null,
            is_trimmed_start: false,
            is_trimmed_end:  false,
    };

    this.user_opts = {
        increment_size: 100,
        output_name:    null,
    };

    // Parse command line arguments ====
    let opts;

    try {
        opts = parse_args.parseArgs(process.argv.slice(2));
    } catch (e) {
        console.log(`Argument Error: ${e.message}`);
        process.exit(1);
    }

    // Print help and exit ====
    if (opts.is_help) {
        help.printHelpMessage();
        process.exit(0);
    }

    // Set props ====
    const file_length = backend.audioLength(opts.audio_file);
    const file_ext =
        opts.audio_file.split(".")[opts.audio_file.split(".").length - 1];

    this.user_opts.input_name  = opts.audio_file;
    this.user_opts.output_name = "./trimmed." + file_ext;
    this.marks                 = opts.marks;

    this.selection.start       = opts.start_time ? opts.start_time : 0;
    this.selection.end         = opts.end_time ? opts.end_time : file_length;
    this.timeline.end_time     = file_length;
}
