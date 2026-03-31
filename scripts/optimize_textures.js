import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const TARGET_DIR = './public/textures/entrance';
const BACKUP_DIR = './public/textures/entrance/backups';

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function getNearestPowerOfTwo(n) {
  const pot = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];
  let nearest = pot[0];
  let minDiff = Math.abs(n - nearest);
  for (let p of pot) {
    if (Math.abs(n - p) < minDiff) {
      minDiff = Math.abs(n - p);
      nearest = p;
    }
  }
  return nearest;
}

function isPowerOfTwo(n) {
  return n > 0 && (n & (n - 1)) === 0;
}

async function optimize() {
  const files = fs.readdirSync(TARGET_DIR);

  for (const file of files) {
    const fullPath = path.join(TARGET_DIR, file);
    const stats = fs.statSync(fullPath);

    if (stats.isFile() && file.match(/\.(webp|jpg|jpeg|png)$/i)) {
      try {
        const image = sharp(fullPath);
        const metadata = await image.metadata();
        const { width, height } = metadata;

        if (!isPowerOfTwo(width) || !isPowerOfTwo(height)) {
          const newWidth = getNearestPowerOfTwo(width);
          const newHeight = getNearestPowerOfTwo(height);

          console.log(`Optimizing ${file}: ${width}x${height} -> ${newWidth}x${newHeight}`);

          // Backup original
          const backupPath = path.join(BACKUP_DIR, file);
          if (!fs.existsSync(backupPath)) {
            fs.copyFileSync(fullPath, backupPath);
          }

          // Resize
          const buffer = await sharp(backupPath)
            .resize(newWidth, newHeight, { fit: 'fill' })
            .toBuffer();
          
          fs.writeFileSync(fullPath, buffer);
          console.log(`Done: ${file}`);
        } else {
          console.log(`Skipping ${file} (already POT): ${width}x${height}`);
        }
      } catch (err) {
        console.error(`Error processing ${file}: ${err.message}`);
      }
    }
  }
}

optimize().then(() => console.log('Optimization complete.'));
