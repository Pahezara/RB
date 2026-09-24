# DECISIONS.md — Reliance Business Partners (Pvt) Ltd

Every decision that governs this site, with the reasoning that produced it. A
decision belongs here when someone reading the code later would otherwise be
entitled to ask "why is it like that?".

Sources referred to throughout, both supplied by SAJ on 2026-08-31 and held
outside this repository:

- `RB Logo/` — the logo pack (`RB_Logo transparent.png`, `RB_Logo_Without name.png`,
  `RB_Logo_psd.png`). `brand/rb-lockup.png` is the one file copied in and committed,
  because the build reads it.
- `RB Logo/RBPL Business Profile.pdf` — the firm's own deck, cited as `[PROFILE]`
- `RB Logo/Secretarial fee Structure.xlsx` — the firm's own fee sheet, cited as `[FEES]`

---

## D1 — Every fact traces to a source
Nothing on this site may be invented, estimated or rounded. Every entry in
`src/data/site.ts` carries a `[PROFILE]`, `[FEES]` or `[SAJ]` tag naming where it
came from — for the fee figures, down to the spreadsheet cell.

This is not a style preference. It is an accounting and company-secretarial firm:
a wrong figure on the packages page is a figure a client may act on. The rule is
what lets anyone check any number on the page against the client's own document
without asking anybody.

`content/ASSETS.md` is the register that enforces the other half of it. A row is
satisfied only when it is `HAVE` or `N/A`, and `N/A` must name the decision that
dropped it, so a gap cannot quietly become an oversight. `scripts/placeholders.mjs`
fails a production build while any row is outstanding.

## D2 — Pricing ships, in full
The firm publishes a fee structure, so the site publishes it. Two places:

- `/packages/` carries all three incorporation packages, everything inside each
  one, the per-director rates, and the four post-incorporation charges.
- The home page carries a **fee estimator** directly under the hero.

Three rules the estimator is held to, because a calculator that is casually wrong
is worse than no calculator:

1. **It owns no numbers.** Every figure is written into a `data-` attribute from
   `src/data/site.ts` and read back out of the DOM. There is no price in the
   JavaScript.
2. **The monthly figure never enters the one-time total.** A subscription folded
   into a setup cost is how an estimate quietly becomes a lie.
3. **It says it is an estimate, on the page, above the buttons.** The package and
   per-director figures are exact; the website and POS lines are labelled "from"
   on every line they appear on, including inside the breakdown.

The annual retainer from year two is quoted as a footnote under the total and is
deliberately **not** added into it: it is not part of setting a company up.

The estimator's default state is rendered on the server with the arithmetic
already done, so with JavaScript disabled the page still shows the Basic package
at its real price and all three packages in full. The script upgrades a correct
page; it does not rescue a broken one.

## D3 — The fee sheet's inconsistency is shown, not smoothed
The client's sheet writes "Certified Form 18" in the Advanced column and plain
"Form 18" in the Premium column. That is probably a typo, but silently correcting
a client's published fee schedule is not the site's call. The comparison table
flags the row, and the footnote says what the sheet says and invites the visitor
to ask.

The comparison matrix is **derived** from the three package lists in code, so a
line cannot be added to a package and quietly dropped from the comparison: the
build throws instead.

## D4 — Facts not supplied, and therefore absent
None of the following appears in the business profile or in anything else
supplied, so none of it appears on the site or in the structured data:

- **Opening hours.** No `openingHoursSpecification` in the JSON-LD, and no hours
  table on the contact page.
- **A WhatsApp number.** The profile gives one number. Assuming it also answers
  WhatsApp is a guess, so the contact page offers the phone and e-mail only. This
  is a real loss in the Sri Lankan market and is worth asking about.
- **A postal code.** The JSON-LD carries no `postalCode` field rather than a
  plausible one. A guess in structured data is worse than an absent field:
  search engines publish it as fact.
- **Registration or licence numbers.** The four directors' professional bodies are
  named on `/about/` in their place. For a firm in this category these numbers are
  the strongest remaining trust signal, and they are worth obtaining.

## D5 — No testimonials; stock photography only as scenery
No proof section ships without real, attributed reviews.

