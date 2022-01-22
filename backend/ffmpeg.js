const sh = require('child_process');

exports.getAudioLength = getAudioLength;
exports.togglePlay = togglePlay;
exports.exportSelection = saveTrimmedFile;

// Returns the length of the audio file in milliseconds
function getAudioLength(file) {
    const command_vec = [
        `ffprobe`,
        `-v error`,
        `-show_entries`,
        `format=duration`,
        `-of default=noprint_wrappers=1:nokey=1`,
        "'" + file + "'",
    ];

    let time_array;

    try {
        const stdout = sh.execSync(command_vec.join(" ")).toString();
        time_array = stdout.slice(0, -1).split(".");
    } catch (e) {
    }


    try {
        let secs = parseInt(time_array[0]);
        let ms   = parseInt(time_array[1].slice(0, 3));

        return secs * 1000 + ms
    } catch (e) {
        throw Error("Failed to read audio file's length. \n"
            + "`ffprobe` did not output the expected time format.\n"
            + "Try running this command manually to verify the output is in seconds:\n"
            + command_vec.join(" "));
    }
}


function saveTrimmedFile() {
    const o = global.state.user_opts;
    const sel = global.state.selection;

    const command_vec = [
        `ffmpeg`,
        `-i '${o.input_name}'`,
        `-ss ${sel.start}ms`,
        `-to ${sel.end}ms`,
        `-c copy`,
        "-hide_banner",
        "-loglevel error",
        "'" + o.output_name + "'",
    ];

    sh.execSync(command_vec.join(" "));
}


function togglePlay() {
    if (global.state.user_opts.is_playing) {
        global.events.emit('stop_playback');
    } else {
        playAudio();
    }
}


function playAudio() {
    const seek_to = global.state.selection.start;
    const duration = global.state.selection.end - global.state.selection.start;

    if (duration < 100) return;

    const command_vec = [
        "ffplay",
        "-ss", `${seek_to}ms`,
        "-t", `${duration}ms`,
        "-hide_banner",
        "-loglevel", "error",
        "-nodisp",
        "-autoexit",
        global.state.user_opts.input_name,
    ];

    const ffplay = sh.spawn(command_vec[0], command_vec.slice(1));

    global.state.user_opts.is_playing = true;

    global.events.once('stop_playback', () => {
        ffplay.kill();
        global.state.user_opts.is_playing = false;
    });

    // TODO: remove debugging
    //ffplay.stdout.on('data', (data) => console.error(data));
    //ffplay.stderr.on('data', (data) => console.error(`Error: ${data}`));

    ffplay.on('close', () => global.events.emit('stop_playback'));
    ffplay.on('exit',  () => global.events.emit('stop_playback'));
}
