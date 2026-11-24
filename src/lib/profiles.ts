/**
 * The official profiles, in one place. Every one of these uses the name
 * "Rahul Bonala" and links back to rahulbonala.me, which is what lets search
 * engines treat them as one person.
 *
 * Keep this list in step with the Person `sameAs` in index.html (that block is
 * static HTML, so it can't import from here).
 */
export type Profile = { label: string; href: string; handle: string };

export const PROFILES: Profile[] = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/rahulbonala/', handle: 'in/rahulbonala' },
  { label: 'Instagram', href: 'https://www.instagram.com/rahul_bonala/', handle: '@rahul_bonala' },
  { label: 'X', href: 'https://x.com/RahulBonala', handle: '@RahulBonala' },
  { label: 'GitHub', href: 'https://github.com/RahulBonala', handle: 'RahulBonala' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UCIfuWTDvEMRy-5Ib68FBcMg', handle: 'Rahul Bonala' },
];

export const COMPANY = { name: 'Gintic.ai', href: 'https://gintic.ai/' };
