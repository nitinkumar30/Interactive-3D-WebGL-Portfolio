const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const targetDir = './public/textures/gallery';
const potValues = [64, 128, 256, 512, 1024, 2048, 4096];

function getNearestLowerPOT(value) {
    let nearest = potValues[0];
    for (let pot of potValues) {
        if (pot <= value) {
            nearest = pot;
        } else {
            break;
        }
    }
    return nearest;
}

async function optimizeFolder() {
    const files = fs.readdirSync(targetDir).filter(f => f.match(/\.(webp|png|jpg|jpeg)$/i));
    
    for (const file of files) {
        const filePath = path.join(targetDir, file);
        const tempPath = path.join(targetDir, `temp_${file}`);
        
        try {
            const image = sharp(filePath);
            const metadata = await image.metadata();
            
            const newWidth = getNearestLowerPOT(metadata.width);
            const newHeight = getNearestLowerPOT(metadata.height);
            
            console.log(`Optimizing ${file}: ${metadata.width}x${metadata.height} -> ${newWidth}x${newHeight}`);
            
            await sharp(filePath)
                .resize(newWidth, newHeight, {
                    fit: 'fill'
                })
                .webp({ quality: 80 })
                .toFile(tempPath);
            
            fs.unlinkSync(filePath);
            fs.renameSync(tempPath, filePath.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
            
        } catch (err) {
            console.error(`Error processing ${file}:`, err);
        }
    }
}

optimizeFolder();
