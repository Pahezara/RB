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

  /** [PROFILE] cover line, verbatim. */
  tagline: 'Your trusted partner',

  /** [PROFILE] "established in 2018 as a limited liability Company". */
  founded: 2018,

  /** Derived from the e-mail domain in [PROFILE]. */
  url: 'https://rbpl.lk',

  /** [PROFILE] Contact Us. */
  phone: '+94 711 22 45 45',
  phoneHref: 'tel:+94711224545',

  /** [PROFILE] Contact Us. */
  email: 'info@rbpl.lk',

  /**
   * [PROFILE] Contact Us: "No. 464, High Level Road, Gangodawila, Nugegoda,
   * Sri Lanka". No postcode is given in any source, so none is published and
   * none appears in the JSON-LD. Inventing one would be inventing a fact.
   */
  address: {
    street: 'No. 464, High Level Road',
    locality: 'Gangodawila, Nugegoda',
    region: 'Western Province',
    country: 'LK',
  },

  /** [PROFILE] Vision and Values, verbatim. */
  vision:
    'To be the trusted partner delivering comprehensive business solutions ' +
    'that address the needs of both existing and potential clients by 2030.',

  /** [PROFILE] Vision and Values, verbatim. */
  values: [
    'Integrity',
    'Accountability',
    'Strengthening the client relationship',
    'Professionalism',
    'Confidentiality',
  ],

  social: {
    /** [PROFILE] Contact Us. */
    linkedin: 'https://www.linkedin.com/in/reliance-business-partners-2668811',
  },

  /**
   * [PROFILE] "Tax & Assurance Services (Conducted through Sanjeewa Associates
   * and Synergy Advisors)". Named on the site because a client is entitled to
   * know which firm actually signs the audit.
   */
  associates: [
    { name: 'Sanjeewa Associates', href: 'https://www.linkedin.com/in/Sanjeewa-associates-443185137' },
    { name: 'Synergy Advisors', href: 'https://www.sa.lk' },
  ],
};

/**
 * [PROFILE] "Our Services" and "Our Services (Cont'd)". Six service areas, and
 * the nature of service under each, transcribed row for row.
 */
