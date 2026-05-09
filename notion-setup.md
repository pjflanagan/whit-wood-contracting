# Notion Setup Guide

## 1. Create a Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Name it "Ridge & Rail Website" and select your workspace
4. Copy the **Internal Integration Token** → set as `NOTION_TOKEN` in Netlify environment variables

## 2. Create the Databases

Create four databases in Notion (share each one with your integration):

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

| Variable | Value |
|---|---|
| `NOTION_TOKEN` | Your integration token (secret_...) |
| `NOTION_SERVICES_DB` | Services database ID (from the database URL) |
| `NOTION_PORTFOLIO_DB` | Portfolio database ID |
| `NOTION_TESTIMONIALS_DB` | Testimonials database ID |
| `NOTION_ABOUT_PAGE` | About page ID |
| `NOTION_CONTACT_PAGE` | Contact page ID |

**How to find a database/page ID:** Open it in Notion, copy the URL. The ID is the 32-character string after the last `/` and before the `?`.

## 4. Share Databases with the Integration

For each database and page, click "..." → "Add connections" → select your integration.

## 5. Update Your Content

The site auto-refreshes every hour. After editing in Notion, changes appear within 60 minutes. To force an immediate refresh, trigger a new deploy in Netlify.

## Day-to-Day Updates

| "I want to…" | How |
|---|---|
| Add a service | Add a row to the Services database in Notion |
| Add a project photo | Add a row to the Portfolio database; paste the image URL |
| Add a testimonial | Add a row to the Testimonials database |
| Update About text | Edit the About page in Notion |
| Update phone/email | Edit the Contact page in Notion |
| See contact form submissions | Log into Netlify → Forms tab |
