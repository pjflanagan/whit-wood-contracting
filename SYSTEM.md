# Website Template System

A reusable design and implementation pattern for spinning up small client websites (contractor, musician, photographer, etc.) on top of this Next.js + Notion stack. Each new project is a fork of this repo with different config — not a different codebase.

---

## Core Philosophy

> **Configure, don't fork.** Every business-specific decision (name, colors, sections, Notion database IDs, form fields) lives in one file: `site.config.ts`. Everything else — components, API layer, page templates — is generic and reused unchanged.

The current codebase has hardcoding scattered across six files (`metadata.ts`, `theme.module.scss`, `model/notion.ts`, `pages/index.tsx`, `pages/_app.tsx`, component JSX). The system below centralizes that into one config file and separates components into two tiers: generic UI primitives and composed blocks.

---

## Proposed File Structure

```
/
├── site.config.ts              ← THE only file you edit per client
│
├── components/
│   ├── ui/                     ← Generic primitives, never touch these
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Grid/
│   │   ├── Badge/
│   │   └── TextBlock/
│   └── blocks/                 ← Composed blocks, driven by config
│       ├── Hero/
│       ├── CollectionGrid/     ← Generic: renders services OR portfolio OR testimonials
│       ├── ContactForm/
│       ├── RichTextSection/
│       └── Footer/
│
├── templates/
│   ├── ContractorPage.tsx      ← Wires config + data into blocks
│   ├── MusicianPage.tsx
│   └── PortfolioPage.tsx
│
├── model/
│   ├── notion.ts               ← Generic: fetchCollection(), fetchPage()
│   └── types.ts                ← SiteRecord (generic row type)
│
├── pages/
│   ├── index.tsx               ← Picks a template, passes config + data
│   └── api/
│       └── data.ts             ← Single route: /api/data?collection=services
│
└── styles/
    ├── theme.css               ← CSS custom properties (set by site.config.ts at build)
    └── base.scss               ← Generic resets only, no colors/fonts
```

---

## 1. `site.config.ts` — The Only File You Edit

This is the complete description of a client site. A developer clones the repo, fills this out, deploys. No other files change.

