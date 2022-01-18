#!/usr/bin/env node
const version = "v0.0.2";

const init = require('./initialize/main.js');
const interface = require('./interface/main.js');

var global_state = init.globalState();

console.dir(global_state);
console.log("Exit successfully");
process.exit(0);
