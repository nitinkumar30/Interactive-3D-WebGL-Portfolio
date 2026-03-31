import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const TARGET_DIR = './public/textures/entrance';
const BACKUP_DIR = './public/textures/entrance/backups';

const FILES_TO_FIX = [
  'wall_bricks_2.webp',
  'sign.webp',
  'pot_with_duck.webp',
  'tree_sketch.webp'
];

function getNextPowerOfTwo(n) {
  const pots = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];
  for (let p of pots) {
    if (p >= n) return p;
  }
  return 8192; // Max fallback
}

async function fix() {
  for (const file of FILES_TO_FIX) {
    const originalPath = path.join(BACKUP_DIR, file);
    const targetPath = path.join(TARGET_DIR, file);

    if (!fs.existsSync(originalPath)) {
      console.log(`Original for ${file} not found in backups!`);
      continue;
    }

    try {
      const inputBuffer = fs.readFileSync(originalPath);
      const metadata = await sharp(inputBuffer).metadata();
      const { width, height } = metadata;

      const newWidth = getNextPowerOfTwo(width);
      const newHeight = getNextPowerOfTwo(height);

      console.log(`Quality Fix ${file}: ${width}x${height} -> ${newWidth}x${newHeight} (Q100)`);
      
      await sharp(inputBuffer)
        .resize(newWidth, newHeight, { fit: 'fill' })
        .webp({ quality: 100, lossless: false }) // 100 quality lossy is usually great
        .toFile(targetPath + '.tmp_q.webp');
        
      fs.renameSync(targetPath + '.tmp_q.webp', targetPath);
      console.log(`Success: ${file}`);
    } catch (e) {
      console.error(`Error with ${file}: ${e.message}`);
    }
  }
}

fix().then(() => console.log('Quality Fix complete!'));
