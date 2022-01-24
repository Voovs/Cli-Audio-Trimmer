const RingBuffer = require.main.require('./utils/ring_buffer.js').RingBuffer;
const markObject = require.main.require('./utils/marks.js').markObject;
const fmt = require.main.require('./utils/mod.js');

exports.userOpts  = userOpts;
exports.keybindsDict = keybindsDict;
exports.selection = selection;
exports.timeline  = timeline;
exports.runtime   = runtime;


function userOpts(opts) {
    this.input_name     = opts.input_name;
    this.output_name    = opts.output_name    || "./trimmed.mp3";
    this.increment_size = opts.increment_size || 100;
    this.window_width   = opts.window_width   || 80;
    this.window_height  = 24;
    this.play_end_time  = opts.play_end_time  || 2000;
    this.menu_field_width = 9;
}


function keybindsDict(opts, field_width) {
    //TODO: Simplify
    const keybinds = new keybindsRawDict(opts);
    this.display_format = {};
    this.codes = {};
    this.raw = {};

    for (const [action, key] of Object.entries(new keybindsRawDict(opts))) {
        const display_key = fmt.displayKey(key);

        this.display_format[action] = fmt.centerStr(display_key, field_width);
        this.codes[action] = fmt.keyStrID(fmt.unformatKey(display_key));
        this.raw[action] = key;
    }
}


function keybindsRawDict(opts) {
    this.play           = opts.play           || "<Space>";
    this.play_end       = opts.play_end       || "`";
    this.new_start      = opts.new_start      || "j";
    this.new_end        = opts.new_end        || "e";
    this.trim_timeline  = opts.trim_timeline  || "ENTER";
    this.undo_trim      = opts.undo_trim      || "-";
    this.start_increase = opts.start_increase || "1";
    this.end_increase   = opts.end_increase   || "4";
    this.start_decrease = opts.start_decrease || "2";
    this.end_decrease   = opts.end_decrease   || "3";
    this.mark_start     = opts.mark_start     || "m";
    this.mark_end       = opts.mark_end       || "k";
    this.export         = opts.export         || "<S-R>";
}


function selection(opts, audio_length) {
    this.start = opts.start_time || 0;
    this.end   = opts.end_time   || audio_length;

    // Unimplemented
    this.start_mark = null;
    this.end_mark   = null;
}


function timeline(opts, audio_length) {
    this.start_time = 0;
    this.end_time = audio_length;

    this.marks = opts.mark_times.map((ms) => new markObject(ms));

    // Unimplemented
    this.is_trimmed_start = false;
    this.is_trimmed_end   = false;
}


function runtime() {
    this.keypress_history = new RingBuffer(10);
    this.playback = null;
    this.playback_is_from_start = false;
}

/*
    // Parse command line arguments ====
    let opts;

    try {
        opts = parse_args.parseArgs(process.argv.slice(2));
    } catch (e) {
        console.log(`Argument Error: ${e.message}`);
        process.exit(1);
    }

    // Set props ====
    const file_length = backend.audioLength(opts.audio_file);
    const file_ext =
        opts.audio_file.split(".")[opts.audio_file.split(".").length - 1];

    this.user_opts.input_name  = opts.audio_file;
    this.user_opts.output_name = "./trimmed." + file_ext;

    this.selection.start       = opts.start_time ? opts.start_time : 0;
    this.selection.end         = opts.end_time ? opts.end_time : file_length;
    this.timeline.end_time     = file_length;

    this.marks = opts.marks.map(function (ms) {
        return {
            time: ms,
            char: null,
            pos:  null,
        };
    });
}
*/
