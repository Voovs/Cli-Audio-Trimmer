const readline      = require('readline');
const event_emitter = require('events').EventEmitter;
const backend       = require.main.require('./backend/mod.js');
const interface     = require.main.require('./interface/mod.js');

const global_state = require('./global_state.js');
const keybinds = require('./keybinds');

exports.initGlobal = initGlobal;
exports.startInterface = startInterface;

function initGlobal() {
    global.keybinds = new keybinds.keybindsDict();
    global.state    = new global_state.globalState();

    global.events = new event_emitter();
    global.events.on('handle_keypress', backend.handleKeyPress);
    global.events.on('redraw_interface', interface.updateDisplay);
}


function startInterface() {
    const input = process.stdin;
    const output = process.stdout;

    readline.createInterface({input, output});

    process.stdin.on('keypress', function (_char, key) {
        global.events.emit('handle_keypress', key);
        global.events.emit('redraw_interface', key);
    });

    interface.startInterface();
}
