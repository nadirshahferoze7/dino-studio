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
