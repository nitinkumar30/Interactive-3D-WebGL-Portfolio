import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const TARGET_DIR = './public/textures/entrance';

async function list() {
  const files = fs.readdirSync(TARGET_DIR).filter(f => f.match(/\.(webp|jpg|jpeg|png)$/i));
  for (const file of files) {
    const fullPath = path.join(TARGET_DIR, file);
    try {
      const metadata = await sharp(fullPath).metadata();
      console.log(`${file}: ${metadata.width}x${metadata.height}`);
    } catch (e) {
      console.log(`Error with ${file}: ${e.message}`);
    }
  }
}

list();
