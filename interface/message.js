const fmt = require.main.require('./utils/mod.js');

exports.drawError = drawError;

function drawError(msg) {
    const error_str = `
┌─${              fmt.centerStr(" ERROR ", 76, true, "─")                    }─┐
${fmt.textBlock(msg, 80, "│ ", " │")}
│                                                                              │
│ ${          fmt.centerStr("Press any key to continue", 76)                 } │
└──────────────────────────────────────────────────────────────────────────────┘
`
    process.stdout.cursorTo(0,
        Math.max(0, (24 - error_str.split("\n").length) / 2));
    process.stdout.clearLine();
    process.stdout.write(error_str);
    process.stdout.clearLine();
}
