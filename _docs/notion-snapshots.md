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
| `notion-snapshots/site-images.json` | `fetchSiteImages()` |
| `notion-snapshots/social-links.json` | `fetchSocialLinks()` |
| `notion-snapshots/about.json` | `fetchAbout()` |

## Keeping Snapshots Up to Date

Snapshot files are committed to the repo. Vercel bundles them with each deploy, so they are always available as a fallback in production.

To refresh the committed snapshots, run the dev server locally while Notion is available — every page load that triggers a fetch will overwrite the corresponding file with fresh data. Commit and push the updated files.

## When Snapshots Are Used

- Notion returns a `service_unavailable` or other API error
- The `NOTION_TOKEN` environment variable is missing (e.g. local dev without a `.env.local`)
- A specific database ID env var is not set

In all cases the priority order is: **live Notion data → snapshot file → in-code default**.
