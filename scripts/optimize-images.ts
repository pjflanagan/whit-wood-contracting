import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const TARGET_DIRS = [
  path.join(process.cwd(), 'public', 'uploads'),
  path.join(process.cwd(), 'public', 'img'),
];
const MAX_WIDTH = 2000;
const QUALITY = 80;

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

      console.log(`Processing ${file} (${(originalSize / 1024).toFixed(2)} KB)...`);

      const image = sharp(filePath);
      const metadata = await image.metadata();

      let pipeline = image;

      if (metadata.width && metadata.width > MAX_WIDTH) {
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
      
      if (buffer.length < originalSize) {
        await fs.writeFile(filePath, buffer);
        console.log(`Optimized ${file}: ${(originalSize / 1024).toFixed(2)} KB -> ${(buffer.length / 1024).toFixed(2)} KB`);
      } else {
        console.log(`Skipped ${file}: optimization did not reduce file size`);
      }
    }
  } catch (error) {
    console.error('Error optimizing images:', error);
  }
}

optimizeImages();
