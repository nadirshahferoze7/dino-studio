# v0.8.0 — complete rest-cycle milestone candidate

Owner accepted the v0.7.4 lowering component on2026-11-27: “alright this is fine, now lets complete this milestone.” Approval applies to that component; the complete cycle is newly delivered for review. Approved hero/turnaround unchanged; v0.5.1 remains approved gait.

## Delivered
A13.28-second,319-frame24fps stand → sit → lower → sleep/breathe → stir → head/chest lift → supported push-up → stand sequence. Full cycle plus five action chapters, source-pose mode, play/pause/replay, speed, frame-step, scrub, optional loop and breathing. First and last rendered pixels identical; shared support joins reuse the exact accepted v0.7.4 atlas pose. No ghosted face blends, separate body-part patches or texture morphing. Sixteen unique artwork poses appear in24 atlas slots; duplicate slots make provenance/chapter joins explicit, not a claim of24 independent drawings.

New supported-rise artwork explicitly depicts weight over hands, tucked feet, crouch, push-off and extension. It plays forward for recovery and in reverse with distinct timing for descent. The separately generated sit sheet was rejected for changing proportions; source and original background/halo variants are retained. Early waking reuses the accepted lowering drawings in reverse, then transitions into the new supported rise. This is deliberate reuse, not independently authored waking artwork. Whole-character scale/translation normalizes head width and baseline; these are estimates, not a solved skeleton or physical contact simulation.

Sleeping holds the exact accepted sleeping source with optional whole-sprite scale breathing (maximum0.2% horizontal/0.4% vertical), pivoted at the floor. It is not chest articulation. No dialogue, speech or films.

## Evidence
Exact player.js/timeline.js rendered all319 frames in Node native Canvas: zero empty/clipped/disconnected substantial frames, floor532 throughout, exact first/last pixel equality. Eight adapter playback checks plus18 chapter/breath/loop/end checks passed. See evidence/player-render.json, chapter-controls.json, validation.json. Native Canvas is not Chromium; hosted browser review is recorded separately after publishing.

Inspected actual registered pose board, sampled319-frame playback contact, enlarged face/foot crops and original turnaround. Full action order is complete. Stepped pose changes, head/muzzle/outfit differences, horizontal foot movement and fast inherited tail curl remain visible. This meets the currently accepted sprite approach as a complete review sequence, not a claim of polished continuous skeletal motion. Final full-cycle acceptance belongs to owner.

## Rebuild
Requires Python with Pillow, NumPy/OpenCV; Node with @napi-rs/canvas; FFmpeg. From repo root:

```
python releases/v0.8.0/build.py
node releases/v0.8.0/render_player.cjs /tmp/dino-v080-frames
python releases/v0.8.0/qa_frames.py /tmp/dino-v080-frames
node releases/v0.8.0/qa_controls.cjs /tmp/dino-v080-controls
```

Exact source PNGs and generation prompts retained; rebuilding requires no inference, externalGPU or paid service. Existing v0.7.4 atlas is a direct relative Git dependency, hash in manifest. Source creation used built-in image generation and background extraction edits; edits do not guarantee exact pixel identity with pre-edit originals. All previous release files retained. Next: owner reviews complete performance before speech/lip sync; refine any identified join or contact issue within this versioned pipeline.

Hosted cycle and action controls checked in Cloud Chrome after successful deployment45964102144. Full playback reached sleep, waking support and final standing stop; sampled video also played. All30 production files remotely byte-verified; previous releases unchanged. See evidence/hosted-review.json.
