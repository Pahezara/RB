/**
 * Every service the site describes, grouped as the main menu groups them.
 *
 * [CONTENT] = `RBPL_Website_Content.docx`, supplied by SAJ on 2026-10-13: the
 * firm's own website copy, one section per service. Titles, descriptions,
 * headlines, the "How we can help" lists, the approach paragraph, the two
 * questions and the button label on each entry are transcribed from it, with
 * spelling made consistent and nothing added to what it promises.
 *
 * EDITORIAL on each entry, and only these: `icon`, `image`, `related`, and the
 * short `blurb` used on cards (each one a condensed line of that service's own
 * opening paragraph).
 *
 * The order inside each category is the order the document's menu table lists
 * them. Two sections the document adds after that table (trademark, and legal
 * and regulatory coordination) sit under "Approvals and quality", the group
 * whose work they share: registrations, approvals and specialist coordination.
 */

export interface Faq { q: string; a: string }
export interface Service {
  slug: string;
  category: CategorySlug;
  title: string;
  blurb: string;
  icon: string;
  image: string;
  seoTitle: string;
  seoDescription: string;
  headline: string;
  intro: string[];
  help: string[];
  approach: string;
  faqs: Faq[];
  cta: string;
  related: string[];
  /** Extra blocks some pages carry, rendered in order after the help list. */
  extra?: Extra[];
  /** Notes a page must state, e.g. which practice carries out the work. */
  note?: string;
}
export type Extra =
  | { kind: 'cards'; heading: string; items: { title: string; body: string }[] }
  | { kind: 'checklist'; heading: string; intro?: string; groups: { label?: string; items: string[] }[] }
  | { kind: 'packages' };

export type CategorySlug = 'start' | 'finance' | 'systems' | 'invest' | 'approvals';
export interface Category {
  slug: CategorySlug;
  /** The menu label, [CONTENT] "Menu category". */
  title: string;
  /** [CONTENT] "Specialist support where it matters": the card title and line. */
  headline: string;
  body: string;
  icon: string;
  /** The hero slide for this category: a scrimmed, measured variant. */
  slide: string;
  /** The type-free photograph used on cards. */
  image: string;
}

export const categories: Category[] = [
  {
    slug: 'start',
    title: 'Start and expand',
    headline: 'Company formation and market entry',
    body: 'Establish your business in Sri Lanka, explore Port City requirements or coordinate your UAE setup.',
    icon: 'rocket',
    slide: 'slide-start',
    image: 'uae-skyline',
  },
  {
    slug: 'finance',
    title: 'Finance and compliance',
    headline: 'Accounting, payroll and corporate compliance',
    body: 'Maintain useful records, organised reporting and continuity in recurring administrative work.',
    icon: 'calculator',
    slide: 'slide-finance',
    image: 'svc-accounting',
  },
  {
    slug: 'systems',
    title: 'Systems and performance',
    headline: 'Business systems and digital presence',
    body: 'Improve workflows with ERP, Power BI, professional websites and focused digital communication.',
    icon: 'gauge',
    slide: 'slide-systems',
    image: 'svc-analytics',
  },
  {
    slug: 'invest',
    title: 'Investment and business change',
    headline: 'Advisory, investment and recovery',
    body: 'Build a financial plan, prepare for a transaction or develop a practical response to business pressure.',
    icon: 'trending-up',
    slide: 'slide-invest',
    image: 'ind-professional',
  },
  {
    slug: 'approvals',
    title: 'Approvals and quality',
    headline: 'Controls, approvals and documentation',
    body: 'Strengthen internal processes and coordinate registration, approval and certification requirements.',
    icon: 'shield-check',
    slide: 'slide-approvals',
    image: 'svc-secretarial',
  },
];

