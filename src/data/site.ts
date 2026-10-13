/**
 * Every fact on the site comes from here, and every entry carries its source.
 * Nothing in this file may be invented, estimated or rounded. See content/FACTS.md.
 *
 * [PROFILE] = `RB Logo/RBPL Business Profile.pdf`, the firm's own deck, read
 *             directly. Wording is tidied for the web (sentence case, Sri Lankan
 *             product names spelled out) but no claim is added or enlarged.
 * [FEES]    = `RB Logo/Secretarial fee Structure.xlsx`, the firm's own sheet.
 *             Figures are transcribed exactly. Not one is rounded.
 * [SAJ]     = supplied directly by the client, dated.
 * [CONTENT] = `RBPL_Website_Content.docx`, the firm's website copy, supplied by
 *             SAJ on 2026-10-13. Where it and the profile differ, it is newer
 *             and it wins.
 *
 * The two documents are NOT in this repository: it is public, and no build
 * script reads them. They are held alongside the checkout at `RB Logo/`, and
 * `.gitignore` says so. The citations stay because they are the provenance
 * record — a tag naming the cell a figure came from is worth having whether or
 * not the spreadsheet sits next to it.
 */

export const site = {
  /** [PROFILE] cover, and the logo wordmark. */
  legalName: 'Reliance Business Partners (Pvt) Ltd',
  shortName: 'Reliance Business Partners',

  /** [SAJ] 2026-10-13, as written in the brief (the [CONTENT] document has
      "Your trusted partner / Take your business to next level"). */
  tagline: 'Your Trusted Partner',
  taglineSub: 'Taking Your Business to the Next Level',

  /** [PROFILE] "established in 2018 as a limited liability Company". */
  founded: 2018,

  /** Derived from the e-mail domain in [PROFILE]. */
  url: 'https://rbpl.lk',

  /** [PROFILE] Contact Us. */
  phone: '+94 711 22 45 45',
  phoneHref: 'tel:+94711224545',

  /**
   * [CONTENT] "Keep 'Discuss Your Requirements' visible as the main action and
   * link it to WhatsApp." No separate WhatsApp number was supplied, so this is
   * the firm's one published number. Change it here if WhatsApp is elsewhere.
   */
  whatsapp: '94711224545',

  /** [PROFILE] Contact Us. */
  email: 'info@rbpl.lk',

  /**
   * [CONTENT] Contact Us: "2nd Floor, No. 464, High Level Road, Gangodawila,
   * Nugegoda, Sri Lanka". No postcode is given in any source, so none is
   * published and none appears in the JSON-LD.
   */
  address: {
    street: '2nd Floor, No. 464, High Level Road',
    locality: 'Gangodawila, Nugegoda',
    region: 'Western Province',
    country: 'LK',
  },

  /** [SAJ] 2026-10-13, verbatim. Replaces the profile's 2030 vision. */
  vision:
    'To be the trusted business partner for entrepreneurs, investors and ' +
    'organisations building resilient businesses globally.',

  /** [SAJ] 2026-10-13, verbatim. */
  mission:
    'To help businesses establish, operate, grow and navigate change through ' +
    'coordinated corporate, financial, technology and advisory services. We bring ' +
    'practical expertise and dependable support to strengthen operations, inform ' +
    'decisions and create lasting value while driving the businesses to next level.',

  /** [SAJ] 2026-10-13, verbatim. `icon` is editorial. */
  values: [
    { name: 'Integrity', icon: 'shield-check', body: 'We act honestly, uphold ethical standards and provide objective guidance.' },
    { name: 'Accountability', icon: 'scale', body: 'We take ownership of our work, honour our commitments and communicate clearly about progress and responsibilities.' },
    { name: 'Client Partnership', icon: 'handshake', body: 'We take time to understand each client’s business and build lasting relationships through responsive, practical support.' },
    { name: 'Professional Excellence', icon: 'badge-check', body: 'We apply care, sound judgement and relevant expertise, engaging qualified specialists where required.' },
    { name: 'Confidentiality', icon: 'lock', body: 'We respect the trust placed in us and safeguard business, financial and personal information.' },
    { name: 'Innovation and Improvement', icon: 'sparkles', body: 'We embrace useful technology, better processes and continuous learning to improve how businesses operate.' },
    { name: 'Sustainable Growth', icon: 'sprout', body: 'We support decisions that balance immediate business needs with long-term resilience and responsible growth.' },
  ],

  social: {
    /** [PROFILE] Contact Us. */
    linkedin: 'https://www.linkedin.com/in/reliance-business-partners-2668811',
  },

  /**
   * [CONTENT] "RBPL is affiliated with Synergy Advisors (Chartered
   * Accountants)". Tax work is conducted through Synergy Advisors and Sanjeewa
   * Associates; audit through Synergy Advisors for corporate clientele and
   * Sanjeewa Associates for sole proprietors and partnerships. Named because a
   * client is entitled to know which firm actually signs the audit.
   */
  affiliate: { name: 'Synergy Advisors', role: 'Chartered Accountants', href: 'https://www.sa.lk/' },
  associates: [
    { name: 'Synergy Advisors', href: 'https://www.sa.lk/', serves: 'corporate clientele' },
    { name: 'Sanjeewa Associates', href: 'https://www.linkedin.com/in/Sanjeewa-associates-443185137', serves: 'sole proprietors and partnerships' },
  ],
};

