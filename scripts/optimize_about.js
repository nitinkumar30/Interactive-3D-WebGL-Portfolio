import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const TARGET_DIR = './public/textures/about';
const BACKUP_DIR = './public/textures/about/backups';

if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function getDownscalePowerOfTwo(n) {
  const pots = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192];
  // Find the largest POT such that p <= n
  let best = pots[0];
  for (let p of pots) {
    if (p <= n) best = p;
    else break;
  }
  return best;
}

async function optimize() {
  const files = fs.readdirSync(TARGET_DIR).filter(f => f.match(/\.(webp|jpg|jpeg|png)$/i));
  console.log(`Optimizing ${files.length} files in About directory (Downgrade Strategy)...`);

  for (const file of files) {
    const fullPath = path.join(TARGET_DIR, file);
    const backupPath = path.join(BACKUP_DIR, file);

    try {
      const inputBuffer = fs.readFileSync(fullPath);
      const metadata = await sharp(inputBuffer).metadata();
      const { width, height } = metadata;

      const newWidth = getDownscalePowerOfTwo(width);
      const newHeight = getDownscalePowerOfTwo(height);

      if (newWidth !== width || newHeight !== height) {
        console.log(`Downgrading ${file}: ${width}x${height} -> ${newWidth}x${newHeight}`);
        
        // Backup
        if (!fs.existsSync(backupPath)) {
          fs.copyFileSync(fullPath, backupPath);
        }

        const tmpPath = fullPath + '.tmp_downgrade.webp';
        await sharp(inputBuffer)
          .resize(newWidth, newHeight, { fit: 'fill' })
          .webp({ quality: 85 })
          .toFile(tmpPath);
          
        fs.renameSync(tmpPath, fullPath);
        console.log(`Success: ${file}`);
      } else {
        console.log(`Skipping ${file} - Already POT: ${width}x${height}`);
      }
    } catch (e) {
      console.error(`Error with ${file}: ${e.message}`);
    }
  }
}

optimize().then(() => console.log('About Optimization complete!'));
