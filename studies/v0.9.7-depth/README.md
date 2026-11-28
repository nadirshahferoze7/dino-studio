# v0.9.7 — controlled voice-depth comparison

Owner requested less youthful, deeper/soothing qualities and proceeded with a30%Fenrir/70%Michael candidate against approved70/30. This explores broad warmth/resonance/reassurance using existing open stock voices. No named-person cloning, celebrity recordings, reference speech or likeness matching. No guarantee that the new ratio sounds deeper or more soothing; no agent auditory verdict or invented scores.

## Controls

Only the style blend changes. Three exact kindness chapters, speaking speed1,0.4s opening/chapter pauses,1s recovery, primary HeadTTS/Kokoro CPU FP32 engine and image atlas remain fixed. No pitch, resampling or waveform effects. Baseline v0.9.6 media are reused by exact existing paths; approved characters/DINO-001/voice.json and all prior studies remain unchanged. Only the director can choose whether this candidate replaces the approved voice.

New style bank: dino_fenrir_michael_30_70,30%am_fenrir +70%am_michael, SHA2567140b7553f9115b7d8e5d55f8d2ebe571e3c549b568ba0fa9a191f3286f06ec4. Exact522,240-byte derivative saved under production/voices with source hashes/recipe in blend-lock.json. Model/runtime locks remain the pinned v0.9.5 locks; model revision dd4401a9add81ac692d20e240d22ec9dda82cc29. No new dependency or engine experiments.

## Actual outputs and evidence

Three original24kHz mono16-bit WAV chunks plus raw/normalized timing; joined32.2s master WAV/MP3;773-frame32.2083s H.264/AAC talking video; VTT and full combined performance JSON. Original PCM preserved exactly in joined master. No clipped samples. All original WAVs and full WAV/MP3/MP4 decode with FFmpeg; timing bounds pass, exact source-neutral recovery; nonoverlapping subtitles. Rendered full contact board visually inspected. Existing welcoming study expression, still body and eight coarse mouth poses retained; no full emotional acting or acoustic forced alignment. Prior approved poster/atlas are reused without duplication. Hosted QA recorded separately when complete.

The page has native full audio/video players plus an A→B opening-paragraph control, using the saved first-chapter endpoints. Media pause one another. Saved recordings/timing only: no model loads or inference on mobile. Browser tests do not establish sound quality or physical Android/iOS compatibility.

## Reproduce on production computer

Install existing v0.9.5 locked runtime (npm ci --ignore-scripts), run its prepare.py against a model directory and verify hashes. Then, from repository root:

```
python studies/v0.9.7-depth/production/blend.py MODEL_DIRECTORY
DINO_MODEL=MODEL_DIRECTORY node studies/v0.9.7-depth/production/generate.mjs
python studies/v0.9.7-depth/production/scene.py
```

NumPy/Pillow, FFmpeg, DejaVuSans and Node24 as in previous production. blend.py writes exact stock-style interpolation and a recipe/hash lock. generate.mjs uses the prior pinned runtime via relative package path; existing complete takes are hash-checked and retained, incomplete/conflicting pairs stop. scene.py preserves original PCM and writes media/timing. Model is not served for review. No new Actions, paid inference or GPU quota.
