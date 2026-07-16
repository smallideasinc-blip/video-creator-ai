// DASHBOARD SERVER v1.1
// Serveur web pour gérer Video Creator AI

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir les fichiers statiques
app.use(express.static('public'));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Route API pour les stats
app.get('/api/stats', (req, res) => {
  res.json({
    status: '✅ System Running',
    engines: 6,
    scriptsGenerated: 42,
    videosFound: 5,
    platformsConnected: 6,
    uptime: new Date().toLocaleTimeString()
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`\n🚀 DASHBOARD RUNNING AT: http://localhost:${PORT}`);
  console.log(`📊 Open your browser and go to: http://localhost:${PORT}`);
  console.log(`\n Press Ctrl + C to stop\n`);
});