/**
 * Per-route search metadata, in one place.
 *
 * scripts/prerender.js reads ROUTE_META (through the SSR entry) to write each
 * page's <title>, description, canonical, Open Graph tags and page-specific
 * JSON-LD into the static HTML. The pages read the same titles for
 * document.title, and the home page renders PORTFOLIO_FAQ visibly, so the
 * FAQPage schema always matches what a visitor can read.
 *
 * Copy rule: no em or en dashes in anything a visitor or a search result shows.
 */

export const SITE = 'https://rahulbonala.me';
const PERSON = { '@id': `${SITE}/#person` };

export type FaqItem = {
  q: string;
  /** Plain-text answer. This exact text is also used in the FAQPage schema. */
  a: string;
  links?: { label: string; href: string }[];
};

export const PORTFOLIO_FAQ: FaqItem[] = [
  {
    q: 'Who is Rahul Bonala?',
    a: 'Rahul Bonala is a product designer and AI builder in Bengaluru who designs AI native products and writes the code that ships them.',
  },
  {
    q: 'What has Rahul Bonala built?',
    a: 'BestAnswersAI, a multi agent AI answer engine, and Stepforge, a resume to portfolio and career planning app, plus BYOC and the other projects listed on this site.',
    links: [
      { label: 'BestAnswersAI', href: 'https://bestanswersai.com/' },
      { label: 'Stepforge', href: 'https://stepforge.co/' },
      { label: 'BestAnswersAI case study', href: '/work/bestanswers' },
      { label: 'Stepforge case study', href: '/work/stepforge' },
    ],
  },
  {
    q: 'Where can I see AI agent application examples?',
    a: 'On the AI agents page, with a case study for each project.',
    links: [{ label: 'AI agent application examples', href: '/work/ai-agents' }],
  },
  {
    q: 'What is Zero to Live?',
    a: 'A 1:1 live session where Rahul helps you take an idea from zero to a live website in one hour.',
    links: [{ label: 'Book Zero to Live', href: '/teach' }],
  },
  {
    q: 'How can I contact Rahul?',
    a: 'Use the contact form on this page, send a message on LinkedIn, or use the email link in the footer.',
    links: [{ label: 'Contact', href: '/#contact' }],
  },
];

export const faqJsonLd = (items: FaqItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export type RouteMeta = {
  path: string;
  /** Output file under dist/. */
  out: string;
  title: string;
  description: string;
  /** Page-specific JSON-LD blocks (the Person/WebSite graph is site-wide). */
  jsonLd?: object[];
  ogType?: 'profile' | 'website' | 'article';
  noindex?: boolean;
};

const article = (path: string, headline: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  '@id': `${SITE}${path}#article`,
  headline,
  description,
  url: `${SITE}${path}`,
  mainEntityOfPage: `${SITE}${path}`,
  image: `${SITE}/og-image.png`,
  author: PERSON,
  publisher: PERSON,
  inLanguage: 'en-IN',
  isPartOf: { '@id': `${SITE}/#website` },
});

const HOME_TITLE = 'Rahul Bonala | Product Designer & AI Builder, Bengaluru';

