import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const TARGET_DIR = './public/textures/contact';
const BACKUP_DIR = './public/textures/contact/backups';

async function upgrade(file, nextPOTWidth, nextPOTHeight) {
    console.log(`Upgrading ${file} to ${nextPOTWidth}x${nextPOTHeight} for high quality...`);
    const backupPath = path.join(BACKUP_DIR, file);
    const targetPath = path.join(TARGET_DIR, file);

    if (!fs.existsSync(backupPath)) {
        console.error(`Backup not found for ${file}! Cannot upgrade safely.`);
        return;
    }

    try {
        const inputBuffer = fs.readFileSync(backupPath);
        await sharp(inputBuffer)
            .resize(nextPOTWidth, nextPOTHeight, { fit: 'fill' })
            .webp({ quality: 100, lossless: true })
            .toFile(targetPath);
        console.log(`Success: ${file} upgraded.`);
    } catch (e) {
        console.error(`Error upgrading ${file}: ${e.message}`);
    }
}

async function run() {
    // Beczki: Original ~2k. Upgrade to 2048x2048
    await upgrade('beczka.webp', 2048, 2048);
    await upgrade('beczka_painted.webp', 2048, 2048);
    await upgrade('beczka.png', 2048, 2048);
    await upgrade('beczka_painted.png', 2048, 2048);

    // Statek: Original 2525x978. Upgrade to 4096x1024
    await upgrade('statek.webp', 4096, 1024);
}

run();
