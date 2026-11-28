# v0.9.5 production notes

Restored model/runtime from pinned locks after the temporary production environment was cleared. npm ci --ignore-scripts loaded bundled Linux x64 CPU runtime successfully. prepare.py verified all model/source-voice hashes; Michael file matched pinned upstream LFS SHA256. No primary-engine substitution or paid inference.

The first Fenrir guidance recording passed before the remaining14. Voice banks use float32 weighted style interpolation supported by upstream Kokoro's mean-blending design. Every line is re-synthesized. All15 PCM hashes are distinct and recipes/transcripts match spec. Exact derivative bank binaries retained, upstream source banks pinned.

Requests use raw PCM; a standard WAV header is added around unchanged samples. This avoids the earlier HeadTTS RIFF header-size defect. All15 WAV/MP3 pairs decode. One full-scale sample in the Fenrir/Puck jolly take is disclosed without an invented audible verdict.

Hosted advice comparison lasted17.675s and exceeded the browser locator wait budget. A fresh inspection confirmed all three media elements reached ended; this was an automation wait limit, not a playback or model failure. No synthesis rerun. Physical Android/iOS hardware not tested.
