const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'index.html');
const criticalPath = path.join(__dirname, '..', 'css', 'critical.min.css');

let html = fs.readFileSync(htmlPath, 'utf8');
const criticalCss = fs.readFileSync(criticalPath, 'utf8');

const targetStr = '  <!-- Main Minified Stylesheet (Material Design 3 Revamped) -->\n  <link rel="stylesheet" href="css/style.min.css?v=7.0">';

const replacementStr = `  <!-- Critical Above-the-Fold Styles (Inlined for 0ms Render Blocking) -->
  <style id="critical-css">${criticalCss}</style>

  <!-- Complete Stylesheet (Asynchronously Preloaded) -->
  <link rel="preload" as="style" href="css/style.min.css?v=7.1">
  <link rel="stylesheet" href="css/style.min.css?v=7.1" media="print" onload="this.media='all'">
  <noscript>
    <link rel="stylesheet" href="css/style.min.css?v=7.1">
  </noscript>`;

if (!html.includes(targetStr)) {
  console.error('Target string not found in index.html');
  process.exit(1);
}

html = html.replace(targetStr, replacementStr);
fs.writeFileSync(htmlPath, html, 'utf8');
console.log('Successfully injected critical CSS into index.html!');