**Amended 2026-09-24.** SAJ asked for stock imagery in the redesign, so the site now
carries seventeen openly licensed photographs (D9). The original rule survives in
its narrower, load-bearing form: **no stock photograph stands in for the firm's
own office, people or clients.** The photographs are cityscapes, desks, documents
and sector scenes, and the site says so in words on `/credits/` and `/terms/`. The
board is still set as type — monograms, names, qualifications and bios — because
no photograph of a director exists, and a stock face in that slot would be a lie
about a real person.

## D6 — Two typefaces, and tabular figures only where they help
Schibsted Grotesk for text, self-hosted as one variable 400–900 latin file plus a
real italic file, with a metric-matched fallback carrying `size-adjust`.

**Amended 2026-09-24: a display serif joins it.** Newsreader (Production Type,
OFL 1.1) sets h1–h3, prices and the large figures. Each headline carries one
italic accent phrase, in `--accent-ink` on paper and `--accent-lift` on navy. The
serif is what separates this site from the geometric-sans template most
consultancy sites in the region share, and it is the register of the documents
the firm actually produces. It is **cut down at build time** by
`scripts/make-fonts.py` (fontTools `instancer`) to the optical sizes 20–72 and
weights 300–600 the site uses.

Both faces are `font-display: optional`, so there is no swap and no CLS. There is
deliberately no monospace: a fee and the sentence around it are the same family.

**Tabular figures are withheld from currency.** Under `tnum` this face gives the
grouping comma a full digit advance and centres it in that slot, so every price
renders as `LKR 36 , 000` with a visible gap either side. Nothing on this site
stacks two prices in a column where digit alignment would repay that, and amounts
that do sit in a column are right-aligned, which lines up their edges whatever the
digit widths are. So currency uses the proportional figures the face was drawn
with, and tabular figures are kept for what they were reached for: phone numbers,
dates and counts. `base.css` states this at the rule.

## D7 — The palette is the mark's, and there is one accent: the orange
Every colour is derived from `brand/rb-lockup.png`, read pixel by pixel. The mark
is two letters in two families: the R runs deep navy into mid blue, the B runs
orange into gold.

The system that came out of it:

- **ORANGE is the accent.** `--accent` is the mark's own `#f3771f`, in a five-step
  ramp. It fills the primary button and carries every rule, numeral, chevron,
  link affordance and selected state on the site.
- **NAVY is the ground.** Not an accent at all. It is the ink, the dark band and
  every neutral, all pulled to hue 250 — the navy's own family — which is what
  makes the greys read as part of the mark rather than as generic slate.

Two things fell out of collapsing an earlier gold-and-orange pair into one ramp:

**Gold could never have carried the whole system.** It measures 1.44:1 on the page
ground, so it can only ever be a fill — never a rule, never a numeral, never a
link. Half the brand marks on this site are 1px rules and small type. One ramp
that can do every job beats two that each do half.

**There is no mid-tone orange, and there cannot be.** `--accent-deep` (`#ec6100`)
is the hover and it holds the ink label at 4.91:1. Anything darker passes through
a lightness where neither a dark nor a light label clears AA — a fill nobody could
label. That is the floor, and it is why the hover goes deeper rather than the
pressed state going deeper still.

**The gold is not gone from the logo.** `--brand-gold` survives inside
`--brand-ramp`, which reproduces the mark's own gradient on the three brand edges
(footer top, hero figure top, closing panel top). That is the logo, not the
interface. Nothing is painted gold.

Contrast is proved, never chosen: `scripts/check-contrast.mjs` parses the token
file, asserts every declared pair against WCAG AA, and re-proves on every build
that the raw brand tokens still match the pixels in the logo file.

## D8 — The supplied lockup is never rasterised into the page
The lockup sets `RELIANCE BUSINESS PARTNERS (PRIVATE) LIMITED` on one line at
roughly 24:1. At the ~130px the header bar has to spare, its letters would be
three pixels tall.

So the page chrome carries the **monogram plus the firm's name as real text** in
the site face. It stays crisp at every size, recolours for the dark band for free,
and is selectable and readable by a screen reader. The full lockup is still
written to `public/brand/` for print and e-mail signatures; nothing in the site
links to it.

The monogram is cut out of the *transparent* lockup rather than taken from the
pack's monogram-only file, which is named "transparent" but measures fully opaque
with a white ground baked in. Keying that out would mean guessing a threshold.

`scripts/prepare-brand.mjs` **fails** if the dark-ground variant of the mark
cannot clear 3:1 on the dark band. That guard earns its keep: as drawn, the mark
reaches **1.44:1** there — its navy half simply vanishes — and the lifted variant
reaches **5.97:1**.

