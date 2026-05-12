import fs from 'fs';
import path from 'path';
import type { Service } from '../model/service';
import type { PortfolioItem } from '../model/portfolio-item';
import type { Testimonial } from '../model/testimonial';
import type { SiteConfig } from '../model/site-config';
import type { SiteImages } from '../model/site-images';
import type { SocialLinks } from '../model/social-links';
import type { PageSection } from '../model/section';
import { DEFAULT_SITE_IMAGES } from '../model/site-images';
import { DEFAULT_SOCIAL_LINKS } from '../model/social-links';

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

function readDir<T>(dir: string): T[] {
  return fs.readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => readJson<T>(path.join(dir, f)));
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

export function fetchServices(): Service[] {
  const dir = path.join(process.cwd(), 'content/services');
  return readDir<Service & { order: number }>(dir)
    .sort((a, b) => a.order - b.order)
    .map(({ order: _order, ...s }) => s);
}

export function fetchPortfolio(): PortfolioItem[] {
  return readDir<PortfolioItem>(path.join(process.cwd(), 'content/portfolio'));
}

export function fetchTestimonials(): Testimonial[] {
  return readDir<Testimonial>(path.join(process.cwd(), 'content/testimonials'));
}

export function fetchAbout(): string {
  const { body } = readJson<{ body: string }>(
    path.join(process.cwd(), 'content/about.json'),
  );
  return markdownToHtml(body);
}

export function fetchSections(): PageSection[] {
  const { sections } = readJson<{ sections: PageSection[] }>(
    path.join(process.cwd(), 'content/sections.json'),
  );
  return sections;
}

export function fetchSiteConfig(): SiteConfig {
  return readJson<SiteConfig>(path.join(process.cwd(), 'content/site-config.json'));
}

export function fetchSocialLinks(): SocialLinks {
  try {
    return readJson<SocialLinks>(path.join(process.cwd(), 'content/social-links.json'));
  } catch {
    return DEFAULT_SOCIAL_LINKS;
  }
}

export function fetchSiteImages(): SiteImages {
  try {
    return readJson<SiteImages>(path.join(process.cwd(), 'content/site-images.json'));
  } catch {
    return DEFAULT_SITE_IMAGES;
  }
}