export const serviceLines = [
  {
    slug: 'accounting',
    /** Editorial: the Lucide icon and the photograph used for this line. */
    icon: 'calculator',
    image: 'svc-accounting',
    /** Editorial paraphrase of `covers` below, for the service page's opening. */
    lead: 'Day-to-day book-keeping and reconciliations through to year-end financial statements, kept in the accounting software your business already runs on — or run for you end to end as a freelance finance function.',
    title: 'Accounting and BPO',
    blurb: 'Your books kept properly, in the software you already use, by people who do this all day.',
    covers: [
      'Freelance accountant service',
      'Accounting and book-keeping',
      'Reconciliations',
      'General ledgers maintained in QuickBooks, Xero, Zoho, ERPNext and similar',
      'Preparation of financial statements',
      'Data entry',
    ],
  },
  {
    slug: 'tax',
    /** Editorial: the Lucide icon and the photograph used for this line. */
    icon: 'landmark',
    image: 'svc-tax',
    /** Editorial paraphrase of `covers` below, for the service page's opening. */
    lead: "Tax computations, administration and planning, and the full range of assurance work — statutory and internal audit, due diligence, system studies and asset verification — carried out through the firm's associate practices.",
    title: 'Tax and assurance',
    blurb: 'Computations, filings and audit, carried out through our associate practices.',
    covers: [
      'Tax computations',
      'Tax administration',
      'Tax planning consultations',
      'Statutory audit service',
      'Internal audit',
      'Due diligence',
      'System studies',
      'Asset verifications',
    ],
    /** [PROFILE] the parenthetical under the service area heading. */
    note: 'Conducted through Sanjeewa Associates and Synergy Advisors.',
  },
  {
    slug: 'advisory',
    /** Editorial: the Lucide icon and the photograph used for this line. */
    icon: 'compass',
    image: 'svc-advisory',
    /** Editorial paraphrase of `covers` below, for the service page's opening. */
    lead: 'For decisions that need a number behind them: what a business or its shares are worth, whether a project stands up on paper, and how the organisation around it should be structured.',
    title: 'Business advisory',
    blurb: 'What a business is worth, whether a plan holds up, and what the numbers say about both.',
    covers: [
      'Shares and business valuation',
      'Feasibility studies',
      'Project reports',
      'HR advisory services',
      'Financial advisory',
    ],
  },
  {
    slug: 'payroll',
    /** Editorial: the Lucide icon and the photograph used for this line. */
    icon: 'wallet',
    image: 'svc-payroll',
    /** Editorial paraphrase of `covers` below, for the service page's opening. */
    lead: 'The monthly payroll prepared, statutory payments processed, payslips issued and the annual T10 forms filed, so the payroll stops being a job someone in the business has to find time for.',
    title: 'Payroll',
    blurb: 'The monthly run, the statutory payments and the annual forms, off your desk.',
    covers: [
      'Monthly payroll preparation',
      'Statutory payments processing',
      'Payslips',
      'Annual T10 forms',
    ],
  },
  {
    slug: 'analytics',
    /** Editorial: the Lucide icon and the photograph used for this line. */
    icon: 'chart-column',
    image: 'svc-analytics',
    /** Editorial paraphrase of `covers` below, for the service page's opening. */
    lead: 'Your own figures turned into dashboards that answer the questions you actually ask, and the Power BI training your team needs to keep building them.',
    title: 'Data analytics and Power BI',
    blurb: 'Your own figures, turned into something you can actually look at and act on.',
    covers: [
      'Dashboard preparation',
      'Training on Power BI',
      'Data analytics',
    ],
  },
  {
    slug: 'secretarial',
    /** Editorial: the Lucide icon and the photograph used for this line. */
    icon: 'file-signature',
    image: 'svc-secretarial',
    /** Editorial paraphrase of `covers` below, for the service page's opening. */
    lead: "From incorporation to the recurring filings that keep a company in good standing: statutory forms, minute books, the share register and the board's compliance checklist.",
    title: 'Corporate secretarial',
    blurb: 'Incorporation, and the filings that keep the company in good standing afterwards.',
    covers: [
      'Incorporation of companies: private, public, limited by guarantee and foreign',
      'Recurring secretarial filings such as Form 15, Form 20, Form 3 and Form 39',
      'Maintenance of minute books',
      'Share register maintenance',
      'Board compliance checklist',
    ],
    /** The only line with published prices, so it is the only one that links out. */
    packagesHref: '/packages/',
  },
] as const;

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
 * [PROFILE] Board of Directors, across three slides. Bios are condensed; every
 * qualification and every role named here appears in the deck.
 */
