const parse_args = require('./parse_args');
const help = require('./help');
const keybinds = require('./keybinds');

exports.globalState = initGlobalState;
exports.keybinds = keybinds.keybindsDict;

function initGlobalState() {
    this.selection = {
            start_time: 0,
            end_time:   null,
            start_mark: null,
            end_mark:   null,
    };

    this.timeline = {
            start_time: 0,
            end_time:   null,
            is_trimmed_start: false,
            is_trimmed_end:  false,
    };

    try {
        let opts = parse_args.parseArgs(process.argv.slice(2));

        if (opts.is_help) {
            help.printHelpMessage();
            process.exit(0);
        } else {
            this.audio_file           = opts.audio_file;
            this.marks                = opts.marks;
            this.selection.start_time = opts.start_time;
            this.selection.end_time   = opts.end_time;

        }
    } catch (e) {
        console.log(`Failed: ${e.message}`);
        process.exit(1);
    }
}