export const services: Service[] = [
  /* ===================================================== START AND EXPAND */
  {
    slug: 'company-registration',
    category: 'start',
    title: 'Company registration in Sri Lanka',
    blurb: 'Incorporation and registration coordination, from name approval to the first corporate records.',
    icon: 'building-2',
    image: 'ind-professional',
    seoTitle: 'Company Registration in Sri Lanka | RBPL',
    seoDescription: 'Register a company in Sri Lanka with coordinated incorporation, corporate records and post-registration support from Reliance Business Partners.',
    headline: 'Start with a structure that <em>fits your business.</em>',
    intro: [
      'Your business structure should support what you plan to do, who will own it and how it will operate. RBPL assists local entrepreneurs and overseas businesses with company incorporation and registration coordination in Sri Lanka, including liaison with the Department of the Registrar of Companies.',
    ],
    help: [
      'Discuss the business activity, proposed ownership and appropriate registration route.',
      'Coordinate name approval, incorporation documentation and submissions.',
      'Support private and public company formations, companies limited by guarantee and overseas company registrations, as applicable.',
      'Organise initial corporate records and the handover to recurring secretarial support.',
      'Coordinate relevant tax, banking and operational registration requirements within the agreed scope.',
    ],
    approach: 'You receive a clear list of required information, an agreed division of responsibilities and the completed registration records made available through the process. Post-incorporation work can be linked to accounting, payroll and corporate administration.',
    faqs: [
      { q: 'Can you support an overseas founder?', a: 'Yes. We can coordinate the setup process and identify activity-specific ownership, documentation and approval requirements before submission.' },
      { q: 'How much does company registration cost?', a: 'The proposal will distinguish professional fees from applicable authority charges and third-party costs. Timing depends on the structure, documents and authority processing. For a private company, the three published incorporation packages and the estimator on this page give you the professional fee straight away.' },
    ],
    cta: 'Discuss My Company Setup',
    related: ['secretarial', 'accounting', 'trademark'],
    extra: [{ kind: 'packages' }],
  },
  {
    slug: 'port-city',
    category: 'start',
    title: 'Colombo Port City business setup',
    blurb: 'Assess the Port City pathway and coordinate the offshore registration and Authorised Person application.',
    icon: 'anchor',
    image: 'ind-trade',
    seoTitle: 'Colombo Port City Business Setup Support | RBPL',
    seoDescription: 'Explore Colombo Port City business setup with support for offshore company registration, Authorised Person applications and operational planning.',
    headline: 'Plan your Port City presence <em>with clarity.</em>',
    intro: [
      'Considering business in and from Colombo Port City? RBPL helps you assess the setup pathway and coordinate the documentation required under the Colombo Port City Economic Commission framework. We connect the application work with your wider financial and operational planning.',
    ],
    help: [
      'Review the proposed activity and identify the relevant application pathway.',
      'Coordinate incorporation where needed and offshore company registration documentation.',
      'Support preparation of the business plan and Authorised Person application material.',
      'Coordinate responses to information requests and follow up with the relevant parties.',
      'Plan the accounting, payroll and administration arrangements for the proposed operation.',
    ],
    approach: 'Company registration and permission to conduct business in Port City are distinct steps. The applicable structure, licensing conditions and any incentives must be assessed for the specific proposal. Approval remains with the relevant authorities.',
    faqs: [
      { q: 'Is ordinary company incorporation enough?', a: 'No. A Port City business must address the applicable offshore registration and Authorised Person licensing requirements.' },
      { q: 'Are incentives automatic?', a: 'No. Eligibility and approval depend on the applicable framework and the proposed business. We review the position before building benefits into your plan.' },
    ],
    cta: 'Discuss My Port City Proposal',
    related: ['company-registration', 'advisory', 'accounting'],
    extra: [{
      kind: 'checklist',
      heading: 'Required information for the setup',
      intro: 'What an application typically has to be supported by. We confirm the exact list for your proposal before anything is prepared.',
      groups: [
        { items: [
          'Certificate of Incorporation certified by the issuing authority 30 days prior to application submission.',
          'Constitutional documents (for example a charter, statute, Memorandum or Articles of Association, or an equivalent constitutive document), certified by the relevant company registry, company secretary or attorney-at-law. Non-English documents must be accompanied by a certified English translation.',
          'Board resolution confirming there is no legal impediment in the country of incorporation to the company carrying on business as an offshore company, or engaging in the business of an offshore company.',
          'Board resolution appointing the Authorised Signatory to act on behalf of the applicant before the Colombo Port City Economic Commission, signed by all directors or, where the company has a sole director, certified by the company secretary.',
          'Certified copies of the passports of all directors and individual shareholders.',
        ] },
        { label: 'For corporate shareholders', items: ['Certificate of Incorporation certified by the issuing authority 30 days prior to application submission.'] },
        { label: 'For associated entities of the applicant or its shareholders', items: ['Certificate of Incorporation certified by the issuing authority 30 days prior to application submission.'] },
        { label: 'Declarations and forms', items: [
          'Bank reference letters for all directors and shareholders, confirming the account holder’s good standing, the account type and the duration of the banking relationship.',
          'Authorised Person Declaration Form (prescribed format), completed and signed by the Authorised Signatory on behalf of the applicant and, where applicable, its parent company.',
          'Ultimate Beneficial Ownership Declaration (prescribed format), completed and signed on company letterhead.',
          'Technical Evaluation Form (prescribed format), duly completed.',
          'Information of Directors and Shareholders (prescribed format), duly completed.',
          'Business Profile and Key Management Personnel Information (prescribed format), duly completed.',
        ] },
        { label: 'Request for designation of the proposed location', items: [
          'A letter requesting designation under Section 64 of the Act, specifying the proposed address and floor area in square metres, signed by the Authorised Signatory.',
          'Evidence of occupancy rights where the premises are not owned by the applicant, such as a lease or tenancy agreement, landlord authorisation or correspondence with the property owner.',
        ] },
        { label: 'Supporting documents', items: [
          'Form 1 (Form 20 where applicable) for companies incorporated under the Companies Act, No. 7 of 2007.',
          'Regulatory licences, where the proposed activities are subject to regulation under applicable law.',
          'Curricula vitae of the key management personnel responsible for the Port City operations.',
          'A business plan of at most four pages, in PDF, outlining the proposed business activities, operating model, target markets and financial projections.',
          'Evidence of funds and source of funds for the proposed investment, such as bank statements for the three preceding months, audited financial statements, loan agreements or investment portfolio statements.',
        ] },
      ],
    }],
  },
  {
    slug: 'uae-company-formation',
    category: 'start',
    title: 'UAE company formation',
    blurb: 'Compare mainland and free zone routes and coordinate formation with UAE providers and authorities.',
    icon: 'globe',
    image: 'uae-skyline',
    seoTitle: 'UAE Company Formation Support | RBPL',
    seoDescription: 'Plan your UAE company formation with coordinated mainland and free zone setup support, documentation and post-formation business planning.',
    headline: 'Build your UAE presence <em>around your business model.</em>',
    intro: [
      'Opening a company in the United Arab Emirates starts with understanding your customers, activities and operating requirements. RBPL helps you compare relevant setup options and coordinate the formation process with appropriate UAE service providers and authorities.',
    ],
    help: [
      'Review the planned activity, ownership, market access and operating location.',
      'Compare relevant mainland and free zone options and their practical implications.',
      'Coordinate business activity selection, application documents and licensing steps.',
      'Identify banking, office and residency-related coordination needs where applicable.',
      'Plan bookkeeping, reporting and ongoing compliance support within the agreed scope.',
    ],
    approach: 'Our approach begins with a setup brief and a scoped proposal. We identify third-party responsibilities and explain the assumptions behind the proposed route, so you can consider formation and ongoing operating costs together.',
    faqs: [
      { q: 'Which is better for my business, mainland or free zone?', a: 'The choice depends on activity, customer location, licensing and operational needs. We assess those factors before recommending a route.' },
      { q: 'Does incorporation guarantee a bank account or visa?', a: 'No. Banking, immigration and licensing decisions are made separately by the relevant institutions and authorities.' },
    ],
    cta: 'Plan My UAE Business Setup',
    related: ['company-registration', 'accounting', 'tax'],
    extra: [{
      kind: 'cards',
      heading: 'The setup, step by step',
      items: [
        { title: 'Choose the setup route', body: 'Explore mainland, free zone or offshore formation according to the proposed business activity and operating requirements.' },
        { title: 'Select the activity and licence', body: 'Identify the appropriate licence and any additional permits required.' },
        { title: 'Prepare the incorporation documents', body: 'Complete the registration paperwork, including the Memorandum of Association where applicable, and coordinate document clearances.' },
        { title: 'Consider suitable free zones', body: 'Options include SPC, Meydan, IFZA, Shams, RAKEZ and DMCC.' },
        { title: 'Allow for variable timelines', body: 'Formation may take from a few days to a few weeks, depending on the business and jurisdiction. This is an indicative timeframe.' },
        { title: 'Plan support after incorporation', body: 'Banking assistance, visa processing, accounting, corporate tax, VAT and ongoing compliance should form part of the wider business setup plan.' },
      ],
    }],
  },
  {
    slug: 'customs-registration',
    category: 'start',
    title: 'Customs registration',
    blurb: 'Registration coordination for import and export, with the corporate and tax information organised.',
    icon: 'container',
    image: 'containers',
    seoTitle: 'Customs Registration Support in Sri Lanka | RBPL',
    seoDescription: 'Prepare for import or export activity with RBPL Customs registration coordination and support to organise relevant business documentation.',
    headline: 'Prepare your business for <em>import and export registration.</em>',
    intro: [
      'Before goods move, your business needs the appropriate registration and supporting records. RBPL assists with Customs registration coordination and helps organise the corporate and tax information required for the relevant application.',
    ],
    help: [
      'Review the proposed import or export activity and registration need.',
      'Compile company, identity and tax registration information as applicable.',
      'Coordinate application preparation and submission follow-up.',
      'Identify product-specific approvals that may require separate action.',
      'Help organise registration records for the business and its service providers.',
    ],
    approach: 'We explain the registration scope and the documents to be supplied by management. Customs registration, product permissions and consignment clearance are different workstreams and should be planned together where relevant.',
    faqs: [
      { q: 'Does registration mean every product can be imported?', a: 'No. Goods may be subject to additional permits, restrictions or approvals depending on their nature.' },
      { q: 'Do you act as a Customs clearing agent?', a: 'This service covers registration coordination. Any consignment clearance or clearing-agent arrangement must be separately confirmed and agreed.' },
    ],
    cta: 'Discuss Import or Export Registration',
    related: ['company-registration', 'nmra-quality', 'accounting'],
  },

  /* ===================================================== FINANCE AND COMPLIANCE */
  {
    slug: 'accounting',
    category: 'finance',
    title: 'Accounting and BPO',
    blurb: 'Bookkeeping, reconciliations, management accounts and finance administration, kept current.',
    icon: 'calculator',
    image: 'svc-accounting',
    seoTitle: 'Outsourced Accounting and BPO Services | RBPL',
    seoDescription: 'Outsource bookkeeping, reconciliations, management accounts and finance administration to RBPL for your Sri Lankan or international business.',
    headline: 'Keep your books organised and <em>your decisions informed.</em>',
    intro: [
      'When finance work falls behind, management loses visibility. RBPL provides accounting outsourcing and business process outsourcing services for local and international businesses that need dependable records and regular reporting without building every function internally.',
    ],
    help: [
      'Bookkeeping, data entry and general ledger maintenance.',
      'Bank, supplier, customer and control-account reconciliations.',
      'Accounts payable and receivable administration within agreed approval limits.',
      'Period-end schedules, management accounts and financial statement preparation.',
      'Project-based or recurring accountant support, and accounting backlog clean-up.',
    ],
    approach: 'We agree the reporting calendar, document flow, review responsibilities and software access at the start. Our corporate profile includes work with eFS, QuickBooks, Xero, Zoho, Odoo and ERPNext. The chosen system and reporting basis depend on your needs.',
    faqs: [
      { q: 'Can you work with an overseas finance team?', a: 'Yes. We can agree reporting formats, communication arrangements and a handover process that supports your internal finance team.' },
      { q: 'Can you clear an accounting backlog?', a: 'Yes. We first assess the period, source records and reconciliation gaps, then propose a catch-up plan and ongoing process.' },
    ],
    cta: 'Request an Accounting Proposal',
    related: ['payroll', 'analytics', 'tax'],
  },
  {
    slug: 'payroll',
    category: 'finance',
    title: 'Payroll outsourcing',
    blurb: 'Monthly payroll, payslips, statutory schedules and employee tax documentation, controlled and traceable.',
    icon: 'wallet',
    image: 'svc-payroll',
    seoTitle: 'Payroll Outsourcing Services in Sri Lanka | RBPL',
    seoDescription: 'Organise monthly payroll, payslips, statutory schedules and employee tax documentation with payroll outsourcing support from RBPL.',
    headline: 'A more organised <em>monthly payroll process.</em>',
    intro: [
      'Employees depend on accurate payroll, while management needs a controlled and traceable process. RBPL supports payroll preparation and administration so your team can manage monthly inputs, approvals and reporting with greater consistency.',
    ],
    help: [
      'Compile approved salary, attendance, overtime, allowance and deduction inputs.',
      'Prepare payroll calculations and employer review schedules.',
      'Generate payslips and payment instructions for authorised release.',
      'Prepare applicable statutory contribution and employee tax schedules.',
      'Support annual employee tax documentation, including T10 forms where applicable.',
    ],
    approach: 'We define cut-off dates, approval points and responsibility for payments before processing begins. Access to payroll information is agreed with management, and changes are supported by authorised instructions.',
    faqs: [
      { q: 'Can payroll be outsourced while payment stays with us?', a: 'Yes. We can prepare the payroll and payment schedules while your authorised officers approve and release funds.' },
      { q: 'Can you help with a payroll transition?', a: 'Yes. We review employee master data, opening balances and previous calculations before agreeing a controlled transition.' },
    ],
    cta: 'Discuss Payroll Support',
    related: ['accounting', 'hr-advisory', 'internal-controls'],
  },
  {
    slug: 'secretarial',
    category: 'finance',
    title: 'Corporate secretarial and beneficial ownership',
    blurb: 'Annual returns, statutory registers, resolutions and beneficial ownership submissions, kept in order.',
    icon: 'file-signature',
    image: 'svc-secretarial',
    seoTitle: 'Corporate Secretarial and Beneficial Ownership Register Support Sri Lanka | RBPL',
    seoDescription: 'Keep company records and recurring filings organised with RBPL corporate secretarial services and beneficial ownership registry support.',
    headline: 'Keep corporate records <em>aligned with your business.</em>',
    intro: [
      'Changes in ownership, directors and business arrangements need clear documentation. RBPL provides corporate secretarial support to help companies maintain records, coordinate filings and track recurring corporate administration requirements.',
    ],
    help: [
      'Coordinate annual returns and relevant event-driven company filings.',
      'Maintain minutes books, shareholder records and statutory registers within scope.',
      'Prepare documentation for director, secretary and shareholding changes.',
      'Support board and shareholder resolutions and compliance tracking.',
      'Assist with beneficial ownership information collection, registry submissions and updates.',
    ],
    approach: 'Beneficial ownership work begins with understanding the ownership and control structure, including the relevant individuals behind corporate shareholders. We help organise supporting information and identify matters requiring clarification before filing.',
    faqs: [
      { q: 'Is a shareholder register the same as beneficial ownership information?', a: 'They serve different purposes. Beneficial ownership work considers the individuals who ultimately own or control the entity under the applicable requirements.' },
      { q: 'Can you take over existing secretarial records?', a: 'Yes. We review the available records and filing history, identify gaps and agree the transfer and remediation scope.' },
    ],
    cta: 'Request a Corporate Records Review',
    related: ['company-registration', 'legal-regulatory', 'accounting'],
    extra: [{ kind: 'packages' }],
  },
  {
    slug: 'tax',
    category: 'finance',
    title: 'Tax advisory and planning',
    blurb: 'Tax planning, computations and administration, coordinated through the firm’s affiliated practices.',
    icon: 'landmark',
    image: 'svc-tax',
    seoTitle: 'Tax Advisory and Planning in Sri Lanka | RBPL',
    seoDescription: 'Coordinate business tax planning, computations and administration through RBPL’s affiliated professional firms with a scope tailored to your needs.',
    headline: 'Plan tax responsibilities <em>alongside your business decisions.</em>',
    intro: [
      'Tax considerations affect structure, cash flow and transactions. RBPL coordinates tax advisory, planning and administration through Synergy Advisors and Sanjeewa Associates, as described in our corporate profile, so the relevant professional support is connected to your wider business needs.',
    ],
    help: [
      'Review applicable tax registration and compliance requirements.',
      'Coordinate tax computations and filing support within the agreed engagement.',
      'Assess the tax implications of proposed business activities and transactions.',
      'Support documentation, reconciliations and responses to information requests.',
      'Plan recurring reporting and payment responsibilities with management.',
    ],
    approach: 'Advice is based on the facts of your business and the applicable rules at the time. We focus on lawful planning and clear records, with the tax service provider and engagement responsibilities confirmed at the outset.',
    faqs: [
      { q: 'Can tax planning be considered before incorporation or investment?', a: 'Yes. Early review helps identify implications that may affect the proposed structure and financial plan.' },
      { q: 'Can you guarantee a tax saving?', a: 'No. The outcome depends on the facts, eligibility and applicable law. Any recommendation must have an appropriate legal and commercial basis.' },
    ],
    cta: 'Discuss My Tax Requirements',
    related: ['accounting', 'audit-assurance', 'advisory'],
    note: 'Tax services are conducted through Synergy Advisors and Sanjeewa Associates, subject to the agreed engagement and professional requirements.',
  },
  {
    slug: 'audit-assurance',
    category: 'finance',
    title: 'Audit and assurance coordination',
    blurb: 'Statutory and internal audit needs, coordinated through the appropriate affiliated professional firm.',
    icon: 'shield-check',
    image: 'work-desk',
    seoTitle: 'Audit and Assurance Coordination | RBPL',
    seoDescription: 'Coordinate statutory audit, internal audit and related assurance needs through RBPL’s affiliated professional firms with clear engagement responsibilities.',
    headline: 'Connect your business with <em>the appropriate assurance support.</em>',
    intro: [
      'Owners, lenders and other stakeholders may need independent assurance over financial or operational information. RBPL coordinates access to audit and assurance services through Synergy Advisors (for corporate clientele) and Sanjeewa Associates (for sole proprietors and partnerships).',
    ],
    help: [
      'Discuss statutory audit and other assurance requirements.',
      'Coordinate referral to the appropriate professional firm.',
      'Help organise accounting schedules and supporting records within a separate support scope.',
      'Coordinate internal audit or system study requirements.',
      'Support management in tracking agreed follow-up actions.',
    ],
    approach: 'The appointed professional firm determines acceptance, independence, scope and reporting. Audit opinions and assurance reports are issued by the appointed provider. Accounting support and audit roles must be assessed separately to meet the relevant professional requirements.',
    faqs: [
      { q: 'Does RBPL issue the statutory audit opinion?', a: 'The opinion is issued by the appointed audit firm under its own engagement. RBPL’s role is coordination and separately agreed support.' },
      { q: 'Can you help us prepare for an audit?', a: 'Yes. Accounting schedules and record preparation can be scoped, subject to the appointed auditor’s independence and engagement requirements.' },
    ],
    cta: 'Discuss My Assurance Requirements',
    related: ['accounting', 'tax', 'internal-controls'],
    note: 'Audit opinions and assurance reports are issued by the appointed firm: Synergy Advisors for corporate clientele, Sanjeewa Associates for sole proprietors and partnerships.',
  },

  /* ===================================================== SYSTEMS AND PERFORMANCE */
  {
    slug: 'erp',
    category: 'systems',
    title: 'ERP and business systems',
    blurb: 'Map workflows, choose the right system and coordinate implementation, migration and training.',
    icon: 'blocks',
    image: 'workspace',
    seoTitle: 'ERP Implementation and Business Systems Support | RBPL',
    seoDescription: 'Review your workflows and implement practical ERP and accounting systems with RBPL business analysis, migration and user training support.',
    headline: 'Choose systems around <em>the way your business works.</em>',
    intro: [
      'An ERP project should solve operational problems and improve information flow. RBPL helps you understand existing processes, define system requirements and coordinate implementation, so technology supports the work your people need to do.',
    ],
    help: [
      'Map finance, sales, purchasing, inventory and other relevant workflows.',
      'Prepare requirements and evaluate suitable system options.',
      'Design account structures, approval flows and user access arrangements.',
      'Coordinate data preparation, migration, testing and reconciliation.',
      'Support user training, go-live planning and post-implementation review.',
    ],
    approach: 'We define the project scope and acceptance criteria before configuration begins. System selection considers the business model, reporting needs, integrations, available skills and total operating cost. Software licences and specialist vendor work are separately scoped.',
    faqs: [
      { q: 'Do we need to replace our existing system?', a: 'Not always. A review may identify improvements in configuration, data quality or processes that can be made within your current system.' },
      { q: 'Can you help migrate accounting data?', a: 'Yes. Migration support can include data clean-up, mapping and reconciliations, with agreed checks before the new system goes live.' },
    ],
    cta: 'Request a Business Systems Review',
    related: ['analytics', 'accounting', 'internal-controls'],
  },
  {
    slug: 'analytics',
    category: 'systems',
    title: 'Data analytics and Power BI',
    blurb: 'Decision-focused dashboards built from your own financial and operational data, with training.',
    icon: 'chart-column',
    image: 'svc-analytics',
    seoTitle: 'Power BI Dashboards and Data Analytics | RBPL',
    seoDescription: 'Turn financial and operational data into useful Power BI dashboards with RBPL reporting design, data analytics and practical training support.',
    headline: 'See the information behind <em>your next decision.</em>',
    intro: [
      'Useful reporting helps you identify changes early and ask better questions. RBPL supports data analytics and Power BI reporting that brings financial and operational information into a clearer view for owners, managers and finance teams.',
    ],
    help: [
      'Define decision-focused measures and dashboard requirements.',
      'Organise data from agreed accounting and operational sources.',
      'Build dashboards for sales, margins, cash flow, receivables or inventory.',
      'Reconcile key measures and document calculation assumptions.',
      'Train users to interpret reports and manage agreed reporting routines.',
    ],
    approach: 'We begin with the decisions you need to make, then work backwards to the data required. The result is an agreed set of measures, reporting views and definitions that your team can use consistently.',
    faqs: [
      { q: 'Can you work with spreadsheet-based information?', a: 'Yes, subject to the structure and quality of the available data. We first review how the information is captured and maintained.' },
      { q: 'Will a dashboard correct inaccurate source data?', a: 'No. Data quality issues need to be identified and addressed. Our scope can include checks and recommendations to improve the underlying records.' },
    ],
    cta: 'Discuss My Reporting Needs',
    related: ['erp', 'accounting', 'advisory'],
  },
  {
    slug: 'sops',
    category: 'systems',
    title: 'SOPs and procedure manuals',
    blurb: 'Procedures that set out responsibilities, approvals and the records each recurring task needs.',
    icon: 'list-checks',
    image: 'svc-tax',
    seoTitle: 'SOP Development and Procedure Manuals | RBPL',
    seoDescription: 'Document how work should be done with RBPL standard operating procedures, approval guidelines and practical business procedure manuals.',
    headline: 'Make essential work easier <em>to perform consistently.</em>',
    intro: [
      'When processes depend on individual memory, errors and delays can multiply as a business grows. RBPL helps document standard operating procedures and manuals that explain responsibilities, approvals and the records required to complete recurring work.',
    ],
    help: [
      'Map existing activities through interviews and process walkthroughs.',
      'Identify unclear responsibilities, repeated work and missing approvals.',
      'Draft procedures for finance, procurement, inventory and other agreed functions.',
      'Develop supporting forms, checklists and escalation paths.',
      'Support management review, staff orientation and document version control.',
    ],
    approach: 'Each procedure should identify its purpose, owner, inputs, steps, approvals and evidence of completion. We tailor the level of detail to the people using it and connect documentation with practical implementation.',
    faqs: [
      { q: 'Can you update manuals we already have?', a: 'Yes. We can review existing procedures against current working practices and propose the changes needed.' },
      { q: 'Will a manual alone improve compliance?', a: 'It provides a foundation. Management ownership, training, supervision and periodic review are also needed to make the procedures work.' },
    ],
    cta: 'Discuss My Procedure Manual',
    related: ['internal-controls', 'hr-advisory', 'erp'],
  },
  {
    slug: 'internal-controls',
    category: 'systems',
    title: 'Internal processes and controls',
    blurb: 'Controls over purchasing, cash, sales and reporting, designed for your size and systems.',
    icon: 'shield-half',
    image: 'svc-payroll',
    seoTitle: 'Internal Controls and Process Design | RBPL',
    seoDescription: 'Strengthen approvals, accountability and business workflows with RBPL internal control design and practical process improvement support.',
    headline: 'Build controls into <em>the way your business operates.</em>',
    intro: [
      'Effective internal controls help a business protect resources, maintain reliable records and assign clear responsibility. RBPL reviews how transactions move through your business and helps design controls suited to its size, systems and operating risks.',
    ],
    help: [
      'Map transaction flows and identify key operational and reporting risks.',
      'Review segregation of duties and approval limits.',
      'Design controls for purchasing, cash, sales, inventory and financial reporting.',
      'Develop evidence requirements, exception reports and monitoring routines.',
      'Support implementation through procedures and management training.',
    ],
    approach: 'We aim for controls that people can apply in everyday work. Recommendations consider the team available, system capabilities and the cost of implementation, with clear ownership for follow-up actions.',
    faqs: [
      { q: 'Can a small team have effective controls?', a: 'Yes. Where duties cannot be fully separated, supervisory reviews and other compensating controls may help address the risk.' },
      { q: 'Is this an internal audit?', a: 'Process and control design is a management support service. An independent internal audit is a separate engagement with its own scope and responsibilities.' },
    ],
    cta: 'Request a Process and Controls Review',
    related: ['sops', 'fixed-assets', 'audit-assurance'],
  },
  {
    slug: 'fixed-assets',
    category: 'systems',
    title: 'Fixed asset registers and verification',
    blurb: 'Build and reconcile the asset register, and verify what the business owns and where it is.',
    icon: 'tag',
    image: 'ind-industry',
    seoTitle: 'Fixed Asset Registers and Verification | RBPL',
    seoDescription: 'Build and reconcile your fixed asset register with RBPL asset identification, physical verification and record improvement support.',
    headline: 'Know what your business owns <em>and where it is located.</em>',
    intro: [
      'Incomplete asset records make it harder to track equipment, plan replacements and support financial reporting. RBPL helps develop fixed asset registers and coordinate physical verification to improve the information available to management.',
    ],
    help: [
      'Review asset purchase records, existing registers and ledger balances.',
      'Define useful asset categories, locations and custodian fields.',
      'Coordinate asset identification and tagging where included in scope.',
      'Perform physical checks and record missing, moved or unrecorded items.',
      'Reconcile findings and recommend controls over transfers and disposals.',
    ],
    approach: 'The output can include an updated register, verification exceptions and a reconciliation schedule. Accounting values, depreciation and ownership evidence are reviewed within the agreed scope; unresolved matters are reported for management action.',
    faqs: [
      { q: 'Can you create a register where none exists?', a: 'Yes. We assess the supporting documents and the physical asset population, then agree the data fields and verification approach.' },
      { q: 'Does physical verification establish market value?', a: 'No. Verification records existence and other agreed observations. A formal valuation requires a separate scope and suitable expertise.' },
    ],
    cta: 'Plan My Asset Verification',
    related: ['internal-controls', 'accounting', 'audit-assurance'],
  },
  {
    slug: 'hr-advisory',
    category: 'systems',
    title: 'HR advisory and administration',
    blurb: 'Role clarity, HR procedures and employee administration, connected to payroll.',
    icon: 'users',
    image: 'contact',
    seoTitle: 'HR Advisory and Administration Support | RBPL',
    seoDescription: 'Improve employee documentation, role clarity and HR procedures with RBPL advisory support linked to payroll and business administration.',
    headline: 'Give your people processes <em>a clearer structure.</em>',
    intro: [
      'As a business grows, informal employment practices can become difficult to manage consistently. RBPL provides HR advisory support to help management organise people-related documentation, responsibilities and recurring administrative processes.',
    ],
    help: [
      'Review HR administration needs and existing documentation.',
      'Support job descriptions, reporting lines and role clarity.',
      'Develop HR procedure manuals and practical employee administration checklists.',
      'Coordinate attendance, leave and payroll information flows.',
      'Support performance review processes and management reporting.',
    ],
    approach: 'The scope can be combined with payroll, SOP development and business systems work. Employment policies and contractual matters should be checked against applicable law, with legal specialists involved where required.',
    faqs: [
      { q: 'Can you help a small business formalise HR administration?', a: 'Yes. We can begin with essential documents and recurring processes, then build further controls as the business grows.' },
      { q: 'Can you connect HR procedures with payroll?', a: 'Yes. We can define the employee data, approvals and cut-off dates needed to support consistent payroll inputs.' },
    ],
    cta: 'Discuss My HR Administration',
    related: ['payroll', 'sops', 'legal-regulatory'],
  },
  {
    slug: 'digital',
    category: 'systems',
    title: 'Website design and digital marketing',
    blurb: 'Websites, brand identity and social campaigns, planned around your business objectives.',
    icon: 'monitor-smartphone',
    image: 'ind-digital',
    seoTitle: 'Web Design and Digital Marketing for Businesses | RBPL',
    seoDescription: 'Create a clear business identity with RBPL website design, logo design and social media campaign support for startups and established companies.',
    headline: 'Make your business easier <em>to understand and find.</em>',
    intro: [
      'A strong digital presence explains what you do, who you help and how a customer can take the next step. RBPL supports startups and established businesses with website, brand identity and digital campaign coordination linked to their business objectives.',
    ],
    help: [
      'Plan the website structure, customer journeys and enquiry points.',
      'Develop website content and coordinate responsive website design.',
      'Create or refresh logos and practical brand-use guidelines.',
      'Plan social media content and campaigns around defined audiences.',
      'Set up agreed campaign reporting and improve content using performance evidence.',
    ],
    approach: 'We start with your offer, audience and priorities. The engagement should define page scope, design revisions, content ownership, hosting arrangements, maintenance and any advertising budget separately.',
    faqs: [
      { q: 'Can you help a startup launch its identity and website together?', a: 'Yes. Logo, core messaging and website work can be coordinated as one agreed project.' },
      { q: 'Do you guarantee search rankings or sales?', a: 'No. We work on content, usability and measurable campaign activity, while results also depend on competition, budget, demand and implementation.' },
    ],
    cta: 'Discuss My Digital Presence',
    related: ['trademark', 'company-registration', 'analytics'],
  },

  /* ===================================================== INVESTMENT AND BUSINESS CHANGE */
  {
    slug: 'advisory',
    category: 'invest',
    title: 'Business and financial advisory',
    blurb: 'Business plans, feasibility studies, financial models and valuation support for real decisions.',
    icon: 'compass',
    image: 'svc-advisory',
    seoTitle: 'Business and Financial Advisory in Sri Lanka | RBPL',
    seoDescription: 'Plan growth and assess commercial decisions with RBPL business plans, feasibility studies, financial modelling and valuation support.',
    headline: 'Give your next business decision <em>a stronger foundation.</em>',
    intro: [
      'Growth decisions bring financial commitments, operating demands and uncertainty. RBPL helps owners and management teams examine the numbers, test assumptions and build a practical plan before committing resources.',
    ],
    help: [
      'Business plans, project reports and feasibility studies.',
      'Budgets, cash-flow forecasts and financial models.',
      'Profitability, pricing and working-capital analysis.',
      'Business and share valuation support for an agreed purpose.',
      'Growth planning and performance reviews with management.',
    ],
    approach: 'We connect the financial analysis to the business model and the decisions being considered. Assumptions, scenarios and information limitations are explained, so that a forecast or valuation can be used with appropriate context.',
    faqs: [
      { q: 'Can you prepare a business plan for a lender or investor?', a: 'Yes. We can prepare a plan, projections and supporting schedules suited to the intended discussion and the information available.' },
      { q: 'Is a valuation the price a buyer must pay?', a: 'No. A valuation is an assessment based on a stated purpose, date, methods and assumptions. A transaction price also depends on negotiations and terms.' },
    ],
    cta: 'Discuss My Business Plan',
    related: ['funding', 'due-diligence', 'analytics'],
  },
  {
    slug: 'due-diligence',
    category: 'invest',
    title: 'Due diligence',
    blurb: 'Financial and operational review before an investment or acquisition, with specialists coordinated.',
    icon: 'search-check',
    image: 'svc-analytics',
    seoTitle: 'Business and Financial Due Diligence | RBPL',
    seoDescription: 'Examine financial and operational risks before an investment or acquisition with coordinated due diligence support from RBPL and its affiliates.',
    headline: 'Understand the business <em>behind the opportunity.</em>',
    intro: [
      'A proposed investment or acquisition deserves careful examination. RBPL coordinates due diligence support to help buyers, investors and business owners understand financial performance, operating risks and the information that needs further investigation.',
    ],
    help: [
      'Review financial trends and the quality of available records.',
      'Analyse working capital, debt, cash commitments and significant balances.',
      'Identify unusual transactions and matters requiring explanation.',
      'Coordinate tax, corporate, legal and specialist reviews where required.',
      'Summarise findings, information gaps and potential transaction implications.',
    ],
    approach: 'The scope is tailored to the transaction, access to information and the intended use of the report. Where assurance or specialist work is required, we coordinate with the appropriate provider, including our affiliated professional firms.',
    faqs: [
      { q: 'Can you support the seller before approaching buyers?', a: 'Yes. A readiness review can identify record gaps and issues that prospective investors may raise.' },
      { q: 'Is due diligence a guarantee that no problems exist?', a: 'No. Findings depend on the agreed scope and information available. Limitations and matters requiring further work are stated in the report.' },
    ],
    cta: 'Discuss a Due Diligence Assignment',
    related: ['business-sale', 'funding', 'advisory'],
  },
  {
    slug: 'funding',
    category: 'invest',
    title: 'Investment partner and funding support',
    blurb: 'A clear funding proposition, forecasts and supporting records for investor and lender discussions.',
    icon: 'hand-coins',
    image: 'svc-payroll',
    seoTitle: 'Investment Partner and Business Funding Support | RBPL',
    seoDescription: 'Prepare for investor and lender discussions with RBPL financial forecasts, funding proposals and coordinated introductions where suitable.',
    headline: 'Prepare a stronger case <em>for the capital you need.</em>',
    intro: [
      'Whether you need working capital, expansion finance or an investment partner, a clear funding proposition makes discussions more productive. RBPL helps you explain the requirement, demonstrate the business case and prepare supporting information.',
    ],
    help: [
      'Assess the purpose, amount and proposed use of funds.',
      'Prepare cash-flow forecasts, repayment scenarios and funding presentations.',
      'Organise financial statements and supporting business records.',
      'Coordinate discussions with potential investors or lending institutions where suitable.',
      'Support management in comparing commercial proposals and information requests.',
    ],
    approach: 'We help distinguish the implications of borrowing from those of bringing in an equity partner. Funding decisions remain with the investor or lender, and any introduction or transaction-related role must be agreed separately.',
    faqs: [
      { q: 'Can you arrange introductions?', a: 'We can help identify relevant parties and coordinate introductions where suitable. This does not guarantee that funding will be available.' },
      { q: 'What information should we prepare?', a: 'Start with recent accounts, current borrowing, cash-flow information, the amount needed and an explanation of how the funds will be used.' },
    ],
    cta: 'Discuss My Funding Requirement',
    related: ['advisory', 'due-diligence', 'business-sale'],
  },
  {
    slug: 'business-sale',
    category: 'invest',
    title: 'Business sale, liquidation and divestment',
    blurb: 'Prepare the information buyers need and coordinate a staged, confidential sale process.',
    icon: 'arrow-right-left',
    image: 'work-desk',
    seoTitle: 'Business Sale and Divestment Support | RBPL',
    seoDescription: 'Prepare your business for a potential sale with RBPL financial information support, buyer coordination and transaction preparation services.',
    headline: 'Prepare for a business sale or liquidation <em>with a clear process.</em>',
    intro: [
      'Selling all or part of a business is a significant decision. RBPL helps owners organise the information potential buyers need, consider the proposed transaction and coordinate discussions with suitable parties where identified.',
    ],
    help: [
      'Clarify the owner’s objectives, proposed sale scope and preferred process.',
      'Review financial information and prepare a business overview.',
      'Coordinate valuation input and identify information gaps.',
      'Support confidential buyer approaches and initial discussions with owner approval.',
      'Organise a data room and coordinate due diligence requests and adviser input.',
    ],
    approach: 'We agree what may be disclosed, and when, before approaching third parties. The process can be staged, beginning with an anonymised overview and progressing to detailed information under appropriate confidentiality arrangements.',
    faqs: [
      { q: 'Can you help sell only part of the business?', a: 'Yes. We can support preparation for a partial sale or investment, subject to the intended structure and the required legal advice.' },
      { q: 'Do you guarantee a buyer or sale price?', a: 'No. Buyer interest, valuation and completion depend on the business, available evidence, market conditions and negotiated terms.' },
    ],
    cta: 'Discuss a Confidential Business Sale or Liquidation',
    related: ['due-diligence', 'advisory', 'turnaround'],
  },
  {
    slug: 'turnaround',
    category: 'invest',
    title: 'Business turnaround and recovery',
    blurb: 'Find the causes of underperformance and build a focused, evidence-based recovery plan.',
    icon: 'trending-up',
    image: 'ind-industry',
    seoTitle: 'Business Turnaround and Recovery Support | RBPL',
    seoDescription: 'Address recurring losses and cash-flow pressure with RBPL business diagnostics, short-term cash planning and practical performance improvement support.',
    headline: 'When performance is under pressure, <em>begin with the facts.</em>',
    intro: [
      'Recurring losses, overdue payments and declining sales can make it difficult to see where to act first. RBPL helps owners understand the causes of underperformance and develop a focused response based on the financial and operational evidence.',
    ],
    help: [
      'Assess profitability, cash commitments and immediate operating pressures.',
      'Prepare short-term cash-flow forecasts and payment priorities.',
      'Review product margins, pricing, overheads and working capital.',
      'Evaluate operational changes and realistic recovery scenarios.',
      'Support management discussions with lenders and other stakeholders within scope.',
    ],
    approach: 'Our first objective is to clarify the position and identify actions management can assess promptly. A recovery plan should state who is responsible, what will change and how progress will be monitored. Distress involving legal obligations or insolvency requires appropriate specialist advice.',
    faqs: [
      { q: 'Can you help a business that has already stopped operating?', a: 'We can assess the available information and discuss whether restart, restructuring, a sale or specialist closure advice should be explored.' },
      { q: 'Can you guarantee a recovery?', a: 'No. Viability depends on cash availability, market demand, obligations and the ability to implement changes. We explain the evidence and options.' },
    ],
    cta: 'Request a Confidential Business Review',
    related: ['advisory', 'internal-controls', 'funding'],
  },

  /* ===================================================== APPROVALS AND QUALITY */
  {
    slug: 'nmra-quality',
    category: 'approvals',
    title: 'NMRA and quality certification',
    blurb: 'NMRA application work and quality certification readiness, with technical specialists coordinated.',
    icon: 'flask-conical',
    image: 'lab-glass',
    seoTitle: 'NMRA and Quality Certification Coordination | RBPL',
    seoDescription: 'Coordinate NMRA application documentation and quality certification preparation with RBPL support and relevant technical specialists.',
    headline: 'Organise the work behind <em>approvals and certification.</em>',
    intro: [
      'Entering a regulated market requires coordinated documentation and specialist input. RBPL supports businesses in organising NMRA-related application work and preparing for relevant quality assurance certification processes, with technical responsibilities assigned to appropriately qualified parties.',
    ],
    help: [
      'Clarify the proposed product or activity and the relevant coordination needs.',
      'Organise corporate and administrative application documents.',
      'Coordinate with product owners, technical specialists and authorised representatives.',
      'Track queries, document versions and agreed follow-up actions.',
      'Support procedure documentation and readiness work for relevant quality certifications.',
    ],
    approach: 'We help management maintain visibility over the application or readiness process. The relevant authority decides approvals, while independent certification bodies make certification decisions. Product testing and technical assessments require the appropriate specialist scope.',
    faqs: [
      { q: 'Can you issue an NMRA approval or quality certificate?', a: 'No. We provide coordination and preparation support. Approvals and certifications are issued by the responsible authorities or certification bodies.' },
      { q: 'Can one approval cover all products?', a: 'The requirements depend on the product category, intended use and applicable process. These must be assessed before defining the assignment.' },
    ],
    cta: 'Discuss My Approval Requirements',
    related: ['customs-registration', 'sops', 'legal-regulatory'],
  },
  {
    slug: 'trademark',
    category: 'approvals',
    title: 'Trademark and logo registration',
    blurb: 'Searches, classification and applications with NIPO, through to renewals and record changes.',
    icon: 'stamp',
    image: 'workspace',
    seoTitle: 'Trademark and Logo Registration in Sri Lanka | RBPL',
    seoDescription: 'Protect your brand identity with RBPL trademark and logo registration support, including application coordination, documentation and renewal tracking.',
    headline: 'Take the next step in <em>protecting your brand.</em>',
    intro: [
      'Your business name, product names and logo help customers recognise your business. RBPL provides trademark registration support to help startups and established businesses organise applications and coordinate the registration process with the National Intellectual Property Office of Sri Lanka (NIPO).',
      'Whether you are launching a new brand or seeking protection for an existing identity, we help clarify the proposed application, prepare supporting information and coordinate specialist advice where required.',
    ],
    help: [
      'Coordinate preliminary trademark searches to identify potentially conflicting marks.',
      'Assist with identifying the relevant goods and services classifications for the proposed application.',
      'Organise applicant details, brand names, logo artwork and supporting documents.',
      'Coordinate the preparation and submission of trademark applications.',
      'Track application progress, publication stages and requests for further information.',
      'Coordinate with qualified intellectual property professionals on objections, oppositions and other legal matters.',
      'Support renewal tracking and documentation for changes in registered ownership, names or addresses.',
    ],
    approach: 'Registration depends on the mark’s eligibility, examination and the applicable opposition process. A preliminary search helps identify potential issues but does not guarantee acceptance. NIPO determines the registration outcome, while any legal advice or representation is provided by the appointed professional.',
    faqs: [
      { q: 'Can a logo be registered as a trademark?', a: 'Yes. A distinctive logo may qualify for registration as a mark. The proposed protection may relate to a brand name, a logo or a combined design, depending on the application and applicable requirements.' },
      { q: 'Does registering my company also register its brand name or logo?', a: 'No. Company registration and trademark registration are separate processes. Incorporating a company does not, by itself, register its name or logo as a trademark.' },
      { q: 'Can you assist with an existing trademark?', a: 'Yes. We can review the available registration records and coordinate renewal applications or relevant record updates within an agreed scope.' },
    ],
    cta: 'Discuss My Trademark Registration',
    related: ['company-registration', 'digital', 'legal-regulatory'],
  },
  {
    slug: 'legal-regulatory',
    category: 'approvals',
    title: 'Legal and regulatory coordination',
    blurb: 'Bring legal advisers, authorities and specialists into one structured, tracked process.',
    icon: 'scale',
    image: 'law-books',
    seoTitle: 'Legal and Regulatory Coordination in Sri Lanka | RBPL',
    seoDescription: 'Coordinate business legal matters, regulatory applications and compliance documentation with RBPL and appropriately qualified legal and specialist professionals.',
    headline: 'Connect your business with <em>the right legal and regulatory support.</em>',
    intro: [
      'Business formation, commercial agreements, ownership changes and regulatory applications often require input from several professionals. Reliance Business Partners (Pvt) Ltd helps organise these requirements and coordinate with legal advisers, relevant authorities and specialist service providers.',
      'Whether you are establishing a business, expanding operations or addressing an existing matter, we help bring the documentation, communication and follow-up activities into a structured process.',
    ],
    help: [
      'Coordinate referrals to appropriately qualified legal professionals for business-related advice and representation.',
      'Arrange professional input on commercial contracts, shareholder agreements, partnership arrangements and other business documents.',
      'Coordinate documentation for business licences, permits, registrations and regulatory applications.',
      'Support the collection and organisation of corporate records and information requested by appointed advisers or authorities.',
      'Coordinate legal and regulatory work associated with investments, acquisitions, ownership changes and business restructuring.',
      'Track agreed submission dates, information requests and follow-up actions.',
      'Help management translate professional recommendations into administrative procedures and compliance records.',
    ],
    approach: 'We agree the scope of our coordination role at the outset and clarify the responsibilities of management and each appointed professional. Legal advice, document certification and legal representation are provided by appropriately qualified professionals under their respective engagements. Approvals and regulatory decisions remain with the relevant authorities.',
    faqs: [
      { q: 'Does RBPL provide legal advice or representation?', a: 'RBPL’s role is to coordinate the required professional support and related administrative work. Legal opinions, legal drafting and representation are undertaken by the appointed legal professionals.' },
      { q: 'Can you help with an existing legal or regulatory matter?', a: 'Yes. We can help organise the available records, coordinate a discussion with an appropriate adviser and track agreed next steps. The appointed professional will assess the matter and advise on the available options.' },
      { q: 'Can you guarantee an approval or resolution?', a: 'No. Outcomes depend on the facts, applicable requirements and decisions of the relevant authorities or other parties. We support an organised process and timely follow-up within the agreed scope.' },
    ],
    cta: 'Discuss My Legal and Regulatory Requirements',
    related: ['secretarial', 'trademark', 'due-diligence'],
  },
];

