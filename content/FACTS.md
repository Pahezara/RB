# FACTS.md — Reliance Business Partners (Pvt) Ltd

Every fact on the site traces to a source recorded here. Nothing is inferred,
estimated or rounded, and nothing is carried in from anywhere else.

## Acquisition status: complete, from primary sources

Nothing here was scraped or guessed. Two documents were supplied by the client
and every fact on the site is transcribed from one of them, or from a dated
instruction. The provenance tags used throughout `src/data/site.ts`:

| Tag | Source |
|---|---|
| `[PROFILE]` | `RB Logo/RBPL Business Profile.pdf` — the firm's own deck |
| `[FEES]` | `RB Logo/Secretarial fee Structure.xlsx` — the firm's own fee sheet |
| `[SAJ]` | Supplied directly by the client, dated |

Both documents are held **outside this repository**, alongside the checkout. The
repo is public, nothing in the build reads them, and `.gitignore` excludes the
folder. Everything they contain that belongs on a website is already on the
website.

## 1. Identity
- **Reliance Business Partners (Pvt) Ltd** — `[PROFILE]` cover and logo wordmark
- Established **2018**, as a limited liability company — `[PROFILE]` About us
- Cover line: **"Your trusted partner"** — `[PROFILE]`
- Stated purpose: *"to render business related services to the clientele under one
  umbrella"* — `[PROFILE]` About us

## 2. Contact — `[PROFILE]` Contact Us
- Phone **+94 711 22 45 45**
- E-mail **info@rbpl.lk**
- **No. 464, High Level Road, Gangodawila, Nugegoda, Sri Lanka**
- LinkedIn `https://www.linkedin.com/in/reliance-business-partners-2668811`

The site URL `https://rbpl.lk` is **derived from the e-mail domain**, not stated in
any source. Confirm it before the DNS is pointed: it sets the canonical URL, the
OG image URLs, the sitemap, `robots.txt` and the JSON-LD.

**Not in any source, and therefore not on the site:** opening hours, a WhatsApp
number, a postal code, and any registration or licence number. See DECISIONS D4.

## 3. Vision and values — `[PROFILE]`, verbatim
> To be the trusted partner delivering comprehensive business solutions that address
> the needs of both existing and potential clients by 2030.

Integrity · Accountability · Strengthening the client relationship · Professionalism
· Confidentiality

## 4. Service areas — `[PROFILE]` "Our Services", six areas
Accounting and BPO · Tax and assurance · Business advisory · Payroll ·
Data analytics and Power BI · Corporate secretarial

Tax and assurance is stated as **"Conducted through Sanjeewa Associates and Synergy
Advisors"**. Both are named on the site rather than left to be discovered, because a
client is entitled to know which practice signs the audit.

## 5. People — `[PROFILE]`
Four directors, with qualifications as printed in the deck: J. M. N. Sanjeewa
(FCA, ACMA, BSc Accounting, MBA), M. A. W. P. Wijerathna (ACA, BSc Business
Administration), R. P. P. Amarasekara (ACMA), M. V. D. Mendis (Certified Business
Accountant). Team of **17**: 2 Chartered Accountants, 2 Professional Accountants,
3 Managers, 10 Associates.

## 6. Fees — `[FEES]`, transcribed exactly, nothing rounded
| | Basic | Advanced | Premium |
|---|---|---|---|
| One director | LKR 36,000 | LKR 45,500 | LKR 60,000 |
| Each additional director | LKR 3,150 | LKR 4,700 | LKR 4,700 |

After incorporation: annual retainer LKR 15,000 from year two, charged when Form 15
is filed; additional DRC forms LKR 2,500 each plus government charges; board
resolutions after the initial set LKR 2,500 each; a secretary attending a board
meeting LKR 5,000 virtually or LKR 7,500 in person.

**The sheet is internally inconsistent in one place**, and the site shows it rather
than fixing it: Form 18 and Form 19 are "Certified" in the Advanced column and plain
in the Premium column. See DECISIONS D3.

## 7. Extras — `[SAJ]` 2026-08-31
Website development from LKR 65,000 (once) · cloud POS from LKR 4,500 a month ·
offline POS from LKR 45,000 (once). All three are **starting prices** and are
labelled "from" everywhere they appear, including inside the estimator's breakdown.

## 8. Sectors — `[PROFILE]`, all fourteen
Import and export · Manufacturing · Construction · Hotels · Insurance · Services ·
Wholesale and retail · Power and energy · Agriculture · Professionals · Trading ·
Advertising · Restaurants · Online e-commerce

Published as *sectorial expertise*, which is what the deck calls it. It is not a
client list and the page says so.

## 9. The hero photograph
Unsplash photo `1742277712272-aecf17e3accb` by Zoshua Colah, free under the Unsplash
License. Source kept at `brand/hero-source.jpg`. It is cropped rather than used whole,
for the reason recorded in DECISIONS D9.
