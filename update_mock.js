const fs = require('fs');
const crypto = require('crypto');

const mockPath = './frontend/lib/data/mock-jamaah.ts';
let content = fs.readFileSync(mockPath, 'utf8');

let count = 0;
// Note: replacing id: '1', id: '2' ... matching `id: 'DD'`
content = content.replace(/id:\s*'(\d+)'/g, (match, p1) => {
    count++;
    return `id: '${crypto.randomUUID()}'`;
});

fs.writeFileSync(mockPath, content);
console.log(`Successfully replaced ${count} mock IDs with UUIDs.`);
