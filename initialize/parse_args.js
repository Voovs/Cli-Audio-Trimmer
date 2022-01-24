const fs = require('fs');
const help = require('./help.js');

exports.parseArgs = parseArgs;


// Interpret command line arguments. See ./help.js or --help for specification
// Args:
//   argv (array):
//       Arguments to parse. Shouldn't program name, only options flags and
//       positional args. Function will drain this array
function parseArgs(argv) {
    let opts = {
        is_help:        false,

        input_name:     null,
        output_name:    null,

        window_width:   null,
        play_end_time:  null,

        start_time:     null,
        end_time:       null,
        increment_size: null,

        mark_times:     Array(),

        keys: {
            play: null,
            play_end: null,
            new_start: null,
            new_end: null,
            trim_timeline: null,
            undo_trim: null,
            start_increase: null,
            end_increase: null,
            start_decrease: null,
            end_decrease: null,
            mark_start: null,
            mark_end: null,
            export: null,
        },
    };

    // Early exits ====
    if (argv.length == 0) {
        throw new Error("Incorrect number of arguments. See --help");
    } else if (argv.includes("-h") || argv.includes("--help")) {
        opts.is_help = true;
        return opts;
    }

    // Parse args ====
    while (argv.length > 1) {
        switch(argv[0]) {
            case "-m":
            case "--mark":
                ms = strToNumber(argv[1]);

                opts.mark_times.push(ms);

                argv = argv.slice(2);
                break;
            case "-s":
            case "--start":
                ms = strToNumber(argv[1]);

                opts.mark_times.push(ms);
                opts.start_time = ms;

                argv = argv.slice(2);
                break;
            case "-e":
            case "--end":
                ms = strToNumber(argv[1]);

                opts.mark_times.push(ms);
                opts.end_time = ms;

                argv = argv.slice(2);
                break;
        }
    }

    opts.input_name = argv[0];

    // Verify arguments ====
    verifyStartEndTimes(opts.start_time, opts.end_time);

    // Verify audio file is readable
    fs.accessSync(opts.input_name, fs.constants.R_OK);

    // Sort in non-decreasing order
    opts.mark_times.sort((a, b) => a - b);

    return opts
}


// Converts and returns given string as a number. Throws error if it's invalid
function strToNumber(number_str) {
    let n = parseInt(number_str);

    if (!isNaN(n))
        return n
    else
        throw new TypeError(`"${number_str}" is not a valid number`);
}


// Throws error when provided starting and ending times are invalid
// Args:
//   start (number | null): Starting time. Null is ignored
//   end   (number | null): Ending time. Null is ignored
function verifyStartEndTimes(start, end) {
    let is_start = typeof start === "number";
    let is_end = typeof end === "number";

    if (is_start && start < 0)
        throw new Error("Starting time cannot be negative");

    if (is_end && end < 0)
        throw new Error("Ending time cannot be negative");

    if (is_start && is_end && start >= end)
        throw new Error("Starting time must be before ending time");

    return true
}