```typescript
// site.config.ts
import type { SiteConfig } from './model/site-config';

const config: SiteConfig = {

  // ── Business info ──────────────────────────────────────────────
  business: {
    name: 'Ridge & Rail Renovations',
    tagline: 'Licensed General Contractor · Portland, OR',
    phone: '(503) 555-0182',
    email: 'hello@ridgeandrail.com',
    address: 'Portland, OR',
    license: 'CCB-218449',
  },

  // ── Branding ───────────────────────────────────────────────────
  // These become CSS custom properties on :root at build time.
  theme: {
    accent:         '#b87333',
    accentDark:     '#8a561d',
    background:     '#f7f4f0',
    backgroundDark: '#1e1e1e',
    surface:        '#ffffff',
    text:           '#2c2c2c',
    textMuted:      '#777777',
    border:         '#e0d8cf',
    fontFamily:     '"Josefin Sans", sans-serif',
    heroImage:      '/img/hero.jpg',   // set to '' for solid color fallback
  },

  // ── SEO ────────────────────────────────────────────────────────
  seo: {
    description: 'Licensed general contractor serving the Portland metro area. Kitchen remodels, bathroom renovations, flooring, decks, and basement finishing.',
    keywords: ['contractor', 'renovation', 'Portland', 'kitchen remodel', 'bathroom renovation'],
    ogImage: '/img/og.jpg',
  },

  // ── Analytics ──────────────────────────────────────────────────
  analytics: {
    gaId: 'G-XXXXXXXXXX',  // leave empty string to disable
  },

  // ── Navigation ─────────────────────────────────────────────────
  // Each entry becomes a section id and an optional nav link in the header.
  nav: [
    { id: 'services',     label: 'Services'    },
    { id: 'portfolio',    label: 'Our Work'    },
    { id: 'testimonials', label: 'Reviews'     },
    { id: 'about',        label: 'About'       },
    { id: 'contact',      label: 'Contact'     },
  ],

  // ── Social links ───────────────────────────────────────────────
  social: [
    { platform: 'facebook',  url: 'https://facebook.com/ridgeandrail', icon: '/img/icon/facebook.png' },
    { platform: 'instagram', url: 'https://instagram.com/ridgeandrail', icon: '/img/icon/instagram.png' },
    { platform: 'houzz',     url: 'https://houzz.com/pro/ridgeandrail', icon: '/img/icon/houzz.png' },
  ],

  // ── Notion data sources ────────────────────────────────────────
  // Each key is the name used in /api/data?collection=<key>.
  // The value is the name of the env var holding the Notion DB/page ID.
  // Field maps tell the generic fetcher which Notion property names to read.
  collections: {
    services: {
      notionEnvVar: 'NOTION_SERVICES_DB',
      type: 'database',
      sortProperty: 'Order',
      fields: {
        title:       { notionProperty: 'Name',        notionType: 'title'     },
        description: { notionProperty: 'Description', notionType: 'rich_text' },
        icon:        { notionProperty: 'Icon',        notionType: 'rich_text' },
      },
    },
    portfolio: {
      notionEnvVar: 'NOTION_PORTFOLIO_DB',
      type: 'database',
      fields: {
        title:       { notionProperty: 'Name',        notionType: 'title'     },
        category:    { notionProperty: 'Category',    notionType: 'select'    },
        description: { notionProperty: 'Description', notionType: 'rich_text' },
        imageUrl:    { notionProperty: 'Image URL',   notionType: 'url'       },
      },
    },
    testimonials: {
      notionEnvVar: 'NOTION_TESTIMONIALS_DB',
      type: 'database',
      fields: {
        clientName:  { notionProperty: 'Client Name',  notionType: 'title'     },
        projectType: { notionProperty: 'Project Type', notionType: 'select'    },
        quote:       { notionProperty: 'Quote',        notionType: 'rich_text' },
        rating:      { notionProperty: 'Rating',       notionType: 'number'    },
      },
    },
    about: {
      notionEnvVar: 'NOTION_ABOUT_PAGE',
      type: 'page',
    },
    contact: {
      notionEnvVar: 'NOTION_CONTACT_PAGE',
      type: 'page',
    },
  },

  // ── Contact form fields ────────────────────────────────────────
  // Rendered generically by the ContactForm block.
  contactForm: {
    netlifyFormName: 'contact',
    fields: [
      { name: 'name',         label: 'Name',              type: 'text',     required: true  },
      { name: 'email',        label: 'Email',             type: 'email',    required: true  },
      { name: 'phone',        label: 'Phone',             type: 'tel',      required: false },
      {
        name: 'project_type',
        label: 'Type of project',
        type: 'select',
        required: false,
        options: ['Kitchen', 'Bathroom', 'Flooring', 'Deck / Patio', 'Basement', 'Painting', 'Other'],
      },
      { name: 'description',  label: 'Tell us about your project', type: 'textarea', required: false },
      { name: 'best_time',    label: 'Best time to call',          type: 'text',     required: false,
        placeholder: 'e.g. weekday mornings' },
    ],
  },

  // ── Fallback / example data ────────────────────────────────────
  // Shown when NOTION_TOKEN is not set. Edit this to match the client
  // before launch so stakeholders see real content during review.
  fallback: {
    services: [
      { title: 'Kitchen Remodels',    description: 'Full kitchen renovations from design through finish.', icon: '🍳' },
      { title: 'Bathroom Renovations',description: 'Modern fixtures, tilework, and walk-in showers.',     icon: '🚿' },
      { title: 'Flooring',            description: 'Hardwood, LVP, tile, and carpet — supply and install.', icon: '🪵' },
      { title: 'Deck & Patio',        description: 'Custom outdoor spaces in composite or lumber.',        icon: '🌿' },
      { title: 'Basement Finishing',  description: 'Convert unfinished space into livable square footage.', icon: '🏠' },
      { title: 'Interior Painting',   description: 'Professional prep, clean lines, durable finish.',     icon: '🎨' },
    ],
    portfolio: [
      { title: 'Hillside Kitchen Overhaul', category: 'Kitchen',   description: 'Custom walnut cabinetry, quartz countertops, opened to living space.', imageUrl: '' },
      { title: 'Master Bath Transformation',category: 'Bathroom',  description: 'Frameless glass shower, heated floors, freestanding soaking tub.',     imageUrl: '' },
      { title: 'Open-Concept LVP Flooring', category: 'Flooring',  description: '1,800 sq ft wide-plank luxury vinyl plank with custom transitions.',   imageUrl: '' },
      { title: 'Wraparound Deck Build',     category: 'Deck',      description: '680 sq ft Trex composite deck, pergola, and cable rail.',              imageUrl: '' },
      { title: 'Basement Media Room',       category: 'Basement',  description: 'Home theater nook, wet bar rough-in, and full bathroom.',              imageUrl: '' },
      { title: 'Whole-Home Repaint',        category: 'Painting',  description: '2,400 sq ft interior, low-VOC Sherwin-Williams throughout.',           imageUrl: '' },
    ],
    testimonials: [
      { clientName: 'Sarah M.',        projectType: 'Kitchen',  rating: 5, quote: 'Professional from day one — on time, clean site, finished early.' },
      { clientName: 'David & Karen T.',projectType: 'Deck',     rating: 5, quote: 'Built exactly what we envisioned. Could not be happier.' },
      { clientName: 'Mike R.',         projectType: 'Bathroom', rating: 5, quote: 'Our bathroom looks like something out of a magazine.' },
      { clientName: 'The Hendersons',  projectType: 'Basement', rating: 5, quote: 'Turned our storage basement into an actual living space.' },
    ],
    about:   '<p>Ridge &amp; Rail Renovations has served the Greater Portland area since 2008. Owner Jake Hartwell started the company after 15 years in residential construction.</p><p>Fully licensed and insured (CCB-218449). 2-year workmanship warranty on every project.</p>',
    contact: '<p><strong>Phone:</strong> <a href="tel:+15035550182">(503) 555-0182</a></p><p><strong>Email:</strong> <a href="mailto:hello@ridgeandrail.com">hello@ridgeandrail.com</a></p><p><strong>Service area:</strong> Portland metro, Beaverton, Hillsboro, Lake Oswego</p>',
  },
};

export default config;
```

