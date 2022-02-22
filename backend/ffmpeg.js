const sh = require('child_process');
const interface = require.main.require('./interface/mod.js');

exports.getAudioLength = getAudioLength;
exports.togglePlay = togglePlay;
exports.exportSelection = exportSelection;
exports.stopPlayback = stopPlayback;

// Returns the length of the media file in milliseconds
function getAudioLength(file) {
    const command = "ffprobe";
    const args = [
        "-v", "error",
        "-show_entries",
        "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        file,
    ];

    const ffprobe = sh.spawnSync(command, args);
    let time_array = ffprobe.stdout.toString().slice(0, -1).split(".");

    try {
        let secs = parseInt(time_array[0]);
        let ms   = parseInt(time_array[1].slice(0, 3));

        return secs * 1000 + ms
    } catch (e) {
        throw Error("Failed to read audio file's length. \n"
            + "`ffprobe` did not output the expected time format.\n"
            + "Try running this command manually to verify the output is in seconds:\n"
            + command + " " + args.join(" "));
    }
}


// Saves selection into given path
function exportSelection(path) {
    const command = "ffmpeg";
    const args = [
        "-i", global.user_opts.input_name,
        "-ss", `${global.selection.start}ms`,
        "-to", `${global.selection.end}ms`,
        "-c", "copy",
        "-hide_banner",
        "-loglevel", "error",
        path,
    ];

    const ffmpeg = sh.spawnSync(command, args);

    if (ffmpeg.status === 0) {
        interface.drawMsg(`Trimmed audio at: ${path}`, "Saved audio");
    } else {
        interface.drawMsg(
            `Exit code: ${ffmpeg.status}\nError message:\n${ffmpeg.stderr}`,
            `FFMPEG failed to save the audio`);
    }
}


// Toggles between playing the audio. Playing is done from the start of
// selection, or a user-specified amount before the end of the selection
function togglePlay(is_from_start) {
    const is_playing = (global.runtime.playback !== null
                        && global.runtime.playback.exitCode === null);

    if (is_playing) {
        stopPlayback();
    } else {
        const to = global.selection.end;

        const from = is_from_start
                ? global.selection.start
                : Math.max(to - global.user_opts.play_end_time, 0);

        playAudio(from, to);
    }
}


// Kills the ffplay process
function stopPlayback() {
    const is_playing = (global.runtime.playback !== null
                       && global.runtime.playback.exitCode === null);

    if (is_playing) {
        global.runtime.playback.kill();
        global.runtime.playback = null;
    }
}


// Play back audio in given range
function playAudio(from, to) {
    const duration = to - from;

    if (duration < 100) return;

    const command = "ffplay";
    const args = [
        "-ss", `${from}ms`,
        "-t", `${duration}ms`,
        "-hide_banner",
        //"-loglevel", "error",
        "-nodisp",
        "-autoexit",
        global.user_opts.input_name,
    ];

    global.runtime.playback = sh.spawn(command, args);
    global.runtime.playback.stderr.on('data', (data) => {
        interface.writeFFPlayTime(data);
    });

    global.runtime.playback.on('close', () => {
        if (global.runtime.display_mode.editor)
            interface.writeFFPlayTime();
    });
}
