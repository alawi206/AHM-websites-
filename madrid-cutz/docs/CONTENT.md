# Content, photos and verification

The site follows one rule: **nothing is presented as fact unless it has been verified.** Every business detail lives in
`src/content/site.ts`. Details that were found publicly but are not yet confirmed are stored with `verified: false` and are
not rendered.

## Where the information came from

The live Booksy profile could not be opened from the build environment (the network policy blocked `booksy.com`), and the
screenshots/photos referenced in the brief were not attached to the build session. Data therefore comes from the brief
plus search-engine snapshots of public listings (Booksy, Yelp, Yahoo Local, Facebook). Verify the items below against
the live Booksy profile and with the owner before launch.

## Status

| Item | Value | Status | Where it shows |
| --- | --- | --- | --- |
| Name | Madrid Cutz | ✅ Brief + all listings | Everywhere |
| Address | 901 Auburn Way N, Suite D, Auburn, WA 98002 | ✅ Brief + all listings | Hero, Trust strip, Visit, Footer, JSON-LD |
| Booking link | `booksy.com/en-us/1090147_madrid-cutz_barber-shop_39184_auburn` | ✅ Brief | Every "Book" button |
| Rating | 5.0 on Booksy | ✅ Brief screenshots | Hero chip, Trust strip, Reviews |
| Review count | 777 in screenshots → displayed as **750+** | ✅ (re-check live count) | Hero chip, Trust strip, Reviews |
| Services | Haircut · Haircut & Beard · Kids Haircut | ⚠️ From Booksy search snapshots | Services (names only) |
| Prices / durations | Haircut $35 · Haircut & Beard $50 · Kids (under 10) $30 · ~45 min | ❌ Hidden — snapshot data | Set `price` / `duration` in `services` |
| Barbers | AJ, Adam, Mar, Abbas, Isaiah | ⚠️ From the brief's Booksy screenshots | Barbers, Trust strip count |
| Hours | Yelp: Mon–Fri 10–7, Sat 9–7, Sun 10–5 (other directories disagree) | ❌ Hidden | Set `hours.verified = true` |
| Phone | (253) 737-5646 (Yelp / Yahoo / Facebook listings) | ❌ Hidden | Set `phone.verified = true` |
| Instagram | @madridcutz | ❌ Hidden — handle unconfirmed | Set `verified: true` in `socials` |
| Facebook | facebook.com/p/Madrid-Cutz-Barbershop-61553226029361 | ❌ Hidden — unconfirmed | Set `verified: true` in `socials` |
| Reviews (quotes) | — | ❌ None yet | Add verbatim entries to `reviews` |

Notes:

- Public snippets mention AJ, Adam, Mar and Abbas in reviews. Isaiah did not appear in the snippets, and one aggregator
  mentioned a "Romo". Confirm the current roster on Booksy.
- When the hours are verified, add `openingHoursSpecification` to the JSON-LD in `index.html`. Do the same for `telephone`.
- The Services section deliberately sends people to Booksy for live prices, so prices on the site can never go stale. If
  the owner prefers to show prices, fill in `price` and `duration` and they appear on each row.

## Reviews

`reviews` in `site.ts` is intentionally empty. Each entry must be copied **word for word** from the live Booksy profile,
with the shop's permission, and use the reviewer's first name exactly as shown. Never paraphrase or write a review. As soon
as the list has entries, the Reviews section shows them as quote cards under the rating visual.

```ts
export const reviews: Review[] = [
  { name: 'First name as shown', rating: 5, text: 'Exact text from Booksy…', barber: 'AJ' },
]
```

## Photos

Real photography is the biggest upgrade available. The pipeline is automatic: drop files in, then run `npm run dev` or
`npm run build`. Images are resized to responsive AVIF/WebP and lazy-loaded. They are never upscaled, stretched or
cropped in the gallery.

| Folder | What | Naming |
| --- | --- | --- |
| `src/assets/photos/work/` | Haircut portfolio (gallery + lightbox) | `fade-01.jpg`, `taper-02.jpg`, `beard-01.jpg`, `style-01.jpg`, `kids-01.jpg` |
| `src/assets/photos/barbers/` | Barber portraits (3:4) | `aj.jpg`, `adam.jpg`, `mar.jpg`, `abbas.jpg`, `isaiah.jpg` |
| `src/assets/photos/shop/` | `hero.jpg`, `about.jpg`, `visit.jpg` | Exactly these names |
| `src/assets/video/` | Optional hero film | `hero.mp4` / `hero.webm` |

Until gallery photos exist, the gallery shows a designed portfolio panel that links to the live Booksy profile. It
never shows stand-in haircut images. Custom alt text can be added per file in `ALT_OVERRIDES` (`src/content/media.ts`).

Photo checklist:

- Use only real Madrid Cutz work and interiors that the owner has approved. No stock photos, and no AI-generated haircuts.
- Prefer originals of 1600px or more on the long edge. Avoid phone screenshots and compressed re-uploads.
- Leave the cropping to the gallery (it shows the full frame). For `hero.jpg`, keep the subject off the bottom-left,
  where the headline sits.

## Regenerating the ceiling renders and social image

With `npm run dev` running:

```bash
npm run render:art      # src/assets/art/*.jpg (stills of the hex-light shader)
npm run render:social   # public/og-image.jpg + public/apple-touch-icon.png
```
