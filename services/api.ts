import type { Service } from '../model/service';
import type { PortfolioItem } from '../model/portfolio-item';
import type { Testimonial } from '../model/testimonial';
import type { SiteConfig } from '../model/site-config';
import type { SiteImages } from '../model/site-images';
import type { SocialLinks } from '../model/social-links';
import type { PageSection } from '../model/section';
import { DEFAULT_SERVICES } from '../model/service';
import { DEFAULT_PORTFOLIO } from '../model/portfolio-item';
import { DEFAULT_TESTIMONIALS } from '../model/testimonial';
import { DEFAULT_SITE_CONFIG } from '../model/site-config';
import { DEFAULT_SITE_IMAGES } from '../model/site-images';
import { DEFAULT_SOCIAL_LINKS } from '../model/social-links';
import { DEFAULT_SECTIONS } from '../model/section';

const CONTENT_BASE =
  'https://raw.githubusercontent.com/pjflanagan/whit-wood-contracting/main/content';

const UPLOADS_BASE =
  'https://raw.githubusercontent.com/pjflanagan/whit-wood-contracting/main/public';

function resolveUploadUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('/uploads/')) return `${UPLOADS_BASE}${path}`;
  return path;
}

async function fetchJson<T>(file: string): Promise<T> {
  const res = await fetch(`${CONTENT_BASE}/${file}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`fetch ${file} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

function markdownToHtml(md: string): string {
  return md
    .split(/\n\n+/)
    .filter(Boolean)
    .map((para) => {
      const inner = para
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>');
      return `<p>${inner}</p>`;
    })
    .join('\n');
}

export async function fetchServices(): Promise<Service[]> {
  try {
    const { services } = await fetchJson<{ services: Service[] }>('services.json');
    return services.map((svc) => ({
      ...svc,
      images: (svc.images ?? []).map((p) => resolveUploadUrl(p) ?? p),
    }));
  } catch {
    return DEFAULT_SERVICES;
  }
}

export async function fetchPortfolio(): Promise<PortfolioItem[]> {
  try {
    const { portfolio } = await fetchJson<{ portfolio: PortfolioItem[] }>('portfolio.json');
    return portfolio.map((item) => ({
      ...item,
      photos: item.photos.map((p) => resolveUploadUrl(p) ?? p),
    }));
  } catch {
    return DEFAULT_PORTFOLIO;
  }
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const { testimonials } = await fetchJson<{ testimonials: Testimonial[] }>('testimonials.json');
    return testimonials;
  } catch {
    return DEFAULT_TESTIMONIALS;
  }
}

export async function fetchAbout(): Promise<string> {
  try {
    const { body } = await fetchJson<{ body: string }>('about.json');
    return markdownToHtml(body);
  } catch {
    return '';
  }
}

export async function fetchSections(): Promise<PageSection[]> {
  try {
    const { sections } = await fetchJson<{ sections: PageSection[] }>('sections.json');
    return sections;
  } catch {
    return DEFAULT_SECTIONS;
  }
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  try {
    return await fetchJson<SiteConfig>('site-config.json');
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}

export async function fetchSocialLinks(): Promise<SocialLinks> {
  try {
    return await fetchJson<SocialLinks>('social-links.json');
  } catch {
    return DEFAULT_SOCIAL_LINKS;
  }
}

export async function fetchSiteImages(): Promise<SiteImages> {
  try {
    const images = await fetchJson<SiteImages>('site-images.json');
    return {
      logoUrl: resolveUploadUrl(images.logoUrl),
      heroImageUrl: resolveUploadUrl(images.heroImageUrl),
      shareCardUrl: resolveUploadUrl(images.shareCardUrl),
    };
  } catch {
    return DEFAULT_SITE_IMAGES;
  }
}
