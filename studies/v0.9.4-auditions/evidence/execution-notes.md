# Execution notes — 2026-11-28

The normal npm install failed while attempting an optional ONNX binary feed through the environment proxy. npm ci/install with --ignore-scripts retained bundled Linux x64 CPU binaries, which loaded and executed the real model. No inference-engine substitution. A premature server initialization read an incomplete model download and failed protobuf parsing; the completed model SHA-256 matched pinned upstream before successful execution. Direct HeadTTS worker invocation avoids a server and loopback isolation. No upstream synthesis code was modified.

The first synthesis gate validated real PCM and timing; subsequently QA found HeadTTS's RIFF-size field undercounted by4bytes, causing Python wave to omit two tail samples. All original bytes are retained and masters repair only that size field. Puck Curious has3 full-scale samples; disclosed without an invented audible assessment.

Local Chromium was absent; the Playwright browser download endpoint returned403. Actual hosted playback testing therefore uses Cloud Chrome. Initial published-route404 occurred while Pages deployment was running, then cleared after deployment; no new Actions were introduced. The responsive iframe harness exercises the real page at360/390/430 CSS pixels, separately from actual phone hardware.