## D9 — Photography: sourced, licensed, measured
**Amended 2026-09-24.** The single Unsplash hero and `scripts/make-hero.mjs` are
retired. Every photograph now comes from **Wikimedia Commons**, through one
manifest (`src/data/images.json`) and one script (`scripts/make-images.mjs`).

- **Licences are read, not typed.** The script asks the Commons API for each
  file's author, licence and source page on every run and writes them back into
  the manifest. Anything not CC0, public domain, CC BY or CC BY-SA stops the build.
  `/credits/` renders from the same file, and so does `<Img>`, so an image cannot
  reach a page without being credited. The script spaces its requests and backs
  off when Commons rate-limits it.
- **Type on a photograph is measured.** Where type sits on an image, the scrim is
  baked into the file and every text region is measured at its 95th-percentile
  luminance against the ink that will actually be there. That includes the
  transparent header: `colombo-golden` measured **2.73:1** under the header, over
  bright sky, and passes at **7.03:1** once its scrim carries weight along the top.
- **Only `--ink-invert` sits on a photograph**, plus the italic accent at display
  size, held to the 3:1 large-text minimum. Muted text never does, so the header's
  second line switches to `--ink-invert` in its transparent state.
- **Phones get their own crop.** A landscape scrim measured for a copy column on
  the left says nothing about a phone, so hero images declare a `portrait` variant
  with its own crop, scrim and regions, served below 48rem.
- **Everything else is type-free.** Service, sector and card photographs carry no
  text; where a label must sit on one (the industries mosaic) it sits on its own
  solid chip.
- **No identifiable people who did not pose.** A Commons photograph of a tea
  plucker at work was declined: a working person photographed on the job did not
  agree to advertise an accounting firm.

Sources are cached in `brand/stock/`, so the build is reproducible offline once
fetched. The OG cards (`scripts/make-og.mjs`) use the home hero's night skyline,
whose scrim is already measured.

## D10 — The enquiry is direct actions, not a form
There is no form. The contact page offers the phone and a `mailto:` **link**
carrying a prefilled subject and body that asks for the same things a form would.

**Why not a form.** A form with `action="mailto:"` makes the browser warn that the
submission is not secure — the warning is about the destination, not the site's
own certificate — and it then fails outright on most phones, so a visitor who
clicked "send anyway" could easily have sent nothing. Links are not submissions,
so no browser warns about them, and both actions work with no JavaScript and no
third party holding the client's messages.

**Open question for SAJ.** A real form needs an HTTPS endpoint. Three options:

1. **A hosted form service** (Web3Forms, Formspree). Plain HTML POST, no
   JavaScript, works immediately. The trade-off is that a third party receives and
   stores every enquiry, and the access key sits in the page source.
2. **A Vercel Function plus an e-mail API** (Resend, Postmark). The enquiry never
   touches a form vendor, but it needs an account and an API key held as an
   environment variable, and it is code to maintain.
3. **Leave it as direct actions.** Nothing to maintain, nothing to break, no third
   party. The cost is that visitors who prefer typing into a form do not get one.

Until SAJ chooses, option 3 is what ships, because it is the only one of the three
that is working right now.

## D11 — How the page is composed
**Rewritten 2026-09-24 for the redesign.** The brief was to out-class
infomateworld.com and the rest of the field. Those sites lead with slogans, stock
handshakes, client-logo walls and round-number claims. This one leads with what can
be checked, and sets it with more care.

1. **The home hero is a photograph, and the estimator overlaps it.** Colombo at
   night, scrimmed and measured, with the incorporation price on a solid card and
   the credentials rail (2018, 17, 4, 14, every one a count from `[PROFILE]`)
   along its foot. The estimator rises over the hero's edge, so the first scroll
   lands on the one thing no competitor offers: the fee, computed.
2. **Inner pages open on navy.** `PageHero` has three variants: `photo` (only for
   images with a measured scrim; passing any other image throws), `split` (type on
   navy, the photograph inset beside it with the brand ramp along its top) and
   `plain`. A `figure` slot takes anything else, such as the industries mosaic.
3. **Services are a bento, then editorial rows.** On the home page, six tiles of
   unequal weight and a dark "not sure where to start" tile; on `/services/`,
   alternating photograph-and-text rows; on each service page, the covers list as
   numbered cards laid out for their count (D15).
