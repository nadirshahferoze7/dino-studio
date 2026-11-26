# Studio website deployment
The static dashboard is `index.html` in the main branch. `.nojekyll` is already present. Releases have permanent relative routes (`releases/v0.1/`, `releases/v0.2/`). Repository metadata checked on 2026-11-25: `has_pages=false`.

One-time setup: repository Settings → Pages → Build and deployment → Source: Deploy from a branch → main → /(root) → Save. GitHub will display the actual published URL. Expected default URL: https://nadirshahferoze7.github.io/dino-studio/ (not live-verified). Check the dashboard and each release URL in a browser; confirm the atlas loads, play/pause, scrub and compare control. Future commits to main update the same site. Keep archived release files unchanged.


## 2026-11-26 — GitHub Pages activation
GitHub repository metadata confirms `has_pages=true` and the [Pages build and deployment workflow](https://github.com/nadirshahferoze7/dino-studio/actions/runs/45763082839) completed successfully for commit `fa809908d251579d6f95c689cf15182ca99c311b`. Studio URL supplied by owner: https://nadirshahferoze7.github.io/dino-studio/ . Version routes: `releases/v0.1/` and `releases/v0.2/`. The assistant's web fetch could not retrieve the hosted pages, so live browser playback is still unverified. Next: owner visual review of corrected palm-forward wave; check both version routes and playback controls. Do not treat deployment success as artistic approval.