---

## 2. The `SiteConfig` Type

```typescript
// model/site-config.ts

export type FieldType = 'title' | 'rich_text' | 'select' | 'url' | 'number' | 'checkbox';

export type FieldMap = Record<string, {
  notionProperty: string;
  notionType: FieldType;
}>;

export type CollectionConfig =
  | { type: 'database'; notionEnvVar: string; sortProperty?: string; fields: FieldMap }
  | { type: 'page';     notionEnvVar: string };

export type FormField = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  required?: boolean;
  placeholder?: string;
  options?: string[];   // for type: 'select'
};

export type SiteConfig = {
  business: {
    name: string;
    tagline: string;
    phone?: string;
    email?: string;
    address?: string;
    license?: string;
  };
  theme: {
    accent: string;
    accentDark: string;
    background: string;
    backgroundDark: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    fontFamily: string;
    heroImage?: string;
  };
  seo: {
    description: string;
    keywords: string[];
    ogImage?: string;
  };
  analytics: {
    gaId: string;
  };
  nav: Array<{ id: string; label: string }>;
  social: Array<{ platform: string; url: string; icon: string }>;
  collections: Record<string, CollectionConfig>;
  contactForm: {
    netlifyFormName: string;
    fields: FormField[];
  };
  fallback: Record<string, unknown[] | string>;
};
```

---

## 3. Generic Notion Layer

Instead of one function per data type (`fetchServices`, `fetchPortfolio`…), a single generic fetcher reads the field map from the collection config and returns plain objects.

