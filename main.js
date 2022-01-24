#!/usr/bin/env node
global.program_name = "Simmer";
global.version = "v0.0.8";

// Start up program ====
const init = require('./initialize/mod.js');
init.setGlobalOptions();
init.registerEvents();
console.dir(global);
init.startInterface();

// Start REPL ====
const backend = require('./backend/mod.js');
const fmt     = require('./utils/key_format.js');

process.stdin.on('keypress', function (char, key) {
    const k = global.keybindings.codes;

    global.runtime.keypress_history.force_push_front(fmt.keyStrID(key_obj));

    const curr_key = global.runtime.keypress_history.get(0);
    const last_key = global.runtime.keypress_history.get(1);

    switch (last_key) {
        // Playback audio ====
        case k.play:
        case k.play_end:
            //TODO
            backend.togglePlay(k.play_end === key_str);
            return;

        // Mark jumping ====
        case k.new_start:
        case k.new_end:
            backend.jumpToMark(k.new_start === last_key, curr_key);
            return;
    }

    switch (curr_key) {
        // Playback audio ====
        case k.play:
        case k.play_end:
            backend.togglePlay(k.play_end === curr_key);
            break;

        // Increase/decrease selection slightly ====
        case k.start_increase:
            backend.incStart();
            break;
        case k.end_increase:
            backend.incEnd();
            break;
        case k.start_decrease:
            backend.decStart();
            break;
        case k.end_decrease:
            backend.decEnd();
            break;

        // Mark setting ====
        case k.mark_start:
        case k.mark_end:
            backend.setMark(k.mark_start === curr_key);
            break;

        // Export ====
        case k.export:
            ffmpeg.exportSelection();
            break;

        //TODO:
        case k.trim_timeline:
        case k.undo_trim:
            throw new Error("Unimplemented behaviour");
            break;
    }
});


// TODO: Remove
process.stdin.on('history', function (hist) {
    console.error(hist);
    //backend.handleKeyPress(char, key);
    //interface.updateDisplay();
});


process.on('SIGINT', function () {
    interface.eraseInterface();
    process.exit(0);
});
