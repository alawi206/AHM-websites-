# Demo videos

Short, fast-paced walkthroughs of the site to send to the owner:

| File | Format | Length |
| --- | --- | --- |
| `madrid-cutz-desktop.mp4` | 1920×1080, 30fps, H.264 (8 MB) | 26s |
| `madrid-cutz-mobile.mp4` | 1170×2532 (iPhone portrait), 30fps, H.264 (10 MB) | 24s |
| `madrid-cutz-desktop-small.mp4` | 1280×720 (2.6 MB), for texting | 26s |
| `madrid-cutz-mobile-small.mp4` | 720×1558 (3.2 MB), for texting | 24s |

Both are recorded frame by frame from the production build, so every animation is smooth. That includes the hex-light
power-on, the logo reveal, the scroll effects, the photo viewer and the swipe. The desktop video shows a cursor; the
mobile video shows tap ripples.

## Regenerate (e.g. after adding the original photos)

```bash
npm run build
npm run preview            # keep running in another terminal (http://localhost:4173)
npm run demo:desktop
npm run demo:mobile
```

Requires Playwright with Chromium and `ffmpeg` on the PATH. The storyboards (what is shown, for how long) are at the
bottom of `scripts/record-demo.mjs`.