```typescript
// model/notion.ts (simplified generic version)

import { Client, isFullPage } from '@notionhq/client';
import type { BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import config from '../site.config';
import type { CollectionConfig } from './site-config';

function client(): Client | null {
  return process.env.NOTION_TOKEN ? new Client({ auth: process.env.NOTION_TOKEN }) : null;
}

// Reads a single Notion property value into a plain JS value.
function readProperty(prop: unknown, type: string): unknown {
  const p = prop as any;
  switch (type) {
    case 'title':     return p.title.map((t: any) => t.plain_text).join('');
    case 'rich_text': return p.rich_text.map((t: any) => t.plain_text).join('');
    case 'select':    return p.select?.name ?? '';
    case 'url':       return p.url ?? '';
    case 'number':    return p.number ?? 0;
    case 'checkbox':  return p.checkbox ?? false;
    default:          return '';
  }
}

// Converts Notion blocks to an HTML string.
export function blocksToHtml(blocks: BlockObjectResponse[]): string { /* ... same as before ... */ }

// Fetches any database and maps it to plain objects using the field map.
export async function fetchCollection(collectionName: string): Promise<Record<string, unknown>[]> {
  const colConfig = config.collections[collectionName];
  if (!colConfig || colConfig.type !== 'database') return [];

  const notion = client();
  const dbId = process.env[colConfig.notionEnvVar];

  if (!notion || !dbId) {
    // Return fallback data from config, adding an id if missing.
    const fallback = config.fallback[collectionName];
    return Array.isArray(fallback)
      ? fallback.map((item: any, i) => ({ id: String(i + 1), ...item }))
      : [];
  }

  try {
    const queryOptions: any = { database_id: dbId };
    if (colConfig.sortProperty) {
      queryOptions.sorts = [{ property: colConfig.sortProperty, direction: 'ascending' }];
    }
    const response = await notion.databases.query(queryOptions);

    return response.results.filter(isFullPage).map((page) => {
      const record: Record<string, unknown> = { id: page.id };
      for (const [key, { notionProperty, notionType }] of Object.entries(colConfig.fields)) {
        record[key] = readProperty(page.properties[notionProperty], notionType);
      }
      return record;
    });
  } catch (e) {
    console.error(`Notion fetch error (${collectionName}):`, e);
    const fallback = config.fallback[collectionName];
    return Array.isArray(fallback) ? fallback.map((item: any, i) => ({ id: String(i + 1), ...item })) : [];
  }
}

// Fetches any page and converts blocks to HTML.
export async function fetchPage(collectionName: string): Promise<string> {
  const colConfig = config.collections[collectionName];
  if (!colConfig || colConfig.type !== 'page') return '';

  const notion = client();
  const pageId = process.env[colConfig.notionEnvVar];

  if (!notion || !pageId) {
    const fallback = config.fallback[collectionName];
    return typeof fallback === 'string' ? fallback : '';
  }

  try {
    const response = await notion.blocks.children.list({ block_id: pageId });
    return blocksToHtml(response.results as BlockObjectResponse[]);
  } catch (e) {
    console.error(`Notion page fetch error (${collectionName}):`, e);
    const fallback = config.fallback[collectionName];
    return typeof fallback === 'string' ? fallback : '';
  }
}
```

---

## 4. Single API Route

Four separate routes (`/api/services`, `/api/portfolio`, etc.) collapse into one.

```typescript
// pages/api/data.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchCollection, fetchPage } from '../../model/notion';
import config from '../../site.config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const collection = req.query['collection'] as string;

  if (!collection || !config.collections[collection]) {
    return res.status(404).json({ error: 'Unknown collection' });
  }

  const colConfig = config.collections[collection];
  const data = colConfig.type === 'page'
    ? await fetchPage(collection)
    : await fetchCollection(collection);

  // Cache for 1 hour at the CDN level
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).json(data);
}
```

Callers: `fetch('/api/data?collection=services')`, `fetch('/api/data?collection=about')`, etc.

---

## 5. CSS Custom Properties for Theming

Replace Sass variables in `theme.module.scss` with CSS custom properties written at build time from `site.config.ts`. This means color changes never touch component files.

```typescript
// lib/generate-theme-css.ts  (run during `next build` via a custom script or plugin)

import config from '../site.config';

export function generateThemeCss(): string {
  const t = config.theme;
  return `
:root {
  --color-accent:          ${t.accent};
  --color-accent-dark:     ${t.accentDark};
  --color-background:      ${t.background};
  --color-background-dark: ${t.backgroundDark};
  --color-surface:         ${t.surface};
  --color-text:            ${t.text};
  --color-text-muted:      ${t.textMuted};
  --color-border:          ${t.border};
  --font-family:           ${t.fontFamily};
  --hero-bg-image:         ${t.heroImage ? `url(${t.heroImage})` : 'none'};
}
  `.trim();
}
```

Components reference `var(--color-accent)` instead of `$accent`. This means the same component SCSS file works for every client — only the CSS variables change.

```scss
// components/ui/Button/style.module.scss
.button {
  background: var(--color-accent);
  color: #fff;
  font-family: var(--font-family);

  &:hover { background: var(--color-accent-dark); }
}
```

**Practical shortcut:** Until the build-time generation is wired up, write the CSS vars into `styles/theme.css` manually per project. It's one file, a few lines — still far better than hunting through component SCSS files.

---

## 6. Two-Tier Component Architecture

### Tier 1: `components/ui/` — Generic primitives

No business logic. Accept only display props. Never import from `site.config.ts`. These are the reusable atoms that work on any project.

