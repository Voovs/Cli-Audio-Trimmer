#!/usr/bin/env node
global.program_name = "Simmer";
global.version = "v0.0.7";

const init = require('./initialize/mod.js');
const interface = require('./interface/mod.js');

// Start up program ====
init.initGlobal();
init.startInterface();

// Clean exit ====
process.on('SIGINT', function () {
    interface.eraseInterface();
    process.exit(0);
});

setInterval(() => {}, 1 << 30);  // Keep program alive indefinitely
