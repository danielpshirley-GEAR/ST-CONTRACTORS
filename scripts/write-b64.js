const fs = require('fs');
const [,, target, b64] = process.argv;
fs.writeFileSync(target, Buffer.from(b64, 'base64').toString('utf-8'), 'utf-8');
console.log('Wrote', target);