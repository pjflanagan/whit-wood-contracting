import siteImagesJson from '../content/site-images.json';

export type SiteImages = {
  logoUrl: string | null;
  heroImageUrl: string | null;
  shareCardUrl: string | null;
};

export const LOCAL_SITE_IMAGES: SiteImages = siteImagesJson;
