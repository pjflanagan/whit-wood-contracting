import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const TARGET_DIRS = [
  path.join(process.cwd(), 'public', 'uploads'),
  path.join(process.cwd(), 'public', 'img'),
];
const MAX_WIDTH = 2000;
const QUALITY = 80;
const MIN_SIZE_KB = 100;
const MIN_REDUCTION_THRESHOLD = 0.95; // Must reduce size by at least 5%

async function walk(dir: string): Promise<string[]> {
  const files = await fs.readdir(dir);
  const paths = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(dir, file);
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        return walk(filePath);
      }
      return filePath;
    })
  );
  return paths.flat();
}

async function optimizeImages() {
  try {
    let allFiles: string[] = [];
    for (const dir of TARGET_DIRS) {
      try {
        const files = await walk(dir);
        allFiles = allFiles.concat(files);
      } catch (e) {
        console.warn(`Directory not found or inaccessible: ${dir}`);
      }
    }
    
    for (const filePath of allFiles) {
      const file = path.basename(filePath);
      const ext = path.extname(file).toLowerCase();
      
      if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        continue;
      }

      const stats = await fs.stat(filePath);
      const originalSize = stats.size;

      const image = sharp(filePath);
      const metadata = await image.metadata();

      const needsResize = !!(metadata.width && metadata.width > MAX_WIDTH);
      const isLargeEnough = originalSize > MIN_SIZE_KB * 1024;

      if (!needsResize && !isLargeEnough) {
        console.log(`Skipping ${file}: already small (${(originalSize / 1024).toFixed(2)} KB) and within dimensions.`);
        continue;
      }

      console.log(`Processing ${file} (${(originalSize / 1024).toFixed(2)} KB)...`);

      let pipeline = image;

      if (needsResize) {
        pipeline = pipeline.resize(MAX_WIDTH);
      }

      if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg({ quality: QUALITY, mozjpeg: true });
      } else if (ext === '.png') {
        pipeline = pipeline.png({ quality: QUALITY, palette: true });
      } else if (ext === '.webp') {
        pipeline = pipeline.webp({ quality: QUALITY });
      }

      const buffer = await pipeline.toBuffer();
      
      if (buffer.length < originalSize * MIN_REDUCTION_THRESHOLD) {
        await fs.writeFile(filePath, buffer);
        console.log(`Optimized ${file}: ${(originalSize / 1024).toFixed(2)} KB -> ${(buffer.length / 1024).toFixed(2)} KB`);
      } else if (buffer.length < originalSize) {
        console.log(`Skipped ${file}: reduction was not significant enough to justify re-compression`);
      } else {
        console.log(`Skipped ${file}: optimization did not reduce file size`);
      }
    }
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages();
