/**
 * Kakul Sarma Portfolio - CERN Zenodo Publications Synchronizer
 * Automatically fetches live verified research publications from CERN Zenodo via ORCID (0009-0004-4327-501X).
 * Writes verified records directly to assets/data/articles.json.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ARTICLES_FILE = path.join(__dirname, '..', 'assets', 'data', 'articles.json');
const ORCID_ID = process.env.ORCID_ID || '0009-0004-4327-501X';
const ZENODO_API_URL = `https://zenodo.org/api/records?q=metadata.creators.person_or_org.identifiers.identifier:%22${ORCID_ID}%22&sort=mostrecent`;

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

async function syncPublications() {
  console.log(`[Sync Publications] Fetching verified Zenodo publications for ORCID: ${ORCID_ID}...`);
  try {
    const data = await fetchJson(ZENODO_API_URL);
    const hits = (data.hits && data.hits.hits) || [];
    console.log(`[Sync Publications] Found ${hits.length} publication(s) on CERN Zenodo.`);

    if (hits.length === 0) {
      console.log('[Sync Publications] No publications found. Preserving current dataset without creating dummy data.');
      return [];
    }

    const publications = hits.map((hit, index) => {
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

    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(publications, null, 2), 'utf8');
    console.log(`[Sync Publications] Successfully wrote ${publications.length} verified publication(s) to ${ARTICLES_FILE}`);
    return publications;
  } catch (err) {
    console.warn('[Sync Publications] Zenodo fetch error:', err.message);
    return [];
  }
}

if (require.main === module) {
  syncPublications().catch(err => {
    console.error('[Sync Publications] Fatal error:', err);
    process.exit(1);
  });
}

module.exports = { syncArticles: syncPublications };
