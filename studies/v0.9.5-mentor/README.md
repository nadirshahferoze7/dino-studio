# v0.9.5 — Fenrir mentor-range auditions

Owner liked Puck and Fenrir and preferred Fenrir. New desired range: guidance, thoughtful advice, soothing reassurance, jolly encouragement and quiet sadness. No permanent voice locked. This version preserves v0.9.4 and all earlier studies.

Three controlled candidates, five identical approved lines each, all speed1:

| Candidate | Style recipe | Status |
| --- | --- | --- |
| Fenrir |100%am_fenrir | Preferred reference |
| Fenrir + Puck |75%am_fenrir +25%am_puck | Unreviewed variant |
| Fenrir + Michael |70%am_fenrir +30%am_michael | Unreviewed variant |

These ratios are hypotheses for casting, not verified emotional qualities. Kokoro's upstream pipeline supports voice-style blending; deterministic weighted float32 interpolation here produces complete510×256 embedding banks. The two generated binary banks are retained in production/voices, with source hashes/recipes in blend-lock.json. Every line is genuinely re-synthesized through HeadTTS1.3.0, Transformers.js4.3.2 and FP32 timestamped Kokoro CPU inference. No pitch shifting, waveform mixing, paid service, GPU quota or emotion-engine trials.

## Review

Open the version index through GitHub Pages. Select a moment and compare all three; complete five-line MP4s are under each voice. WAVs preserve unchanged engine16-bit mono24kHz PCM in a standard RIFF container. MP3 copies and JSON phoneme/viseme/word timing are saved. The page loads no model or neural worker and requires no inference on mobile. Shared v0.9.4 CSS and exact v0.9.2 speech atlas are reused without edits.

First Fenrir guidance WAV passed duration/PCM/clipping/decode/timing checks before the remaining14. All15 outputs are decoded and validated, including predicted timing bounds and raw/master PCM hashes. Three full24fps previews use0.35s neutral lead and0.5s recovery per line; first/last source character pixels must match exactly. Contact boards and per-frame timelines accompany them. Hosted/browser testing is recorded separately when completed.

## Important limits

No agent auditory assessment or invented artistic scores. Fenrir is preferred based on the director's prior listening; neither new blend is approved. All dialogue intentions are labels for review, not model conditioning. The engine cannot reliably command soothing, joyful or sad acting. Compare whether the actual outputs fit those intentions. Existing visual study remains static-bodied with eight approximate mouth poses and a smiling/rest face; no matching facial acting or approved identity replacement. Timings are model predictions, not acoustic forced alignment. Physical Android/iOS hardware is not part of browser testing. One full-scale sample is present in the Fenrir + Puck jolly take; its audible effect is unassessed. Other takes have no full-scale samples.

## Reproduce on a studio computer

Requires Linux/Node24, Python3 with NumPy/Pillow, FFmpeg, curl and DejaVuSans font at the path in finish.py. About2GB spare RAM. No user installation is needed for review.

```
cd studies/v0.9.5-mentor/production
npm ci --ignore-scripts
python prepare.py ./model
python blend.py ./model
node generate.mjs --first
# Validate first actual WAV and timing before proceeding.
node generate.mjs
python finish.py
```

Model repository/revision/files are pinned in model-lock.json. Use DINO_MODEL for an alternate production model directory. prepare.py verifies upstream file sizes/hashes; blend.py verifies source/output hashes and writes derivative banks into the model voice directory. Saved production/voices binaries can be compared to the regenerated banks. Model weights are not served by the review page. The generator requests raw PCM, avoiding HeadTTS's prior RIFF-size bug while preserving all actual PCM samples. Typographic apostrophes are normalized to ASCII only for language processing; both exact display text and engine input are retained. Existing take pairs are hash-checked and retained; incomplete/conflicting takes stop generation rather than overwrite originals. Cross-platform inference byte determinism is not promised. No new GitHub Actions.


## Hosted verification record
See evidence/hosted-review.json for actual Cloud Chrome playback results and narrow viewport checks. No agent auditory assessment or physical Android/iOS device test is implied. Initial production78files (7,577,658bytes) were compared byte-for-byte with fetched remote Git at e9e4268586b357894d68d53041ae6d93027cb10e; original reference hashes match and previous studies/releases/Actions are unchanged. Later QA notes are saved in a final checkpoint.

Hosted result: all15 MP3s and all3 complete MP4s played to ended in Cloud Chrome. Narrow iframe widths360/390/430px passed overflow/single-column checks, with390px comparison playback. No agent auditory judgment or physical phone test. Full record: evidence/hosted-review.json.
