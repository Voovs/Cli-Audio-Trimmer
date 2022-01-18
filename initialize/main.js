#!/usr/bin/env node
const parse_args = require('./parse_args');
const help = require('./help');

exports.globalState = initGlobalState;

function initGlobalState() {
    let g = {
        selection: {
            start_time: 0,
            end_time:   null,
            start_mark: null,
            end_mark:   null,
        },
        timeline: {
            start_time: 0,
            end_time:   null,
            is_trimmed_start: false,
            is_trimmed_end:  false,
        },
        marks: [],
        is_help: false,
        audio_file: null,
    };


    try {
        parse_args.parseArgs(process.argv.slice(2), g);

        if (g.is_help) {
            help.printHelpMessage();
            process.exit(0);
        } else {
            console.log("setting global state");
            return g;
        }
    } catch (e) {
        console.log(`Failed: ${e.message}`);
        process.exit(1);
    }
}
