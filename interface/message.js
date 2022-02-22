const fmt = require.main.require('./utils/mod.js');

exports.drawMsg = drawMsg;

// Draws an error message box in the middle of the display
//
// Example: (truncated width)
//   drawMsg("Wrong path: /home/emiliko/Documents", "Title") ===
//   ┌──────────────────────────── Title ───────────────────────────────┐
//   │ Wrong path: ~/Documents                                          │
//   │                                                                  │
//   │                     Press any key to continue                    │
//   └──────────────────────────────────────────────────────────────────┘
function drawMsg(message, err_title = "ERROR") {
    let msg = fmt.tildeHome(message);
    let title = " " + err_title + " ";

    const error_str = `
┌─${                fmt.centerStr(title, 76, "─", true)                      }─┐
${            fmt.textBlock(msg, 80, "│ ", " │", " ", false)                   }
│                                                                              │
│ ${          fmt.centerStr("Press any key to continue", 76)                 } │
└──────────────────────────────────────────────────────────────────────────────┘
`
    process.stdout.cursorTo(0,
        Math.floor(
            Math.max(0, (24 - error_str.split(/\r\n|\r|\n/).length) / 2)));
    process.stdout.clearLine();
    process.stdout.write(error_str);
    process.stdout.clearLine();

    global.runtime.display_mode.message = true;
}
