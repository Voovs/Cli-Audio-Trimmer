Sample interfaces for the user. Concept sketches below

# Characters used
[See box characters at](https://en.wikipedia.org/wiki/Box-drawing_character)
```
─ u2500 Horizontal line
│ u2502 Vertical line
┌ u250c Right down corner
└ u2514 Right up corner
┐ u2510 Left down corner
┘ u2518 Left up corner
├ u251c Left mid connect
┤ u2524 Right mid connect
┬ u252c Top mid connect
┴ u2534 Bottom mid connect
┼ u253c 4-way connect
▲ u25b2 Up arrow
◄ u25c4 Left arrow
► u25ba Right arrow
▼ u25bc Down arrow
```

Loading bars from https://changaco.oy.lc/unicode-progress-bars/
```
██▁▁
██░░
##──
==--
```

# Main view
```
                                                                                 
                                  Simmer v0.0.9                                  
                                                                                 
┌─────────┬──────────────────────────────┐      ┌─────────────────────────────┐  
│ Keybind │ Action                       │      │      Current selection      │  
├─────────┼──────────────────────────────┤      ├──────────────┬──────────────┤  
│ <Space> │ Pause/Play selection         │      │  Start time  │   End time   │  
│    j    │ Choose new start             │      ├──────────────┼──────────────┤  
│    e    │ Choose new end               │      │ 00:00:07.580 │ 00:00:10.666 │  
│ <Enter> │ Trim timeline to selection   │      │      f       │      g       │  
│    -    │ Undo timeline trim           │      └──────────────┴──────────────┘  
│    1    │ -100ms to start              │                                       
│    2    │ +100ms to start              │                                       
│    3    │ -100ms to end                │                                       
│    4    │ +100ms to end                │                                       
│  <S-r>  │ Export selection             │                                       
└─────────┴──────────────────────────────┘                                       
                                                                                 
                             <             >                                     
                             │             │                                     
0a b          c  d     e     │ f           gh     i    j                 k    l$ 
││ │          │  │     │     │ │           ││     │    │                 │    ││ 
█░░░░░░░░░░░░░░░░░░░░░░░░░░░░███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█ 
00:00:00.000              00:00:07.580 -> 00:00:10.666              00:00:20.040 
```

# Concept views
Subject to change

# Main view with separated menu layer
```
                                                                                 
                                 Simmer v0.0.10                                  
                                                                                 
┌General Keybinds──────────────────────╥─Selection Keybinds────────────────────┐ 
│ Keybind │ Action                     ║  Start  │   End   │ Action            │ 
├─────────┼────────────────────────────╫─────────┼─────────┼───────────────────┤ 
│ <Enter> │ Trim timeline              ║    j    │    e    │ Jump to mark      │ 
│    -    │ Undo timeline trim         ║    m    │    k    │ Set mark          │ 
│  <C-[>  │ Export selection           ║    1    │    4    │ Increase by 100ms │ 
│  <C-c>  │ Exit Simmer                ║    2    │    3    │ Decrease by 100ms │ 
│  <Tab>  │ Exit. Save current session ║ <Space> │    `    │ Play/Pause from   │ 
└─────────┴────────────────────────────╨─────────┴─────────┴───────────────────┘ 
                                                                                 
                ┌──────────────┬──────────────┬──────────────┐                   
                │  Start Time  │  Play  Head  │   End Time   │                   
                ├──────────────┼──────────────┼──────────────┤                   
                │ 00:00:07.900 │    Paused    │ 00:00:07.900 │                   
                └──────────────┴──────────────┴──────────────┘                   
                             <             >                                     
                             │             │                                     
0a b          c  d     e     │ f           gh     i    j                 k    l$ 
││ │          │  │     │     │ │           ││     │    │                 │    ││ 
█░░░░░░░░░░░░░░░░░░░░░░░░░░░░███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█ 
00:00:00.000              00:00:07.580 -> 00:00:10.666              00:00:20.040 
```

# Save view
```
                                                                                 
                                 Simmer v0.0.10                                  
                                                                                 
                  ┌Saving Keybinds────────────────────────────┐                  
                  │ Keybind │ Action                          │                  
                  ├─────────┼─────────────────────────────────┤                  
                  │ <Enter> │ Save file                       │                  
                  │  <C-r>  │ Save file with overwrite        │                  
                  │  <C-o>  │ Pause/Play selection            │                  
                  │  <C-k>  │ Back to timeline                │                  
                  └─────────┴─────────────────────────────────┘                  
                                                                                 
 ┌─Save as─────────────── 00:00:07.580 -> 00:00:10.666 ───────────────────────┐  
 │                                                                            │  
 │  /Users/emiliko/desktop/mpv/word_save_100/timmer.mp3                       │  
 │                                                                            │  
 └────────────────────────────────────────────────────────────────────────────┘  
                                                                                 
                             <             >                                     
                             │             │                                     
0a b          c  d     e     │ f           gh     i    j                 k    l$ 
││ │          │  │     │     │ │           ││     │    │                 │    ││ 
█░░░░░░░░░░░░░░░░░░░░░░░░░░░░███████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█ 
00:00:00.000              00:00:07.580 -> 00:00:10.666              00:00:20.040 
```
