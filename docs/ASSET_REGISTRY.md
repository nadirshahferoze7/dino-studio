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
