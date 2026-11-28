# Make room for everyone — v0.9.6

One30.9-second warm guidance scene with the selected70%Fenrir/30%Michael voice, frozen as DINO-voice-1.0 production baseline. This closes casting and supplies a final acceptance performance; it does not invent approval of the final scene. Exact voice config: characters/DINO-001/voice.json. No recasting, pitch effects or music.

The script addresses making fun of others, hurt, stopping/listening, repair and inclusion. It separates hurtful behaviour from a person's worth: “You matter. They matter too.” It never labels someone bad or blames the target of teasing. SCRIPT.md retains exact production text.

Actual HeadTTS1.3.0/Kokoro CPU FP32 synthesis generated three WAV chapters using the exact pre-existing style-bank hash6ab7a8eea45135d560b9bbd53a3f2c3a02caa3603c997137061d3d8149b4122e. Original chapter WAVs/engine timing are retained. The joined WAV preserves every original PCM sample, with0.4s opening/chapter pauses and1s recovery. No clipping in any chapter. Master WAV/MP3 and rendered H.264/AAC MP4 decoded with FFmpeg.742frames at24fps,30.9167s video. Exact source character neutral recovery. Subtitle timings come from model word timestamps; overlap is normalized. Captions are burned into video and separately stored as VTT.

Existing stable v0.9.2 mouth atlas is reused unchanged, with its welcoming face and still body. No redesign or new sad/joyful facial acting. Predicted timing is not acoustic forced alignment; eight poses remain approximate. Actual sampled rendered contact board inspected. Hosted playback/viewport results recorded separately when tested. No agent auditory assessment or invented artistic scores. The scene awaits director creative review.

## Reproduce (production computer)

Use v0.9.5's pinned package lock/runtime and model lock. In studies/v0.9.5-mentor/production run npm ci --ignore-scripts and python prepare.py MODEL_DIRECTORY. Copy the saved dino_fenrir_michael_70_30.bin from that version's production/voices into MODEL_DIRECTORY/voices and verify its SHA256. Then:

```
DINO_MODEL=MODEL_DIRECTORY node studies/v0.9.6-kindness/production/generate.mjs
python studies/v0.9.6-kindness/production/scene.py
```

Commands above run from repository root. Requires Node24, NumPy/Pillow, FFmpeg and DejaVuSans fonts at the paths used by scene.py. The existing generator uses v0.9.5 runtime by relative path. Existing take pairs are checked and retained, not overwritten. Audio is raw engine16-bit mono24kHz PCM wrapped in correct RIFF headers. All timing uses exact PCM sample counts. Playback requires only static saved files; no runtime/model on mobile. Previous auditions/versions retained. No new Actions.


## Hosted QA
Actual published Cloud Chrome MP4 played to ended30.917s on desktop and in390px iframe viewport.360/390/430px layout checks passed without overflow. Audio-only MP3 playback to14.47s and native pause tested; complete file decoding separately passed FFmpeg. No physical Android/iOS test or auditory quality scoring. See evidence/hosted-review.json. Initial22files byte-verified from remote9120236. Casting/production/playback are technically complete; director creative acceptance of this final scene remains separate.