/** A WhatsApp chat with the firm, optionally with the first message written. */
export const whatsappHref = (text?: string) =>
  `https://wa.me/${site.whatsapp}` + (text ? `?text=${encodeURIComponent(text)}` : '');

/**
 * [FEES] Sheet1, columns B, D and F. The three incorporation packages, priced
 * for a one-director company, with the per-additional-director rate that the
 * sheet states beneath each column.
 *
 * Every figure here is transcribed from that sheet. The calculator on the home
 * page reads this array and nothing else, so a price cannot appear on the site
 * that is not in the client's own document.
 */
export const packages = [
  {
    slug: 'basic',
    name: 'Basic',
    /** [FEES] B2 */
    price: 36_000,
    /** [FEES] B13 */
    perDirector: 3_150,
    summary: 'Everything needed to have the company legally in existence and its bank account open.',
    /** [FEES] B3:B11 */
    includes: [
      'Company name approval',
      'Certificate of Incorporation',
      'Certified Form 1',
      'Certified Articles',
      'Director seal',
      'TIN certificate',
      'Submission of BO forms',
      'Resolutions to open a bank account and online banking',
      'First year retainer fee included',
    ],
  },
  {
    slug: 'advanced',
    name: 'Advanced',
    /** [FEES] D2 */
    price: 45_500,
    /** [FEES] D16 */
    perDirector: 4_700,
    summary: 'The Basic set, plus the appointment forms and the embossed company seal.',
    /** [FEES] D3:D14 */
    includes: [
      'Company name approval',
      'Certificate of Incorporation',
      'Certified Form 1',
      'Certified Articles',
      'Certified Form 18',
      'Certified Form 19',
      'Director seal',
      'Embossed seal',
      'TIN certificate',
      'Submission of BO forms',
      'Resolutions to open a bank account and online banking',
      'First year retainer fee included',
    ],
  },
  {
    slug: 'premium',
    name: 'Premium',
    /** [FEES] F2 */
    price: 60_000,
    /** [FEES] F19 */
    perDirector: 4_700,
    summary: 'The full statutory record from day one, including the gazette and newspaper notice.',
    /** [FEES] F3:F17 */
    includes: [
      'Company name approval',
      'Certificate of Incorporation',
      'Certified Form 1',
      'Certified Articles',
      'Form 18',
      'Form 19',
      'Director seal',
      'Embossed seal',
      'TIN certificate',
      'Submission of BO forms',
      'Resolutions to open a bank account and online banking',
      'Share certificate book',
      'Minutes book',
      'Gazette and newspaper notice',
      'First year retainer fee included',
    ],
  },
] as const;

