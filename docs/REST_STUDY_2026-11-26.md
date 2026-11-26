# Rest animation revision — failed quality gate (2026-11-26)

**Status:** not v0.6.1; not published as a release. Owner rejected v0.6 because sitting, sleeping and waking looked incomplete. v0.5.1 is the latest accepted baseline. Preserve all prior version routes and assets.

## Work performed
- Read AGENTS.md, PROJECT_STATE.md, README, CHANGELOG, character Bible, identity, asset registry, archive manifest, publishing/release policy, roadmap and all six studio skills. Recovered both canonical reference and v0.1 artwork puppet archives from Library; archive SHA-256 and original hero/turnaround SHA-256 matched registry. The local profile_idle.webp Git blob SHA cd975ce50591282d5fc841ab37b562fc8903c789 matches the existing Git tree, and SHA-256 is a933ae48af7600af825f184035ce94a438623e83bc499d9085ad2ea7b7eaec0d.
- Root cause of v0.6: it animates two separate secondary sheet crops and fades through an empty frame during wake. No continuous sit-down or body recovery.
- Study A: single approved-profile texture mesh deformation, 16s complete timeline. Visual inspection exposed stretched legs, folded triangles and inadequate sleeping contact; second pass introduced clipping. Rejected.
- Study B: landmark morph between standing and locally re-derived secondary sit/sleep crops (not byte-identical to the compressed v0.6 sprites). Visual inspection exposed duplicated features, flipped triangles and anatomical distortion. Rejected.
- Study C: source-derived head, torso, scarf, satchel, tail, arm and feet plus reconstructed shaded hidden joints, independent head/tail/limb changes, progressive lid closure, sleep breathing, full timeline. Revised tail mask and foot anchors after initial render. This is a 2D layered study, not a full rig or new master.

## Actual output test
Chromium CPU rendered 385 frames at 24fps across 0–16s from the actual viewer with exact archived atlas bytes and script inlined. Tested sleep selection, pause, seek, replay: all four passed. Zero page errors, empty frames or canvas edge clipping; exactly one foreground component above 20 pixels per frame (alpha >=128). Bottom alpha row ranged 336–344 (not perfect ground locking). Inspected successive 12-pose montages and a final 24-pose contact sheet; actual MP4 and GIF rendered. These tests are local, not live GitHub Pages playback. They do not prove natural movement.

**Failed visual gate:** leg anatomy is rounded/reconstructed and foot mechanics remain unconvincing; sleeping pose looks like a forward lean rather than a relaxed curl, elbow and shoulder shading approximate, mouth/lid closure stylized. No new approved assets, no v0.6.1 release, and no claim of hosted deployment for this study.

## Durable archive and reproduction
Library / DINO Studio Archive / DINO_Rest_Study_Rejected_2026-11-26.zip
SHA-256: 767f2850ee31bcafc9d23209f4345b6b563c98529ee4e8f2dd35cc44166b9a3a
Upload succeeded. Contains rejected source experiments, final viewer/rest.js, exact profile atlas, full_test.py, self-contained HTML, MP4/GIF, final contact sheet and validation.json. For reproduction recover and verify ZIP from Library by exact folder listing (ZIP search may not index filenames); see archive README. Run the harness after setting the working root and restoring the relative layout specified there. Git contains this report, not the archive bytes.

## Next task
Do not repeat whole-image mesh stretching or crossfade morphing. Build consistent side/three-quarter seated and curled sleeping key poses from the approved art, reconstruct hidden legs and forearms with separate anatomically coherent segments and contact constraints, then animate anticipation, sit, rest, lower, sleep, head-first wake, push up and return. Compare to exact hero/turnaround, render and inspect transition frames and motion; publish a versioned v0.6.1 candidate only once the visual and functional gate passes. User approval still required for acceptance. No paid GPU or mandatory local user setup.
