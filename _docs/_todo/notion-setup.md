# Notion Setup Guide

## 1. Create a Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Name it (e.g. "Website Integration") and select your workspace
4. Copy the **Internal Integration Token** → set as `NOTION_TOKEN` in Netlify environment variables

## 2. Create the Databases and Pages

Create the following in Notion (share each one with your integration):

### Site Config Database ⭐

A single-row database that controls all site-level content.

Properties:
| Name | Type | Notes |
|---|---|---|
| Business Name | Title | Your business name, e.g. "Ridge & Rail Renovations" |
| Tagline | Text | Short line under the name, e.g. "Licensed General Contractor · Portland, OR" |
| Hero Image URL | URL | Full URL to your hero background image (Cloudinary, etc.) |
| CTA Label | Text | Hero button text, e.g. "Get a Free Quote" |
| CTA Target | Text | Section ID the button scrolls to, e.g. `contact` |
| SEO Description | Text | Meta description for search engines |
| SEO Keywords | Text | Comma-separated keywords for search engines |

Add one row and fill in all fields.

### Services Database

Properties:
| Name | Type | Notes |
|---|---|---|
| Name | Title | Service name, e.g. "Kitchen Remodels" |
| Description | Text | One or two sentences |
| Icon | Text | An emoji, e.g. 🍳 |
| Order | Number | Controls display order (1, 2, 3…) |

### Portfolio Database

Properties:
| Name | Type | Notes |
|---|---|---|
| Name | Title | Project name |
| Category | Select | Kitchen, Bathroom, Flooring, Deck, Basement, Painting |
| Description | Text | 2–3 sentence description |
| Image URL | URL | Cloudinary or other image URL |

### Testimonials Database

Properties:
| Name | Type | Notes |
|---|---|---|
| Client Name | Title | e.g. "Sarah M." |
| Project Type | Select | Kitchen, Bathroom, etc. |
| Quote | Text | The testimonial text |
| Rating | Number | 1–5 |

### About Page & Contact Page

Create two regular Notion pages (not databases). Use headings and paragraphs — the site will convert them to HTML automatically.

## 3. Set Environment Variables in Netlify

In Netlify → Site settings → Environment variables, add:

| Variable                 | Value                                |
| ------------------------ | ------------------------------------ |
| `NOTION_TOKEN`           | Your integration token (secret\_...) |
| `NOTION_SITE_CONFIG_DB`  | Site Config database ID              |
| `NOTION_SERVICES_DB`     | Services database ID                 |
| `NOTION_PORTFOLIO_DB`    | Portfolio database ID                |
| `NOTION_TESTIMONIALS_DB` | Testimonials database ID             |
| `NOTION_ABOUT_PAGE`      | About page ID                        |
| `NOTION_CONTACT_PAGE`    | Contact page ID                      |

**How to find a database/page ID:** Open it in Notion, copy the URL. The ID is the 32-character string after the last `/` and before the `?`.

## 4. Share Databases with the Integration

For each database and page, click "..." → "Add connections" → select your integration.

## 5. Update Your Content

The site auto-refreshes every hour. After editing in Notion, changes appear within 60 minutes. To force an immediate refresh, trigger a new deploy in Netlify.

## Day-to-Day Updates

| "I want to…"                        | How                                                          |
| ----------------------------------- | ------------------------------------------------------------ |
| Change the business name or tagline | Edit the Site Config row in Notion                           |
| Change the hero background photo    | Paste a new URL into "Hero Image URL" in the Site Config row |
| Change the hero button text         | Edit "CTA Label" in the Site Config row                      |
| Add a service                       | Add a row to the Services database in Notion                 |
| Add a project photo                 | Add a row to the Portfolio database; paste the image URL     |
| Add a testimonial                   | Add a row to the Testimonials database                       |
| Update About text                   | Edit the About page in Notion                                |
| Update phone/email                  | Edit the Contact page in Notion                              |
| See contact form submissions        | Log into Netlify → Forms tab                                 |
