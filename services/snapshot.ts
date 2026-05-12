import fs from 'fs';
import path from 'path';

const SNAPSHOT_DIR = path.join(process.cwd(), 'notion-snapshots');
const IMAGE_DIR = path.join(process.cwd(), 'public', 'notion-snapshots');

export function readSnapshot<T>(key: string): T | null {
  try {
    const raw = fs.readFileSync(path.join(SNAPSHOT_DIR, `${key}.json`), 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeSnapshot<T>(key: string, data: T): void {
  try {
    fs.mkdirSync(SNAPSHOT_DIR, { recursive: true });
    fs.writeFileSync(
      path.join(SNAPSHOT_DIR, `${key}.json`),
      JSON.stringify(data, null, 2),
      'utf-8',
    );
  } catch {
    // best-effort — don't break the response if snapshot write fails
  }
}

export async function downloadImage(url: string, key: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') ?? '';
    const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(IMAGE_DIR, `${key}.${ext}`), buffer);
    return `/notion-snapshots/${key}.${ext}`;
  } catch {
    return null;
  }
}
