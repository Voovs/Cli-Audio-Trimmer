const sh = require('child_process');

exports.getAudioLength = getAudioLength;
exports.togglePlay = playAudio;
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


function saveTrimmedFile(input_file, output_file, start_time, end_time) {
    const command_vec = [
        `ffmpeg`,
        `-i '${file}'`,
        `-ss ${start_time}`,
        `-to ${end_time}`,
        `-c copy`,
        "-hide_banner",
        "-loglevel error",
        "'" + output_file + "'",
    ];

    sh.execSync(command_vec.join(" "));

    return true
}


function playAudio(file) {
    const command_vec = [
        `ffplay`,
        "-hide_banner",
        "-loglevel error",
        "-nodisp",
        "-autoexit",
        "'" + file + "'",
    ];

    sh.execSync(command_vec.join(" "));

    return true

}
