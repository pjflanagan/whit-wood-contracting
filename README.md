# Ridge & Rail Renovations — Website

Original: https://www.yourgreenguys.org/

Contractor website for Whit Wood. Built with Next.js 14, TypeScript, and SCSS. Deployed on Netlify. Content is managed through Decap — no code changes needed for day-to-day updates.

## Content Management

Content is managed through Decap. The account login is configured through Netlify.

Content updates do not trigger a redeploy, as Decap is designed to do. Instead they are stored directly in this repo publicly on Github.

## Local Development

```
git clone https://github.com/pjflanagan/whit-wood-contracting
cd whit-wood-contracting
npm install
npm run dev
```

The site runs at `http://localhost:3000`.

## Deploy

Pushing to `main` triggers a Netlify deploy automatically.

## Tech Stack

| Layer     | Tool                      |
| --------- | ------------------------- |
| Framework | Next.js 14 (Pages Router) |
| Language  | TypeScript                |
| Styles    | SCSS Modules              |
| CMS       | Decap                     |
| Hosting   | Netlify                   |
| Forms     | Netlify Forms             |
| Analytics | Google Analytics 4        |

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
