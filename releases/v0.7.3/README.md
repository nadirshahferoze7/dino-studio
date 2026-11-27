# v0.7.3 — authored whole-body pose staging study

**Unapproved study. Not a perfected resting animation or accepted creative milestone.** Approved hero and turnaround and accepted v0.5.1 remain unchanged.

## What changed
Three six-pose native sprite sheets replace the six-anchor morph experiment. The standing-to-seated progression uses grounded bent-knee poses; lowering places hands on the floor; waking starts closed-eyed, then opens to a sleepy slit and uses forelimb support. Closed mouth throughout avoids the previous early cheerful recovery. Whole-body frames preserve crisp features without crossfading, optical flow or separate limb layers.

All eighteen poses are registered using integer whole-image translation, approximate hip positions and alpha floor 532. There is no independent scaling of body parts, no mirrored art and no texture interpolation. The 10.43-second sequence displays 24 timed pose entries, with exact standing recovery. Recovery reverses the sit poses and is not independently authored standing performance. The optional sleep breathing study scales the complete sprite about its baseline by at most 0.2% horizontally / 0.4% vertically; it is approximate and can be disabled.

A fourth six-pose lowering-gap attempt failed to distribute the movement: the final sleep pose still jumped substantially. It is retained in studies/rejected-lowering-gap.png and is NOT used in playback. It also changes bag/strap and head details. Do not treat it as approved source.

## Actual rendering and QA
- build.py rendered 250 offline Pillow frames and a video; validation.json labels this accurately.
- render_player.cjs executes the exact player.js and timeline.js with @napi-rs/canvas and a minimal DOM adapter. It rendered all 250 frames with no runtime error; this is native Canvas output, **not Chromium or a browser UI test**.
- All 250 native Canvas frames: no empty/clipped frames, one component above 64 pixels, alpha ground row 532 throughout, exact first/last image bytes. These checks do not establish physical foot locking or artistic success.
- evidence/player-preview.mp4 is the exact-player Canvas render; evidence/rest-preview.mp4 is the first offline render. Both are preserved. Player contact sheet and enlarged face and joint/feet boards were inspected against the approved turnaround and recovered v0.7.2.
- Fresh local Chromium was blocked by workspace Unix socket restrictions. Hosted controls and actual page rendering must be tested separately after publishing. See project recovery audit for v0.7.2 hosted checks.

## Artistic evaluation
Crisp eyes, closed mouths, continuous source silhouettes, grounded soles and delayed waking expression improve specific defects over v0.7.2. Motion remains stepped. Cross-sheet head shape, camera/pose proportions, satchel size/strap hardware and horizontal contact drift remain visible. The rendering is a useful blocking/staging study, **not a convincing final natural performance**. It trades morph artifacts for pose steps and does not establish overall animation acceptance. In particular, source 11→12 changes the sleep silhouette, source 17→5 changes eye state during recovery, and the lower-to-curled change is still under-authored. Do not hide these failures with another dissolve.

## Reproduction
From repository root, with Python + Pillow/NumPy/OpenCV + FFmpeg:

```
python releases/v0.7.3/build.py
```

With Node, @napi-rs/canvas and FFmpeg:

```
node releases/v0.7.3/render_player.cjs /tmp/dino-v073-frames
```

The source files are original generated PNGs including their alpha. Extraction retains the largest alpha component and its 2-pixel fringe in each cell; no new anatomy is painted by the extraction script. Source file SHA-256, estimated registration and exact timeline are in manifest.json. No inference is required to rebuild from stored bytes. Image generation is not deterministic; prompts describe provenance rather than guaranteeing exact regeneration.

## Next production decision
Do not commission more broad sheets and assume they will form a natural animation. Keep this candidate as a sharp pose reference and contact/timing study. The blocker is dense, consistent authored motion artwork: head volume, planted contacts, hand/body occlusion and accessory paths must agree from drawing to drawing. Investigate a genuinely unified deformable character representation with explicit contact constraints, or individually authored matched in-betweens; test one difficult lower-to-sleep transition before expanding the full cycle. Preserve identity and compare directly with original art. No dialogue, lip sync or films until owner acceptance of resting performance.
