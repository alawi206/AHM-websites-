# Photos

Drop owner-authorized photos here, named after the slot they fill
(`hero.jpg`, `dish-iskender.jpg`, …). The full list of slots, and what each
should show, is in `src/data/media.ts` and in the project README.

- JPEG, PNG, WebP or AVIF; at least 2400px wide for full-bleed slots.
- The build creates AVIF / WebP / JPEG sizes automatically — no manual export.
- Only use a photo in a dish slot when it has been positively identified as
  that dish.
- Until a slot has a file, the site shows a text or art layout instead —
  never a placeholder notice. `npm run dev` lists the empty slots.