export const directors = [
  {
    name: 'Mr. J. M. N. Sanjeewa',
    creds: 'FCA (CA Sri Lanka), ACMA (SL), BSc Accounting (Special), MBA',
    bio:
      'A Fellow Member of the Institute of Chartered Accountants of Sri Lanka and an ' +
      'Associate Member of the Chartered Institute of Management Accountants. He is a ' +
      'Registered Company Secretary and an Investment Advisor, and works across corporate ' +
      'governance and financial advisory.',
  },
  {
    name: 'Mr. M. A. W. P. Wijerathna',
    creds: 'ACA (CA Sri Lanka), BSc Business Administration (Special)',
    bio:
      'An Associate Member of CA Sri Lanka and a Registered Company Secretary. His work is ' +
      'in corporate compliance and administration, advising on organisational management ' +
      'and on what the statutory requirements actually ask for.',
  },
  {
    name: 'Mr. R. P. P. Amarasekara',
    creds: 'ACMA, Investment Advisor',
    bio:
      'An Associate Chartered Management Accountant and an experienced Investment Advisor. ' +
      'He works on financial planning, investment strategy and portfolio management, ' +
      'grounded in management accounting.',
  },
  {
    name: 'Mr. M. V. D. Mendis',
    creds: 'Certified Business Accountant',
    bio:
      'A Certified Business Accountant working in financial reporting and business ' +
      'advisory, supporting clients in managing their financial operations.',
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

/** [PROFILE] Sectorial expertise, all fourteen, in the order the deck lists them. */
export const sectors = [
  'Import and export', 'Power and energy',
  'Manufacturing', 'Agriculture',
  'Construction', 'Professionals',
  'Hotels', 'Trading',
  'Insurance', 'Advertising',
  'Services', 'Restaurants',
  'Wholesale and retail', 'Online e-commerce',
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

export const audiences = [
  {
    title: 'Registering a company',
    detail: 'You want a company incorporated in Sri Lanka and you want to know what it costs before you call.',
    to: '/packages/',
  },
  {
    title: 'Running one already',
    detail: 'Forms are due, the minute book is behind, or the share register needs to be right.',
    to: '/services/secretarial/',
  },
  {
    title: 'Handing over the books',
    detail: 'You want the accounting, the reconciliations and the monthly payroll off your desk.',
    to: '/services/accounting/',
  },
  {
    title: 'Trying to see the numbers',
    detail: 'The data exists somewhere and nobody can answer a question with it.',
    to: '/services/analytics/',
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
    a: 'Tax and assurance work is conducted through Sanjeewa Associates and Synergy Advisors. That is stated here rather than buried, because you are entitled to know which practice signs your audit.',
  },
  {
    q: 'Which accounting software do you work in?',
    a: 'We maintain general ledgers in QuickBooks, Xero, Zoho and ERPNext among others. If your books are already somewhere, the usual answer is that we work in what you have rather than moving you.',
  },
  {
    q: 'Do you take on the accounting after incorporation as well?',
    a: 'Yes, and most clients do. Book-keeping, reconciliations, financial statements, monthly payroll and the statutory payments are all in-house, alongside the secretarial work.',
  },
] as const;

/**
 * The fourteen sectors in [PROFILE] "Sectorial expertise", grouped into six
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
    title: 'Professional and financial services',
    short: 'Professional services',
    icon: 'briefcase-business',
    image: 'ind-professional',
    sectors: ['Professionals', 'Services', 'Insurance', 'Advertising'],
    blurb: 'Businesses where time is the product, so payroll, compliance and clean monthly figures do most of the work.',
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
 * Why a business would choose this firm, stated only in terms the sources
 * support. Each `basis` names the fact the pillar rests on, so a pillar cannot
 * drift into a claim nobody can check.
 */
export const pillars = [
  {
    icon: 'layers',
    title: 'Six disciplines, one set of books',
    body: 'Accounting, tax, payroll, advisory, analytics and company secretarial work under one roof. The ledger the accountant keeps is the ledger the tax computation is built from.',
    basis: '[PROFILE] About us: "business related services ... under one umbrella"',
  },
  {
    icon: 'badge-check',
    title: 'A qualified board',
    body: 'Chartered Accountants, Chartered Management Accountants and Registered Company Secretaries sit on the board of directors.',
    basis: '[PROFILE] Board of Directors',
  },
  {
    icon: 'receipt-text',
    title: 'Fees in the open',
    body: 'Every incorporation package and per-director rate is published, and the estimator adds them up for you before you pick up the phone.',
    basis: '[FEES] Sheet1',
  },
  {
    icon: 'laptop',
    title: 'Your software, not ours',
    body: 'General ledgers kept in QuickBooks, Xero, Zoho, ERPNext and similar, so the books stay in the system your business already uses.',
    basis: '[PROFILE] Our Services: "Maintenance of GLs through software (QB, Xero, Zoho, ERP next, etc.)"',
  },
] as const;

/**
 * [PROFILE] the four ledger packages named under Accounting & BPO, plus Power BI
 * from the analytics line. Set as TYPE, never as the vendors' logos: the firm
 * works in these tools, it is not their partner, and a row of logos would
 * imply otherwise.
 */
export const platforms = ['QuickBooks', 'Xero', 'Zoho', 'ERPNext', 'Power BI'] as const;

/** The credentials rail. Every number is a count from [PROFILE]. */
export const credentials = [
  { n: 2018, label: 'Year established', count: false },
  { n: 17, label: 'Professionals on the team', count: true },
  { n: 4, label: 'Directors on the board', count: true },
  { n: 14, label: 'Sectors of expertise', count: true },
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
