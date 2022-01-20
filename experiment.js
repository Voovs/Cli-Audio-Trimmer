#!/usr/bin/env node
const readline = require('readline');
const interface = require('./interface/mod.js');

// User-modifiable. Conflicts will result in unexpected execution
global.keybinds = {
    play:           "space",
    new_start:      ",",
    new_end:        ".",
    trim_timeline:  "enter",
    undo_trim:      "-",
    start_increase: "[",
    end_increase:   "]",
    start_decrease: "{",
    end_decrease:   "}",
    export:         "c-[",
};


global.state = {
    timeline_start: 11412333,
    start_time:     11540342,
    end_time:       11550342,
    timeline_end:   13212333,
    start_mark: "6",
    end_mark: "e",
    is_trimmed_start: true,
    is_trimmed_end:  false,
    tty_size: {
        rows: process.stdout.rows,
        cols: process.stdout.columns,
    },
};

//console.log(interface.updateDisplay())

//console.log(interface.interfaceString(keybinds, global_state));
//process.exit();
//

//const tty = require('tty');

//process.stdout.write("Hello, World");

//let t = 0;

function getChar() {
  let buffer = Buffer.alloc(1)
  fs.readSync(0, buffer, 0, 1)
  return buffer.toString('utf8')
}

process.stdin.on('keypress', function (char, key) {
    interface.updateDisplay(key);
});


const input = process.stdin;
const output = process.stdout;

const rl = readline.createInterface({input, output});
interface.updateDisplay(null);

//rl.on('history', function (history) {
//    console.log(`History: ${history}`);
//});

//setTimeout(function () {
//process.stdout.cursorTo(0);
//}, t+=1000);
//
//setTimeout(function () {
//process.stdout.cursorTo(0, 2);
//}, t+=1000);
//
//setTimeout(function () {
//process.stdout.clearLine(0);
//}, t+=1000);
//
//setTimeout(function () {
//process.stdout.cursorTo(0);
//process.stdout.write("\n");
//}, t+=1000);


setInterval(() => {}, 1 << 30);

// vim: set shiftwidth=4:
