# v0.6.3 — Natural rest polish (review candidate)

Open index.html on GitHub Pages. Retains the 17-second v0.6.2 performance and six clip selectors. Owner said v0.6.2 was much better but needed more improvement; no approval assumed. v0.5.1 remains the accepted baseline.

## Changes
- Rebuilt upper eyelid reveal with source-derived surrounding skin, curved eyelid line and original eye pixels; added two brief independent blinks during seated holds. Slower waking lid reopening, while keeping jaw relaxation independent.
- Eliminated full-head double exposure from standing-to-rig blend: transition now confined to transformed lower body. Feathered tail root and ankle layers; rounded thigh/ankle join; sampled intact torso skin for hidden shoulder patch; filtered green pixels in bag overlay; trimmed duplicated scarf pixels on lower head. A separate scarf-wrap study was rejected visually (doubled band); final uses inherited torso scarf.
- Extended forward arm support within existing reach limit, synchronized torso attachment transforms with breathing; staggered small foot-lift arcs. After assembling pose, translate rendered character to exact original bottom alpha row. This is a global silhouette floor correction, not a biomechanical IK solve or proof that each foot is locked horizontally.

## Actual QA
Run `python releases/v0.6.3/test_render.py /tmp/dino-v063-evidence` with Python, Pillow, OpenCV, NumPy, Playwright, Chromium and FFmpeg. Uses existing ../v0.1/clips/profile_idle.webp, not regenerated artwork. CPU Chromium rendered all 409 samples, 24 fps; 11/11 controls, no JS errors, blank or edge-clipped frames, one significant foreground component each. Both clip boundaries and standing recovery identical. Bottom alpha row exactly 336 for all 409 frames (v0.6.2: 336–341); 1701 timing samples within range. Inspected successive matched 16-pose enlarged sheets and final full contact sheet. Archive includes intermediate source experiments and final MP4/GIF. See validation.json for exact source hashes. Original approved hero/turnaround and archive hashes matched registry. No GPU/API dependency.

Limitations: still a profile-view cutout puppet with approximate reconstructed limbs, shading, scarf drape, eyelids and visible joins in curled poses; source-to-rig lower-body handoff and horizontal foot repositioning are not anatomically perfect. No independent hosted playback check. No claim of final master; owner visual review required. Do not advance to speech until accepted.
