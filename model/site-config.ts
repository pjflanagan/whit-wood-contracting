export type SiteConfig = {
  businessName: string;
  tagline: string;
  ctaLabel: string;
  seoDescription: string;
  seoKeywords: string;
  phone: string;
  email: string;
};

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  businessName: '',
  tagline: '',
  ctaLabel: '',
  seoDescription: '',
  seoKeywords: '',
  phone: '',
  email: '',
};
