const readline      = require('readline');
const EventEmitter = require('events').EventEmitter;
const backend       = require.main.require('./backend/mod.js');
const interface     = require.main.require('./interface/mod.js');

const global_state = require('./global_state.js');
const parse_args   = require('./parse_args.js');

exports.setGlobalOptions = setGlobalOptions;
exports.registerEvents = registerEvents;
exports.startInterface = startInterface;

function setGlobalOptions() {
    const opts = parse_args.parseArgs(process.argv.slice(2));

    if (opts.is_help) {
        help.printHelpMessage();
        process.exit(0);
    }

    const audio_length = backend.getAudioLength(opts.input_name);

    global.keybinds  = new global_state.keybindsDict(opts, 9);
    global.user_opts = new global_state.userOpts(opts, audio_length);
    global.timeline  = new global_state.timeline(opts, audio_length);
    global.selection = new global_state.selection(opts, audio_length);
    global.runtime   = new global_state.runtime();
}


function registerEvents() {
    global.events = new EventEmitter();
    global.events.on('redraw_interface', interface.updateDisplay);
}


function startInterface() {
    const input = process.stdin;
    const output = process.stdout;

    readline.createInterface({input, output});

    interface.drawInitial();
}
