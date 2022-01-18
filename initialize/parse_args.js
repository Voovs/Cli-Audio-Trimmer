#!/usr/bin/env node
const fs = require('fs');

exports.parseArgs = parseArgs;

function parseArgs(argv, global_state) {
    let g = global_state;

    if (argv.length == 0) {
        throw new Error('No audio file supplied');
    } else if (argv.includes("-h") || argv.includes("--help")) {
        g.is_help = true;
        return g;
    }



    arg_loop:
    for (let i = 0; i < argv.length - 1; i++) {
        switch(argv[i]) {
            case "-h":
            case "--help":
                g.is_help = true;
                console.log("help");
                return g;
            case "-m":
            case "--mark":
                ms = strToNumber(argv[i+1]);

                g.marks.push(ms);

                i++;
                break;
            case "-s":
            case "--start":
                ms = strToNumber(argv[i+1]);

                g.marks.push(ms);
                g.selection.start_time = ms;

                i++;
                break;
            case "-e":
            case "--end":
                ms = strToNumber(argv[i+1]);

                g.marks.push(ms);
                g.selection.end_time = ms;

                i++;
                break;
        }
    }

    g.audio_file = argv[argv.length - 1];

    fs.accessSync(g.audio_file, fs.constants.R_OK);

    return g;
}


function strToNumber(number_str) {
    let n = parseInt(number_str);

    if (!isNaN(n))
        return n
    else
        throw new TypeError(`"${number_str}" is not a valid number`);
}
