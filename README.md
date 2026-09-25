# Reliance Business Partners — website

Static site for Reliance Business Partners (Pvt) Ltd, a firm of professionals in
Gangodawila, Nugegoda. Astro, vanilla CSS, no UI or CSS framework, no analytics, no
third-party scripts.

```bash
npm install
npm run dev      # local dev server
npm run verify   # build, then every check, in order
```

**JavaScript.** Four small inline scripts, and the site works with all of them blocked:

- the **fee estimator**, on the home page and `/packages/`. Its default state is rendered
  on the server with the arithmetic already done, so with the script blocked the page
  still shows the Basic package at its real price and all three packages in full;
- the **header**: the transparent-over-the-hero and scrolled states, and the Services
  mega menu's `aria-expanded`, Escape and outside-click handling. Without it the header is
  solid and the mega menu opens on hover and focus;
- the **counters** on the home page's credentials rail, which count up once when they
  come into view. The real numbers are in the HTML;
- the **scroll reveal** in `Base.astro`, which fades blocks in as they arrive. It only
  ever hides blocks that start below the fold, so with it blocked nothing is hidden.

The mobile menu, the FAQ accordion and the page transitions are HTML and CSS.

## Deploying to Vercel

Import the repository. Vercel detects Astro and needs no configuration; `vercel.json`
is committed only to set cache and security headers.

| Setting | Value |
|---|---|
| Framework | Astro (auto-detected) |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |

**The deploy runs `npm run build`, not `npm run verify`.** That is deliberate: the checks
need a headless Chromium that is not present in the build image, and `placeholders` is
designed to block a release while facts are missing. **Run `npm run verify` locally before
you push** — the deploy will not do it for you.

The canonical URL and every OG image URL are absolute, built from `site` in
`astro.config.mjs` (`https://rbpl.lk`). That domain is **derived from the firm's e-mail
address**, `info@rbpl.lk`, and is not stated anywhere in the supplied material — confirm it
before pointing DNS. Change `site` in `astro.config.mjs` and `SITE_HOST` in
`scripts/audit-html.mjs` together if it is wrong.

After any content change that adds or removes a page, regenerate the OG images:

```bash
npm run build && node scripts/make-og.mjs
```

`make-og` reads the built routes, so the image set cannot drift from the pages, and
`audit-html` fails if any `og:image` does not resolve.

### What is already set up for the deploy

- **`robots.txt` and `sitemap.xml` are generated**, not static files, so both are built
  from `site` in `astro.config.mjs` and cannot end up advertising the wrong domain after a
  rename. The sitemap is derived from the pages that exist (`import.meta.glob` plus the
  `serviceLines` array that feeds `getStaticPaths`), and `audit-html` fails the build if it
  does not list exactly the routes that were built.
- **Security headers** are in `vercel.json`: `Content-Security-Policy`, HSTS,
  `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` and `Permissions-Policy`.
- **Caching**: fonts and `/_astro/` are immutable for a year (both are content-hashed or
  never change); `/img/`, `/brand/` and `/og/` get a week; `robots.txt`, `sitemap.xml` and
  the manifest get an hour.
- **`engines.node` is `>=20.3.0`**, the floor Astro 5 needs, so a build on an older Node
  fails clearly instead of confusingly.

**About the CSP.** It blocks external scripts, styles, fonts, frames and plugins, and locks
down `base-uri`, `form-action` and `frame-ancestors` — real defence in depth for a site that
loads nothing from anywhere else. It does carry `'unsafe-inline'` on `script-src`, because
Astro inlines the one small script this site ships (the estimator) directly into the HTML
rather than emitting a file. Removing that would mean either moving the estimator to
`public/` as a plain unhashed file, or adopting Astro's experimental hash-based CSP; neither
was worth the churn for a static site with no user input and no third-party code.

The policy is **verified, not assumed**: `dist/` is served behind the exact headers
`vercel.json` declares, five routes are loaded in a real browser, and the estimator is
driven to check it still computes. Zero violations, zero blocked requests.

---

## The one rule

**Every fact on this site traces to a source.** Nothing may be invented, estimated or
rounded — and that now includes every price.

- `content/FACTS.md` — every fact, with its source
- `content/DECISIONS.md` — every decision, with the reasoning
- `content/ASSETS.md` — the asset register, which drives the placeholder check
- `brand/PALETTE.md` — the palette, measured out of the logo file, not chosen

