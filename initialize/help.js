#!/usr/bin/env node

exports.printHelpMessage = printHelpMessage;

function printHelpMessage() {
const help_msg = `\
Audio Trimmer v0.0.2

USAGE:
    audio-trimmer [OPTIONS] <audio-file>

FLAGS:
    -h, --help            Print this message
    --help-interactive    Print help message for interactive mode

OPTIONS:
    -m, --mark  <time-ms>    Sets a mark. Can be specified multiple times
    -s, --start <time-ms>    Sets a mark and starts selection
    -e, --end   <time-ms>    Sets a mark and ends selection

ARGS:
    <audio-file>    Audio file to trim
`;

    console.log(help_msg);
}


//TODO
const help_interactive = `\
Audio Trimmer v0.0.2

Use marks and manual adjustment to select an audio interval. Marks can be
loaded with command-line options or manually. Marks 0-9 are reserved for the
user to specify

Once you have selected an interval to your liking, listen with the play/pause
key. Export then <C-c> to close
`;
