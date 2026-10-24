# Sofra Turkish Grill — Website Redesign

A premium, mobile-first redesign of [sofratg.com](https://sofratg.com/) for **Sofra Turkish Grill**,
24228 104th Ave SE, Suite 105, Kent, WA 98031. Prepared by **AHM Digital LLC** as a client proposal.

- **Pages:** Home · Menu · Our Story · Catering & Events · Contact · 404
- **Stack:** React 19, Vite 8, Tailwind CSS 4, TypeScript. No UI or animation libraries — motion is
  CSS plus two small scroll hooks, and routing is a ~100-line router (`src/lib/router.tsx`).
- **Output:** every page is prerendered to static HTML (fast first paint, full SEO), then hydrated.
  Deploys to any static host.

> **Photography status:** the site uses Sofra's real business details, menu and reviews. It
> contains **no food photography yet**: no authorized originals could be retrieved while building
> (see [Photos](#photos)). The site is designed to look finished without them. Dishes are presented
> as text-led menu cards, and the large atmospheric areas use typographic art panels. Visitors
> never see a placeholder or "awaiting" notice. Each photo appears automatically once its file is
> added. See the [owner approval checklist](#before-launch--owner-approval-checklist) before going
> live.

---

## Quick start

Requires Node.js 20.19+ (or 22.12+).

```bash
cd sofra-turkish-grill
npm install
npm run dev          # local development at http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build → `dist/` (client build, server build, prerender of every route, sitemap, robots.txt) |
| `npm run preview` | Serves `dist/` at http://localhost:4173 exactly like a static host (clean URLs, real 404, compression) |
| `npm run typecheck` | TypeScript check |
| `npm run check:links` | After a build, requests every external link and embed in the site and reports any that fail |

Run `npm run check:links` on your own machine before every demo or launch. It confirms the ordering,
reservation, catering, Google Maps and Instagram links all respond.

---

## Editing content

All content lives in `src/data/`. Edit these files rather than the components.

| File | Contents |
| --- | --- |
| `business.ts` | Name, address, phone, email, hours, social links, ordering / reservation / catering URLs, production `SITE_URL`, footer credit |
| `menu.ts` | Every menu category, item, price and variant (e.g. Shashlik: Chicken $28 / Beef $35 / Lamb $35). Add an optional `description` to any item once the owner supplies one — it renders automatically and is included in search. |
| `reviews.ts` | Google reviews quoted on the original site. Entries without `text` stay hidden. |
| `media.ts` | Photo slots: what each should show, alt text, crop position (desktop and mobile), fallbacks |
| `seo.ts` | Page titles, meta descriptions and structured data (schema.org `Restaurant` and `Menu`) |

Changes to `business.ts` update the header, footer, hero, contact page, sticky mobile bar,
structured data and map links in one place.

### Photos

Drop owner-authorized photos into `src/assets/photos/`, **named after the slot**, e.g. `hero.jpg`.
The build automatically produces responsive AVIF, WebP and JPEG versions (640–2400px) plus a tiny
blurred preview. No manual export is needed. Use JPEG/PNG/WebP, ideally 2400px+ wide for full-bleed
slots.

| Slot file name | What it should show | Used on |
| --- | --- | --- |
| `hero` | The communal table spread — the strongest food photo | Home hero (also falls back into the menu hero, the story's "table" chapter and catering) |
| `welcome-main` | Dining room, warmly lit (portrait) | Home "Welcome" (arch frame) |
| `welcome-detail` | Turkish coffee or tea service (square) | Home "Welcome" inset |
| `dish-lamb-chops` | Lamb Chops | Signature dishes |
| `dish-iskender` | Iskender Kebab | Signature dishes |
| `dish-manti` | Manti | Signature dishes |
| `dish-mix-meat-pide` | Mix Meat Pide | Signature dishes |
| `dish-shashlik` | Shashlik Kebab | Signature dishes |
| `dish-baklava` | Baklava | Signature dishes |
| `experience-grill` | Kebabs / shashlik on the grill | Home "Sofra Experience" (falls back to `dish-shashlik`) |
| `experience-pide` | Pide fresh from the oven | Home "Sofra Experience" (falls back to `dish-mix-meat-pide`) |
| `experience-table` | Guests sharing a full table | Home "Sofra Experience" (falls back to `hero`) |
| `experience-welcome` | Turkish tea and coffee | Home "Sofra Experience" (falls back to `welcome-detail`) |
| `catering-main` | A catering spread / event | Home catering, Catering page |
| `catering-detail` | Platter detail | Home catering |
| `menu-hero` | Dishes from above | Menu page hero |
| `story-hero` | Restaurant interior | Our Story hero, Catering "Group dining" |
| `story-kitchen` | In the kitchen | Our Story |
| `story-table` | A table set for sharing | Our Story (arch frame) |
| `catering-hero` | Event or group celebration | Catering page hero |
| `contact-hero` | Storefront or dining room | Contact page hero |

**Minimum set for a strong demo:** `hero`, `welcome-main`, `welcome-detail`, the six `dish-*`
photos and `catering-main`. The fallbacks fill most other slots automatically.

**How the site behaves while a photo is missing** (nothing tells the visitor a photo is missing):

| Where | Without a photo | With a photo |
| --- | --- | --- |
| Signature dishes (home and menu page) | Framed menu cards (number, category, name, price) alternating ivory and espresso | That dish's card shows its photo in an arch medallion. Once **all six** dishes have photos, the home section switches to a full photo grid. |
| Full menu | Text menu with dotted price leaders; signature dishes marked with a gold star | Unchanged (the menu stays text-led) |
| Home hero, page heroes | Ember-toned art panel with the Turkish lattice behind the headline | Full-bleed photo with a dark gradient for legibility |
| Welcome arch, catering arch, "Sofra Experience" chapters | Typographic art: a Turkish word and its meaning (*Hoş geldiniz* — Welcome, *Afiyet olsun* — Enjoy your meal, *Ateş* — Fire, *Fırın* — Oven, *Sofra* — The table, *Çay* — Tea) | Photo |
| Welcome and catering insets, Our Story photo pair, Catering page card headers | Left out; the layout closes up | Photo |

`npm run dev` logs the slots that still have no file. The words and tones for the art panels are set
per slot in `media.ts` (`art`, `tone`).

Rules:

- Only use photos Sofra owns or has authorized. Never use photos from other restaurants or stock
  photos presented as Sofra.
- Only place a photo in a `dish-*` slot once it has been **positively identified** as that dish.
- After adding a photo, check its `alt` text and crop (`position` / `mobilePosition`) in `media.ts`.
  When a slot borrows another slot's photo (`fallback`), the alt text and crop of the photo's own
  slot are used, so the description always matches the image.

**Dishes that still need original photos:** all of them. No authorized photo of any menu item is in
the project yet. Priority: Lamb Chops, Iskender Kebab, Manti, Mix Meat Pide, Shashlik Kebab and
Baklava (the six signature dishes), then the hero table spread and the dining room. Customer photos
on Yelp, Google or delivery apps belong to the people who took them, so they are not used.

### Logo

The header and footer use a typographic SOFRA wordmark with an eight-point star. To use the official
logo, add `src/assets/brand/logo-light.svg` (for dark backgrounds) and optionally
`logo-dark.svg` (for light backgrounds). PNG or WebP also work. The wordmark is replaced
automatically.

---

## External integrations

The site connects to Sofra's **existing** systems. It does not take payments, hold a cart or collect
form data itself.

| Action | Destination | Where it appears |
| --- | --- | --- |
| Order Online | `https://sofraturkishgrillwa.com/store/` | Header, hero area, menu page, mobile sticky bar, footer, contact |
| Reserve a Table | `https://tmt.spotapps.co/reservations?spot_id=364253` | Header, hero, menu, story, contact, visit section, mobile sticky bar |
| Plan Your Event (catering) | `https://tmt.spotapps.co/catering?spot_id=364253` | Home catering section, Catering page, contact, footer |
| Directions / map | Google Maps URLs (no API key) built from the address | Hero, visit section, contact, footer |
| Reviews | Google Maps listing search for the restaurant | Reviews section |
| Instagram | `https://www.instagram.com/sofratg/` | Footer, contact |
| Phone / email | `tel:` and `mailto:` links | Throughout |

External links open in a new tab, announced to screen readers. The map is a lazy-loaded Google Maps
embed with a styled fallback and an "Open in Google Maps" link. To use a specific Google Business
Profile link for reviews, replace `maps.reviews` in `business.ts`.

---

## Deployment

The build output in `dist/` is plain static files.

- **Netlify:** set the base directory to `sofra-turkish-grill`. Build settings come from
  `netlify.toml` (`npm run build`, publish `dist`).
- **Vercel:** set the root directory to `sofra-turkish-grill`. Settings come from `vercel.json`
  (clean URLs, long-term caching for `/assets`).
- **Cloudflare Pages:** root directory `sofra-turkish-grill`, build command `npm run build`, output
  `dist`.
- **Any other static host:** upload `dist/`. The host must serve `/menu` from `menu/index.html`, as
  all major hosts do, and should serve `404.html` for unknown paths.

Before launch, set `SITE_URL` in `src/data/business.ts` to the final domain. It drives canonical URLs,
Open Graph tags, the sitemap and structured data.

---

## What's included

**Design system:** warm ivory, espresso, dark olive and antique gold, adjusted so every text pairing
meets WCAG AA (`--color-gold-deep` is the text-safe gold on light backgrounds). Cormorant Garamond and
Manrope are self-hosted variable fonts, with the above-the-fold files preloaded. Motifs are an
eight-point star (Rub el Hizb) and a Turkish geometric lattice, plus an Ottoman pointed-arch image
mask. Tokens live in `src/styles/index.css`.

**Motion:** CSS-only hero entrance (runs before JavaScript loads), masked word reveals, clip-path image
wipes, a pinned scroll story ("The Sofra Experience") and light hero parallax. Everything is disabled
under `prefers-reduced-motion`, where the scroll story becomes a simple stacked layout. If JavaScript
fails, all content stays visible.

**Accessibility:** semantic landmarks, skip link, visible focus states, a focus-managed mobile menu
(Escape to close, background made inert), focus moved to the page on navigation, labelled icons,
announced menu-search results, at least 40px touch targets, and AA color contrast.

**SEO / local:** unique titles and descriptions per page aimed at Kent, WA searches. Includes
schema.org `Restaurant` data (address, phone, hours, menu, reservations, ordering, Instagram) and a
full `Menu` schema with prices, Open Graph and Twitter cards, a branded share image, `sitemap.xml`
and `robots.txt`.

### Measured results (production build, this sandbox)

- **Lighthouse (mobile, simulated slow 4G):** Home 98 / 100 / 100 / 100, Menu 100 / 100 / 100 / 100,
  Catering 100 / 100 / 100 / 100 (Performance / Accessibility / Best Practices / SEO). CLS 0 on all
  pages. These were measured without photography and with the Google map embed blocked, so re-run once real
  photos are in, because the hero photo becomes the LCP element.
- **axe-core** (WCAG 2.1 A/AA and best practices): 0 violations on every page at 1440px and 390px.
- **No horizontal overflow** at 1440, 390 and 360px, and no console or hydration errors.
- JavaScript: about 90 KB gzipped in total (React is most of it). CSS: about 16 KB gzipped.

---

## Before launch — owner approval checklist

Content was verified against the restaurant's own website (sofratg.com) where possible. The build
environment could not load sofratg.com or the booking systems directly, so these items need the
owner's confirmation:

1. **Photography.** Permission to use Sofra's existing photos (from sofratg.com, Instagram or new
   shoots) and the files themselves. All 21 slots are currently empty; the site shows text and art
   layouts in their place.
2. **Logo.** The official logo files, or approval of the typographic wordmark.
3. **Hours.** sofratg.com publishes "daily 10 AM – 9 PM", but third-party listings differ (delivery
   apps show earlier closing). Confirm, including holiday hours. A breakfast service window
   (reported elsewhere as 10 AM – 2 PM) is *not* shown until confirmed.
4. **Menu and prices.** Transcribed from sofratg.com's published food and drink menus. Delivery apps
   list higher prices for some items (e.g. Iskender $24 here vs $26 on delivery apps), so confirm
   current in-house pricing. Also confirm: the soup's name (published as "Soup — cup $7 / bowl $10"),
   spellings such as "Kiymali Pide" and "Sucuklu Omelette", and any dishes missing from the published
   menu. Add owner-approved descriptions in `menu.ts` if wanted.
5. **Reviews.** Approval to reuse the Google reviews shown on sofratg.com. Two are published verbatim
   (Gabriella E., Fatima A.). The full text of the reviews by Lisa G. and Kenny W. could not be
   retrieved; paste it into `reviews.ts` to show them. No aggregate rating or review count is shown.
6. **Halal.** Guests and third-party listings describe the food as halal. The site makes no halal
   claim until the owner confirms the wording and certification.
7. **Copy.** Brand copy written for the redesign (e.g. the "Sofra Experience" chapters and catering
   steps) should be approved by the owner. Historical claims such as founding year or family history
   were deliberately left out.
8. **Integrations.** Run `npm run check:links` and test an order, a reservation and a catering request
   end to end.
9. **Domain and analytics.** Confirm the production domain (`SITE_URL`) and whether to add analytics.
10. **Footer credit.** "Website redesign by AHM Digital LLC" is shown for the proposal. Agree with the
    client whether to keep it.

---

## Project structure

```
sofra-turkish-grill/
├── index.html                 # HTML shell (head tags are injected per page at build time)
├── public/                    # favicon, apple-touch-icon, og-image.jpg
├── scripts/
│   ├── prerender.mjs          # renders every route to static HTML + sitemap/robots
│   ├── serve.mjs              # production-accurate local preview server
│   └── check-links.mjs        # verifies all external links in the build
└── src/
    ├── data/                  # ← all editable content (business, menu, reviews, media, seo)
    ├── assets/photos/         # ← drop owner-approved photos here
    ├── assets/brand/          # ← optional official logo files
    ├── components/            # Header, Footer, MobileCtaBar, Photo, PageHero, buttons, icons
    ├── sections/              # homepage sections + the shared Visit section
    ├── pages/                 # Home, Menu, Our Story, Catering, Contact, 404
    ├── hooks/                 # scroll state, parallax, reveal observer
    ├── lib/                   # router, photo loader, head tags
    ├── styles/index.css       # design tokens, components, motion
    ├── main.tsx               # client entry (hydration)
    └── entry-server.tsx       # prerender entry
```
