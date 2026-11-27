# v0.7.1 — Identity-lock pose review (candidate)

**Not an approved master.** The owner requested a better whole-body sprite method before dialogue, and permanent GitHub-first storage. Original hero and turnaround remain authoritative; v0.5.1 remains the approved animation baseline. The approved source archive and hero/turnaround were recovered and their SHA-256 values matched the registered values (see `validation.json`/project state).

## Delivered
- 28 selected full-body poses from the original v0.7 illustrated floor-rest sheet; 20 poses deferred/omitted. Five anchor candidates (stand, sit, lower chest, curled sleep, wake push-up). A 12-unique-pose gold sequence plus identical standing return; a 28-pose complete rest cycle plus identical return.
- `curated.webp`: transparent 288 × 256 cells, seven columns, four rows. Approximate head-width registration to 94 pixels and hip/satchel reference x=116; alpha floor y=224. Each source is resampled uniformly and translated, never separated or warped by body part. No optical-flow interpolation or mixing with the separate seated/speech sources. The head/hip landmarks are hand-estimated, not verified physical measurements. The chosen source is the lower-resolution illustrated sheet; upsampling does not add native detail. No new high-resolution master artwork is claimed.
- `manifest.json` contains exact source path and hash, cell coordinates, source crop, estimated landmarks, duration and omitted frames. `identity.jpg` and `contact.jpg` show the actual registered poses. `evidence/rest-preview.mp4` and `evidence/browser-contact.jpg` show actual Chromium Canvas output. `index.html` has full/gold/anchor modes, pose inspection, scrub, speed, loop and comparison to original approved turnaround in Git.

## Reproduce
From a Git clone, install Python dependencies Pillow, OpenCV, NumPy, Playwright and Chromium (FFmpeg for MP4; no paid services), then run from repository root:

```
python releases/v0.7.1/build.py releases/v0.7/sources/a_polished_high_resolution_2d_cartoon_sprite_shee.png releases/v0.7.1
python releases/v0.7.1/test_render.py releases/v0.7.1/evidence
```

The local test inlines exact script and atlas bytes because hosted URL access is restricted in this environment. It does not claim hosted playback. 47 timeline entries across three modes (29 full, 13 gold, 5 anchor); 13/13 controls passed, zero JS errors, empty or clipped frames, one substantial alpha component each. Both full/gold recover identical standing pixels. Source floor y=224; actual rendered alpha rows 448–450 on the 576×512 canvas. This measures vertical silhouette alignment, not horizontal contact locking. Reviewed actual source contact sheets and rendered sequence; motion remains discrete/stepped and some source facial proportions and satchel positions vary. The five anchors are candidate reference poses pending owner approval, not canon.

## Next quality gate
Review anchors against approved hero/turnaround. Then produce higher-native-resolution full-body poses using the approved candidate anchors, reject face/accessory drift, lock contact points and test carefully selected in-betweens at actual playback speed. No speech or film work until owner accepts the resting performance. See `../../docs/SPRITE_RULES.md` and `../../docs/STORAGE_POLICY.md`.
