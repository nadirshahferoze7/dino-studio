# Asset registry — import backlog

This registry describes actual previously produced packages, not claims they are already present in Git. Original files were available in the prior chat execution environment at repository initialization. Preserve original filenames and check hashes when importing.

| Package | Status / contents |
|---|---|
| Project_DINO_Studio_Pack_v0_1.zip | Earlier 3D blockout; Godot project; rejected visual direction |
| Project_DINO_Studio_Pack_v0_2.zip | 25-bone rig, seven animations, First Light cinematic; not approved likeness |
| DINO_Identity_Lock_v1_Candidate.zip | procedural smooth GLB, ten clips, viewer, skills; rejected candidate |
| DINO_001_Approved_Reference_Pack.zip | **Canonical source**: approved/hero.png, approved/turnaround.png, guides/front.png, guides/profile_facing_right.png, guides/back.png, reference/design_sheet.png, expressions.png, movement.png, identity.json, verification script |
| DINO_001_Explorer_Sculpt_Candidate.zip | code-built continuous sculpt with separate scarf/satchel; rejected likeness; unrigged and dense |
| DINO_Reconstruction_Test_Pack.zip | exact approved images, scorecard, research; external GPU demos not executed and not acceptable as dependency |
| Dino_Artwork_Animation_Source.zip | first exact-artwork deformation test (6 sec, 180 frames, CPU) |
| DINO_Artwork_Puppet_Studio_v0_1.zip | current prototype: assets, ten WebP atlases, source/rig.py, source/build.py, source/finish.py, source/viewer_template.html, source/clip_manifest.json, validation.json, standalone HTML, MP4, GIF and previews |

Canonical SHA-256 values are in characters/DINO-001/identity.json. Original hero is 2,265,452 bytes; turnaround 1,527,126 bytes. Original PNGs are authoritative, not compressed preview substitutes.

Archive versions under releases/<version>/ with manifests and relative preview URLs. Preserve all earlier builds; do not relabel rejected models as approved. Prefer a complete source import, original images and build instructions over a large monolithic viewer with embedded duplicate media. GitHub Pages should serve versioned static previews, not just the current release.

## Persistent archive backup — 2026-11-25
All eight packages above were successfully copied to the owner's ChatGPT Library folder `DINO Studio Archive`. This is a separate persistent backup, not GitHub binary storage. When resuming from a new chat, locate packages by exact filename in the owner's Library, recover them using authorized file access, and compare SHA-256 against [archive_manifest.json](archive_manifest.json). Start with the approved reference pack and image puppet v0.1. The manifest hashes were calculated from the local source ZIPs before the Library copy; recheck on recovery. If Library is unavailable, report that the original files cannot yet be retrieved from Git alone. Do not use regenerated art as a substitute. The site is still not deployed.

## Git import and v0.2 candidate
Verified repository tree includes characters/DINO-001/approved/hero.png (2,265,452 bytes), releases/v0.1/index.html and ten v0.1 WebP atlases. v0.2 reuses those atlases by relative path, adds wave.js and its own viewer; v0.1 untouched. Full v0.1 source, turnaround and archived experiments remain in Library, not yet fully in Git. GitHub Pages metadata has_pages=false; configure source main / (root) and verify before declaring published.

## v0.6 rest assets
Two secondary movement-sheet crops (sit.webp, sleep.webp) stored in releases/v0.6. Exact provenance and hashes in provenance.json. These are derived candidate poses, not canonical originals.


## Rejected rest study archive (2026-11-26)
`DINO_Rest_Study_Rejected_2026-11-26.zip` saved in Library / DINO Studio Archive. Includes source, exact existing profile atlas, actual full-sequence renders, validation, and failed approach notes. SHA-256: 767f2850ee31bcafc9d23209f4345b6b563c98529ee4e8f2dd35cc44166b9a3a. Not a release; no new binary assets committed to Git. See [rest study report](REST_STUDY_2026-11-26.md).


## v0.6.1 rest review archive
`DINO_v0.6.1_Review_Pack.zip` saved in Library / DINO Studio Archive; SHA-256 bcbe7c4022f717a8b4ed640587ed7255a12fe139a6288c83ce8e9cbc6171f797. Source viewer, renderer, test harness and validation also committed in releases/v0.6.1. ZIP includes exact original profile atlas, render video/GIF/contact sheet, screenshots and intermediate experiments. Original approved art and previous release assets unchanged.


## v0.6.2 continuity archive
`DINO_v0.6.2_Review_Pack.zip` saved in Library / DINO Studio Archive; SHA-256 2b5743df6bcaed82b2415aa3e1ea3b01cfe2e889a5691a91b9ecf9efa00ce733. Contains source, exact original profile atlas, actual rendered MP4/GIF, contact sheets, validation and intermediate studies. Source/tests also in releases/v0.6.2. No approved artwork changed.


## v0.6.3 natural rest archive
`DINO_v0.6.3_Review_Pack.zip` saved in Library / DINO Studio Archive; SHA-256 c360a19915c5a5f4a36e1faedee2bf584bf4fa564d6b67fb657326278717efc0. Contains source, exact existing profile atlas, actual MP4/GIF, contact sheets, validation and intermediate studies. Source/test files also in releases/v0.6.3. No approved artwork changed.


## v0.6.4 structural body archive
`DINO_v0.6.4_Review_Pack.zip` saved in Library / DINO Studio Archive; SHA-256 628ec7824b10d460d4efce80b8e0673f294ba6fd8c480b8227e98484a4a1d051. Contains source, exact existing profile atlas, actual MP4/GIF, comparison/contact sheets, validation and intermediate studies. Source and test files also in releases/v0.6.4. No approved artwork changed.


