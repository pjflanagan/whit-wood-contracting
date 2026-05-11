import { Client, isFullPage } from '@notionhq/client';
import type { BlockObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';
import { EXAMPLE_SERVICES } from '../model/service';
import type { Service } from '../model/service';
import { EXAMPLE_PORTFOLIO } from '../model/portfolio-item';
import type { PortfolioItem } from '../model/portfolio-item';
import { EXAMPLE_TESTIMONIALS } from '../model/testimonial';
import type { Testimonial } from '../model/testimonial';
import { EXAMPLE_SITE_CONFIG } from '../model/site-config';
import type { SiteConfig, SocialLinks } from '../model/site-config';
import notionConfig from '../notion.config';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_SITE_CONFIG_DB = notionConfig.siteConfigDb;
const NOTION_SERVICES_DB = notionConfig.servicesDb;
const NOTION_PORTFOLIO_DB = notionConfig.portfolioDb;
const NOTION_TESTIMONIALS_DB = notionConfig.testimonialsDb;
const NOTION_ABOUT_PAGE = notionConfig.aboutPage;
const NOTION_CONTACT_PAGE = notionConfig.contactPage;

function createClient(): Client | null {
  if (!NOTION_TOKEN) return null;
  return new Client({ auth: NOTION_TOKEN });
}

function richTextToPlain(richText: RichTextItemResponse[]): string {
  return richText.map((t) => t.plain_text).join('');
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

const EXAMPLE_ABOUT = `<p>Ridge &amp; Rail Renovations has been serving the Greater Portland area since 2008. Owner Jake Hartwell started the company after 15 years in residential construction, with a simple belief: homeowners deserve honest pricing, clean job sites, and work they're proud to show off.</p>
<p>We're fully licensed and insured (License #CCB-218449), and every project comes with a 2-year workmanship warranty. Our crew of eight handles everything from permit to punch-list — no subcontractors, no surprises.</p>`;

const EXAMPLE_CONTACT = `<p><strong>Phone:</strong> <a href="tel:+15035550182">(503) 555-0182</a></p>
<p><strong>Email:</strong> <a href="mailto:hello@ridgeandrail.com">hello@ridgeandrail.com</a></p>
<p><strong>Service area:</strong> Portland metro, Beaverton, Hillsboro, Lake Oswego, Tualatin</p>
<p><strong>License:</strong> CCB-218449 — fully licensed and insured in Oregon</p>`;

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
  if (!client || !NOTION_SERVICES_DB) return EXAMPLE_SERVICES;
  try {
    const response = await client.databases.query({
      database_id: NOTION_SERVICES_DB,
    });
    return response.results.filter(isFullPage).map((page) => {
      const p = page.properties;
      const images: string[] = ((p.Images as any)?.files ?? []).map((f: any) =>
        f.type === 'external' ? f.external.url : f.file.url,
      );
      return {
        title: richTextToPlain((p.Title as any).title),
        description: richTextToPlain((p.Description as any).rich_text),
        tier: ((p.Tier as any).select?.name?.toLowerCase() ?? null) as Service['tier'],
        images,
      };
    });
  } catch (e) {
    console.error('Notion services fetch error:', e);
    return EXAMPLE_SERVICES;
  }
}

export async function fetchPortfolio(): Promise<PortfolioItem[]> {
  const client = createClient();
  if (!client || !NOTION_PORTFOLIO_DB) return EXAMPLE_PORTFOLIO;
  try {
    const response = await client.databases.query({
      database_id: NOTION_PORTFOLIO_DB,
      sorts: [{ property: 'Name', direction: 'ascending' }],
    });
    return response.results.filter(isFullPage).map((page) => {
      const p = page.properties;
      return {
        id: page.id,
        title: richTextToPlain((p.Name as any).title),
        category: (p.Category as any).select?.name ?? '',
        description: richTextToPlain((p.Description as any).rich_text),
        imageUrl: (p['Image URL'] as any).url ?? '',
      };
    });
  } catch (e) {
    console.error('Notion portfolio fetch error:', e);
    return EXAMPLE_PORTFOLIO;
  }
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const client = createClient();
  if (!client || !NOTION_TESTIMONIALS_DB) return EXAMPLE_TESTIMONIALS;
  try {
    const response = await client.databases.query({
      database_id: NOTION_TESTIMONIALS_DB,
      sorts: [{ property: 'Client Name', direction: 'ascending' }],
    });
    return response.results.filter(isFullPage).map((page) => {
      const p = page.properties;
      return {
        id: page.id,
        clientName: richTextToPlain((p['Client Name'] as any).title),
        projectType: (p['Project Type'] as any).select?.name ?? '',
        quote: richTextToPlain((p.Quote as any).rich_text),
        rating: (p.Rating as any).number ?? 5,
      };
    });
  } catch (e) {
    console.error('Notion testimonials fetch error:', e);
    return EXAMPLE_TESTIMONIALS;
  }
}

export async function fetchAbout(): Promise<string> {
  return (await fetchPageHtml(NOTION_ABOUT_PAGE)) ?? EXAMPLE_ABOUT;
}

export async function fetchContact(): Promise<string> {
  return (await fetchPageHtml(NOTION_CONTACT_PAGE)) ?? EXAMPLE_CONTACT;
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const client = createClient();
  if (!client || !NOTION_SITE_CONFIG_DB) return EXAMPLE_SITE_CONFIG;
  try {
    const response = await client.databases.query({
      database_id: NOTION_SITE_CONFIG_DB,
      page_size: 1,
    });
    const page = response.results.filter(isFullPage)[0];
    if (!page) return EXAMPLE_SITE_CONFIG;
    const p = page.properties;
    const socialLinks: SocialLinks = {
      facebookUrl: (p['Facebook URL'] as any)?.url ?? undefined,
      instagramUrl: (p['Instagram URL'] as any)?.url ?? undefined,
      houzzUrl: (p['Houzz URL'] as any)?.url ?? undefined,
      yelpUrl: (p['Yelp URL'] as any)?.url ?? undefined,
      googleUrl: (p['Google URL'] as any)?.url ?? undefined,
    };
    return {
      businessName: richTextToPlain((p['Business Name'] as any).title),
      tagline: richTextToPlain((p.Tagline as any).rich_text),
      heroImageUrl: (p['Hero Image URL'] as any).url ?? '',
      ctaLabel: richTextToPlain((p['CTA Label'] as any).rich_text),
      ctaTarget: richTextToPlain((p['CTA Target'] as any).rich_text),
      seoDescription: richTextToPlain((p['SEO Description'] as any).rich_text),
      seoKeywords: richTextToPlain((p['SEO Keywords'] as any).rich_text),
      socialLinks,
    };
  } catch (e) {
    console.error('Notion site config fetch error:', e);
    return EXAMPLE_SITE_CONFIG;
  }
}
