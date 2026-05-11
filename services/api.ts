import { Client, isFullPage } from '@notionhq/client';
import type { BlockObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { DEFAULT_SERVICES } from '../model/service';
import type { Service } from '../model/service';
import { DEFAULT_PORTFOLIO } from '../model/portfolio-item';
import type { PortfolioItem } from '../model/portfolio-item';
import { DEFAULT_TESTIMONIALS } from '../model/testimonial';
import type { Testimonial } from '../model/testimonial';
import { DEFAULT_SITE_CONFIG } from '../model/site-config';
import type { SiteConfig } from '../model/site-config';
import { DEFAULT_SITE_IMAGES } from '../model/site-images';
import type { SiteImages } from '../model/site-images';
import { DEFAULT_SOCIAL_LINKS } from '../model/social-links';
import type { SocialLinks } from '../model/social-links';
import { DEFAULT_SECTIONS } from '../model/section';
import type { PageSection } from '../model/section';
import notionConfig from '../notion.config';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_SITE_CONFIG_DB = notionConfig.siteConfigDb;
const NOTION_SOCIAL_LINKS_DB = notionConfig.socialLinksDb;
const NOTION_SITE_IMAGES_DB = notionConfig.siteImagesDb;
const NOTION_SERVICES_DB = notionConfig.servicesDb;
const NOTION_PORTFOLIO_DB = notionConfig.portfolioDb;
const NOTION_TESTIMONIALS_DB = notionConfig.testimonialsDb;
const NOTION_SECTIONS_DB = notionConfig.sectionsDb;
const NOTION_ABOUT_PAGE = notionConfig.aboutPage;

function createClient(): Client | null {
  if (!NOTION_TOKEN) return null;
  return new Client({ auth: NOTION_TOKEN });
}

function richTextToPlain(richText: RichTextItemResponse[]): string {
  return richText.map((t) => t.plain_text).join('');
}

function safeTitle(prop: unknown): string | null {
  try {
    const text = richTextToPlain((prop as any)?.title ?? []);
    return text || null;
  } catch {
    return null;
  }
}

function safeRichText(prop: unknown): string {
  try {
    return richTextToPlain((prop as any)?.rich_text ?? []);
  } catch {
    return '';
  }
}

function safeSelect(prop: unknown): string {
  try {
    return (prop as any)?.select?.name ?? '';
  } catch {
    return '';
  }
}

function safeNumber(prop: unknown, fallback: number): number {
  try {
    const n = (prop as any)?.number;
    return typeof n === 'number' ? n : fallback;
  } catch {
    return fallback;
  }
}

function safeFiles(prop: unknown): string[] {
  try {
    return ((prop as any)?.files ?? []).map((f: any) =>
      f.type === 'external' ? f.external.url : f.file.url,
    ).filter(Boolean);
  } catch {
    return [];
  }
}

function richTextToHtml(richText: RichTextItemResponse[]): string {
  return richText
    .map((t) => {
      let text = t.plain_text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      if (t.annotations.bold) text = `<strong>${text}</strong>`;
      if (t.annotations.italic) text = `<em>${text}</em>`;
      if (t.href) text = `<a href="${t.href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      return text;
    })
    .join('');
}

export function blocksToHtml(blocks: BlockObjectResponse[]): string {
  const html: string[] = [];
  let listType: 'ul' | 'ol' | null = null;

  for (const block of blocks) {
    const isBulleted = block.type === 'bulleted_list_item';
    const isNumbered = block.type === 'numbered_list_item';
    const isListItem = isBulleted || isNumbered;
    const currentListType: 'ul' | 'ol' | null = isBulleted ? 'ul' : isNumbered ? 'ol' : null;

    if (listType && (!isListItem || currentListType !== listType)) {
      html.push(`</${listType}>`);
      listType = null;
    }
    if (isListItem && !listType) {
      listType = currentListType;
      html.push(`<${listType}>`);
    }

    switch (block.type) {
      case 'paragraph': {
        const text = richTextToHtml(block.paragraph.rich_text);
        if (text) html.push(`<p>${text}</p>`);
        break;
      }
      case 'heading_1': {
        html.push(`<h3>${richTextToHtml(block.heading_1.rich_text)}</h3>`);
        break;
      }
      case 'heading_2': {
        html.push(`<h4>${richTextToHtml(block.heading_2.rich_text)}</h4>`);
        break;
      }
      case 'heading_3': {
        html.push(`<h5>${richTextToHtml(block.heading_3.rich_text)}</h5>`);
        break;
      }
      case 'bulleted_list_item': {
        html.push(`<li>${richTextToHtml(block.bulleted_list_item.rich_text)}</li>`);
        break;
      }
      case 'numbered_list_item': {
        html.push(`<li>${richTextToHtml(block.numbered_list_item.rich_text)}</li>`);
        break;
      }
    }
  }

  if (listType) html.push(`</${listType}>`);
  return html.join('\n');
}

// --- FETCHERS ---

async function fetchPageHtml(pageId: string | undefined): Promise<string | null> {
  const client = createClient();
  if (!client || !pageId) return null;
  try {
    const response = await client.blocks.children.list({ block_id: pageId });
    return blocksToHtml(response.results as BlockObjectResponse[]);
  } catch (e) {
    console.error('Notion page fetch error:', e);
    return null;
  }
}

export async function fetchServices(): Promise<Service[]> {
  const client = createClient();
  if (!client || !NOTION_SERVICES_DB) return DEFAULT_SERVICES;
  try {
    const response = await client.databases.query({
      database_id: NOTION_SERVICES_DB,
    });
    return response.results.filter(isFullPage).flatMap((page) => {
      const p = page.properties;
      const title = safeTitle(p.Title);
      if (!title) return [];
      const tierName = safeSelect(p.Tier).toLowerCase();
      const tier = (['primary', 'secondary', 'tertiary'].includes(tierName) ? tierName : null) as Service['tier'];
      return [{
        title,
        description: safeRichText(p.Description),
        tier,
        images: safeFiles(p.Images),
      }];
    });
  } catch (e) {
    console.error('Notion services fetch error:', e);
    return DEFAULT_SERVICES;
  }
}

export async function fetchPortfolio(): Promise<PortfolioItem[]> {
  const client = createClient();
  if (!client || !NOTION_PORTFOLIO_DB) return DEFAULT_PORTFOLIO;
  try {
    const response = await client.databases.query({
      database_id: NOTION_PORTFOLIO_DB,
    });
    return response.results.filter(isFullPage).flatMap((page) => {
      const p = page.properties;
      const title = safeTitle(p.Name);
      if (!title) return [];
      return [{
        id: page.id,
        title,
        type: safeSelect(p.Type),
        description: safeRichText(p.Description),
        photos: safeFiles(p.Photos),
      }];
    });
  } catch (e) {
    console.error('Notion portfolio fetch error:', e);
    return DEFAULT_PORTFOLIO;
  }
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const client = createClient();
  if (!client || !NOTION_TESTIMONIALS_DB) return DEFAULT_TESTIMONIALS;
  try {
    const response = await client.databases.query({
      database_id: NOTION_TESTIMONIALS_DB,
    });
    return response.results.filter(isFullPage).flatMap((page) => {
      const p = page.properties;
      const clientName = safeTitle(p['Client Name']);
      const quote = safeRichText(p.Quote);
      if (!clientName || !quote) return [];
      return [{
        clientName,
        quote,
        rating: safeNumber(p.Stars, 5),
      }];
    });
  } catch (e) {
    console.error('Notion testimonials fetch error:', e);
    return DEFAULT_TESTIMONIALS;
  }
}

export async function fetchAbout(): Promise<string> {
  return (await fetchPageHtml(NOTION_ABOUT_PAGE)) ?? '';
}

async function fetchImageDb(dbId: string): Promise<Record<string, string>> {
  const client = createClient();
  if (!client || !dbId) return {};
  const response = await client.databases.query({ database_id: dbId });
  const kv: Record<string, string> = {};
  for (const page of response.results.filter(isFullPage)) {
    const p = page.properties;
    const id = richTextToPlain((p.ID as any)?.title ?? []);
    const files: any[] = (p.Image as any)?.files ?? [];
    const url = files[0]
      ? files[0].type === 'external'
        ? files[0].external.url
        : files[0].file.url
      : '';
    if (id && url) kv[id] = url;
  }
  return kv;
}

async function fetchKeyValueDb(dbId: string): Promise<Record<string, string>> {
  const client = createClient();
  if (!client || !dbId) return {};
  const response = await client.databases.query({ database_id: dbId });
  const kv: Record<string, string> = {};
  for (const page of response.results.filter(isFullPage)) {
    const p = page.properties;
    const id = richTextToPlain((p.ID as any)?.title ?? []);
    const value = richTextToPlain((p.Value as any)?.rich_text ?? []);
    if (id) kv[id] = value;
  }
  return kv;
}

export async function fetchSocialLinks(): Promise<SocialLinks> {
  if (!NOTION_SOCIAL_LINKS_DB) return DEFAULT_SOCIAL_LINKS;
  try {
    const kv = await fetchKeyValueDb(NOTION_SOCIAL_LINKS_DB);
    return {
      facebookUrl: kv.facebookUrl || null,
      instagramUrl: kv.instagramUrl || null,
      houzzUrl: kv.houzzUrl || null,
      yelpUrl: kv.yelpUrl || null,
      googleUrl: kv.googleUrl || null,
    };
  } catch (e) {
    console.error('Notion social links fetch error:', e);
    return DEFAULT_SOCIAL_LINKS;
  }
}

export async function fetchSiteImages(): Promise<SiteImages> {
  if (!NOTION_SITE_IMAGES_DB) return DEFAULT_SITE_IMAGES;
  try {
    const kv = await fetchImageDb(NOTION_SITE_IMAGES_DB);
    return {
      logoUrl: kv.logo || null,
      heroImageUrl: kv['hero-image'] || null,
      shareCardUrl: kv['share-card'] || null,
    };
  } catch (e) {
    console.error('Notion site images fetch error:', e);
    return DEFAULT_SITE_IMAGES;
  }
}

export async function fetchSections(): Promise<PageSection[]> {
  const client = createClient();
  if (!client || !NOTION_SECTIONS_DB) return DEFAULT_SECTIONS;
  try {
    const response = await client.databases.query({
      database_id: NOTION_SECTIONS_DB,
    });
    return response.results.filter(isFullPage).flatMap((page) => {
      const p = page.properties;
      const id = safeTitle(p.ID);
      const title = safeRichText(p.Title);
      if (!id || !title) return [];
      return [{
        id,
        title,
        description: safeRichText(p.Description),
      }];
    });
  } catch (e) {
    console.error('Notion sections fetch error:', e);
    return DEFAULT_SECTIONS;
  }
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  if (!NOTION_SITE_CONFIG_DB) return DEFAULT_SITE_CONFIG;
  try {
    const kv = await fetchKeyValueDb(NOTION_SITE_CONFIG_DB);
    return {
      businessName: kv.businessName || '',
      tagline: kv.tagline || '',
      ctaLabel: kv.buttonLabel || '',
      seoDescription: kv.seoDescription || '',
      seoKeywords: kv.seoKeywords || '',
      phone: kv.phone || '',
      email: kv.email || '',
    };
  } catch (e) {
    console.error('Notion site config fetch error:', e);
    return DEFAULT_SITE_CONFIG;
  }
}
