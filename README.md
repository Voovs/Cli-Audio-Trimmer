# Simmer v0.0.12 - The Simple CLI Audio Trimmer

Trim audio from the comfort of your shell. Essentially a cli-frontend to ffmpeg.
Helpful if you often trim down audio clips

You can set marks with options passed to the script. Similar to Vim marks, these
can be used as aliases for certain time stamps. These make this script ideal for
trimming audio to match subtitles

Requires `ffmpeg` and `node` somewhere in your path. No npm dependencies!

### State of Project

<strong>Almost works</strong>. Currently at a very early stage of development.
Most of it works, though exporting still doesn't have a dedicated screen.
Exporting won't overwrite files and just crashes if there's a naming conflict.
Otherwise it's usable. Wait for at least v0.1.0 for a more polished experience

<!-- ❌ 🟡 ✅ -->

 - Help menu 🟡
 - Command line arguments 🟡
 - Interface 🟡 (see below)
 - Marks 🟡
 - Adjust selection 🟡
 - User-configured keybindings 🟡
 - Playback 🟡 (missing live timer)
 - Exporting 🟡
 - Timeline trimming ❌
 - Interesting project name 🟡

### How it looks

Current interface is scaled for a 24x80 terminal. Changes based on user
preferences and selections

```
                                 Simmer v0.0.12

┌General Keybinds──────────────────────╥─Selection Keybinds────────────────────┐
│ Keybind │ Action                     ║  Start  │   End   │ Action            │
├─────────┼────────────────────────────╫─────────┼─────────┼───────────────────┤
│ <Enter> │ Trim timeline              ║    j    │    e    │ Jump to mark      │
│    -    │ Undo timeline trim         ║    m    │    k    │ Set mark          │
│  <S-r>  │ Export selection           ║    1    │    4    │ Increase 100ms    │
│  <C-c>  │ Exit Simmer                ║    2    │    3    │ Decrease 100ms    │
│  TODO   │ Exit. Save current session ║ <Space> │    `    │ Play/Pause from   │
└─────────┴────────────────────────────╨─────────┴─────────┴───────────────────┘

                ┌──────────────┬──────────────┬──────────────┐
                │  Start Time  │  Play  Head  │   End Time   │
                ├──────────────┼──────────────┼──────────────┤
                │ 00:00:06.980 │ 00:00:08.510 │ 00:00:10.766 │
                └──────────────┴──────────────┴──────────────┘

                             <             >
                             │             │
0a b          c  d     e     │ f           gh     i    j                 k    l$
││ │          │  │     │     │ │           ││     │    │                 │    ││
█░░░░░░░░░░░░░░░░░░░░░░░░░░░░███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█
00:00:00.000              00:00:06.980 -> 00:00:10.766              00:00:20.040
```
