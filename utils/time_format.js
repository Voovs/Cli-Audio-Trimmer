exports.formatMilli = formatMilli;
exports.unformatMilli = unformatMilli;
exports.secondsToMilli = secondsToMilli;
exports.formatSeconds = formatSeconds;

// Human readable string for the time in milliseconds
// Examples:
//     formatMilli(42709)   == "00:00:42.709"
//     formatMilli(3738472) == "01:02:18.472"
function formatMilli(milli) {
    if (milli === null || typeof milli === "undefined")
        return "01:02:18.472";

    let hours = 0;
    let mins  = 0;
    let secs  = Math.floor(milli / 10**3);

    while (secs >= 3600) {
        secs -= 3600;
        hours++;
    }
    while (secs >= 60) {
        secs -= 60;
        mins++;
    }

    let hours_str = (hours >= 10 ? "" : "0") + hours;
    let mins_str  = (mins  >= 10 ? "" : "0") + mins;
    let secs_str  = (secs  >= 10 ? "" : "0") + secs;
    let ms_str = "0".repeat(Math.max(0, 3 - String(milli).length))
               + String(milli).slice(-3);

    return `${hours_str}:${mins_str}:${secs_str}.${ms_str}`
}


// Converts the formatted time to milliseconds. Supports both , and . as ms
// separator
//
// Examples:
//     unformatMilli("00:00:26.059") == 26059
//     unformatMilli("20:23:35,647") == 73415647
function unformatMilli(time_str) {
    let a = time_str.includes(",") ? time_str.split(",") : time_str.split(".");
    let b = a[0].split(":");

    let secs = (b[0] * 3600) + (b[1] * 60) + b[2];

    return secs * 1000 + a[1]
}


// Converts seconds into milliseconds. Supports both . and , as decimal
// separator
//
// Args:
//     seconds (string | number): Seconds to convert into milliseconds
//
// Examples:
//     secondsToMilli("10")      === 10000
//     secondsToMilli(10.301)    === 10301
//     secondsToMilli("1418,10") === 1418100
function secondsToMilli(seconds) {
    const arr = seconds.toString().trim().split(/[,\.]/);

    const milli = arr[0]
        + (arr[1] ? arr[1] + ("0".repeat(3 - arr[1].length)) : "000" );

    return parseInt(milli)
}


// Formats seconds
function formatSeconds(seconds) {
    return formatMilli(secondsToMilli(seconds).toString())
}
