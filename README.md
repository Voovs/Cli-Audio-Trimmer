# Simmer v0.1.0 - The Simple CLI Audio Trimmer

Trim audio from the comfort of your shell. Essentially a cli-frontend to ffmpeg.
Helpful if you often trim down audio clips

You can set marks with options passed to the script. Similar to Vim marks, these
can be used as aliases for certain time stamps. These make this script ideal for
trimming audio to match subtitles

Requires `ffmpeg`, `ffplay`, and `node` somewhere in your path. No npm
dependencies!

### State of Project

It'll work, probably... Changing keybindings requires manually editing
`./initialize/global_state.js` and timeline trimming doesn't work yet

<!-- β π‘ β -->

 - Help menu π‘
 - Command line arguments π‘
 - Interface β
 - Marks β
 - Adjust selection β
 - User-configured keybindings β
 - Playback β
 - Exporting β
 - Timeline trimming β
 - Interesting project name β

### How it looks

Current interface is scaled for a 24x80 terminal. Example:

```
                                  Simmer v0.1.0

βGeneral Keybindsβββββββββββββββββββββββ₯βSelection Keybindsβββββββββββββββββββββ
β Keybind β Action                     β  Start  β   End   β Action            β
βββββββββββΌβββββββββββββββββββββββββββββ«ββββββββββΌββββββββββΌββββββββββββββββββββ€
β <Enter> β Trim timeline              β    j    β    e    β Jump to mark      β
β    -    β Undo timeline trim         β    m    β    k    β Set mark          β
β  <S-r>  β Export selection           β    1    β    4    β Increase 100ms    β
β  <C-c>  β Exit Simmer                β    2    β    3    β Decrease 100ms    β
β  TODO   β Exit. Save current session β <Space> β    `    β Play/Pause from   β
βββββββββββ΄βββββββββββββββββββββββββββββ¨ββββββββββ΄ββββββββββ΄ββββββββββββββββββββ

                ββββββββββββββββ¬βββββββββββββββ¬βββββββββββββββ
                β  Start Time  β  Play  Head  β   End Time   β
                ββββββββββββββββΌβββββββββββββββΌβββββββββββββββ€
                β 00:00:06.980 β 00:00:08.510 β 00:00:10.766 β
                ββββββββββββββββ΄βββββββββββββββ΄βββββββββββββββ

                             <             >
                             β             β
0a b          c  d     e     β f           gh     i    j                 k    l$
ββ β          β  β     β     β β           ββ     β    β                 β    ββ
ββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββββ
00:00:00.000              00:00:06.980 -> 00:00:10.766              00:00:20.040
```
