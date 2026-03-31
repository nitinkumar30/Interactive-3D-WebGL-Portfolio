import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ROOT_DIRS = ['./public/textures', './public/images'];

function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

async function scan(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      await scan(fullPath);
    } else if (file.match(/\.(webp|jpg|jpeg|png)$/i)) {
      try {
        const metadata = await sharp(fullPath).metadata();
        const { width, height } = metadata;
        if (!isPowerOfTwo(width) || !isPowerOfTwo(height)) {
          console.log(`NPOT: ${fullPath} - ${width}x${height}`);
        }
      } catch (err) {
        // console.error(`Error processing ${fullPath}: ${err.message}`);
      }
    }
  }
}

async function run() {
  console.log('Scanning for NPOT textures/images...');
  for (const dir of ROOT_DIRS) {
    await scan(dir);
  }
}

run();
