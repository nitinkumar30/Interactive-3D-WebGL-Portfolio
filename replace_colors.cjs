const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src/components/canvas');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Split by <meshBasicMaterial and reconstruct
    const parts = content.split('<meshBasicMaterial');
    let newContent = parts[0];
    
    for (let i = 1; i < parts.length; i++) {
        let part = parts[i];
        let closeIndex = part.indexOf('>');
        
        if (closeIndex !== -1) {
            let tagProps = part.substring(0, closeIndex);
            
            if (tagProps.includes('color=')) {
                // simple replacement of white colors
                tagProps = tagProps.replace(/color=["']#(ffffff|fffaf0)["']/gi, 'color="#c0c0c0"')
                                   .replace(/color=["']white["']/gi, 'color="#c0c0c0"');
                newContent += '<meshBasicMaterial' + tagProps + part.substring(closeIndex);
            } else {
                newContent += '<meshBasicMaterial color="#c0c0c0"' + tagProps + part.substring(closeIndex);
            }
        } else {
            // Malformed
            newContent += '<meshBasicMaterial' + part;
        }
    }
    
    // Now handle new THREE.MeshBasicMaterial
    const threeParts = newContent.split('new THREE.MeshBasicMaterial(');
    let finalContent = threeParts[0];
    
    for(let i = 1; i < threeParts.length; i++) {
        let part = threeParts[i];
        let closeIndex = part.indexOf(')');
        
        if (closeIndex !== -1) {
            let props = part.substring(0, closeIndex);
            if (props.includes('color:')) {
                props = props.replace(/color:\s*['"]#(ffffff|fffaf0)['"]/gi, "color: '#c0c0c0'")
                             .replace(/color:\s*['"]white['"]/gi, "color: '#c0c0c0'");
                finalContent += 'new THREE.MeshBasicMaterial(' + props + part.substring(closeIndex);
            } else {
                // If it's empty e.g. () or object {} 
                if (props.trim() === '{}') {
                    finalContent += "new THREE.MeshBasicMaterial({ color: '#c0c0c0' })" + part.substring(closeIndex + 1);
                } else if (props.includes('{')) {
                    // insert right after {
                    props = props.replace('{', "{ color: '#c0c0c0', ");
                    finalContent += 'new THREE.MeshBasicMaterial(' + props + part.substring(closeIndex);
                } else if (props.trim() === '') {
                    finalContent += "new THREE.MeshBasicMaterial({ color: '#c0c0c0'})" + part.substring(closeIndex);
                } else {
                     finalContent += 'new THREE.MeshBasicMaterial(' + part;
                }
            }
        } else {
            finalContent += 'new THREE.MeshBasicMaterial(' + part;
        }
    }

    if (original !== finalContent) {
        fs.writeFileSync(file, finalContent, 'utf8');
        console.log('Tinted:', file);
    }
});
console.log('Done!');
