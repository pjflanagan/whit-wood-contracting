# Ridge & Rail Renovations — Website

Contractor website for Ridge & Rail Renovations (Portland, OR). Built with Next.js 14, TypeScript, and SCSS. Deployed on Netlify. Content is managed through Notion — no code changes needed for day-to-day updates.

## Content Management

All copy, services, portfolio items, and testimonials are managed in Notion. See **[notion-setup.md](./notion-setup.md)** for how to structure the databases and connect them to the site.

When Notion is not configured (no `NOTION_TOKEN`), the site displays built-in example data so it is always previewable.

The site rebuilds automatically every hour to pick up Notion changes. To force an immediate refresh, trigger a new deploy in Netlify.

## Local Development

```
git clone https://github.com/pjflanagan/whit-wood-contracting
cd whit-wood-contracting
npm install
```

Create a `.env.local` file with Notion credentials (see notion-setup.md). Without it, the site runs fine on example data.

```
npm run dev
```

The site runs at `http://localhost:3000`.

## Deploy

Pushing to `main` triggers a Netlify deploy automatically.

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 14 (Pages Router) |
| Language | TypeScript |
| Styles | SCSS Modules |
| CMS | Notion (via `@notionhq/client`) |
| Hosting | Netlify |
| Forms | Netlify Forms |
| Analytics | Google Analytics 4 |

## Project Structure

```
content/
  metadata.ts       ← Site title, subtitle, SEO tags
components/         ← UI components (Hero, ServicesList, PortfolioGrid, …)
model/
  notion.ts         ← Fetches from Notion; falls back to example data
  *.ts              ← TypeScript types (Service, PortfolioItem, Testimonial, …)
pages/
  index.tsx         ← Main page — assembles sections at build time
  api/              ← API routes for data fetching
public/
  img/logo/         ← Replace logo.png with the client's logo
  __forms.html      ← Netlify Forms detection file (do not delete)
styles/
  theme.module.scss ← Colors, breakpoints, spacing
```

## System

This repo follows the pattern described in [SYSTEM.md](./SYSTEM.md) — a reusable template for spinning up small client sites on the same Next.js + Notion stack.
