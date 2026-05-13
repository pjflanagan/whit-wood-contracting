# How to Use Decap CMS Without Triggering a Rebuild Every Time

If you've set up [Decap CMS](https://decapcms.org) with Netlify, you've probably noticed the default workflow: editor saves content → commit goes to GitHub → Netlify rebuilds the entire site → live in ~60 seconds. For a small site that's fine, but it has a few real annoyances:

- Every content edit burns a Netlify build minute
- The client has to wait a minute to see their change go live
- Your build count goes up every time someone fixes a typo

There's a cleaner approach: **store content in a public GitHub repo and fetch it at runtime**. The CMS still commits to GitHub, but instead of the site reading those files at build time, it reads them on every request via GitHub's raw content URL. No rebuild needed.

This post walks through how to set it up.

---

## The Core Idea

The default Decap CMS + Next.js setup reads content from the filesystem during the build:

```ts
// reads at build time — requires a rebuild to pick up changes
const data = JSON.parse(fs.readFileSync("content/site-config.json", "utf-8"));
```

The no-rebuild version reads from GitHub's raw content API at request time:

```ts
// reads at runtime — always gets the latest commit
const res = await fetch(
  "https://raw.githubusercontent.com/YOUR_ORG/YOUR_REPO/main/content/site-config.json"
);
const data = await res.json();
```

GitHub serves raw file contents publicly (with no auth) as long as the repo is public. The URL is always the latest version on the branch you specify. Change the file via the CMS, and the next request to your site gets the new content automatically.

---

## Step 1 — Make the Repo Public

For GitHub raw content to be accessible without a token, **the repository must be public**.

If your repo is currently private:

1. Go to your repo on GitHub → **Settings → Danger Zone → Change repository visibility**.
2. Set it to **Public**.

> **Is this safe?** For a typical contractor or small business site, yes. The content (services, testimonials, portfolio photos) is information you *want* the public to see. The only things that should never be in a public repo are secrets — API keys, tokens, passwords. Those belong in environment variables, never committed to the repo. If you have any `.env` files committed, remove them and rotate the secrets before making the repo public.

---

## Step 2 — Confirm Your Content Path

After making the repo public, test that a raw URL works. The format is:

```
https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path-to-file}
```

For example:

```
https://raw.githubusercontent.com/pflanagan/whit-wood-contracting/main/content/site-config.json
```

Open that URL in your browser. You should see the raw JSON. If you get a 404, check that the file exists at that path on the `main` branch.

---

## Step 3 — Replace Filesystem Reads With Fetch Calls

Anywhere you're currently using `fs.readFileSync` to load content, replace it with a `fetch` to the raw GitHub URL.

Before:

```ts
import fs from "fs";
import path from "path";

export function fetchSiteConfig(): SiteConfig {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "content/site-config.json"), "utf-8")
  );
}
```

After:

```ts
const REPO = "https://raw.githubusercontent.com/YOUR_ORG/YOUR_REPO/main";

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const res = await fetch(`${REPO}/content/site-config.json`, {
    next: { revalidate: 60 }, // Next.js: re-fetch at most once per minute
  });
  if (!res.ok) throw new Error(`Failed to fetch site config: ${res.status}`);
  return res.json();
}
```

Do the same for every content type — services, portfolio, testimonials, etc.

The `next: { revalidate: 60 }` option tells Next.js to cache the response for 60 seconds and then re-fetch in the background. You can tune this — lower values mean faster content updates, higher values mean fewer outbound requests. For a small business site, 60 seconds is a reasonable middle ground.

---

## Step 4 — Handle Collections (Multiple Files)

For collections stored as individual files in a folder (e.g. `content/services/*.json`), you can't just fetch a directory listing from the raw URL — GitHub's raw content host doesn't support that. You have two options:

**Option A: Fetch a manifest file.**

