/**
 * Who operates this site and what it sells. One source for the footer, the
 * /about page, the policy pages (/legal/*) and the structured data.
 *
 * Rahul Bonala is a one person software business: it builds and sells SaaS
 * products, each on its own site, all under one owner and one payment
 * account. These details must match that account exactly (legal name,
 * business category, contact details). If one changes there, change it here.
 *
 * `address` and `phone` render on /legal/contact and /about only when set.
 * Razorpay may ask for a full postal address on the contact page; add it here
 * if they do.
 */
export const BUSINESS = {
  legalName: 'Sri Sai Rahul Bonala',
  brand: 'Rahul Bonala',
  structure: 'Sole proprietor',
  description: 'Independent software business building SaaS products',
  category: 'Software (SaaS)',
  city: 'Bengaluru',
  region: 'Karnataka',
  country: 'India',
  email: 'rahulbonala06@gmail.com',
  site: 'https://rahulbonala.me',
  address: '',
  phone: '',
  /** Shown on every policy page. Update whenever a policy's wording changes. */
  policiesUpdated: '24 November 2026',
} as const;

export type Product = {
  name: string;
  url: string;
  /** Short category label, e.g. "SaaS · Career tools". */
  category: string;
  status: 'Live' | 'Beta' | 'Experiment';
  summary: string;
  /** How it is paid for, in plain words. Omit if it is free or not yet decided. */
  pricing?: string;
  caseStudy?: string;
};

/**
 * The product line. To launch a new product, add it here: it then appears on
 * /about and in the "What does Rahul Bonala sell?" answer. Also add the new
 * site to the same Razorpay account under the same business category.
 */
export const PRODUCTS: Product[] = [
  {
    name: 'Stepforge',
    url: 'https://stepforge.co/',
    category: 'SaaS · Career tools',
    status: 'Live',
    summary:
      'Upload a resume and get a portfolio website you own, then a grounded career plan built from the same resume.',
    pricing: 'A one off payment unlocks a custom published link.',
    caseStudy: '/work/stepforge',
  },
  {
    name: 'BestAnswersAI',
    url: 'https://bestanswersai.com/',
    category: 'SaaS · AI answers',
    status: 'Live',
    summary:
      'A multi agent AI answer engine: four AI agents answer in parallel and a judge merges the strongest points into one answer.',
    caseStudy: '/work/bestanswers',
  },
  {
    name: 'BYOC',
    url: 'https://build-your-own-company.vercel.app/',
    category: 'SaaS · Product planning',
    status: 'Live',
    summary:
      'Build Your Own Company: configure the software product you need brick by brick (auth, payments, dashboards), see the cost update in real time, and follow AI agents through each phase of the build.',
  },
];
