# Project state — 2026-11-25

## Vision
One consistent original universe for animated films, interactive 2D/2.5D and 3D experiences, eventual AR and VR. Tone: playful, heartwarming, epic, mysterious. Foldwilds, The Quiet and Fernlight Basin remain proposals, not approved canon.

## Approved
DINO-001: the green smooth explorer dinosaur with red neckerchief and brown crossbody satchel. Owner selected hero and approved front/profile/back turnaround on Nov 24. Large amber eyes, cream muzzle/belly, no hair/scales/spikes. Right-hip bag (viewer left in front view); strap over anatomical left shoulder. Do not mirror. Exact original hashes in identity.json.

## Current engineering
Image Puppet Studio v0.1 was built from actual approved hero/front/side/back textures using Python, OpenCV, NumPy, SciPy, Pillow, FFmpeg and a standalone HTML Canvas atlas viewer. Ten clips rendered: idle, wave, curious, jump, step, tail, profile_idle, hero_idle, back_idle, nod. Prior report: all ten drew nontransparent pixels in headless Chromium with GPU disabled, no page errors; original hero/turnaround SHA-256 matched. MP4 12.708 sec, 24 FPS, 960x540, silent. This is a prototype, not final character rig. Fixed face, baked accessories, approximate stepping, no completed blink/lip sync or XR. Live 3D is not a requirement for current milestone.
 
## v0.2 review candidate — implemented (not approved)
User requested the palm face the viewer. v0.2 uses the existing 72-frame wave atlas and measured fingertip tracks to replace the distal hand with a shaded, three-digit open palm, wrist pivot and small independent wrist oscillation. The site includes a toggle comparing original and corrected hand at the same playback position. CPU Chromium rendered all 72 frames nonempty, zero page errors; eight sampled poses inspected during development. Final shading/transition and artistic fit remain a candidate requiring user review, not a new approved master. Next: enable Pages, verify hosted routes and playback, obtain wave feedback, refine as needed; then blink/gaze.

## Infrastructure
User created this GitHub repository as persistent project memory. Wants a browser-accessible site, version history and no downloads. Proposed GitHub Pages or ChatGPT Sites if available; GitHub Pages deployment and binary import are not verified at initialization. Preserve each iteration and failed experiments. This repository is public; only DINO production information belongs here.

## Recovery
Read asset registry for original package names and expected hashes. Prior chat artifacts are not yet committed as binaries. If assets are missing, recover the originals from the Project/Library or authorized source, verify hashes, then commit. Never fabricate replacements as approved originals.

## Archive backup update
All eight previous ZIP packages were successfully saved in the owner's persistent ChatGPT Library under `DINO Studio Archive`. See docs/ASSET_REGISTRY.md and docs/archive_manifest.json. Git contains the approved hero PNG, all ten v0.1 WebP atlases, static v0.1 viewer and v0.2 wave source/viewer. Remaining source packages and approved turnaround PNG are still backed up in Library, not fully imported. Hosted previews remain pending; GitHub repository metadata returned has_pages=false. Future sessions should retrieve the canonical reference and v0.1 puppet archives there and verify their hashes; no prior chat is required if Library access is available.
