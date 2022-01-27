# Simmer v0.0.10 - The Simple CLI Audio Trimmer

Trim audio from the comfort of your shell. Essentially a cli-frontend to ffmpeg.
Helpful if you often trim down audio clips

You can set marks with options passed to the script. Similar to Vim marks, these
can be used as aliases for certain time stamps. These make this script ideal for
trimming audio to match subtitles

Requires `ffmpeg` and `node` somewhere in your path. No npm dependencies!

### State of Project

<strong>Barely works</strong>. Currently at a very early stage of development.
Lots of odd bugs. Wait for at least v0.1.0 before using

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

                                 Simmer v0.0.10

------------------------------------------      -------------------------------
| Keybind | Action                       |      |      Current selection      |
|---------|------------------------------|      -------------------------------
| <Space> | Pause/Play selection         |      |  Start time  |   End time   |
|    ,    | Choose new start             |      | -------------|--------------|
|    .    | Choose new end               |      | 00:00:07.580 | 00:00:10.601 |
| <Enter> | Trim timeline to selection   |      |      -       |      n       |
|    -    | Undo timeline trim           |      -------------------------------
|    [    | -100ms to start              |
|    ]    | +100ms to end                |
|    {    | +100ms to start              |
|    }    | -100ms to end                |
|  <C-[>  | Export selection             |
------------------------------------------

                             <             >
                             │             │
0a b          c  d     e     │ f           gh     i    j                 k    l$
││ │          │  │     │     │ │           ││     │    │                 │    ││
 ░░░░░░░░░░░░░░░░░░░░░░░░░░░░███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
00:00:00.000              00:00:07.580 -> 00:00:10.601              00:00:20.040
```
