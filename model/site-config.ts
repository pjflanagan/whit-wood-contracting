export type SiteConfig = {
  businessName: string;
  tagline: string;
  heroImageUrl: string;
  ctaLabel: string;
  ctaTarget: string;
  seoDescription: string;
  seoKeywords: string;
};

export const EXAMPLE_SITE_CONFIG: SiteConfig = {
  businessName: 'Ridge & Rail Renovations',
  tagline: 'Licensed General Contractor · Portland, OR',
  heroImageUrl: '',
  ctaLabel: 'Get a Free Quote',
  ctaTarget: 'contact',
  seoDescription: 'Ridge & Rail Renovations — licensed general contractor serving the Portland metro area. Kitchen remodels, bathroom renovations, flooring, decks, basement finishing, and painting.',
  seoKeywords: 'contractor, renovation, remodel, kitchen remodel, bathroom renovation, flooring installation, deck builder, basement finishing, interior painting, Portland contractor',
};
