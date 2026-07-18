# 🎬 Video Creator AI

Système de création de vidéos virales assisté par IA, avec un dashboard web et 6 moteurs :

| Moteur | Rôle |
|---|---|
| 📊 Trends Analyzer | Analyse les tendances (données de démonstration pour l'instant) |
| ✍️ Script Generator | Génère des scripts vidéo via l'API Claude |
| 🔥 Viral Scraper | Trouve les 5 vidéos les plus virales (données de démonstration) |
| 🎯 Content Replicator | Réplique des concepts viraux via l'API Claude |
| 🇰🇷 Korean Adapter | Adapte du contenu coréen en FR/EN via l'API Claude |
| 📱 Multi-Publisher | Publication multi-plateformes (simulation pour l'instant) |

## Démarrage

```bash
npm install
cp .env.example .env   # puis remplir les vraies valeurs
npm start              # dashboard sur http://localhost:3000
```

## Configuration (.env)

```
CLAUDE_API_KEY=sk-ant-api03-...   # clé API sur console.anthropic.com
MONGODB_URI=mongodb+srv://...     # optionnel (fallback en mémoire)
NODE_ENV=production
```

⚠️ **Ne jamais committer le fichier `.env`** — il est dans le `.gitignore`.

⚠️ **La génération de scripts nécessite des crédits API** sur le compte Anthropic
(console.anthropic.com → Plans & Billing). Sans crédits, le dashboard affiche
l'erreur renvoyée par l'API.

## API du dashboard

| Route | Méthode | Description |
|---|---|---|
| `/api/stats` | GET | État réel des moteurs (compteurs, connexion MongoDB) |
| `/api/platforms` | GET | État de connexion des plateformes (identifiants API configurés ou non) |
| `/api/publications` | GET | Historique et statistiques des publications |
| `/api/scripts` | GET | Historique des scripts générés (du plus récent au plus ancien) |
| `/api/analyze` | POST | Analyse des tendances |
| `/api/find-viral` | POST | Top 5 vidéos virales |
| `/api/generate-script` | POST | Génère un script (`{topic, style, duration}` optionnels) |
| `/api/improve-script` | POST | Améliore un script existant via Claude (`{scriptId, feedback}` requis) |
| `/api/publish` | POST | Publie un script (`{scriptId, platforms}` optionnels, sinon le dernier généré sur TikTok / Instagram Reels / YouTube Shorts) |
| `/api/run-pipeline` | POST | Pipeline complet : tendances → viral → script → publication |

## Persistance (v1.3)

Si `MONGODB_URI` est défini, chaque script généré est sauvegardé dans MongoDB
et l'historique est rechargé au démarrage du serveur — les scripts survivent
donc aux redémarrages (utile sur Render, qui redémarre les services au déploiement).
Sans MongoDB, l'historique reste en mémoire et disparaît au redémarrage.

## Connexion des plateformes (v1.5)

Le dashboard indique pour chaque plateforme si son identifiant API est
configuré (✅) ou non (⚠️ → publication simulée). Le guide pas à pas pour
créer chaque compte (TikTok, Instagram, YouTube, X, LinkedIn, Facebook) et
obtenir chaque clé se trouve dans **[GUIDE-PLATEFORMES.md](GUIDE-PLATEFORMES.md)**.
Les variables attendues sont listées dans `.env.example`.

## Déploiement (Render)

Le serveur écoute sur `process.env.PORT`. Définir `CLAUDE_API_KEY` dans les
variables d'environnement de Render (jamais dans le code).

### Protection par mot de passe

Définir la variable d'environnement `DASHBOARD_PASSWORD` (dans Render →
Environment) pour protéger tout le dashboard : le navigateur demandera ce mot
de passe avant d'afficher le site (le champ « utilisateur » peut rester vide).
Sans cette variable, le dashboard est ouvert à tous — n'importe qui peut alors
déclencher des appels à l'API Claude avec votre clé.

## Lancer le pipeline en console

```bash
node launcher.js   # exécute une démo de tous les moteurs
```
