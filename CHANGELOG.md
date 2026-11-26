# Production history

## 2026-11-26 — v0.3 eye animation candidate
- Added source-pixel gaze and shaded blink controls on Idle/Wave; pointer tracking and manual blink. Prior versions preserved. Six sampled local Chromium eye renders inspected; integrated and hosted playback pending. Candidate, not approved.

## 2026-11-26 — v0.2.1 accepted
- Owner visually accepted connected-shoulder wave. Marked it as the approved waving baseline, preserved prior releases and selected blinking/eye gaze for the next milestone. No animation code changed.

## 2026-11-26 — v0.2.1 shoulder correction
- Owner flagged the visible underarm seam in v0.2. Added pose-dependent contour reconstruction, source-skin shading and independent comparison control in a new release. Both older versions preserved.
- CPU browser harness: 72/72 frames, zero page errors, 53 changed frames, no out-of-region differences, one significant connected foreground component per corrected frame. Eight visual comparisons inspected. Candidate, not approved. See release validation.json.

## 2026-11-25 — v0.2 palm-forward candidate
- Retained v0.1 atlas/viewer and hero already imported into Git. Added versioned v0.2 browser viewer and wave.js, an open-palm replacement driven by tracked hand coordinates and wrist motion; compare toggle and archive links.
- Local Chromium canvas test: 72/72 nonempty frames, zero page errors; eight sampled poses inspected during development. Final candidate needs owner review. No external AI/API/GPU dependency.
- GitHub Pages is not enabled (repository has_pages=false). Publishing requires one-time Pages configuration; no live preview claimed.

## 2026-11-25 — persistent archive backup
- Copied all eight prior production archives into ChatGPT Library folder `DINO Studio Archive`; recorded local SHA-256 hashes and recovery instructions in Git. No binary Git import or hosting yet.

## 2026-11-25 — repository initialization
- Repository designated project memory by owner. Added durable state, character rules, skill instructions, asset register and release policy.
- Next work: archive image puppet v0.1, correct palm-forward wave, create browser-accessible version history. No new animation or site deployment claimed at initialization.

## 2026-11-25 — image puppet v0.1 (prior chat)
- Exact approved art used as source textures; separated front arm with shoulder/elbow motion; math warps for head/body/tail. Ten clips and browser atlas player. Prior headless GPU-disabled test passed for all ten; no external inference.
- User feedback: wave is good in principle but palm must face viewer. Fixed facial expression and approximate gait remain.

## 2026-11-25 — reconstruction research and artwork deformation
- Investigated Pixal3D, TRELLIS.2, Hunyuan3D-2mv, TripoSR, SAM 3D Objects, img2threejs, UniRig and SkinTokens. No neural reconstruction run; GPU/quotas unacceptable.
- First 6s CPU deformation of exact artwork demonstrated source-based motion.

## 2026-11-24 — explorer identity
- Owner selected red-scarf/satchel Dino and approved three-angle turnaround. Reference pack created; secondary generated sheets are subordinate.
- Code-built explorer sculpt rendered from multiple views but failed face resemblance. Not approved master.

## 2026-11-23–24 — technical experiments
- Early 3D blockout, rigged model and First Light cinematic; technical prototypes but visual quality not accepted.
- Simplified smooth spike-free sprite preferred over rough/scaled crest design. Identity Lock candidate viewer, checks and procedural model built; likeness not accepted.

## 2026-11-21–22 — creative foundation
- Dino is dinosaur-inspired; one shared universe for film and interactive experience; balanced playful/heartwarming/epic/mysterious tone. Foldwilds and Fernlight Basin only proposals.


## 2026-11-26 — GitHub Pages activation
GitHub repository metadata confirms `has_pages=true` and the [Pages build and deployment workflow](https://github.com/nadirshahferoze7/dino-studio/actions/runs/45763082839) completed successfully for commit `fa809908d251579d6f95c689cf15182ca99c311b`. Studio URL supplied by owner: https://nadirshahferoze7.github.io/dino-studio/ . Version routes: `releases/v0.1/` and `releases/v0.2/`. The assistant's web fetch could not retrieve the hosted pages, so live browser playback is still unverified. Next: owner visual review of corrected palm-forward wave; check both version routes and playback controls. Do not treat deployment success as artistic approval.