Keep an index file that lists all items in the collection. The CMS doesn't manage this automatically, but you can maintain it manually or generate it as part of your build.

```
content/
  services/
    carpentry.json
    roofing.json
    painting.json
  services-index.json   ← ["carpentry", "roofing", "painting"]
```

```ts
export async function fetchServices(): Promise<Service[]> {
  const index: string[] = await fetch(`${REPO}/content/services-index.json`).then(r => r.json());
  const items = await Promise.all(
    index.map(slug =>
      fetch(`${REPO}/content/services/${slug}.json`).then(r => r.json())
    )
  );
  return items.sort((a, b) => a.order - b.order);
}
```

**Option B: Use the GitHub Contents API.**

GitHub's REST API can list directory contents. It works without auth for public repos, though it has a lower rate limit (60 requests/hour per IP unauthenticated, 5000/hour with a token).

```ts
export async function fetchServices(): Promise<Service[]> {
  const dir = await fetch(
    "https://api.github.com/repos/YOUR_ORG/YOUR_REPO/contents/content/services",
    { next: { revalidate: 60 } }
  ).then(r => r.json());

  const files = (dir as { name: string; download_url: string }[])
    .filter(f => f.name.endsWith(".json"));

  const items = await Promise.all(
    files.map(f => fetch(f.download_url).then(r => r.json()))
  );

  return items.sort((a, b) => a.order - b.order);
}
```

For a low-traffic small business site, 60 unauthenticated requests/hour per visitor IP is fine. If you want to be safe, add a `GITHUB_TOKEN` environment variable and pass it as a `Authorization: Bearer` header — this bumps the limit to 5000/hour.

---

## Step 5 — Disable or Ignore Build Triggers (Optional)

By default, Netlify rebuilds on every push to `main`. Since your content updates are now just data file commits, you might not want those to trigger a rebuild at all.

In Netlify: **Site configuration → Build & deploy → Continuous deployment → Branch deploys** — you can configure ignored build paths.

Or add a `netlify.toml` at the project root:

```toml
[build]
  ignore = "git diff --quiet HEAD^ HEAD -- . ':!content/'"
```

This tells Netlify to skip the build if the only files that changed are inside `content/`. Code changes still rebuild; content-only commits do not.

---

## Step 6 — Verify End-to-End

1. Open the CMS at `/admin` and edit a piece of content.
2. Click **Publish**. The CMS commits the change to GitHub.
3. Wait a few seconds, then reload the live site. The change should appear within your `revalidate` window (60 seconds if you used the setting above) — **without a Netlify build running**.
4. Check the Netlify dashboard — if you set up the ignored build path, no build should have been triggered.

---

## Trade-offs to Know About

**Slightly slower first load (cold cache).** When the Next.js cache expires and re-fetches from GitHub, there's a small latency hit vs. reading a local file. For a static-looking site with a 60-second revalidation window, visitors almost never hit this.

**GitHub rate limits.** Unauthenticated raw content requests are generous but not unlimited. For a low-traffic site this is a non-issue. Add a `GITHUB_TOKEN` env var if you want headroom.

**Public repo means public history.** Anyone can see every commit, including past content. If you ever committed sensitive data, scrub it before going public.

**The CMS still needs Git Gateway.** The no-rebuild change only affects how the *site* reads content. The CMS still writes via Netlify Identity + Git Gateway. That config in `config.yml` stays the same.

---

## Summary

| | Default (build-time) | No-rebuild (runtime fetch) |
|---|---|---|
| Content update speed | ~60 seconds | ~60 seconds (revalidate window) |
| Netlify build triggered | Yes, every save | No (with ignored paths) |
| Build minutes used | Yes | No |
| Requires public repo | No | Yes |
| Setup complexity | Low | Low–medium |

For a small business site where the content and codebase are both meant to be public, the runtime fetch approach is strictly better: faster visible updates for the client, no wasted build minutes, and the CMS workflow stays exactly the same.
