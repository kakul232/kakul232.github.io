/**
 * Kakul Sarma Portfolio - Credly Verified Badges Synchronizer
 * Fetches live verified badges from Credly Public API and writes to assets/data/badges.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const BADGES_FILE = path.join(__dirname, '..', 'assets', 'data', 'badges.json');
const CREDLY_USER_ID = 'kakul-sarma.a09a1b12';
const CREDLY_API_URL = `https://www.credly.com/users/${CREDLY_USER_ID}/badges.json`;

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function categorizeBadge(name, skills = []) {
  const text = (name + ' ' + skills.join(' ')).toLowerCase();
  if (text.includes('claude') || text.includes('watsonx') || text.includes('agentic') || text.includes('generative ai') || text.includes('rag') || text.includes('vector search') || text.includes('security for ai') || text.includes('artificial intelligence')) {
    return 'ai';
  }
  if (text.includes('javascript') || text.includes('cloud') || text.includes('aws') || text.includes('digital product') || text.includes('delivery central')) {
    return 'cloud';
  }
  return 'enterprise';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = months[parseInt(month, 10) - 1] || '';
  return `${monthName} ${year}`;
}

async function syncBadges() {
  console.log(`[Sync Badges] Fetching Credly badges for user: ${CREDLY_USER_ID}...`);
  const response = await fetchJson(CREDLY_API_URL);

  if (!response || !response.data || !Array.isArray(response.data)) {
    throw new Error('Invalid response structure from Credly API');
  }

  const rawBadges = response.data;
  console.log(`[Sync Badges] Successfully fetched ${rawBadges.length} badges from Credly.`);

  const badges = rawBadges.map((item) => {
    const template = item.badge_template || {};
    const issuer = template.issuer?.entities?.[0]?.entity?.name || 'IBM';
    const skills = (template.skills || []).map(s => s.name);
    const category = categorizeBadge(template.name || '', skills);

    return {
      id: item.id,
      title: template.name || 'Verified Badge',
      description: template.description || '',
      issuer: issuer,
      issuedDate: formatDate(item.issued_at_date),
      rawDate: item.issued_at_date || '',
      imageUrl: template.image_url || template.image?.url || '',
      credlyUrl: `https://www.credly.com/badges/${item.id}`,
      category: category,
      skills: skills.slice(0, 5)
    };
  });

  // Sort latest first
  badges.sort((a, b) => (b.rawDate || '').localeCompare(a.rawDate || ''));

  fs.writeFileSync(BADGES_FILE, JSON.stringify(badges, null, 2), 'utf8');
  console.log(`[Sync Badges] Wrote ${badges.length} verified badges to ${BADGES_FILE}`);
  return badges;
}

if (require.main === module) {
  syncBadges().catch(err => {
    console.error('[Sync Badges] Error:', err);
    process.exit(1);
  });
}

module.exports = { syncBadges };
