# v0.6.4 — Connected body (review candidate)

Owner feedback on v0.6.3: motion is much better, but body parts look disconnected. The approved change is a structural rebuild of the profile rest puppet, not a new character. v0.5.1 remains the latest accepted baseline.

## Implementation
The 17-second v0.6.3 timing and facial channels are retained. `rest.js` replaces the rigid torso cutout with a continuous implicit skin surface (smooth union of pose-driven neck/chest/back/pelvis/near-leg/upper-arm/root shapes). The tail is fused via a signed-distance field derived from the existing profile texture. Original face, textured distal arm, feet and separately masked scarf, strap and satchel remain source-based. No mirroring. The skin shading and hidden regions are reconstructed, not approved original pixels. The previous original-pose handoff is retained only near standing. Structural anchors and radii vary with the pose; this is not a newly drawn seven-pose turnaround or a full 3D rig.

## Review and reproduction
Open `index.html` via GitHub Pages, play Full sequence, then compare with v0.6.3. Reproduce local evidence using `python releases/v0.6.4/test_render.py <output-directory>` from a checkout with Python, Playwright, Chromium, Pillow, NumPy, OpenCV and FFmpeg installed. Existing `releases/v0.1/clips/profile_idle.webp` is the only image dependency. All 409 frames rendered, no blank/clipped frames or JS errors, one significant component per frame, all 11 viewer checks passed, both shared boundaries and original standing recovery identical. Silhouette bottom row 336 in every sample (not an anatomical contact lock). 1701 timing samples within range. Actual enlarged matched pose sheets and final contact sheet inspected; source and intermediate variants are archived separately. No direct hosted playback verification. See validation.json for exact hashes.

## Remaining limitations
The continuous body is softer and less detailed than the source artwork; the near thigh/foot, wrist/shoulder and scarf still use approximations, the belly shading differs, and contact/sliding and accessory drape can improve. The fused tail contour is resampled. Profile only; no claim of master rig or finished film. Owner creative approval is required before speech work.
