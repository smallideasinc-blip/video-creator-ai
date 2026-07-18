// DASHBOARD SERVER v1.2
// Serveur web pour gérer Video Creator AI — branché sur les vrais moteurs

require('dotenv').config();

const express = require('express');
const TrendsAnalyzer = require('./trends-analyzer-engine.js');
const ScriptGenerator = require('./script-generator.js');
const MultiplatformPublisher = require('./multiplatform-publisher.js');
const ViralVideoScraper = require('./viral-video-scraper.js');
const ContentReplicator = require('./content-replicator.js');
const KoreanContentAdapter = require('./korean-content-adapter.js');
const DatabaseManager = require('./database-manager.js');

const app = express();
const PORT = process.env.PORT || 3000;
const apiKey = process.env.CLAUDE_API_KEY;

// Instancier les moteurs (partagés entre les requêtes)
const trendsAnalyzer = new TrendsAnalyzer();
const scriptGenerator = new ScriptGenerator(apiKey);
const publisher = new MultiplatformPublisher();
const viralScraper = new ViralVideoScraper();
const contentReplicator = new ContentReplicator(apiKey);
const koreanAdapter = new KoreanContentAdapter(apiKey);
const db = new DatabaseManager();

// Persistance : recharger les scripts existants pour ne jamais régénérer
// (et donc re-payer) un script déjà produit avant un redémarrage
db.connect().then(async () => {
  const saved = await db.getScripts();
  if (saved && saved.length > 0) scriptGenerator.loadScripts(saved);
});

// Sauvegarde un script fraîchement généré (les réutilisations du cache ne sont pas re-sauvées)
async function persistScript(script) {
  if (!script || script.fromCache) return;
  await db.saveScript({
    topic: script.topic,
    style: script.style,
    duration: script.duration,
    script: script.script,
    generatedBy: scriptGenerator.model,
    status: script.status
  });
}

app.use(express.json());

// Protection par mot de passe (activée si DASHBOARD_PASSWORD est défini)
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD;
if (DASHBOARD_PASSWORD) {
  const crypto = require('crypto');
  app.use((req, res, next) => {
    const auth = req.headers.authorization || '';
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = Buffer.from(encoded, 'base64').toString();
      const password = decoded.slice(decoded.indexOf(':') + 1);
      const a = Buffer.from(password);
      const b = Buffer.from(DASHBOARD_PASSWORD);
      if (a.length === b.length && crypto.timingSafeEqual(a, b)) return next();
    }
    res.set('WWW-Authenticate', 'Basic realm="Video Creator AI"');
    res.status(401).send('Mot de passe requis');
  });
  console.log('🔒 Dashboard protégé par mot de passe');
}

app.use(express.static('public'));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Stats réelles depuis l'état des moteurs
app.get('/api/stats', (req, res) => {
  res.json({
    status: '✅ System Running',
    engines: 6,
    apiKeyConfigured: Boolean(apiKey),
    scriptsGenerated: scriptGenerator.getAllScripts().length,
    videosFound: viralScraper.viralVideos.length,
    trendsAnalyzed: trendsAnalyzer.trends.length,
    contentPublished: publisher.getPublishHistory().length,
    uptime: new Date().toLocaleTimeString()
  });
});

// Analyser les tendances
app.post('/api/analyze', async (req, res) => {
  try {
    const trendData = await trendsAnalyzer.analyzeTrends();
    const stats = await trendsAnalyzer.getDailyStats();
    res.json({ trends: trendData.trends, stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Trouver les vidéos virales
app.post('/api/find-viral', async (req, res) => {
  try {
    const videos = await viralScraper.findFiveMostViral();
    res.json({ videos, stats: viralScraper.getDailyStats() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Générer un script via Claude API
app.post('/api/generate-script', async (req, res) => {
  if (!apiKey) {
    return res.status(503).json({ error: 'CLAUDE_API_KEY non configurée sur le serveur' });
  }

  try {
    const { topic, style, duration } = req.body || {};

    // Sans sujet fourni, utiliser la tendance du moment
    let scriptTopic = topic;
    if (!scriptTopic) {
      if (trendsAnalyzer.trends.length === 0) await trendsAnalyzer.analyzeTrends();
      const topTrend = trendsAnalyzer.getTopTrends(1)[0];
      scriptTopic = `${topTrend.category}: ${topTrend.keywords.join(', ')}`;
    }

    const script = await scriptGenerator.generateScript(scriptTopic, style || 'engaging', duration || 60);
    if (!script) {
      return res.status(502).json({ error: scriptGenerator.lastError || 'La génération du script a échoué' });
    }
    await persistScript(script);
    res.json({ script });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publier le dernier script généré
app.post('/api/publish', async (req, res) => {
  try {
    const scripts = scriptGenerator.getAllScripts();
    if (scripts.length === 0) {
      return res.status(400).json({ error: 'Aucun script à publier — générez un script d\'abord' });
    }
    const latest = scripts[scripts.length - 1];
    const record = await publisher.publishContent(
      latest.script,
      ['TikTok', 'Instagram Reels', 'YouTube Shorts']
    );
    res.json({ published: record });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Pipeline complet : tendances → viral → script → publication
app.post('/api/run-pipeline', async (req, res) => {
  if (!apiKey) {
    return res.status(503).json({ error: 'CLAUDE_API_KEY non configurée sur le serveur' });
  }

  try {
    await trendsAnalyzer.analyzeTrends();
    await viralScraper.findFiveMostViral();

    const topTrend = trendsAnalyzer.getTopTrends(1)[0];
    const script = await scriptGenerator.generateScript(
      `${topTrend.category}: ${topTrend.keywords.join(', ')}`,
      'engaging',
      60
    );

    let published = null;
    if (script) {
      await persistScript(script);
      published = await publisher.publishContent(
        script.script,
        ['TikTok', 'Instagram Reels', 'YouTube Shorts']
      );
    }

    res.json({
      trends: trendsAnalyzer.getTopTrends(3),
      viral: viralScraper.getTopVideo(),
      script,
      published
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`\n🚀 DASHBOARD RUNNING AT: http://localhost:${PORT}`);
  console.log(`✅ API Key: ${apiKey ? '***CONFIGURÉE***' : 'NON CONFIGURÉE (génération de scripts désactivée)'}`);
  console.log(`\n Press Ctrl + C to stop\n`);
});
