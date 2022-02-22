#!/usr/bin/env node
global.program_name = "Simmer";
global.version = "v0.1.0";

// Start up program ====
const init = require('./initialize/mod.js');
init.setGlobalOptions();
init.registerEvents();
init.startInterface();

// Start REPL ====
const backend = require('./backend/mod.js');
const fmt     = require('./utils/key_format.js');

process.stdin.on('keypress', function (char, key) {
    if (global.runtime.display_mode.message) {
        global.runtime.display_mode.message = false;
        global.runtime.display_mode.editor = true;
        return;
    } else if (!global.runtime.display_mode.editor) return;

    global.runtime.keypress_history.force_push_front({
        code: fmt.keyStrID(key),
        display: fmt.formatDisplayKey(key, 9),
        raw: char,
    });

    const k = global.keybinds.codes;

    const curr_key = global.runtime.keypress_history.get(0);
    const last_key = global.runtime.keypress_history.get(1);
    const prev_key = global.runtime.keypress_history.get(2);
    const four_key = global.runtime.keypress_history.get(3);

    switch (last_key ? last_key.code : null) {
        // Mark jumping ====
        case k.new_start:
        case k.new_end:
            const _3_back_was_jump =
                prev_key && (k.new_start === prev_key.code || k.new_end === prev_key.code);
            const _4_back_was_jump =
                four_key && (k.new_start === four_key.code || k.new_end === four_key.code);

            if (_3_back_was_jump && !_4_back_was_jump)
                break;

            backend.jumpToMark(k.new_start === last_key.code, curr_key.raw);
            global.events.emit('redraw_interface');
            return;
    }

    switch (curr_key.code) {
        // Playback audio ====
        case k.play:
        case k.play_end:
            backend.togglePlay(k.play === curr_key.code);
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
            backend.setMark(k.mark_start === curr_key.code);
            break;

        // Export ====
        case k.export:
            backend.exportSelection();
            break;

        // Exit ====
        case k.exit:
            process.kill(process.pid, 'SIGINT');
            break;

        //TODO:
        case k.trim_timeline:
        case k.undo_trim:
            throw new Error("Unimplemented behaviour");
            break;
    }

    if (global.runtime.display_mode.editor)
        global.events.emit('redraw_interface');
});


// Erase screen on exit ====
const interface = require('./interface/mod.js');

process.on('SIGINT', function () {
    interface.eraseInterface();
    process.exit(0);
});

setInterval(() => {}, 1 << 30);