| Component | Props | Notes |
|---|---|---|
| `Button` | `label`, `href?`, `onClick?`, `variant` | primary / secondary / ghost |
| `Card` | `children`, `accent?` | border-left accent stripe |
| `Grid` | `children`, `columns` (1/2/3) | responsive CSS grid |
| `Badge` | `label`, `color?` | pill label for categories |
| `TextBlock` | `html` | renders `dangerouslySetInnerHTML` safely |

### Tier 2: `components/blocks/` — Composed blocks

Know about the app's data shape. Import from `model/` types. Do not import `site.config.ts` directly — receive config slices as props.

| Block | Key props | Replaces |
|---|---|---|
| `Hero` | `businessName`, `tagline`, `ctaLabel`, `ctaTarget`, `bgImage?` | current `Hero` |
| `CollectionGrid` | `items: SiteRecord[]`, `variant: 'services'\|'portfolio'\|'testimonials'` | `ServicesList`, `PortfolioGrid`, `Testimonials` |
| `RichTextSection` | `html` | inline `dangerouslySetInnerHTML` divs |
| `ContactForm` | `fields: FormField[]`, `formName` | current `ContactForm` |
| `Footer` | `credit` | current `FooterSection` |

The key insight: `CollectionGrid` is one component that switches its card layout based on `variant`. Since all three (services, portfolio, testimonials) are grids of cards with a title and body, a single component handles all three — the variant just controls which fields to render and whether to show a star rating vs. a category badge.

```tsx
// components/blocks/CollectionGrid/CollectionGrid.tsx
type Variant = 'services' | 'portfolio' | 'testimonials';

type CollectionGridProps = {
  items: Record<string, unknown>[];
  variant: Variant;
};

export function CollectionGrid({ items, variant }: CollectionGridProps) {
  return (
    <Grid columns={variant === 'testimonials' ? 2 : 3}>
      {items.map((item, i) => (
        <Card key={item.id as string ?? i} accent={variant === 'testimonials'}>
          {variant === 'services' && (
            <>
              <span>{item.icon as string}</span>
              <h3>{item.title as string}</h3>
              <p>{item.description as string}</p>
            </>
          )}
          {variant === 'portfolio' && (
            <>
              {item.imageUrl
                ? <img src={item.imageUrl as string} alt={item.title as string} />
                : <div className={Style['placeholder']}>{item.category as string}</div>
              }
              <Badge label={item.category as string} />
              <h3>{item.title as string}</h3>
              <p>{item.description as string}</p>
            </>
          )}
          {variant === 'testimonials' && (
            <>
              <Stars rating={item.rating as number} />
              <blockquote>"{item.quote as string}"</blockquote>
              <footer><strong>{item.clientName as string}</strong> — {item.projectType as string}</footer>
            </>
          )}
        </Card>
      ))}
    </Grid>
  );
}
```

---

## 7. Page Templates

Templates are the only place `site.config.ts` is imported directly. They read config and data props, wire them into blocks, and define the section order.

```tsx
// templates/ContractorPage.tsx

import config from '../site.config';
import { Hero, CollectionGrid, RichTextSection, ContactForm, Footer } from '../components/blocks';
import { Section } from '../components/ui';

type ContractorPageProps = {
  data: Record<string, unknown[] | string>;
};

export function ContractorPage({ data }: ContractorPageProps) {
  return (
    <>
      <Hero
        businessName={config.business.name}
        tagline={config.business.tagline}
        ctaLabel="Get a Free Quote"
        ctaTarget="contact"
        bgImage={config.theme.heroImage}
      />
      <main>
        {config.nav.map(({ id, label }) => {
          switch (id) {
            case 'services':
              return (
                <Section key={id} id={id}>
                  <h2>{label}</h2>
                  <CollectionGrid items={data.services as any[]} variant="services" />
                </Section>
              );
            case 'portfolio':
              return (
                <Section key={id} id={id}>
                  <h2>{label}</h2>
                  <CollectionGrid items={data.portfolio as any[]} variant="portfolio" />
                </Section>
              );
            case 'testimonials':
              return (
                <Section key={id} id={id}>
                  <h2>{label}</h2>
                  <CollectionGrid items={data.testimonials as any[]} variant="testimonials" />
                </Section>
              );
            case 'about':
              return (
                <Section key={id} id={id}>
                  <h2>{label}</h2>
                  <RichTextSection html={data.about as string} />
                </Section>
              );
            case 'contact':
              return (
                <Section key={id} id={id}>
                  <h2>{label}</h2>
                  <RichTextSection html={data.contact as string} />
                  <ContactForm fields={config.contactForm.fields} formName={config.contactForm.netlifyFormName} />
                </Section>
              );
            default:
              return null;
          }
        })}
        <Footer credit="Peter Flanagan" />
      </main>
    </>
  );
}
```

