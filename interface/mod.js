const fmt = require.main.require('./utils/mod.js');

const display = require('./display.js');
const menus   = require('./menu.js');
const prompts = require('./prompt.js');
const msg     = require('./message.js');

exports.drawInitial = drawInitial;
exports.eraseInterface = eraseInterface;
exports.updateDisplay = updateDisplay;
exports.writeFFPlayTime = menus.writeFFPlayTime;
exports.savePrompt = prompts.savePrompt;
exports.drawError = msg.drawError;


// Initialize interface without overwriting scrollback. Only works on flashier
// terminals, others still lose their scrollback
function drawInitial() {
    process.stdout.moveCursor(0, -process.stdout.rows);  // Cursor to bottom
        // Sets the current bottom row as one above the new top row
    process.stdout.clearScreenDown();

    updateDisplay();
}


// Erase the interface and center the cursor
function eraseInterface() {
    process.stdout.moveCursor(0, -24);
    process.stdout.clearScreenDown();
    process.stdout.cursorTo(0, Math.floor(process.stdout.rows / 2));
}


// Redraw updated interface
// Args:
//   key (obj | null): Seconds argument returned by 'keypress' event
function updateDisplay() {
    let key = global.runtime.keypress_history.get(0);
    key = key ? key.display : null;

    if (key && key.name === "return")
        process.stdout.moveCursor(0, -1);

    process.stdout.cursorTo(0, 0);

    let str = display.interfaceString().split(/\r?\n/);

    for (let r = 0; r < 24; r++) {
        process.stdout.clearLine();
        process.stdout.write(str[r]);

        process.stdout.moveCursor(0, 1);
        process.stdout.cursorTo(0);
    }
}
