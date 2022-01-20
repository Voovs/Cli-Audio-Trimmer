const fs = require('fs');

exports.parseArgs = parseArgs;


// Interpret command line arguments. See ./help.js or --help for specification
function parseArgs(argv) {
    let opts = {
        is_help: false,
        audio_file: null,
        marks: Array(),
        start_time: null,
        end_time: null,
    }

    if (argv.length == 0) {
        throw new Error("Incorrect number of arguments. See --help");
    } else if (argv.includes("-h") || argv.includes("--help")) {
        opts.is_help = true;
        return opts;
    }

    // Parse args
    arg_loop:
    for (let i = 0; i < argv.length - 1; i++) {
        switch(argv[i]) {
            case "-m":
            case "--mark":
                ms = strToNumber(argv[i+1]);

                g.marks.push(ms);

                i++;
                break;
            case "-s":
            case "--start":
                ms = strToNumber(argv[i+1]);

                opts.marks.push(ms);
                opts.start_time = ms;

                i++;
                break;
            case "-e":
            case "--end":
                ms = strToNumber(argv[i+1]);

                opts.marks.push(ms);
                opts.end_time = ms;

                i++;
                break;
        }
    }

    if (typeof opts.start_time === "number" && opts.start_time < 0)
        throw new Error("Starting time cannot be negative");

    if (typeof opts.end_time === "number" && opts.end_time < 0)
        throw new Error("Ending time cannot be negative");

    if (typeof opts.start_time === "number"
        && typeof opts.end_time === "number"
        && typeofopts.start_time >= opts.end_time
    )
        throw new Error("Starting time must be before ending time");

    // Verify audio file is readable
    opts.audio_file = argv[argv.length - 1];
    fs.accessSync(opts.audio_file, fs.constants.R_OK);

    return opts
}


function strToNumber(number_str) {
    let n = parseInt(number_str);

    if (!isNaN(n))
        return n
    else
        throw new TypeError(`"${number_str}" is not a valid number`);
}
