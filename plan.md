# Contractor Website Adaptation Plan

This document outlines how to adapt the Julian Wittich Music website into a contractor/renovating service website. The goal is a site that is easy for a non-programmer to keep updated.

---

## What Stays the Same

- **Framework:** Next.js 14 + TypeScript + Sass (no reason to change — it's fast, SEO-friendly, and deploys easily to Netlify)
- **Hosting:** Netlify (free tier handles this easily)
- **Architecture:** Single-page with smooth scroll to sections
- **Google API key pattern:** Reuse the same approach for any Google-based data sources

---

## What Gets Removed

| Current Element | Reason |
|---|---|
| Interactive canvas guitar animation | Music-specific; replace with a static hero image or CSS background slideshow |
| Google Calendar events section | Not relevant; replace with a Services section |
| Music social icons (Instagram, YouTube, Spotify) | Replace with contractor-relevant links (Facebook, Houzz, Google My Business, Yelp) |

---

## New Site Structure

The new single-page layout, scrolling top to bottom:

1. **Hero** — Full-screen background image of a completed project, business name, tagline, and a "Get a Free Quote" CTA button that scrolls to Contact
2. **Services** — Cards or list of services offered (e.g., Kitchen Remodels, Bathroom Renovations, Flooring, Decks)
3. **Portfolio / Gallery** — Before/after photos or a photo grid of completed projects
4. **Testimonials** — 3–5 client reviews with name and project type
5. **About** — Who we are, years of experience, license number, service area
6. **Contact** — A working contact form (name, email, phone, project description) + phone number and email displayed

---

## Data Sourcing: Three Proposed Options

The most important decision is where the client stores content so they can update it without touching code. Three options are proposed below, ranked from simplest to most powerful.

---

### Option A: Stay in the Google Ecosystem (Recommended for lowest friction)

Keep the existing pattern — everything lives in Google tools the client already knows.

| Content Type | Tool | How the client updates it |
|---|---|---|
| Services, About, Testimonials (text) | Google Blogger | Edit posts in Blogger's web editor — no code |
| Portfolio photos | Google Photos shared album | Upload photos to a shared album |
| Contact form submissions | Netlify Forms | Submissions appear in the Netlify dashboard |

**How it works technically:**

- Each content section (Services, About, Testimonials, Contact info) maps to one Blogger post, fetched via the existing `/api/content` route — no new API setup needed.
- A new Google Photos shared album is created. Its album ID is stored as an environment variable. The site fetches the album's photos via the Google Photos Library API and renders them as a grid.
- The contact form uses Netlify's built-in form handling (just add `data-netlify="true"` to the `<form>` tag — zero backend code required). Submissions are emailed to the client and visible in the Netlify dashboard.

**Pros:** Client already knows Google tools. Zero new accounts or logins.  
**Cons:** Google Photos Library API requires OAuth2 (more complex than the Blogger/Calendar API key approach). Blogger is not the most intuitive editor for structured content like a services list.

---

### Option B: Notion as CMS (Recommended for best experience)

The client manages all content in Notion — a modern, Google Docs-style tool that non-programmers find very natural.

| Content Type | Tool | How the client updates it |
|---|---|---|
| Services | Notion database (table) | Add/edit rows in a table — like a spreadsheet |
| Portfolio photos | Notion gallery or page images | Upload images directly into Notion pages |
| Testimonials | Notion database (table) | Add/edit rows |
| About, Contact info | Notion page (rich text) | Edit like a Google Doc |
| Contact form | Netlify Forms | Same as Option A |

**How it works technically:**

- A shared Notion workspace is set up for the client.
- The site uses the [Notion API](https://developers.notion.com/) to fetch database entries and page content at request time (or at build time with ISR).
- Images stored in Notion pages are fetched as temporary signed URLs (they expire; for production, images should be re-hosted on Cloudinary or similar — see note below).
- The Notion integration token is stored as a Netlify environment variable.

**Pros:** Excellent editor experience. Databases make structured content (services, testimonials) very intuitive. Free tier is generous.  
**Cons:** Notion image URLs expire after ~1 hour, requiring either a caching layer or a separate image host for the portfolio.

---

### Option C: Airtable + Cloudinary (Recommended for a photo-heavy portfolio)

Airtable acts as the database (services, testimonials, portfolio metadata) while Cloudinary handles all images with a media library the client can manage visually.

| Content Type | Tool | How the client updates it |
|---|---|---|
| Services | Airtable table | Add/edit rows |
| Portfolio | Airtable table + Cloudinary | Add a row per project; upload photos to Cloudinary |
| Testimonials | Airtable table | Add/edit rows |
| About, Contact info | Airtable single-record table | Edit the one row |
| Contact form | Netlify Forms | Same as Option A |

**How it works technically:**

- Airtable's REST API returns structured JSON for each table (services, portfolio, testimonials).
- Each portfolio row includes a Cloudinary public ID. The site constructs image URLs using Cloudinary's URL API (supports automatic resizing, WebP conversion, and lazy loading — no extra code).
- Cloudinary has a drag-and-drop media library at cloudinary.com that requires no technical knowledge to use.
- Both the Airtable API key and Cloudinary cloud name are stored as Netlify environment variables.

**Pros:** Best image management story. Airtable is spreadsheet-like and very accessible. Cloudinary's free tier (25GB) is more than enough for a contractor portfolio.  
**Cons:** Two new accounts/tools to learn. More initial setup than Options A or B.

---

## Contact Form (All Options)

All three options use **Netlify Forms**, which is the simplest possible approach since the site is already hosted on Netlify.

Implementation: add `data-netlify="true"` and a hidden `<input type="hidden" name="form-name" value="contact" />` to the `<form>` element. Netlify intercepts form submissions at the edge — no API route or backend needed.

Fields to include:
- Name (required)
- Email (required)
- Phone
- Type of project (dropdown: Kitchen, Bathroom, Flooring, Deck, Other)
- Project description (textarea)
- Best time to call

Submissions are forwarded to the client's email and stored in the Netlify dashboard under "Forms."

---

## Visual / Design Changes

| Element | Current | New |
|---|---|---|
| Hero background | Animated canvas (bass guitar) | Full-screen photo of a completed project |
| Color palette | Dark, moody (music aesthetic) | Suggest: warm neutrals — slate gray, off-white, wood tones |
| Typography | Current fonts (minimal branding) | Slightly more corporate-friendly: strong serif for headings, clean sans-serif for body |
| Logo | Julian Wittich music logo | New client's logo (replace `/public/img/logo/`) |
| Favicon | Music-themed | New client's logo or initials |
| Photos in slideshow | Musician headshots | Project before/after photos |

The slideshow component already exists and can be reused with new photos — just swap out the images in the data source of choice.

---

## Code Changes Required

Even without touching visual design, these are the key code changes:

1. **`/content/metadata.ts`** — Update site title, description, OG image, keywords
2. **`/pages/_app.tsx`** — Replace Google Analytics ID with client's GA4 property
3. **`/pages/api/events.ts`** → rename/replace with `/pages/api/services.ts` — fetch from chosen CMS
4. **`/pages/api/content.ts`** — Update Blogger IDs (or replace with Notion/Airtable fetch)
5. **`/components/canvas/`** — Remove the guitar canvas; replace with a hero image component
6. **`/components/events-list/`** → rename/replace with a `services-list` or `portfolio-grid` component
7. **`/components/social-icon-row/`** — Replace social links with contractor-relevant ones
8. **`/public/img/`** — Replace all photos with client's photos (if using static images)
9. **`/content/main/SidebarBelowTheFold.tsx`** — Add Portfolio, Testimonials sections; update Contact section to include the form

---

## Non-Programmer Update Guide (Example for Option A)

Once set up, the client's day-to-day updates require no code:

| "I want to..." | How |
|---|---|
| Add a completed project photo | Upload to the shared Google Photos album |
| Update my services list | Edit the "Services" post in Google Blogger |
| Add a testimonial | Edit the "Testimonials" post in Blogger |
| Update my phone number | Edit the "Contact" post in Blogger |
| See who filled out the contact form | Log into Netlify → Forms tab |
| Update the About section | Edit the "About" post in Blogger |

---

## Recommended Path Forward

1. **Decide on the CMS option** (A, B, or C above) before writing any code
2. **Gather from the client:** logo, photos of completed projects, services list, 3–5 testimonials, about text, contact details
3. **Set up the data source** (Blogger posts / Notion pages / Airtable base) with real content before coding the frontend
4. **Replace the canvas hero** with a static full-screen image component first — this is the biggest visual change
5. **Wire up the Contact form** via Netlify Forms — this is the quickest win and a key differentiator from the music site
6. **Swap content section by section**, testing on a preview branch before going live
