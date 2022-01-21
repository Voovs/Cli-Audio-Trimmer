# Simple Audio Trimmer v0.0.4

Trim audio from the comfort of your shell. Essentially a cli-frontend to ffmpeg.
Helpful if you often trim down audio clips

You can set marks with options passed to the script. Similar to Vim marks, these
can be used as aliases for certain time stamps. These make this script ideal for
trimming audio to match subtitles

Requires `ffmpeg` and `node` somewhere in your path. No npm dependencies!

### State of Project

<strong>Does NOT work</strong>. Currently at a very early stage of development.
Wait for v1.0.0 before using

<!-- ❌ 🟡 ✅ -->

 - Help menu 🟡
 - Command line arguments 🟡
 - Interface 🟡 (see below)
 - Marks ❌
 - Adjust selection 🟡
 - Playback 🟡
 - Exporting 🟡
 - Timeline trimming ❌
 - Interesting project name ❌

### How it looks

Current interface is scaled for a 24x80 terminal. Changes based on user
preferences and selections

```

                                  Audio Trimmer

------------------------------------------      -------------------------------
| Keybind | Action                       |      |      Current selection      |
|---------|------------------------------|      -------------------------------
| <Space> | Pause/Play selection         |      |  Start time  |   End time   |
|    ,    | Choose new start             |      | -------------|--------------|
|    .    | Choose new end               |      | 01:02:18.472 | 01:02:18.472 |
| <Enter> | Trim timeline to selection   |      |      -       |      -       |
|    -    | Undo timeline trim           |      -------------------------------
|    [    | -100ms to start              |
|    ]    | +100ms to end                |
|    {    | +100ms to start              |
|    }    | -100ms to end                |
|  <C-[>  | Export selection             |
------------------------------------------

                            6                                           e
                            |                                           |
 1    2         3 45        |  7   8    9  ab           c      d        |     $
 |    |         | ||        |  |   |    |  ||           |      |        |     |
<==============================================================================>
00:00:00.000              01:02:18.472 -> 01:02:18.472              03:30:18.300
```