## v0.7 sprite engine archive
`DINO_v0.7_Sprite_Review_Pack.zip` saved in Library / DINO Studio Archive; SHA-256 46881c67243c38e2f81c28cda36128e46cab4d3c4ff267c3b00e861386e596bf. Includes three exact generated source PNGs, 128 cleaned sprites in PNG/WebP atlases, 83 optional interpolated frames in WebP, source/test scripts, actual MP4s and visual evidence. Five WebP atlases and manifest committed in releases/v0.7. Original approved artwork unchanged; generated assets are candidates.


## v0.7.1 — directly stored identity-lock review assets
Exact original source `releases/v0.7/sources/a_polished_high_resolution_2d_cartoon_sprite_shee.png` already in Git. `releases/v0.7.1/` contains curated.webp, identity.jpg, contact.jpg, evidence/rest-preview.mp4, evidence/browser-contact.jpg, manifest.json, builder, player, viewer, validation and release notes. Binary SHA-256 in validation and exact Git blob IDs in the archive inventory direct-release record. No required Library-only v0.7.1 asset. Candidate, not approved; original art unchanged.

## 2026-11-27 — interrupted v0.7.2 recovered
Recovered exact v0.7.2 binary/source transfer contents into releases/v0.7.2; all original recorded hashes match. Original ZIP itself not found; no original ZIP checksum claim. Recovered all six pending historical ZIPs and verified full SHA-256/CRC; fourteen archive concatenations pass locally. See docs/RECOVERY_2026-11-27.md (or RECOVERY_2026-11-27.md from docs) for detailed limitations and reproduction. All 56 intermediate sprites inspected on enlarged sheets: facial and outfit blending, unsupported seated soles, premature waking smile remain failures. v0.5.1 stays approved. The six-pose morph is not a polished resting performance; next author smaller, physically supported whole-body pose gaps. Local fresh browser launch blocked by environment Unix socket restriction; original validation retained as historical evidence. No dialogue/films.

## 2026-11-27 — recovery verified; authored-pose study v0.7.3
Recovery b125bd2 verified from remote-fetched bytes: all 14 historical ZIP SHA-256 values match across 90 stored files/parts. v0.7.2 Pages run 45954097034 succeeded; sampled hosted controls and rendered sprites independently tested. New v0.7.3 contains three generated six-pose sheets and original rejected fourth gap study, lossless 18-pose atlas, explicit 10.43-second timeline, no morph/crossfade, and approximate whole-image sleep breathing. Exact player executed with native Canvas for all 250 video frames: no empty/clipped/disconnected substantial frames, ground532 and exact standing recovery. This is not Chromium testing. Face and shoulder/hip/tail/feet crop boards inspected. Crisp features, grounded seated soles and delayed waking expression improve specific issues, but stepped motion, accessory/camera/head drift, sleep sheet boundary and reverse-sit recovery remain unresolved. Do not mark accepted or proceed to speech. See releases/v0.7.3/README.md and PROMPTS.md. Next test must solve one difficult transition with matched authored in-betweens or a genuinely unified representation before expanding another full cycle. No more broad sprite batches on the assumption they produce continuous motion.


## v0.7.4 focused transition source
Original RGBA sources/lowering-eight.png and deterministic derivatives under releases/v0.7.4. Source SHA-256 and cell registration in manifest.json; rendering and control checks in evidence/player-render.json. Unapproved study; exact approved artwork unchanged.


## v0.8.0 complete rest cycle
New source PNGs, rejected sit and background variants, prompts, deterministic build/player, lossless atlas and rendered/QA evidence in releases/v0.8.0. Accepted v0.7.4 rest atlas reused by exact path/hash. Manifest records native source hashes/registration; originals and previous releases unchanged. Full cycle pending review.


## v0.9.4 prerecorded neural auditions — 2026-11-28
Fifteen original engine WAVs in audio/, matching RIFF-corrected masters in masters/,15 MP3 playback copies and15 full engine/normalized timing JSONs. Three five-line H.264/AAC videos, render timelines, contact boards and production scripts/locks under studies/v0.9.4-auditions. Model revision/hashes pinned upstream; no model in review path. No approved voice or new identity. Asset inventory and remote verification recorded with this version.

Recovered speech-study originals are now in studies/v0.9.1-speech/recovered (remote-verified6f626fe). Original PNG hash matches the pre-existing v0.9.1 manifest; builder unchanged. v0.9.1a refinement builder/evidence remain unlocated. Hosted playback/viewport evidence in v0.9.4 evidence/hosted-review.json; audio quality remains for actual listening/creative approval.


## 2026-11-28 — mentor-range continuation
v0.9.5 adds15 new original WAV masters,15 MP3s,15 raw/normalized timing JSONs and3 five-line MP4s under studies/v0.9.5-mentor, with render/QA evidence and production scripts. Two exact derivative style-vector banks retained under production/voices; upstream model/source voice bytes pinned by revision/hash. Exact prior speech atlas/CSS reused without modification. Fenrir director-preferred; blends unreviewed.

Hosted v0.9.5 QA verified all15 MP3/3 MP4 plays to end and narrow CSS viewport checks. Original78 version files byte-verified from remote e9e4268; final evidence/inventory/restart additions committed separately. All original references and prior studies unchanged. No permanent voice selection.


## 2026-11-28 — selected-voice acceptance scene
v0.9.6-kindness retains3 original selected-voice WAV chapters and timing JSONs, joined unchanged-PCM WAV master, MP3, captioned MP4, VTT, full performance timing, source generation/scene scripts and validation/contact evidence. Existing style bank and mouth atlas referenced by exact path/hash; no duplicates. characters/DINO-001/voice.json freezes the selected production recipe.
