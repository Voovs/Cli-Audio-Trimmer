#!/usr/bin/env node
global.version = "v0.0.3";

const readline = require('readline');

const init = require('./initialize/mod.js');
const interface = require('./interface/mod.js');

// Initialize global options
global.state = new init.globalState();
global.keybinds = new init.keybinds();

// Listen to input
const input = process.stdin;
const output = process.stdout;

readline.createInterface({input, output});

// Draw and update interface
interface.startInterface();

process.stdin.on('keypress', function (_char, key) {
    interface.updateDisplay(key);
});

process.on('SIGINT', function () {
    interface.eraseInterface();
    process.exit(0);
});


setInterval(() => {}, 1 << 30);  // Keep program alive indefinitely