/* --- lookups, and the build stopping on a broken reference ------------------ */
export const serviceBySlug = (slug: string) => {
  const s = services.find((x) => x.slug === slug);
  if (!s) throw new Error(`services.ts: no service "${slug}"`);
  return s;
};
export const categoryBySlug = (slug: CategorySlug) => categories.find((c) => c.slug === slug)!;
export const servicesIn = (slug: CategorySlug) => services.filter((s) => s.category === slug);

for (const s of services) {
  for (const r of s.related) serviceBySlug(r);
  if (!categories.some((c) => c.slug === s.category)) throw new Error(`services.ts: ${s.slug} has no category`);
}
if (new Set(services.map((s) => s.slug)).size !== services.length) throw new Error('services.ts: duplicate slug');

/**
 * [CONTENT] "Choose a starting point": four visitor needs, the page each one
 * starts on, and the next action. Used on the home page and /services/.
 */
export const startingPoints = [
  {
    need: 'I want to start or expand a business',
    title: 'Start or expand',
    body: 'Set up a company in Sri Lanka, explore Colombo Port City or plan a UAE business presence with coordinated registration and operational support.',
    href: '/services/company-registration/',
    next: 'Discuss market and business activity',
    icon: 'rocket',
  },
  {
    need: 'I need reliable ongoing support',
    title: 'Run with confidence',
    body: 'Keep accounting, payroll, corporate records and recurring business obligations organised, with support tailored to your operation.',
    href: '/services/accounting/',
    next: 'Request a scoped proposal',
    icon: 'calculator',
  },
  {
    need: 'My business needs improvement',
    title: 'Improve performance',
    body: 'Strengthen your processes, introduce useful technology and turn financial and operational data into information you can act on.',
    href: '/services/internal-controls/',
    next: 'Request a diagnostic discussion',
    icon: 'gauge',
  },
  {
    need: 'I want to invest or raise funds',
    title: 'Invest or transition',
    body: 'Prepare for funding, assess an acquisition, explore a business sale or address the causes of recurring losses.',
    href: '/investors/',
    next: 'Submit a confidential enquiry',
    icon: 'trending-up',
  },
] as const;