The `nav` array in `site.config.ts` controls which sections appear and in what order. To remove the Testimonials section from a client's site, just remove that entry from `nav`.

---

## 8. `pages/index.tsx` Becomes Thin

With templates and a generic data loader, the page is just plumbing.

```tsx
// pages/index.tsx

import type { GetStaticProps } from 'next';
import { ContractorPage } from '../templates/ContractorPage';
import { fetchCollection, fetchPage } from '../model/notion';
import config from '../site.config';

type HomeProps = {
  data: Record<string, unknown[] | string>;
};

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  // Load every collection listed in config
  const entries = await Promise.all(
    Object.entries(config.collections).map(async ([key, col]) => {
      const value = col.type === 'page'
        ? await fetchPage(key)
        : await fetchCollection(key);
      return [key, value] as const;
    })
  );
  return {
    props: { data: Object.fromEntries(entries) },
    revalidate: 3600,
  };
};

export default function Home({ data }: HomeProps) {
  return <ContractorPage data={data} />;
}
```

To use a different template (say, a musician's page), change one import and one JSX tag.

---

## 9. Spinning Up a New Client

```
1. Fork / clone this repo into a new GitHub repo for the client
2. Edit site.config.ts — fill in business info, colors, nav, fallback content
3. Replace /public/img/logo/logo.png with the client's logo
4. Replace /public/img/hero.jpg with a hero photo (or set theme.heroImage: '')
5. Set the correct page template in pages/index.tsx
6. Deploy to Netlify — add the env vars from notion-setup.md
7. Share notion-setup.md with the client so they can connect their Notion workspace
8. Done
```

Steps 2–5 touch exactly four things. The entire codebase otherwise stays the same.

---

## 10. What To Hardcode vs. Configure

| Decision | Hardcode | Configure |
|---|---|---|
| Business name, tagline | | ✓ `site.config.ts` |
| Brand colors | | ✓ `site.config.ts → theme` |
| Section order and which sections exist | | ✓ `site.config.ts → nav` |
| Notion DB/page IDs | | ✓ Netlify env vars (referenced by name in config) |
| Contact form fields | | ✓ `site.config.ts → contactForm.fields` |
| Fallback content | | ✓ `site.config.ts → fallback` |
| Google Analytics ID | | ✓ `site.config.ts → analytics.gaId` |
| UI layout (grid, card shape, spacing) | ✓ `components/ui/` | |
| Block composition (which ui/ components a block uses) | ✓ `components/blocks/` | |
| Page template (section wiring) | ✓ `templates/` | |
| Notion API parsing logic | ✓ `model/notion.ts` | |
| Next.js config, TypeScript config | ✓ | |

The rule: if it would be the same for every contractor (or every musician), hardcode it. If it differs per client, it belongs in `site.config.ts`.

---

## Current Codebase → Target System: Migration Steps

The current repo (`claude/plan-contractor-website-F4Xni`) is already close. Here's what's left to reach the full template system:

1. **Extract `site.config.ts`** from `content/metadata.ts` + `model/notion.ts` fallback arrays + `styles/theme.module.scss` + form field definitions in `ContactForm.tsx`
2. **Write `model/site-config.ts`** type definitions
3. **Refactor `model/notion.ts`** to `fetchCollection(name)` + `fetchPage(name)` using the field maps from config
4. **Replace four API routes** with single `pages/api/data.ts`
5. **Move `components/hero/`, `components/services-list/`, etc.** into `components/blocks/`; merge `ServicesList`, `PortfolioGrid`, `Testimonials` into `CollectionGrid`
6. **Create `components/ui/`** with `Button`, `Card`, `Grid`, `Badge`; refactor blocks to use them
7. **Replace Sass variable references** in component SCSS with `var(--color-*)` custom properties; write `lib/generate-theme-css.ts`
8. **Create `templates/ContractorPage.tsx`** driven by `config.nav`
9. **Slim down `pages/index.tsx`** to the thin plumbing version shown above
