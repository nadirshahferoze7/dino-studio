# v0.7.2 — Native full-body pose and motion study

Review candidate, not approved canon. The user requested continuing the higher-native-resolution whole-body sprite method after v0.7.1. The approved reference remains `characters/DINO-001/approved/hero.png` and `turnaround.png`, and v0.5.1 remains the approved animation baseline. No dialogue or film work was started.

## Delivered
- Six new complete right-facing native source poses in `sources/rest-anchors.png` (1536×1024 transparent image; extracted native silhouettes up to 499×491 px). Whole-image uniform registration only, scale 0.98–1.03, estimated hip x=260 and alpha floor y=532 on transparent 640×576 cells. The source was compared visually to the approved turnaround. Generated face, camera angle, feet and satchel details remain approximate, not exact identity. No part-separated rest puppet.
- `anchors.webp`: six lossless whole-body poses. `motion.webp`: 56 experimental whole-image landmark-guided in-betweens in eight transitions. Hand-estimated 25 landmark correspondences plus canvas boundary constraints, thin plate spline inverse mapping of complete images and signed-distance silhouette blending. No runtime articulated deformation or external inference.
- The full cycle plays for 13.61 seconds, with standing, bend, seated, drowsy support, curled sleep, sleepy wake, seated, bend and standing. The source-only comparison uses exactly the six anchor images. `manifest.json` records all details. `identity.jpg` shows registered poses. `evidence/rest-preview.mp4` and `evidence/browser-contact.jpg` are actual Chromium Canvas output, not a mockup.
- The initial unconstrained DIS optical flow experiment was rejected for duplicate heads and feet. `studies/flow-review.jpg` and source code reproduce the experiment; its bulky derived atlas is intentionally reproducible rather than duplicated. The first landmark attempt had poor curled-tail mapping; `studies/landmark-first-review.jpg` and `source/landmark-first.py` preserve the attempt. A revised tail landmark and direct sleepy-wake-to-seated path were selected. Two generated infographics were rejected as unsuitable; their depicted release claims, checkmarks and commit IDs are fabricated illustration text, NOT verified project results. Preserve originals in the studies archive, not as production previews.

## Reproduction
From a Git clone, install Python, Pillow, NumPy, OpenCV, SciPy, Playwright, Chromium and FFmpeg. From repository root:

```
python releases/v0.7.2/source/build.py releases/v0.7.2/sources/rest-anchors.png releases/v0.7.2
python releases/v0.7.2/source/landmark.py releases/v0.7.2
python releases/v0.7.2/source/pack.py releases/v0.7.2
python releases/v0.7.2/test_render.py releases/v0.7.2/evidence
```

The viewer is self-contained with the two atlas files; no GPU or paid inference dependency. The QA harness inlines exact player script and atlas bytes, because hosted URL navigation is restricted. It renders every actual timeline entry at native 640×576: 65 motion, 9 source-only and 6 anchor entries. All 12 controls passed, zero JS errors, no blank/clipped entries, maximum one alpha component above 64 pixels per entry. Alpha threshold floor row 532 throughout. Both rest modes start/end with pixel-identical standing pose. This is not a proof of anatomical or horizontal foot locking. Actual rendered contact sheet and interpolation triplets visually inspected.

## Limitations and next gate
Native poses are much larger than the previous 48-pose concept crops, but the chosen in-betweens still blend facial features, scarf, bag and feet in difficult transitions. The source seated feet and sleep curl differ considerably; physical support and body mass are not guaranteed by alpha checks. Source-only motion is deliberately stepped. The motion candidate is not production-perfect. Next: obtain matching newly drawn intermediate poses, especially seat-to-hands-down, sleep-to-head-lift, and wake-to-seat. Reject any visible duplicate face, limbs or narrowed tail. User visual acceptance remains mandatory; no speech or film yet.
