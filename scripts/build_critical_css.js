const fs = require('fs');
const path = require('path');

const styleFile = path.join(__dirname, '..', 'css', 'style.css');
const content = fs.readFileSync(styleFile, 'utf8');

const heroEndMatch = content.match(/\/\* ==========================================================================\s+VERIFIED PROFESSIONAL BADGES/);
if (!heroEndMatch) {
  console.error('Could not find Hero section end marker');
  process.exit(1);
}

const criticalRaw = content.substring(0, heroEndMatch.index);
fs.writeFileSync(path.join(__dirname, '..', 'css', 'critical.css'), criticalRaw, 'utf8');
console.log('Saved raw critical CSS, bytes:', criticalRaw.length);
