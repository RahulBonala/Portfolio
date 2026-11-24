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

import { PRODUCTS } from './business';

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
    a: 'Rahul Bonala is an independent software business in Bengaluru that builds and sells SaaS products, run by Sri Sai Rahul Bonala, a product designer and software developer who designs every product and writes the code that ships it.',
    links: [{ label: 'About the business', href: '/about' }],
  },
  {
    q: 'What does Rahul Bonala sell?',
    a: `SaaS products: ${PRODUCTS.map((p) => p.name).join(', ')}, each sold on its own site. Alongside them, Zero to Live is a 1:1 live training session in building and deploying software with AI tools, sold on this site.`,
    links: [
      { label: 'Products', href: '/about' },
      { label: 'Zero to Live', href: '/teach' },
      { label: 'Terms', href: '/legal/terms' },
      { label: 'Refund policy', href: '/legal/refunds' },
    ],
  },
  {
    q: 'Which SaaS products has Rahul Bonala built?',
    a: 'Stepforge, a resume to portfolio and career planning app; BestAnswersAI, a multi agent AI answer engine; and BYOC, which turns planning and building a software product into a configurator you can price in real time.',
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
    a: 'A 1:1 live training session where Rahul teaches you to build and deploy your first web app with free AI tools, from idea to live on the internet in one hour.',
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

/** The policy pages (src/pages/Legal.tsx). */
const LEGAL_ROUTES: RouteMeta[] = [
  {
    slug: 'terms',
    title: 'Terms and Conditions | Rahul Bonala',
    description: 'Terms for using rahulbonala.me and buying from Rahul Bonala, an independent software business run by Sri Sai Rahul Bonala.',
  },
  {
    slug: 'refunds',
    title: 'Refund and Cancellation Policy | Rahul Bonala',
    description: 'How refunds, cancellations and rescheduling work for Zero to Live sessions bought on rahulbonala.me.',
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy | Rahul Bonala',
    description: 'What rahulbonala.me collects, why, which services process it, and how to see or delete your data.',
  },
  {
    slug: 'contact',
    title: 'Contact Us | Rahul Bonala',
    description: 'Contact Rahul Bonala, an independent software business in Bengaluru run by Sri Sai Rahul Bonala, about a purchase, a refund or your data.',
    type: 'ContactPage',
  },
].map(({ slug, title, description, type }) => ({
  path: `/legal/${slug}`,
  out: `legal/${slug}/index.html`,
  title,
  description,
  ogType: 'website' as const,
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': type ?? 'WebPage',
      '@id': `${SITE}/legal/${slug}#page`,
      url: `${SITE}/legal/${slug}`,
      name: title,
      description,
      publisher: PERSON,
      isPartOf: { '@id': `${SITE}/#website` },
      inLanguage: 'en-IN',
    },
  ],
}));

const HOME_TITLE = 'Rahul Bonala | SaaS Products by an Independent Software Business';

export const ROUTE_META: RouteMeta[] = [
  {
    path: '/',
    out: 'index.html',
    title: HOME_TITLE,
    description:
      'Rahul Bonala is an independent software business in Bengaluru building SaaS products: Stepforge, BestAnswersAI and BYOC. See the products, case studies and Zero to Live training.',
    ogType: 'profile',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'ProfilePage',
        '@id': `${SITE}/#profile`,
        url: `${SITE}/`,
        name: 'Rahul Bonala | SaaS Products',
        mainEntity: PERSON,
        isPartOf: { '@id': `${SITE}/#website` },
      },
      faqJsonLd(PORTFOLIO_FAQ),
    ],
  },
  {
    path: '/teach',
    out: 'teach/index.html',
    title: 'Zero to Live: Build Your First Web App with AI | Rahul Bonala',
    description:
      'A 1:1 live training session with Rahul Bonala: learn to build and deploy your first web app with free AI tools, from idea to live in one hour.',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: 'Zero to Live',
        serviceType: 'Software development training',
        category: 'Software',
        description: 'A one hour 1:1 live training session in building and deploying software with AI tools, from idea to a live web app.',
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
    path: '/about',
    out: 'about/index.html',
    title: 'About Rahul Bonala: SaaS Products and the Business Behind Them',
    description:
      'Rahul Bonala is an independent software business in Bengaluru that builds and sells SaaS products: Stepforge, BestAnswersAI and BYOC.',
    ogType: 'website',
    jsonLd: [
      {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        '@id': `${SITE}/about#page`,
        url: `${SITE}/about`,
        name: 'About Rahul Bonala',
        about: { '@id': `${SITE}/#business` },
        isPartOf: { '@id': `${SITE}/#website` },
        inLanguage: 'en-IN',
      },
    ],
  },
  ...LEGAL_ROUTES,
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
