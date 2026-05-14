const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'app', 'services');
const newIp = '10.221.130.161';

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/localhost/g, newIp);
    fs.writeFileSync(filePath, content, 'utf8');
}

['product.ts', 'seller.ts', 'user.ts', 'ai.ts'].forEach(file => {
    const fullPath = path.join(directoryPath, file);
    if (fs.existsSync(fullPath)) {
        replaceInFile(fullPath);
    }
});

// Also replace in server.ts if needed for logging, though not strictly required
const serverPath = path.join(__dirname, 'src', 'server.ts');
if (fs.existsSync(serverPath)) {
    replaceInFile(serverPath);
}

console.log('Successfully replaced localhost with ' + newIp);
