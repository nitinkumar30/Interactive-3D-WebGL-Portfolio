const fs = require('fs');
const path = require('path');

const targetTint = '"#e0e0e0"'; // Softer, brighter gray (was #c0c0c0)
const oldTint = '"#c0c0c0"'; // Too intense gray that user applied
const pureWhite = '"#ffffff"';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        let filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(filePath));
        } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.cjs')) {
            results.push(filePath);
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src', 'components', 'canvas'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // 1. Process <meshBasicMaterial> and <revealMaterial>
    content = content.replace(/<(meshBasicMaterial|revealMaterial)([^>]*?)>/g, (match, tag, attrs) => {
        let newAttrs = attrs;

        if (newAttrs.includes('color=' + oldTint)) {
            newAttrs = newAttrs.replace('color=' + oldTint, 'color=' + targetTint);
            modified = true;
        } 
        else if (newAttrs.includes('color=' + pureWhite)) {
            newAttrs = newAttrs.replace('color=' + pureWhite, 'color=' + targetTint);
            modified = true;
        }
        else if (!newAttrs.includes('color=')) {
            newAttrs = ' color=' + targetTint + newAttrs;
            modified = true;
        }

        if (attrs !== newAttrs) {
            return `<${tag}${newAttrs}>`;
        }
        return match;
    });

    // 2. Process JS object constructors new THREE.MeshBasicMaterial(...)
    content = content.replace(/new THREE\.MeshBasicMaterial\(\s*\{([\s\S]*?)\}\s*\)/g, (match, props) => {
        let newProps = props;
        
        if (newProps.includes("color: '#c0c0c0'") || newProps.includes('color: "#c0c0c0"')) {
            newProps = newProps.replace(/color:\s*['"]#c0c0c0['"]/g, `color: ${targetTint.replace(/"/g,"'")}`);
            modified = true;
        }
        else if (newProps.includes("color: '#ffffff'") || newProps.includes('color: "#ffffff"')) {
            newProps = newProps.replace(/color:\s*['"]#ffffff['"]/g, `color: ${targetTint.replace(/"/g,"'")}`);
            modified = true;
        }
        else if (!newProps.includes('color:')) {
            newProps = `color: ${targetTint.replace(/"/g,"'")}, ` + newProps;
            modified = true;
        }

        if (props !== newProps) {
            return `new THREE.MeshBasicMaterial({ ${newProps.trim()} })`;
        }
        return match;
    });

    if (modified) {
        fs.writeFileSync(file, content);
        console.log('Tinted:', file);
    }
});