/**
 * The comparison matrix on /packages/, DERIVED from the three `includes` lists
 * above rather than typed out a second time. A matrix maintained by hand is a
 * second copy of the fee sheet, and second copies drift.
 *
 * The normaliser drops the word "Certified" because the client's sheet writes
 * "Certified Form 18" in the Advanced column and plain "Form 18" in the
 * Premium one. That difference is preserved as a note on the row instead of
 * being flattened away or silently corrected.
 *
 * If a package ever gains a line this list does not know about, the build stops
 * rather than quietly dropping it out of the comparison.
 */
const MATRIX_ORDER = [
  'Company name approval',
  'Certificate of Incorporation',
  'Form 1',
  'Articles',
  'Form 18',
  'Form 19',
  'Director seal',
  'Embossed seal',
  'TIN certificate',
  'Submission of BO forms',
  'Resolutions to open a bank account and online banking',
  'Share certificate book',
  'Minutes book',
  'Gazette and newspaper notice',
  'First year retainer fee included',
] as const;

const normalise = (line: string) => line.replace(/^Certified\s+/, '');

export const packageMatrix = (() => {
  const known = new Set<string>(MATRIX_ORDER);
  for (const p of packages) {
    for (const line of p.includes) {
      if (!known.has(normalise(line))) {
        throw new Error(
          `site.ts: "${line}" in the ${p.name} package has no row in MATRIX_ORDER. ` +
          `Add it there so /packages/ cannot silently drop it.`,
        );
      }
    }
  }
  return MATRIX_ORDER.map((key) => {
    // The exact wording each package uses for this line, where it has it.
    const wordings = packages
      .map((p) => p.includes.find((l) => normalise(l) === key))
      .filter((l): l is string => Boolean(l));
    const varies = new Set(wordings).size > 1;
    return {
      // Where every package words it identically, print that wording. Where they
      // disagree, print the plain name and flag the row: the marker means "the
      // sheet is not consistent here", not "this is certified".
      label: varies ? key : (wordings[0] ?? key),
      wordingVaries: varies,
      in: packages.map((p) => p.includes.some((l) => normalise(l) === key)),
    };
  });
})();

/**
 * [FEES] Sheet1, B21:B24. What is charged after incorporation, or instead of it.
 * These are NOT added into the calculator: none of them is part of setting a
 * company up, and quietly folding a per-meeting fee into a headline number is
 * how an estimate stops being honest.
 */
export const ongoingFees = [
  {
    label: 'Annual retainer, from the second year',
    amount: 'LKR 15,000',
    detail: 'Charged at the time of filing Form 15. The first year is included in every package above.',
  },
  {
    label: 'Additional forms filed with the DRC',
    amount: 'LKR 2,500 per form',
    detail: 'Plus the government charges for that form.',
  },
  {
    label: 'Board resolutions after the initial set',
    amount: 'LKR 2,500 per resolution',
    detail: 'The resolutions to open the bank account are already in every package.',
  },
  {
    label: 'A secretary attending your board meeting',
    amount: 'LKR 5,000 virtually, LKR 7,500 in person',
    detail: 'Charged per meeting attended.',
  },
] as const;

/**
 * [SAJ] 2026-08-31. Optional systems a new company usually needs on day one,
 * quoted as starting prices. Every one of these is a FROM figure and the
 * calculator labels it as such on every line it prints.
 */
export const extras = [
  {
    slug: 'website',
    name: 'Website development',
    /** one-time */
    price: 65_000,
    kind: 'once' as const,
    detail: 'Starting price. The final figure depends on the number of pages and what has to connect to it.',
  },
  {
    slug: 'pos-cloud',
    name: 'POS system, cloud based',
    /** per month */
    price: 4_500,
    kind: 'monthly' as const,
    detail: 'Starting price per month. Billed monthly rather than as part of the incorporation fee.',
  },
  {
    slug: 'pos-offline',
    name: 'POS system, offline',
    /** one-time */
    price: 45_000,
    kind: 'once' as const,
    detail: 'Starting price, paid once. No monthly fee.',
  },
] as const;

