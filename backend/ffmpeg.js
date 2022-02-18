const sh = require('child_process');
const interface = require.main.require('./interface/mod.js');

exports.getAudioLength = getAudioLength;
exports.togglePlay = togglePlay;
exports.exportSelection = saveTrimmedFile;

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


function saveTrimmedFile(path) {
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

    sh.spawnSync(command, args);
    //const stderr = out.stderr.toString();
}


function togglePlay(is_from_start) {
    const playback_type = global.runtime.playback_is_from_start;

    const is_playing = (global.runtime.playback !== null && global.runtime.playback.exitCode === null);
    let is_pause = false;

    if (is_playing) {
        global.runtime.playback.kill();
        global.runtime.playback = null;
        is_pause = global.runtime.playback_is_from_start === is_from_start;
    }

    if (!is_pause) {
        global.runtime.playback_is_from_start = is_from_start;

        const to = global.selection.end;

        const from = is_from_start ? global.selection.start
                : Math.max(to - global.user_opts.play_end_time, 0);

        playAudio(from, to);
    }
}


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

    global.runtime.playback.on('close', interface.writeFFPlayTime);
}
