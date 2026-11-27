# v0.7.4 — focused lowering transition study

Unapproved production experiment, not a finished rest cycle. v0.5.1 remains the approved animation baseline; all previous release files remain unchanged.

Eight new whole-body poses cover hands supporting → elbow flexion → chest/chin lowering → forearm rest. One reference-conditioned generation, with exact inputs and prompt in PROMPT.md. Native 1774×887 RGBA original retained verbatim; no guarantee that image generation will reproduce its bytes. Whole-character translations register the rightmost substantial foreground (estimated outer hand) to x470 and silhouette floor to y532. No source rescaling, separate limb patches, optical flow, crossfade or texture morph. Largest alpha component and a two-pixel fringe retained per cell. Lossless atlas has 640×576 cells, four columns. The 3.12-second study is deliberately one-way; first/last images differ, and loop is off by default. It is not joined to the v0.7.3 rest cycle.

## Actual checks and visual findings
Exact player.js/timeline.js rendered all 75 frames at 24fps using Node native Canvas. Zero empty/clipped frames, one substantial alpha component per frame; floor row532 throughout. Eight native-adapter UI checks passed (play/pause/next/previous/seek/replay/source/study). This is NOT Chromium or hosted playback evidence. Alpha alignment is not anatomical foot locking.

Inspected source and registered boards against approved turnaround, and sampled exact-player rendered motion frames and enlarged face/feet crops. Lowering is distributed across more closely spaced poses than the previous large final jump. Remaining failures: fast tail curl at poses6→7, visible head-volume/camera and satchel variation, stepped drawings, and only approximate support registration. Elbows are not controlled by a shared skeleton. No claim of polished continuous motion. No waking/standing recovery or speech/film work. Keep as a focused study; do not promote as an accepted master.

## Reproduction
Requires Python with Pillow, NumPy, OpenCV; Node with @napi-rs/canvas; FFmpeg. From repository root:

```
python releases/v0.7.4/build.py
node releases/v0.7.4/render_player.cjs /tmp/dino-v074-frames
python releases/v0.7.4/qa_frames.py /tmp/dino-v074-frames
```

Next: refine the tail/contact path over this same small transition and stabilize head and satchel volumes before expansion. Do not hide drift with morphs or issue another broad full-cycle pose batch. Approved originals must remain unchanged. Hosted inspection is recorded separately when performed.