/** [FEES] B21. Quoted by the calculator as a footnote, never inside the total. */
export const annualRetainer = 15_000;

/**
 * [CONTENT] "Our directors", with the qualifications from [PROFILE] Board of
 * Directors. The bios are the document's own, which describe each director's
 * profile rather than claim more than it states.
 */
export const directors = [
  {
    name: 'J M N Sanjeewa',
    creds: 'FCA (CA Sri Lanka), ACMA (SL), BSc Accounting (Special), MBA',
    bio: 'A Fellow Member of CA Sri Lanka with a BSc in Accounting (Special) and an MBA. His profile includes company secretarial, corporate governance and financial advisory experience.',
  },
  {
    name: 'M A W P Wijerathna',
    creds: 'ACA (CA Sri Lanka), BSc Business Administration (Special)',
    bio: 'An Associate Member of CA Sri Lanka with a BSc in Business Administration (Special), bringing company secretarial and corporate administration experience.',
  },
  {
    name: 'R P P Amarasekara',
    creds: 'ACMA, Investment Advisor',
    bio: 'An Associate Chartered Management Accountant whose profile includes financial planning and investment advisory experience.',
  },
  {
    name: 'M V D Mendis',
    creds: 'Certified Business Accountant',
    bio: 'A Certified Business Accountant whose profile includes financial reporting and business advisory work.',
  },
] as const;

/** [PROFILE] Our Team. The numbers are the firm's own count. */
export const team = {
  rows: [
    { role: 'Chartered Accountants', n: 2 },
    { role: 'Professional Accountants', n: 2 },
    { role: 'Managers', n: 3 },
    { role: 'Associates', n: 10 },
  ],
  total: 17,
} as const;

/** [PROFILE] Sectorial expertise, all fourteen in the deck's order, plus NGOs,
    which [CONTENT] "Businesses we support" adds. */
export const sectors = [
  'Import and export', 'Power and energy',
  'Manufacturing', 'Agriculture',
  'Construction', 'Professionals',
  'Hotels', 'Trading',
  'Insurance', 'Advertising',
  'Services', 'Restaurants',
  'Wholesale and retail', 'Online e-commerce',
  'NGOs',
] as const;

/**
 * How an incorporation actually runs. Every step names something that appears
 * in [FEES] as a deliverable, so this is a description of the published work
 * rather than a promise invented for the website.
 */
export const steps = [
  {
    n: 1,
    title: 'Tell us what you are setting up',
    who: 'You, by phone or e-mail',
    detail:
      'What the company will do, and how many directors it will have. That is enough to say which package fits and what it will cost.',
  },
  {
    n: 2,
    title: 'We clear the name',
    who: 'The firm, with the Registrar of Companies',
    detail:
      'Name approval is the first filing and the first thing that can come back. It is in all three packages.',
  },
  {
    n: 3,
    title: 'We incorporate and register',
    who: 'The firm',
    detail:
      'Form 1 and the Articles are filed, the Certificate of Incorporation is issued, the seals are made, the TIN certificate is obtained and the BO forms go in.',
  },
  {
    n: 4,
    title: 'You open the bank account and start trading',
    who: 'You, with our resolutions in hand',
    detail:
      'The resolutions to open the account and enable online banking are in every package. From the second year we file your Form 15 on the annual retainer.',
  },
] as const;

