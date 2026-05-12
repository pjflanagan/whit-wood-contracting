import fs from 'fs';
import path from 'path';

const SNAPSHOT_DIR = path.join(process.cwd(), 'notion-snapshots');

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
