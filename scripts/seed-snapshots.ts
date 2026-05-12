import fs from 'fs';
import path from 'path';

// Suppress the Notion SDK's internal warn logs — our own error output is enough
console.warn = () => {};
import {
  fetchServices,
  fetchPortfolio,
  fetchTestimonials,
  fetchAbout,
  fetchSiteImages,
  fetchSocialLinks,
  fetchSections,
  fetchSiteConfig,
} from '../services/api';

const SNAPSHOT_DIR = path.join(process.cwd(), 'notion-snapshots');

const RETRIES = 3;
const RETRY_DELAY_MS = 3000;

function snapshotMtime(key: string): number {
  try {
    return fs.statSync(path.join(SNAPSHOT_DIR, `${key}.json`)).mtimeMs;
  } catch {
    return 0;
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const fetchers: [string, string, () => Promise<unknown>][] = [
  ['services',              'services',    fetchServices],
  ['portfolio',             'portfolio',   fetchPortfolio],
  ['testimonials',          'testimonials', fetchTestimonials],
  ['about',                 'about',       fetchAbout],
  ['site-images',           'site-images-local', fetchSiteImages],
  ['social-links',          'social-links', fetchSocialLinks],
  ['sections',              'sections',    fetchSections],
  ['site-config',           'site-config', fetchSiteConfig],
];

(async () => {
  console.log('Seeding Notion snapshots...\n');

  let written = 0;
  let failed = 0;

  for (const [name, snapshotKey, fn] of fetchers) {
    let succeeded = false;
    for (let attempt = 1; attempt <= RETRIES; attempt++) {
      const before = snapshotMtime(snapshotKey);
      await fn();
      const after = snapshotMtime(snapshotKey);
      if (after > before) {
        console.log(`  ✓ ${name}`);
        written++;
        succeeded = true;
        break;
      }
      if (attempt < RETRIES) {
        process.stdout.write(`  ~ ${name}: Notion unavailable, retrying in ${RETRY_DELAY_MS / 1000}s...\r`);
        await sleep(RETRY_DELAY_MS);
      }
    }
    if (!succeeded) {
      console.log(`  ✗ ${name}: Notion unavailable after ${RETRIES} attempts — snapshot not updated`);
      failed++;
    }
  }

  console.log(`\n${written} written, ${failed} failed.`);
  if (written > 0) {
    console.log('Commit the files in notion-snapshots/ and public/notion-snapshots/');
  }
  if (failed > 0) {
    console.log('Re-run when Notion is stable to seed the remaining snapshots.');
  }
})();
