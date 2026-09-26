/**
 * Kakul Sarma Portfolio - 30-Day LinkedIn & Technical Articles Synchronizer
 * Runs via GitHub Actions monthly cron (or manual workflow dispatch)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const ARTICLES_FILE = path.join(__dirname, '..', 'assets', 'data', 'articles.json');
const FEED_URL = process.env.LINKEDIN_FEED_URL || process.env.ARTICLES_RSS_URL || '';

async function fetchFromUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', err => reject(err));
  });
}

async function syncArticles() {
  console.log('[Sync Articles] Starting 30-day articles synchronization...');
  
  let currentArticles = [];
  if (fs.existsSync(ARTICLES_FILE)) {
    try {
      currentArticles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
      console.log(`[Sync Articles] Loaded ${currentArticles.length} existing articles.`);
    } catch (e) {
      console.error('[Sync Articles] Failed reading existing articles:', e);
    }
  }

  // If a live RSS/JSON feed URL is configured in GitHub Secrets
  if (FEED_URL) {
    try {
      console.log(`[Sync Articles] Fetching remote feed from: ${FEED_URL}`);
      const raw = await fetchFromUrl(FEED_URL);
      const parsed = JSON.parse(raw);
      const items = (parsed.items || parsed.articles || []).slice(0, 6);

      if (items.length > 0) {
        const transformed = items.map((item, index) => ({
          id: `art-${index + 1}`,
          title: item.title || 'Untitled Article',
          snippet: (item.description || item.snippet || item.content || '').replace(/<[^>]+>/g, '').substring(0, 180) + '...',
          tag: item.category || item.tag || 'Architecture',
          readTime: item.readTime || '6 min read',
          date: item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recent',
          url: item.link || item.url || 'https://www.linkedin.com/in/kakulsarma/'
        }));

        fs.writeFileSync(ARTICLES_FILE, JSON.stringify(transformed, null, 2), 'utf8');
        console.log(`[Sync Articles] Successfully updated top ${transformed.length} articles from feed.`);
        return;
      }
    } catch (err) {
      console.warn('[Sync Articles] Remote feed fetch failed or returned non-JSON, preserving current dataset:', err.message);
    }
  }

  // Fallback / standard upkeep: Ensure data is properly structured and formatted
  if (currentArticles.length > 0) {
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(currentArticles.slice(0, 6), null, 2), 'utf8');
    console.log(`[Sync Articles] Verified top ${Math.min(6, currentArticles.length)} articles in data store.`);
  }

  console.log('[Sync Articles] Synchronization completed successfully.');
}

syncArticles().catch(err => {
  console.error('[Sync Articles] Fatal error during sync:', err);
  process.exit(1);
});