export const ROUTE_META: RouteMeta[] = [
  {
    path: '/',
    out: 'index.html',
    title: HOME_TITLE,
    description:
      'Rahul Bonala is a product designer and AI builder in Bengaluru. See AI agent projects, product case studies and Zero to Live website sessions.',
    ogType: 'profile',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': `${SITE}/#profile`,
        url: `${SITE}/`,
        name: 'Rahul Bonala | Product Designer & AI Builder',
        mainEntity: PERSON,
        isPartOf: { '@id': `${SITE}/#website` },
      },
      faqJsonLd(PORTFOLIO_FAQ),
    ],
  },
  {
    path: '/teach',
    out: 'teach/index.html',
    title: 'Zero to Live: Your Website Live in One Hour | Rahul Bonala',
    description:
      'A 1:1 live session with Rahul Bonala that takes your idea from zero to a live website in one hour. Book your Zero to Live session.',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Zero to Live',
        serviceType: '1:1 live website building session',
        description: 'A one hour 1:1 live session that takes your idea from zero to a live website.',
        provider: PERSON,
        areaServed: 'Worldwide',
        url: `${SITE}/teach`,
        // The price is shown on the page (src/lib/booking.ts BOOKING.price).
        offers: {
          '@type': 'Offer',
          price: '999',
          priceCurrency: 'INR',
          url: `${SITE}/teach`,
        },
      },
    ],
  },
  {
    path: '/work/bestanswers',
    out: 'work/bestanswers/index.html',
    title: 'BestAnswersAI Case Study: Multi Agent AI App | Rahul Bonala',
    description:
      'How Rahul Bonala designed and built BestAnswersAI, where 4 AI agents debate a question and a judge writes one best answer.',
    ogType: 'article',
    jsonLd: [
      article(
        '/work/bestanswers',
        'BestAnswersAI case study: a multi agent AI answer engine',
        'How Rahul Bonala designed and built BestAnswersAI, where 4 AI agents debate a question and a judge writes one best answer.',
      ),
    ],
  },
  {
    path: '/work/stepforge',
    out: 'work/stepforge/index.html',
    title: 'Stepforge Case Study: Resume to Portfolio | Rahul Bonala',
    description:
      'How Rahul Bonala designed and built Stepforge, which turns a resume into a portfolio website and a grounded career plan.',
    ogType: 'article',
    jsonLd: [
      article(
        '/work/stepforge',
        'Stepforge case study: resume to portfolio website and career plan',
        'How Rahul Bonala designed and built Stepforge, which turns a resume into a portfolio website and a grounded career plan.',
      ),
    ],
  },
  {
    path: '/work/ai-agents',
    out: 'work/ai-agents/index.html',
    title: 'AI Agent Application Examples | Rahul Bonala',
    description:
      'Real AI agent applications designed and built by Rahul Bonala, with case studies: multi agent answers, career planning and more.',
    ogType: 'website',
    // CollectionPage + ItemList are built from the page's own data, see AI_AGENT_PROJECTS.
  },
  {
    path: '/work/smiths-detection',
    out: 'work/smiths-detection/index.html',
    title: 'Smiths Detection Case Study | Rahul Bonala',
    description:
      'How Rahul Bonala designed and built service consoles used daily by maintenance engineers across Europe, APAC and North America.',
    ogType: 'article',
    jsonLd: [
      article(
        '/work/smiths-detection',
        'Smiths Detection service consoles: a case study',
        'How Rahul Bonala designed and built service consoles used daily by maintenance engineers across Europe, APAC and North America.',
      ),
    ],
  },
  {
    path: '/review',
    out: 'review/index.html',
    title: 'Leave a review | Zero to Live',
    description: 'Tell me how your Zero to Live session went.',
    // A link to hand out, not a page to be found. Indexing it would invite
    // drive-by submissions the moderation queue exists to absorb.
    noindex: true,
  },
];

/** The AI agent projects listed on /work/ai-agents. Facts only, from each repo. */
export type AgentProject = {
  name: string;
  summary: string;
  agents: string;
  caseStudy?: string;
  live: string;
};

export const AI_AGENT_PROJECTS: AgentProject[] = [
  {
    name: 'BestAnswersAI',
    summary:
      'A multi agent AI answer engine at bestanswersai.com. You ask once, and instead of one chatbot answering, four AI agents answer in parallel and a judge writes one best answer.',
    agents:
      'Four agent personas draft answers at the same time, each one votes on the best of the others, and a judge agent tallies the votes and merges the strongest points into a single verdict, crediting what each agent contributed. All four personas currently run on Google Gemini with different system prompts.',
    caseStudy: '/work/bestanswers',
    live: 'https://bestanswersai.com/',
  },
  {
    name: 'Stepforge',
    summary:
      'A resume to portfolio website app at stepforge.co. It turns the resume you already have into a portfolio site you own, then uses the same resume to plan the job search.',
    agents:
      'The resume is parsed by a deterministic parser in your browser, not a model. AI is opt in: it proposes grounded repairs and rewrites you accept or reject, and runs an 8 step career guide that finds roles your experience supports, checks gaps against a real job description, and builds a 30 day search plan. Every claim it makes cites the resume line it came from.',
    caseStudy: '/work/stepforge',
    live: 'https://stepforge.co/',
  },
  {
    name: 'BYOC: SDLC Agents',
    summary:
      'Build Your Own Company turns the software delivery lifecycle into a product: configure what your product needs brick by brick and watch the cost update in real time.',
    agents:
      'AI agents are mapped to the SDLC phases (plan, design, build, test, ship) and carry the work through them, tracked on a metro map style pipeline.',
    live: 'https://build-your-own-company.vercel.app/',
  },
];

export const aiAgentsJsonLd = () => {
  const path = '/work/ai-agents';
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${SITE}${path}#page`,
      url: `${SITE}${path}`,
      name: 'AI agent application examples',
      description:
        'Real AI agent applications designed and built by Rahul Bonala, with case studies.',
      author: PERSON,
      isPartOf: { '@id': `${SITE}/#website` },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: AI_AGENT_PROJECTS.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: p.name,
          url: p.caseStudy ? `${SITE}${p.caseStudy}` : p.live,
        })),
      },
    },
  ];
};

export const titleFor = (path: string): string =>
  ROUTE_META.find((r) => r.path === path)?.title ?? HOME_TITLE;
