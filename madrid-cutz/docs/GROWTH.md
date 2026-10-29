# Growth roadmap (optional)

The site is built to grow into a bookings engine, but **none of the items below is running.** Each one is optional and
needs the owner's approval. Each also needs a feasibility check against the shop's Booksy plan. The site never stores
customer data, never claims access to Booksy data, and never replaces Booksy.

## Already in place (inactive)

| Hook | Where | What it enables |
| --- | --- | --- |
| Event layer | `src/lib/analytics.ts` | Every booking click (`book_click` with its placement: hero, nav, service, barber, sticky bar…), plus `directions_click`, `copy_address`, `gallery_open`, `gallery_filter`, `social_click` and `phone_click`. These do nothing until an analytics script is added. |
| Announcement bar | `announcement` in `src/content/site.ts` | Promotions, holiday hours, a new barber joining. Off by default. |
| Single booking component | `src/components/ui/BookLink.tsx` | One place to add tracking parameters or swap the booking destination. |
| Content model | `src/content/site.ts` | Services, barbers and reviews are data, ready to come from a CMS later. |

## Options, in a sensible order

1. **Basic website analytics.** Add a privacy-friendly analytics script (for example Plausible, or GA4 through Google Tag
   Manager) to `index.html`. The existing `track()` calls forward to it automatically. The result is an answer to "which
   button drives bookings?" Add a cookie/consent notice if the chosen tool needs one.
2. **Booking attribution.** Optionally append UTM parameters to the Booksy URL in `BookLink`. First confirm whether the
   shop's Booksy reporting shows them; if it doesn't, rely on on-site click events.
3. **Review requests.** Booksy prompts clients to review after a visit. The site can add a short "Loved your cut? Leave a
   review" link to the Booksy reviews page, and verbatim reviews can be added to `reviews` with permission.
4. **Promotional announcements.** Turn on `announcement` with owner-approved copy and an end date.
5. **Rebooking reminders and retention campaigns.** Run these with Booksy's built-in client messaging and marketing tools,
   which depend on the shop's plan. The website's role is to send traffic to Booksy, not to message clients itself.
6. **Birthday promotions and referral programmes.** These need an opt-in list, either through Booksy or a separate,
   consent-based email/SMS tool. SMS marketing must follow consent rules (for example TCPA), and any sign-up form needs a
   privacy policy. Add the form only after the owner chooses a tool.
7. **Instagram feed.** Once the handle is confirmed, show recent posts with an official embed or a manually curated grid.
   Avoid scraping.

## What the site must not do

- Show prices, hours, staff or reviews that the shop has not confirmed.
- Collect payment or appointment details on the site.
- Claim that any automation, campaign or integration is active before it really is.
