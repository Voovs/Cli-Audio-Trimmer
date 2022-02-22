const fmt = require.main.require('./utils/mod.js');

exports.savePrompt = savePrompt;


// Prompt the user for a path to save the file into. Prefills the prompt with
// the default path
function savePrompt(callback) {
    process.stdout.cursorTo(0, 12);
    process.stdout.clearScreenDown();

    // Save-as heading
    const start = fmt.formatMilli(global.selection.start);
    const end   = fmt.formatMilli(global.selection.end);

    const prompt_str = `  Save As:   ${  start  } -> ${   end   }\n`;

    process.stdout.write(prompt_str);

    // Default save path
    const default_path = process.cwd() + "/" + global.user_opts.output_name;

    global.readline.clearLine();
    global.readline.prompt();
    global.readline.write(default_path);

    let prev_line = "";
    global.readline.on('line', (line) => {
        if (line !== prev_line) {
            prev_line = line;
            callback(line);
        }
    });
}