The two primary sources are the client's own documents: the business profile PDF and the
secretarial fee structure spreadsheet. **Neither is in this repository** — it is public and
no build script reads them, so they are held alongside the checkout at `RB Logo/` and
`.gitignore` excludes that folder. Their *content* is published in full on the site, and
the citations remain in the data file as the provenance record. `src/data/site.ts` tags every
entry `[PROFILE]`, `[FEES]` or `[SAJ]` so any figure on the page can be traced back to a
cell or a slide.

---

## Editing content

Almost everything lives in **`src/data/site.ts`**: contact details, the six service lines,
the three incorporation packages, the post-incorporation fees, the extras, the board, the
team counts, the sectors, the process steps and the FAQ. Change it there and the home
page, the packages page, the services pages and the footer all follow.

**To add a service line**, add an entry to `serviceLines`. A page at `/services/<slug>/`
is generated automatically and it appears in the home grid, the contact page and the
footer. Re-run `make-og` so it gets a card.

**To change a price**, change it in `src/data/site.ts` and nowhere else. The packages
page, the service page, the comparison matrix and the estimator all read from there; the
estimator's JavaScript contains no figures at all, only `data-` attributes read back out
of the DOM.

**If a package gains or loses a line**, add it to `MATRIX_ORDER` in the same file too. The
comparison matrix is derived from the package lists, and the build **throws** rather than
letting a line exist in a package and quietly vanish from the comparison.

---

## What `npm run verify` checks, and what each failure means

Run in order. Any failure is a red build.

| Step | What it proves | Common failure |
|---|---|---|
| `astro build` | The site compiles, and every package line has a matrix row | A content or type error, or a package line missing from `MATRIX_ORDER` |
| `check-contrast` | Every colour pair clears WCAG AA, measured from `tokens.css`, plus OKLCH/hex parity on every comment | You changed a token. It names the pair, the ratio and the required minimum. Fix the token, not the check. |
| `audit-html` | Links and anchors resolve, no duplicate IDs, no orphan `for`/`aria-labelledby`, images have dimensions, JSON-LD parses, one `h1`, headings never skip, no welded text, and the sitemap lists exactly the routes that were built | It names the file and the element |
| `placeholders` | No `{{ASK}}` tokens remain and every asset-register row is `HAVE` or `N/A` | Something is still missing. It prints what and where to get it. |
| `check-glass-count` | Never more than three backdrop-filtered elements in view, at three viewports, walking the scroll. Also that the `@supports` fallback exists | Reduce `--blur` first, then the count, then drop glass on that surface |
| `check-mobile` | At 320, 360 and 390px portrait **and 844x390 landscape**: no horizontal overflow, every tap target at least 44x44, no text under 12px, and the rendered header height matches `--header-h` | It names the route, the viewport and the offending element |
| `shoot-frames` | Every route renders at four viewports plus reduced-motion, reduced-transparency and no-blur variants | **Then look at the PNGs in `frames/`.** This step proves they rendered, not that they are right. |

`PLACEHOLDERS_ALLOW=1 npm run verify` lets a **preview** build through with ASK tokens
still in it. Never use it for production.

---

## Regenerating brand assets

```bash
node scripts/extract-brand.mjs brand/rb-lockup.png   # -> brand/PALETTE.md
node scripts/prepare-brand.mjs                       # mark, light mark, favicons, manifest
node scripts/make-images.mjs                         # every photograph, from src/data/images.json
npm run build && node scripts/make-og.mjs            # one OG image per page
```

Run them in that order after any logo or image change. Two of them fail rather than
shipping something wrong:

- `make-images.mjs` reads each photograph's author, licence and source page from the
  Wikimedia Commons API on every run and writes them into `src/data/images.json`, which
  `/credits/` renders. It fails on any licence that is not CC0, public domain, CC BY or
  CC BY-SA. Where type sits on a photograph, it bakes the scrim into the file and measures
  every declared text region (including the transparent header) against the ink that will
  sit there, and fails below the declared minimum. Sources are cached in `brand/stock/`.
  To add a photograph, add an entry to the manifest with its Commons file name, where it is
  used, its crop focus and its alt text, then run the script. See decision D9.
- `prepare-brand.mjs` fails if the dark-ground variant of the mark cannot clear 3:1 on the
  dark band. As drawn, the mark reaches **1.44:1** there — its navy half would simply
  vanish — and the lifted variant reaches **5.97:1**.