4. **Trust is shown, not claimed.** Published prices, a qualified board set as
   monograms with credentials in full, associate practices named, platforms set as
   type rather than logos (the firm works in these tools, it is not their
   partner), and fourteen sectors grouped into six families with no client implied.
5. **One closing band everywhere.** `CtaBand`: a full-bleed architectural
   photograph with the type on a solid navy card, never on the image.
6. **A hairline before a border, a border before a box, a box before a shadow.**
   Glass is still the chrome, never the content.

**One thing tried and reverted.** An accent-tinted closing panel put the accent
button on an accent ground at about 1.5:1, so the control had no visible edge. The
brand gradient marks panel edges instead.

## D12 — The mobile contract goes down to 320px
`check-mobile` runs at **320x568**, **360x640**, **390x844** and **844x390**. 320
is the floor a responsive site is expected to survive (iPhone SE 1st gen, older
budget Androids, any phone at 100% zoom in split view), and a phone held sideways
is still a phone.

320 immediately found a real bug that 360 did not. `/packages/` overflowed the
viewport by 11px, and the cause was three steps removed from the symptom:

1. `.fee-rows dd` was `white-space: nowrap`.
2. "LKR 5,000 virtually, LKR 7,500 in person" is 310px wide unbroken.
3. A grid column's **automatic minimum is its min-content size**, so that one
   unbreakable string set a floor for the whole column, which set a floor for the
   grid, which pushed the page wider than the screen.

Both halves are fixed. The amounts are kept atomic by non-breaking spaces inside
the figures themselves (`ongoingFees` in `site.ts`) rather than by nowrap on the
whole sentence, and **every** `grid-template-columns` on the site now uses
`minmax(0, …)` rather than a bare `1fr`, so no single long string can ever widen a
grid past its container again.

Also added: the comparison matrix on `/packages/` scrolls horizontally on a phone,
and now says so. A scrolling table with no hint is a table most phone users never
scroll. It is real text rather than a fading edge, because a gradient is not an
instruction.

## D13 — Deploy configuration
`robots.txt` and `sitemap.xml` are **generated endpoints**, not files in
`public/`, so both are built from `site` in `astro.config.mjs`. A hardcoded
robots.txt is the classic way a site ends up advertising a sitemap on the wrong
domain after a rename.

The sitemap is derived from `import.meta.glob` over `src/pages` plus the same
`serviceLines` array `getStaticPaths` uses, and `audit-html` asserts it lists
exactly the routes that were actually built — so a derivation that misses a page
fails the build rather than shipping a sitemap with a hole in it.

`vercel.json` carries HSTS and a Content-Security-Policy. The CSP carries
`'unsafe-inline'` on `script-src` because Astro inlines the estimator into the
HTML rather than emitting a file; removing that would mean either moving the
script to `public/` unhashed or adopting Astro's experimental hash-based CSP, and
neither is worth the churn on a static site with no user input and no third-party
code. What it does buy is real: no external script, style, font, frame or plugin
can load, and `base-uri`, `form-action` and `frame-ancestors` are locked down.

The policy is verified rather than assumed. `dist/` is served behind the exact
headers `vercel.json` declares, five routes are loaded in a real browser, and the
estimator is driven under the policy to confirm it still computes. A header nobody
has loaded the site behind is a guess.

## D14 — Every page earns its place in the navigation
Added in the redesign: `/industries/` (the fourteen `[PROFILE]` sectors in six
editorial families, each with the three service lines that usually carry the
weight there) and `/credits/` (required by the CC BY and BY-SA licences, and linked
from every footer). The family titles, short labels, blurbs and service mappings
are editorial and say so in `site.ts`; none of them claims a client or an
engagement.

Legal pages share `Legal.astro`: the prose beside a sticky index of its sections,
and a contact block at the foot. No "last reviewed" date is printed, because nobody
at the firm has reviewed the text yet, and a date would say they had.

## D15 — Grids are laid out for their count
A three-column grid holding four or five items ends on an orphan, and several lists
here are exactly those lengths: payroll covers four items, and five sectors lean on
accounting. Service pages pick a layout from the count: fours in fours, five as two
over three on a six-column track, the rest in threes. Two related sectors run as
two wide cards rather than two-thirds of an empty row.
