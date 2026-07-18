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
| `/api/stats` | GET | État réel des moteurs (compteurs) |
| `/api/analyze` | POST | Analyse des tendances |
| `/api/find-viral` | POST | Top 5 vidéos virales |
| `/api/generate-script` | POST | Génère un script (`{topic, style, duration}` optionnels) |
| `/api/publish` | POST | Publie le dernier script généré |
| `/api/run-pipeline` | POST | Pipeline complet : tendances → viral → script → publication |

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
