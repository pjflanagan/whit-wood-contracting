import siteConfigJson from '../content/site-config.json';

export type SiteConfig = {
  businessName: string;
  tagline: string;
  ctaLabel: string;
  seoDescription: string;
  seoKeywords: string;
  phone: string;
  email: string;
};

export const LOCAL_SITE_CONFIG: SiteConfig = siteConfigJson;