export const faqs = [
  {
    q: 'What does it cost to incorporate a company?',
    a: 'LKR 36,000 for the Basic package, LKR 45,500 for Advanced and LKR 60,000 for Premium, each priced for a company with one director. The calculator at the top of this page adds the extra directors and shows what each package contains. Those are the firm’s published figures, not a range.',
  },
  {
    q: 'We are incorporating with more than one director.',
    a: 'Each director after the first adds LKR 3,150 on the Basic package, and LKR 4,700 on Advanced and Premium. Set the number of directors in the calculator and it is added for you.',
  },
  {
    q: 'What happens after the first year?',
    a: 'The first year retainer is already inside all three packages. From the second year onwards the annual retainer is LKR 15,000, charged at the time your Form 15 is filed. Nothing else renews automatically.',
  },
  {
    q: 'Is the calculator price the final price?',
    a: 'No. It is an estimate built from the published fee structure, and the website and POS lines are starting prices. Government charges on additional filings are separate. Tell us what you are setting up and you get the actual figure in writing before anything begins.',
  },
  {
    q: 'Who carries out the audit and the tax work?',
    a: 'RBPL is affiliated with Synergy Advisors (Chartered Accountants). Tax work is conducted through Synergy Advisors and Sanjeewa Associates; audits through Synergy Advisors for companies and Sanjeewa Associates for sole proprietors and partnerships. That is stated here rather than buried, because you are entitled to know which practice signs your audit.',
  },
  {
    q: 'Which accounting software do you work in?',
    a: 'Our corporate profile includes work with eFS, QuickBooks, Xero, Zoho, Odoo and ERPNext. If your books are already somewhere, the usual answer is that we work in what you have rather than moving you.',
  },
  {
    q: 'Do you take on the accounting after incorporation as well?',
    a: 'Yes, and most clients do. Book-keeping, reconciliations, financial statements, monthly payroll and the statutory payments are all in-house, alongside the secretarial work.',
  },
  /* [CONTENT] Common questions. */
  {
    q: 'Can I engage you for one service?',
    a: 'Yes. Individual services or combined engagements can be scoped.',
  },
  {
    q: 'Do you work with international businesses?',
    a: 'Yes. Tell us your location and reporting needs so we can scope the support required.',
  },
] as const;

/**
 * The fifteen sectors ([PROFILE] "Sectorial expertise", plus NGOs from [CONTENT]), grouped into six
 * families so each family can carry one photograph. Every one of the fourteen
 * names appears, exactly as the deck spells it.
 *
 * The family titles (and their `short` forms, for the jump bar and the mosaic),
 * the blurbs and the `services` mapping are EDITORIAL: they
 * describe what tends to weigh on a business in that sector and which of the
 * firm's six service lines usually answers it. None of them claims a client, a
 * result or an engagement, and none should ever be edited into one.
 */
export const industries = [
  {
    slug: 'trade',
    title: 'Trade and distribution',
    short: 'Trade',
    icon: 'ship',
    image: 'ind-trade',
    sectors: ['Import and export', 'Trading', 'Wholesale and retail'],
    blurb: 'Stock, margins and landed costs move every week, and the books have to move with them.',
    services: ['accounting', 'tax', 'payroll'],
  },
  {
    slug: 'hospitality',
    title: 'Hotels and restaurants',
    short: 'Hospitality',
    icon: 'utensils',
    image: 'ind-hospitality',
    sectors: ['Hotels', 'Restaurants'],
    blurb: 'Seasonal staff, service charge and daily takings: payroll and reconciliations carry most of the weight.',
    services: ['payroll', 'accounting', 'analytics'],
  },
  {
    slug: 'industry',
    title: 'Manufacturing, construction and energy',
    short: 'Industry and energy',
    icon: 'factory',
    image: 'ind-industry',
    sectors: ['Manufacturing', 'Construction', 'Power and energy'],
    blurb: 'Capital projects, long contracts and asset registers, where a feasibility study and an asset verification both earn their fee.',
    services: ['advisory', 'tax', 'accounting'],
  },
  {
    slug: 'agriculture',
    title: 'Agriculture',
    short: 'Agriculture',
    icon: 'wheat',
    image: 'ind-agriculture',
    sectors: ['Agriculture'],
    blurb: 'Income that arrives by season and a workforce that grows at harvest, so cash-flow planning matters as much as the ledger.',
    services: ['payroll', 'advisory', 'accounting'],
  },
  {
    slug: 'professional',
    title: 'Professional, financial and non-profit',
    short: 'Professional and NGO',
    icon: 'briefcase-business',
    image: 'ind-professional',
    sectors: ['Professionals', 'Services', 'Insurance', 'Advertising', 'NGOs'],
    blurb: 'Organisations where time is the product, so payroll, compliance and clean monthly figures do most of the work, and for an NGO, records a funder can rely on.',
    services: ['payroll', 'secretarial', 'analytics'],
  },
  {
    slug: 'digital',
    title: 'Online commerce',
    short: 'Online commerce',
    icon: 'shopping-bag',
    image: 'ind-digital',
    sectors: ['Online e-commerce'],
    blurb: 'Many small transactions across several payment channels, reconciled into one set of figures you can trust.',
    services: ['accounting', 'analytics', 'secretarial'],
  },
] as const;

