# Notion Snapshots

The site caches every successful Notion API response to a local JSON file in `notion-snapshots/`. If Notion is unavailable on a subsequent request, the site serves the most recent cached data instead of falling back to empty defaults.

## How It Works

Every fetch function in `services/api.ts` follows this pattern:

1. **Success** — call Notion, write the result to `notion-snapshots/<key>.json`, return the result
2. **Failure** — read from `notion-snapshots/<key>.json`; if no snapshot exists, fall back to the in-code `DEFAULT_*` constant

The read/write logic lives in `services/snapshot.ts`. Writes are best-effort — a failed write is silently ignored so it never breaks a response.

## Snapshot Files

| File | Populated by |
|---|---|
| `notion-snapshots/services.json` | `fetchServices()` |
| `notion-snapshots/portfolio.json` | `fetchPortfolio()` |
| `notion-snapshots/testimonials.json` | `fetchTestimonials()` |
| `notion-snapshots/sections.json` | `fetchSections()` |
| `notion-snapshots/site-config.json` | `fetchSiteConfig()` |
| `notion-snapshots/site-images-local.json` | `fetchSiteImages()` |
| `notion-snapshots/social-links.json` | `fetchSocialLinks()` |
| `notion-snapshots/about.json` | `fetchAbout()` |

## Image Snapshots

Site images (logo, hero, share card) are downloaded as actual files in addition to the JSON snapshot. Notion's image URLs are signed and expire after ~1 hour, so caching the URL alone is not enough.

On a successful `fetchSiteImages()`, each image is fetched and written to `public/notion-snapshots/`:

| File | Image |
|---|---|
| `public/notion-snapshots/logo.<ext>` | Logo |
| `public/notion-snapshots/hero-image.<ext>` | Hero background |
| `public/notion-snapshots/share-card.<ext>` | OG share card |

The local paths are stored in `notion-snapshots/site-images-local.json`. When Notion fails, that file is read and the local paths (e.g. `/notion-snapshots/logo.jpg`) are returned instead of null.

The extension is detected from the response `Content-Type` header (`png`, `webp`, or `jpg`).

Portfolio photos are not cached this way — they degrade gracefully when missing and would bloat the repo.

## Keeping Snapshots Up to Date

Snapshot files and images are committed to the repo. Vercel bundles them with each deploy, so they are always available as a fallback in production.

To refresh them, run the dev server locally while Notion is available — every page load that triggers a fetch will overwrite the corresponding files with fresh data. Commit and push the updated files.

## When Snapshots Are Used

- Notion returns a `service_unavailable` or other API error
- The `NOTION_TOKEN` environment variable is missing (e.g. local dev without a `.env.local`)
- A specific database ID env var is not set

In all cases the priority order is: **live Notion data → snapshot file → in-code default**.
