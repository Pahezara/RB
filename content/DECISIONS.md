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

## D5 — No testimonials, no stock photography
No proof section ships without real, attributed reviews, and no stock photograph
stands in for a real office or a real person. The board section on `/about/` is
therefore set as type — hairline-topped blocks with names, qualifications and
bios — rather than as a grid of empty photo cards.

## D6 — One typeface, and tabular figures only where they help
Schibsted Grotesk, self-hosted as one variable 400–900 latin file plus a real
italic file, with a metric-matched fallback carrying `size-adjust`.
`font-display: optional`, so there is no swap and no CLS. There is deliberately no
monospace: a fee and the sentence around it are the same typeface.

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

## D9 — The hero photograph
Unsplash photo `1742277712272-aecf17e3accb` by Zoshua Colah, free under the
Unsplash License. Source kept at `brand/hero-source.jpg`.

**It is cropped, not used whole.** The original is a street-level frame carrying
Nippon Paint, Union Assurance and Hilton signage. Putting third-party brands
behind this firm's headline would imply an association that does not exist, so
`scripts/make-hero.mjs` crops to the tower line, which drops every readable brand
mark, the traffic signals and the shopfronts.

It is then mapped to a **navy duotone**, not tinted. Blending a colour photograph
toward a saturated navy in sRGB leaves the red channel alive in the midtones and
the whole frame reads violet; mapping luminance through a two-point ramp with a
highlight whose green clearly leads its red gives a clean navy. The script
measures the 95th-percentile luminance of the regions type occupies and fails the
build under 4.5:1, and a cast check fails it again if the result drifts violet at
any sampled point.

Three treatments are written from the same crop. `hero-*` and `hero-portrait-*`
carry the heavy scrim, because type sits on them — they are the OG card
backgrounds. `hero-panel-*` carries almost none, because the hero's inset figure
has no type on it and the scrim would only be throwing away the architecture.

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
Five choices that shape the silhouette of the site rather than only its colour.

1. **The hero is built, not photographed.** Copy on the left of a navy field with
   two blurred light sources and one diagonal at the angle of the R's leg; the
   photograph is an inset figure on the right with the mark's gradient along its
   top edge. The glows are `mix-blend-mode: screen`, not translucent overlays: a
   20%-alpha warm tone laid over navy averages toward olive, a colour this brand
   does not contain, whereas screen adds light and never passes through green.
   Both sources are centred off-canvas, and the warm one is sized per breakpoint —
   a 40rem source is a corner accent at 1440px and a wash across the entire glass
   header at 390px.
   `glass.css` allows "a baked image, **or overlapping shapes**" behind glass, so
   the header over this hero is still real glass.

2. **Services is a numbered ledger, not a card grid.** Six cards in a three-column
   grid is the default shape of every professional-services site, and rows suit
   the content better: the reader is scanning an ordered list, and the index
   numeral gives them a place to be.

3. **The footer is a masthead.** The brand and the two ways of reaching the firm
   share one full-width strip, with the phone number set at heading size, and the
   navigation runs underneath in equal columns. This is also better on merit: the
   phone number and the address are what people scroll to the bottom of a
   professional-services site to find.

4. **Buttons are softened rectangles, not pills**, and every eyebrow opens with a
   short accent rule.

5. **A hairline before a border, a border before a box, a box before a shadow.**
   Most sections are type on a ground with rules between the items. Glass is the
   chrome, never the content: it never carries a price, a form field or a table.

**One thing tried and reverted.** The closing panel was accent-tinted for an
iteration. The accent button sitting on an accent tint measures about 1.5:1
between fill and ground, so the control had no visible edge — precisely what WCAG
1.4.11 asks for at 3:1. `check-contrast` could not have caught it: it proves token
pairs, not what the cascade puts next to what. The brand gradient marks the panel
edge instead.

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