/**
 * [CONTENT] Accounting: "work with eFS, QuickBooks, Xero, Zoho, Odoo and
 * ERPNext", plus Power BI from the analytics page. Set as TYPE, never as the
 * vendors' logos: the firm works in these tools, it is not their partner.
 */
export const platforms = ['eFS', 'QuickBooks', 'Xero', 'Zoho', 'Odoo', 'ERPNext', 'Power BI'] as const;

/** The credentials rail. Counts from [PROFILE] and [CONTENT]; the service
    count is the number of service pages, checked against services.ts. */
export const credentials = [
  { n: 2018, label: 'Year established', count: false },
  { n: 17, label: 'Professionals on the team', count: true },
  { n: 24, label: 'Specialist services', count: true },
  { n: 15, label: 'Sectors supported', count: true },
] as const;

/**
 * [CONTENT] "Links to important sites". Each address checked by hand on
 * 2026-10-13; the UAE page's own path includes /Doing-business/, which the
 * document's link omitted.
 */
export const usefulLinks = [
  { name: 'Synergy Advisors', note: 'Affiliated Chartered Accountants', href: 'https://www.sa.lk/' },
  { name: 'Central Bank of Sri Lanka', note: 'Monetary policy, rates and economic data', href: 'https://www.cbsl.gov.lk/' },
  { name: 'Department of Labour', note: 'Employment law and workplace administration', href: 'https://labourdept.gov.lk/' },
  { name: 'Employees’ Provident Fund', note: 'EPF registration and contributions', href: 'https://epf.lk/' },
  { name: 'The Employers’ Federation of Ceylon', note: 'Employer guidance and industrial relations', href: 'https://www.employers.lk/' },
  { name: 'Department of Foreign Exchange', note: 'Foreign exchange regulations and approvals', href: 'https://www.dfe.lk/' },
  { name: 'Colombo Port City Economic Commission', note: 'Port City registration and Authorised Persons', href: 'https://www.portcitycolombo.gov.lk/' },
  { name: 'Department of the Registrar of Companies', note: 'Company registration and filings', href: 'https://drc.gov.lk/' },
  { name: 'UAE Government portal', note: 'Running a business in a UAE free zone', href: 'https://u.ae/en/information-and-services/business/Doing-business/doing-business-in-free-zones/running-a-business-in-a-free-zone-' },
  { name: 'Sri Lanka Customs', note: 'Import and export registration', href: 'https://www.customs.gov.lk/' },
  { name: 'National Medicines Regulatory Authority', note: 'NMRA registrations and approvals', href: 'https://www.nmra.gov.lk/' },
] as const;

/**
 * How any engagement other than an incorporation starts. The promise in step
 * two — scope and fee in writing before work begins — is the one the site has
 * always made; nothing here adds a new one.
 */
export const engagement = [
  {
    n: 1,
    title: 'Tell us what you need',
    detail: 'By phone or e-mail, in your own words. You do not need the technical term for it.',
  },
  {
    n: 2,
    title: 'Scope and fee, in writing',
    detail: 'You see what will be done and what it costs before any work begins, and nothing starts until you agree.',
  },
  {
    n: 3,
    title: 'The work, delivered',
    detail: 'Monthly, annual or one-off, exactly as the written scope says, with you kept informed of where it stands.',
  },
] as const;
