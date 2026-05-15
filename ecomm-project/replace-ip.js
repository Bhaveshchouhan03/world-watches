const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Auto-detect current IP address
function getLocalIp() {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

const currentIp = getLocalIp();
const apiUrl = `http://${currentIp}:5000`;

// Update environment.ts for development (LAN access)
const envPath = path.join(__dirname, 'src', 'environments', 'environment.ts');
const envContent = `// Development environment - auto-generated for LAN access
export const environment = {
  production: false,
  apiUrl: '${apiUrl}'
};
`;

fs.writeFileSync(envPath, envContent, 'utf8');
console.log(`✅ Updated environment.ts with API URL: ${apiUrl}`);
console.log(`📱 Other devices can access your app at: http://${currentIp}:4200`);
console.log(`🖥️  Backend running at: ${apiUrl}`);
