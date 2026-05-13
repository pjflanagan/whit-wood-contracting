import socialLinksJson from '../content/social-links.json';

export type SocialLinks = {
  facebookUrl: string | null;
  instagramUrl: string | null;
  houzzUrl: string | null;
  yelpUrl: string | null;
  googleUrl: string | null;
};

export const LOCAL_SOCIAL_LINKS: SocialLinks = socialLinksJson;
