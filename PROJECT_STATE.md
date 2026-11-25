# Project state — 2026-11-25

## Vision
One consistent original universe for animated films, interactive 2D/2.5D and 3D experiences, eventual AR and VR. Tone: playful, heartwarming, epic, mysterious. Foldwilds, The Quiet and Fernlight Basin remain proposals, not approved canon.

## Approved
DINO-001: the green smooth explorer dinosaur with red neckerchief and brown crossbody satchel. Owner selected hero and approved front/profile/back turnaround on Nov 24. Large amber eyes, cream muzzle/belly, no hair/scales/spikes. Right-hip bag (viewer left in front view); strap over anatomical left shoulder. Do not mirror. Exact original hashes in identity.json.

## Current engineering
Image Puppet Studio v0.1 was built from actual approved hero/front/side/back textures using Python, OpenCV, NumPy, SciPy, Pillow, FFmpeg and a standalone HTML Canvas atlas viewer. Ten clips rendered: idle, wave, curious, jump, step, tail, profile_idle, hero_idle, back_idle, nod. Prior report: all ten drew nontransparent pixels in headless Chromium with GPU disabled, no page errors; original hero/turnaround SHA-256 matched. MP4 12.708 sec, 24 FPS, 960x540, silent. This is a prototype, not final character rig. Fixed face, baked accessories, approximate stepping, no completed blink/lip sync or XR. Live 3D is not a requirement for current milestone.
 
## Immediate next task — v0.2
User likes the wave concept but noticed hand orientation is incorrect. Current arm simply rotates resting hand; nail tips/edge face viewer. Correct it by adding independently controlled wrist/palm and an open-palm texture/pose consistent with the approved anatomy. Raise arm, turn palm toward viewer, gently oscillate wrist, lower arm. Preserve v0.1 as a viewable baseline; inspect keyframes and full playback; no new character face. Record tests and user approval status. Do not mark correction complete before it exists.

## Infrastructure
User created this GitHub repository as persistent project memory. Wants a browser-accessible site, version history and no downloads. Proposed GitHub Pages or ChatGPT Sites if available; GitHub Pages deployment and binary import are not verified at initialization. Preserve each iteration and failed experiments. This repository is public; only DINO production information belongs here.

## Recovery
Read asset registry for original package names and expected hashes. Prior chat artifacts are not yet committed as binaries. If assets are missing, recover the originals from the Project/Library or authorized source, verify hashes, then commit. Never fabricate replacements as approved originals.
