# v0.7 — Whole-body sprite engine (review candidate)

The owner rejected v0.6.4's continuing disconnected appearance and narrowed tail root. This version abandons joint-layer deformation for generated, complete profile-view source poses. These new poses are not approved identity masters. The original approved artwork and all historical releases remain unchanged.

## Preview
`index.html` offers independent seated rest (48 source poses), curled floor sleep (48 concept-sheet poses) and an expression-study atlas (32 source poses; not speech/lip sync). 192×192 transparent cells, 8 columns, common silhouette floor at source y=176. The registered sequence includes only selected source poses; exact first/last standing pixels on both rest sequences. Optional 44 seated and 39 floor in-between images computed by CPU DIS optical flow on premultiplied alpha. No runtime network or GPU/inference dependency. Controls: mode, play/pause, replay, source/interpolated, frame steps, timeline, speed, loop, sheet view. Source-only frames are available to compare.

## Production assets
WebP atlases and exact manifest are in this release. Full PNG atlases, original generated PNG sheets, test videos and comparison sheets, and source scripts are archived in the DINO Studio Archive Library ZIP. Input hashes in manifest. Generated floor source was a labelled illustration; no claim it originally had uniform cells or a real 24 fps timeline. Its 48 silhouettes are recovered from five rows, not all used in playback.

## Reproduction
Recover the three source PNG files from the archive's `sources/` folder. From this release directory, use Python with Pillow, NumPy, OpenCV:

```
python source/build.py /path/to/sources
python source/interpolate.py
python source/build_player.py
python test_render.py /path/to/evidence
```

The test additionally requires Playwright/Chromium and FFmpeg. Test harness inlines exact asset bytes because browser file navigation was blocked; no hosted playback claim. Source-only and intermediate atlases are separate, and the assets can be reused by another Canvas/PixiJS player. See validation.json for actual browser frames and exact hashes. Rendering inspected via final contact sheets and sampled interpolation triplets.

## Limitations and next step
This is a new production pipeline prototype, not approved artwork or fully polished natural animation. Generated poses vary in proportions, scale, eyes and accessories. The clean rest sheet shows seated dozing only; the separate floor sleep uses the lower-resolution illustrated sheet and has noticeable pose/scale changes. Intermediate images sometimes blur eyes and mouth. Silhouette alignment is not anatomical horizontal foot locking. No audio, phoneme timing or lip sync. Review both rest cycles before progressing to a new higher-resolution matching floor-sleep atlas and speech. Do not mark v0.7 accepted without owner approval.
