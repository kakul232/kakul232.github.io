/**
 * Kakul Sarma Portfolio - Verified Publications & Technical Articles Synchronizer
 * Fetches live verified publications directly from CERN Zenodo (via ORCID 0009-0004-4327-501X)
 * and optional external feeds. Writes verified data to assets/data/articles.json.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ARTICLES_FILE = path.join(__dirname, '..', 'assets', 'data', 'articles.json');
const ORCID_ID = process.env.ORCID_ID || '0009-0004-4327-501X';
const ZENODO_API_URL = `https://zenodo.org/api/records?q=metadata.creators.person_or_org.identifiers.identifier:%22${ORCID_ID}%22&sort=mostrecent`;
const FEED_URL = process.env.LINKEDIN_FEED_URL || process.env.ARTICLES_RSS_URL || '';

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'KakulSarma-Portfolio-Sync/1.0',
        'Accept': 'application/json'
      }
    }, (res) => {
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

function formatDate(dateStr) {
  if (!dateStr) return 'Recent';
  const parts = dateStr.split('-');
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  if (parts.length >= 2) {
    const month = months[parseInt(parts[1], 10) - 1] || '';
    return `${month} ${parts[0]}`.trim();
  }
  return dateStr;
}

async function fetchZenodoPublications() {
  console.log(`[Sync Articles] Fetching Zenodo publications for ORCID: ${ORCID_ID}...`);
  try {
    const data = await fetchJson(ZENODO_API_URL);
    const hits = (data.hits && data.hits.hits) || [];
    console.log(`[Sync Articles] Found ${hits.length} publication(s) on Zenodo.`);

    return hits.map((hit, index) => {
      const meta = hit.metadata || {};
      const desc = (meta.description || '').replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
      const snippet = desc.length > 200 ? desc.substring(0, 197) + '...' : desc;
      const tag = (meta.keywords && meta.keywords[0]) || (meta.resource_type && meta.resource_type.title) || 'Research Publication';

      return {
        id: `zenodo-${hit.id || (index + 1)}`,
        title: meta.title || 'Untitled Publication',
        snippet: snippet,
        tag: tag,
        readTime: hit.doi ? `DOI: ${hit.doi}` : 'Technical Report',
        date: formatDate(meta.publication_date),
        url: hit.doi_url || (hit.doi ? `https://doi.org/${hit.doi}` : (hit.links && hit.links.self_html) || 'https://zenodo.org')
      };
    });
  } catch (err) {
    console.warn('[Sync Articles] Zenodo fetch error:', err.message);
    return [];
  }
}

async function fetchFeedArticles() {
  if (!FEED_URL) return [];
  console.log(`[Sync Articles] Fetching external feed from: ${FEED_URL}`);
  try {
    const parsed = await fetchJson(FEED_URL);
    const items = (parsed.items || parsed.articles || []).slice(0, 6);
    return items.map((item, index) => ({
      id: `feed-${index + 1}`,
      title: item.title || 'Untitled Article',
      snippet: (item.description || item.snippet || item.content || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').substring(0, 180) + '...',
      tag: item.category || item.tag || 'Architecture',
      readTime: item.readTime || '6 min read',
      date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recent',
      url: item.link || item.url || 'https://www.linkedin.com/in/kakulsarma/'
    }));
  } catch (err) {
    console.warn('[Sync Articles] External feed fetch failed:', err.message);
    return [];
  }
}

async function syncArticles() {
  console.log('[Sync Articles] Starting live publication synchronization...');

  const zenodoPublications = await fetchZenodoPublications();
  const feedArticles = await fetchFeedArticles();

  const combined = [...zenodoPublications, ...feedArticles];

  if (combined.length === 0) {
    console.log('[Sync Articles] No remote records found. Preserving current dataset without creating dummy data.');
    return;
  }

  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(combined, null, 2), 'utf8');
  console.log(`[Sync Articles] Successfully wrote ${combined.length} verified publication(s) to ${ARTICLES_FILE}`);
}

if (require.main === module) {
  syncArticles().catch(err => {
    console.error('[Sync Articles] Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { syncArticles };
