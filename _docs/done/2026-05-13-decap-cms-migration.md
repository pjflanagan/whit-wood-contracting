# Decap CMS Migration

Decap CMS replaces Notion entirely. Content is stored as JSON files in the repo, edited through a
web UI at `/admin`, and committed back to GitHub automatically. Netlify rebuilds the site on each
commit.

## Architecture

**Same repo, not a separate content repo.** Decap CMS writes files directly into your repo via the
GitHub API — splitting content into a second repo adds sync complexity for no benefit.

**Netlify over Vercel.** Netlify Identity + Git Gateway handles CMS authentication as a managed
service with zero custom code. Vercel would require a hand-rolled OAuth proxy instead.

---

## Step 1 — Deploy to Netlify

1. Go to [app.netlify.com](https://app.netlify.com) and click **Add new site → Import an existing project**.
2. Connect GitHub and select the `whit-wood-contracting` repo.
3. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add an environment variable: `NODE_VERSION = 22`.
5. Add all the Notion env vars from `.env` (needed until the Notion code is removed in Step 7).
6. Click **Deploy**. Confirm the site loads at the Netlify URL before continuing.
7. Transfer your custom domain DNS to Netlify: **Domain management → Add a domain**.

---

## Step 2 — Enable Netlify Identity

1. In the Netlify dashboard: **Identity → Enable Identity**.
2. Under **Registration preferences**: set to **Invite only** so random people can't create accounts.
3. Under **Services → Git Gateway**: click **Enable Git Gateway**.
   - This lets the CMS commit files back to GitHub without exposing a personal token.
4. Invite yourself: **Identity → Invite users** → enter your email.
5. Accept the invite email and set a password.

Invite the client the same way when the site is ready to hand off.

---

## Step 3 — Add the Decap CMS Admin UI

Create `public/admin/index.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Content Manager</title>
  </head>
  <body>
    <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
  </body>
</html>
```

Create `public/admin/config.yml` — this defines the CMS collections (see Step 4).

> **Why `public/`?** Next.js serves everything in `public/` as static files. The CMS UI is a
> pure client-side app that talks to Netlify Identity and Git Gateway directly — no Next.js
> involvement needed.

---

## Step 4 — Define CMS Collections

`public/admin/config.yml`:

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: public/uploads
public_folder: /uploads

collections:
  - name: site_config
    label: Site Config
    files:
      - name: config
        label: Site Configuration
        file: content/site-config.json
        format: json
        fields:
          - { label: Business Name, name: businessName, widget: string }
          - { label: Phone, name: phone, widget: string }
          - { label: Email, name: email, widget: string }
          - { label: Address, name: address, widget: string }
          - { label: Tagline, name: tagline, widget: string }

  - name: services
    label: Services
    folder: content/services
    format: json
    create: true
    slug: "{{slug}}"
    fields:
      - { label: Title, name: title, widget: string }
      - { label: Description, name: description, widget: text }
      - { label: Icon, name: icon, widget: string, required: false }
      - { label: Order, name: order, widget: number }

  - name: portfolio
    label: Portfolio
    folder: content/portfolio
    format: json
    create: true
    slug: "{{slug}}"
    fields:
      - { label: Title, name: title, widget: string }
      - { label: Description, name: description, widget: text }
      - { label: Photo, name: photo, widget: image, required: false }
      - { label: Date, name: date, widget: datetime }

  - name: testimonials
    label: Testimonials
    folder: content/testimonials
    format: json
    create: true
    slug: "{{slug}}"
    fields:
      - { label: Name, name: name, widget: string }
      - { label: Quote, name: quote, widget: text }
      - { label: Date, name: date, widget: datetime }

  - name: about
    label: About
    files:
      - name: about
        label: About Section
        file: content/about.json
        format: json
        fields:
          - { label: Body, name: body, widget: markdown }

  - name: sections
    label: Page Sections
    folder: content/sections
    format: json
    create: true
    slug: "{{slug}}"
    fields:
      - { label: Title, name: title, widget: string }
      - { label: Body, name: body, widget: markdown }
      - { label: Order, name: order, widget: number }
```

Adjust field lists by cross-referencing the snapshot files in `notion-snapshots/` and what the
components in `components/` actually read.

---

## Step 5 — Seed Initial Content Files

Convert the current Notion snapshot data into the new file structure. Do this manually by copying
values out of `notion-snapshots/*.json`, or write a one-off migration script.

Expected layout:

```
content/
  site-config.json
  about.json
  services/
    carpentry.json
    roofing.json
    ...
  portfolio/
    job-1.json
    ...
  testimonials/
    testimonial-1.json
    ...
  sections/
    hero.json
    cta.json
    ...
```

Commit these files before testing the CMS so the site has content to display from the start.

---

## Step 6 — Replace the Data Layer

Replace every function in `services/api.ts` with a local file reader. The `fs` module is available
during the Next.js build and in server components/API routes.

```ts
import fs from "fs";
import path from "path";

export function fetchServices(): Service[] {
  const dir = path.join(process.cwd(), "content/services");
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")))
    .sort((a, b) => a.order - b.order);
}

export function fetchSiteConfig(): SiteConfig {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content/site-config.json"), "utf-8")
  );
}

// ... same pattern for portfolio, testimonials, about, sections
```

---

## Step 7 — Remove All Notion Code

Once the data layer is replaced and the site builds cleanly, delete everything Notion-related:

```bash
npm uninstall @notionhq/client
rm notion.config.ts
rm services/snapshot.ts
rm scripts/seed-snapshots.ts
rm -rf notion-snapshots/
rm -rf public/notion-snapshots/
```

Also remove the Notion env vars from Netlify (**Site configuration → Environment variables**) and
from the local `.env` file.

---

## Step 8 — Verify

1. Push to `main`. Netlify should build and deploy successfully.
2. Visit `https://whitwoodcontracting.com/admin` — you should see the Netlify Identity login prompt.
3. Log in with the account you set up in Step 2.
4. Edit a piece of content and click **Publish**. This commits directly to `main`, triggering a
   new Netlify deploy.
5. Confirm the change appears on the live site after the deploy finishes (~1 min).

---

## Content Editing Workflow (for the client)

1. Go to `https://whitwoodcontracting.com/admin`.
2. Log in with email and password (no GitHub account needed).
3. Click the collection to edit (Services, Portfolio, etc.).
4. Make changes and click **Save** (draft) or **Publish** (goes live).
5. Site updates automatically in about a minute.

---

## Notes

- **Images** uploaded through the CMS are stored in `public/uploads/` and committed to the repo.
- **Editorial workflow** (drafts/review before publishing) can be enabled by adding
  `publish_mode: editorial_workflow` to `config.yml`.
- The snapshot fallback system is no longer needed — content lives in the repo and is always
  available at build time.