**The supplied lockup is never rasterised into the page.** It sets the firm's name on one
line at roughly 24:1, which at header size would be three-pixel letters. The header, the
footer and the OG card carry the monogram plus the name as real text. The full lockup is
still written to `public/brand/` for print and signatures. See decision D8.

---

## The palette and the type

**One family, Apple's way.** San Francisco on Apple devices (the system face, nothing
downloaded) and Inter everywhere else, self-hosted as one variable file with weight and
optical size, with a metric-matched fallback and `font-display: optional`, so no swap and
no CLS. Headlines are semibold and tightly tracked. See decision D6.

**Motion** is in `src/styles/motion.css`: scroll reveals, hero entrances, the menu
drop-in, button feedback, smooth FAQ answers and page transitions. Nothing is hidden
without JavaScript, and reduced motion turns it all off. See decision D16.

Tabular figures are applied to phone numbers, dates and counts and **withheld from
currency**: under `tnum` this face gives the grouping comma a full digit advance, and every
price renders as `LKR 36 , 000`. `base.css` states the reasoning at the rule.

**One accent, and it is the orange.** Five steps of one warm ramp cover every
brand-coloured thing on the site.

| Role | Hex | Where |
|---|---|---|
| accent | `#f3771f` | primary button, text selection, selected package, slider, eyebrow and step rules, the estimate figure |
| accent-deep | `#ec6100` | the hover state of an accent button, and only that |
| accent-ink | `#ab3e00` | the accent as text on light: italic headline accents, index numerals, chevrons, "explore this service" |
| accent-lift | `#f9953d` | the accent as text on navy, including the italic headline accent over a photograph |
| accent-tint | `#ffead2` | the selected package card, icon tiles, notes |
| dark band | `#04152a` | page heroes, dark panels, the footer |
| ink | `#091e34` | body and headings |
| surface | `#f9f6f1` | the page ground, a warm paper |

**There is no gold in the interface.** The gold at the foot of the B survives in exactly two
places, and both are the logo rather than the UI: the monogram itself, and `--brand-ramp`,
which reproduces the mark's own gradient on the three brand edges (footer top, hero figure
top, closing panel top). Nothing is *painted* gold.

That is a decision, not only a preference. Gold measures 1.44:1 on the page ground, so it
can only ever be a fill — never a rule, never a numeral, never a link. Half the marks on
this site are 1px rules and small type, which had to be orange anyway. One warm ramp that
can do every job beats two that each do half.

The mark's **blue** is likewise not an accent. It is the ink, the dark band and every
neutral, and it appears as a colour only inside the brand ramp.

**Rules the build enforces.** The accent fill carries a **dark** label, never white: white
on it is 2.90:1, ink on it is 5.85:1. The accent is never text on a light ground (2.86:1)
and never a control border — `--accent-ink` exists for that. `--accent-deep` at #ec6100 is
the end of the road downward: any darker and neither a dark nor a light label clears AA,
which would be a fill nobody could label. And the four raw brand values are kept as tokens
with their hex in a comment, so `check-contrast` re-proves on every build that the palette
still matches the logo's pixels.

The ink, the dark band and the muted greys sit in hue family 250, the navy's own family,
which is what makes them read as part of the mark rather than as generic slate. The page
ground is the one deliberate exception: a warm paper (hue 84) rather than a cool grey, so
the navy and the orange read as printed on it rather than lit on a screen.

---

## Still outstanding before launch

1. **Confirm the domain.** `rbpl.lk` is inferred from `info@rbpl.lk`. It sets the canonical
   URL, every OG image URL and the JSON-LD.
2. **Opening hours** — not in the business profile. Without them there is no
   `openingHoursSpecification` in the structured data, which is a real loss for local
   search.
3. **A WhatsApp number** — the profile gives one phone number and the site will not assume
   it also answers WhatsApp. In this market that is the channel most enquiries want.
4. **Registration / licence numbers** — still the strongest remaining trust signal for an
   accounting and secretarial firm.
5. **Form 18 and Form 19** — the fee sheet says "Certified" on Advanced and plain on
   Premium. The site flags the difference rather than correcting it. Confirm which is
   right and the footnote can go.
6. **The enquiry is a `mailto:` link, not a form** — a real endpoint needs a third-party
   service and the client's approval. See decision D10.
