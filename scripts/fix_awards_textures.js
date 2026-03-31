import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const BACKUP_DIR = './public/textures/about/backups';
const TARGET_DIR = './public/textures/about';

const SOTD_FILES = [
  'SOTDAYYOUNGMULTICSSWINNER.webp',
  'SOTDAYYOUNGMULTIDESIGNNOMINESS.webp',
  'SOTDAYYOUNGMULTIGSAP.webp',
  'SOTDAYYOUNGMULTIORPETRON.webp'
];

async function fixAwardsToSquarePOT() {
  console.log('Fixing SOTD Awards to Square POT (512x512) for stretching in code...');
  for (const file of SOTD_FILES) {
    const backupPath = path.join(BACKUP_DIR, file);
    const targetPath = path.join(TARGET_DIR, file);

    if (fs.existsSync(backupPath)) {
      console.log(`Processing ${file}...`);
      // Resize to 512x512 with fill (distorting to square so code can stretch it back)
      await sharp(backupPath)
        .resize(512, 512, {
          fit: 'fill'
        })
        .webp({ quality: 90 })
        .toFile(targetPath + '.tmp');
      
      fs.renameSync(targetPath + '.tmp', targetPath);
      console.log(`Updated ${file} to 512x512 (filled)`);
    } else {
      console.error(`Backup not found for ${file}`);
    }
  }
  console.log('SOTD Awards Square fix complete!');
}

fixAwardsToSquarePOT();
