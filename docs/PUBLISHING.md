# Studio website deployment
The static dashboard is `index.html` in the main branch. `.nojekyll` is already present. Releases have permanent relative routes (`releases/v0.1/`, `releases/v0.2/`). Repository metadata checked on 2026-11-25: `has_pages=false`.

One-time setup: repository Settings → Pages → Build and deployment → Source: Deploy from a branch → main → /(root) → Save. GitHub will display the actual published URL. Expected default URL: https://nadirshahferoze7.github.io/dino-studio/ (not live-verified). Check the dashboard and each release URL in a browser; confirm the atlas loads, play/pause, scrub and compare control. Future commits to main update the same site. Keep archived release files unchanged.
