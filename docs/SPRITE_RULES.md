# DINO-001 whole-body sprite production rules

Status: proposed production standard, not a new character identity. Approved hero and turnaround remain authoritative. Rest puppet revisions v0.6–v0.6.4 are not the production approach.

## Five anchor candidates
| Anchor | Intent | Visual gate |
|---|---|---|
| Standing neutral | Relaxed right-facing profile | Approved rounded head, muzzle, eye, thick tail root, outfit side |
| Seated | Hips low, knees folded, weight supported | Connected shoulders, pelvis and feet |
| Drowsy/lowering | Eyes soften, head and chest lower | Natural neck, forelimb reach, continuous tail and strap |
| Curled sleep | Body lies on ground, eyes closed | Head and body support, no gaps, stable outfit |
| Wake/push-up | Head lifts then forelimb support and chest rises | No early cheerful face, no elongated arms or unsupported body |

v0.7.1 anchors derive from source poses 1, 9, 14, 17, 30 of the same existing v0.7 floor illustration. Review at consistent scale. They are NOT approved replacements for the original art. The 12 unique gold poses establish story beats; full cycle adds selected supporting poses and returns to the exact first image.

## Sprite production
- Complete right-facing whole character per frame, uniform cell and baseline, transparent background, generous margins, stable camera and lighting. Never mirror the asymmetrical accessories. Keep smooth green skin, cream muzzle/belly/tail underside, large amber eyes, original nose and mouth contours, red scarf front knot and flap, brown satchel on anatomical right hip with gold button and buckle, rounded brown nails.
- Preserve thick anatomical tail root, neck, shoulders and hips. No extra fingers, spikes, scales, crests or detached regions; do not paste body parts onto a pose.
- Register by consistent head scale and stable skeletal/contact landmarks, not bounding-box width or tail tip. Uniform whole-character scaling only for registration; source artwork must meet identity before normalization. Exact v0.7.1 registration parameters are in its manifest. Approximate landmarks are not anatomical measurements.
- Build in small batches with matched reference: stand → prepare → bend → sit → drowsy → lower → sleep → stir → head lift → push up → sit → rise → stand. Hold and overlap motions naturally. Do not pad with duplicate or off-model source poses. Do not equate frame count with animation quality. Native artwork quality is essential; upsampling cannot substitute for higher-resolution drawing.
- In-between methods are optional experiments, not automatic acceptance. Reject double contours, facial blurring, ghosting, shrinking tail root and sliding support. Keep source-only comparison.
- Run deterministic frame playback and inspect actual rendered motion, enlarged joint/face crops, matched reference boards, accessory handedness and contact. Check no blank/clipped frames, alpha connectivity and consistent start/end, but do not equate numerical pass with artistic quality. Owner must explicitly accept before an anchor is canon or speech/films begin.
- Save original source, atlas, metadata, viewer, reproducible scripts, test and visual evidence to GitHub. See STORAGE_POLICY.md.

## Next production task
Owner review of v0.7.1 five anchors, gold sequence and full sequence. Once approved, commission/generate matching higher-native-resolution poses in small batches, validate against the exact approved art, then carefully select in-betweens. Avoid repeating low-resolution pose-sheet drift or the rejected cutout rig. 
