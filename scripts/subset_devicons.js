/**
 * Subset Devicon CSS to include ONLY the 29 icons actively used on the site.
 * Eliminates 17+ KiB of unused CSS and enforces font-display: swap.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const HTML_FILE = path.join(__dirname, '..', 'index.html');
const OUT_FILE = path.join(__dirname, '..', 'css', 'devicon-subset.css');
const DEVICON_URL = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css';

https.get(DEVICON_URL, (res) => {
  let cssData = '';
  res.on('data', chunk => cssData += chunk);
  res.on('end', () => {
    const html = fs.readFileSync(HTML_FILE, 'utf8');
    const usedMatches = [...html.matchAll(/devicon-([a-zA-Z0-9-]+)/g)].map(m => m[0]);
    const uniqueIcons = [...new Set(usedMatches)];
    console.log(`[Devicon Subset] Found ${uniqueIcons.length} unique icons used in index.html`);

    // Override @font-face with absolute font URLs and font-display: swap
    const fontFace = `@font-face {
  font-family: "devicon";
  src: url("https://cdn.jsdelivr.net/gh/devicons/devicon@latest/fonts/devicon.woff?qd25fp") format("woff"),
       url("https://cdn.jsdelivr.net/gh/devicons/devicon@latest/fonts/devicon.ttf?qd25fp") format("truetype");
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}\n`;

    const baseClassRule = `[class^="devicon-"],[class*=" devicon-"] {
  font-family: 'devicon' !important;
  speak: never;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}\n`;

    // Extract all rules that define each used icon
    let subsetRules = '';
    uniqueIcons.forEach(iconName => {
      // Matches .devicon-python-plain:before{content:"..."} or .devicon-python-plain.colored{color:...}
      const regex = new RegExp(`\\.${iconName}[^{]*\\{[^}]+\\}`, 'g');
      const matches = cssData.match(regex);
      if (matches) {
        subsetRules += matches.join('\n') + '\n';
      }
    });

    const finalCss = fontFace + baseClassRule + subsetRules;
    fs.writeFileSync(OUT_FILE, finalCss, 'utf8');
    console.log(`[Devicon Subset] Successfully created ${OUT_FILE} (${finalCss.length} bytes, original was ${cssData.length} bytes)`);
  });
}).on('error', err => {
  console.error('[Devicon Subset] Error fetching Devicon CSS:', err);
});
