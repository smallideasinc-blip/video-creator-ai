# 🛡️ AI Detection Agent — Guide Complet

Ce guide explique comment utiliser l'**Agent de Détection IA** pour vérifier que vos contenus ne semblent pas générés par une IA (et éviter les suspensions).

---

## **📋 Sommaire**

1. [Travailler Localement (Économiser)](#travailler-localement)
2. [Utiliser l'Agent de Détection IA](#utiliser-lagent)
3. [Automation & Scheduling](#automation)
4. [Exemples Pratiques](#exemples)

---

## **💰 Travailler Localement (Économiser)**

### **Coûts API Claude**
- **Script Generator** : ~$0.003 par script (1500 mots)
- **Content Replicator** : ~$0.003 par amélioration
- **Korean Adapter** : ~$0.003 par adaptation
- **AI Detection** : ~$0.002 par vérification

### **Mode Économique (Gratuit)**

```bash
# Démarrer le serveur localement
cd /home/user/video-creator-ai
npm start

# Utiliser uniquement les démos (GRATUIT) :
# - Trends Analyzer (données de démo)
# - Viral Video Scraper (données de démo)
# - Platform Status (pas d'API call)
# - Dashboard (local seulement)
```

**Coût = $0** tant que vous n'activez pas Claude API ✅

### **Stratégie Optimale**

```
1. Générez 5-10 scripts le même jour (grouper les appels API)
2. Vérifiez-les avec AI Detection (même jour)
3. Améliorez les meilleurs (1-2 par jour)
4. Publiez l'optimisé sur 6 plateformes

Coût/jour = ~$0.02 (2 scripts + 1 détection)
```

---

## **🤖 Utiliser l'Agent de Détection IA**

### **Via API HTTP (Dashboard)**

**Endpoint :** `POST /api/check-ai-detection`

**Body :**
```json
{
  "scriptId": "1234567890",
  "platform": "instagram"
}
```

**Réponse :**
```json
{
  "scriptId": "1234567890",
  "platform": "instagram",
  "aiDetectionResult": {
    "safe": "yes",
    "score": 35,
    "suggestions": [
      {
        "originalPhrase": "Leveraging cutting-edge technology...",
        "issue": "Corporate jargon, sounds robotic",
        "suggestion": "Using the latest tech..."
      }
    ],
    "rewrittenContent": "..."
  }
}
```

### **Scores d'IA**

| Score | Risque | Action |
|-------|--------|--------|
| 0-30 | 🟢 Bas | Publier sans crainte ✅ |
| 31-60 | 🟡 Moyen | Revoir les suggestions |
| 61-80 | 🔴 Élevé | Appliquer les corrections |
| 81-100 | 🔴 Très élevé | Ne pas publier ❌ |

### **Via Node.js (Local)**

```javascript
const AIDetectionAgent = require('./ai-detection-agent.js');
const agent = new AIDetectionAgent(process.env.CLAUDE_API_KEY);

const script = "Your AI-generated script here...";
const analysis = await agent.analyzeAndHumanize(script, 'instagram');

console.log(`AI Score: ${analysis.aiDetectionScore}`);
console.log(`Safe: ${analysis.publicationSafe}`);
console.log(`Rewritten: ${analysis.rewrittenContent}`);
```

---

## **⏰ Automation & Scheduling**

### **Option 1 : Vérification Automatique Avant Publication**

Modifiez votre workflow :

```javascript
// Dans le dashboard (public/index.js)

async function publishContent(scriptId) {
  // 1. Vérifier avec AI Detection
  const checkResponse = await fetch('/api/check-ai-detection', {
    method: 'POST',
    body: JSON.stringify({ scriptId, platform: 'instagram' })
  });
  const check = await checkResponse.json();

  // 2. Si score > 60, alerter l'utilisateur
  if (check.aiDetectionResult.score > 60) {
    showResult('⚠️ AI Detection Warning', 
      `Score: ${check.aiDetectionResult.score}/100\n\n` +
      `Suggestions:\n${check.aiDetectionResult.suggestions.map(s => s.suggestion).join('\n')}\n\n` +
      `Rewritten:\n${check.aiDetectionResult.rewrittenContent}`
    );
    return; // Ne pas publier
  }

  // 3. Si score < 60, publier
  await publishNormally(scriptId);
}
```

### **Option 2 : Batch Checking (Node.js Local)**

```bash
# Créer un fichier batch-check.js
node batch-check.js
```

```javascript
// batch-check.js
const AIDetectionAgent = require('./ai-detection-agent.js');
const ScriptGenerator = require('./script-generator.js');

async function checkAllScripts() {
  const agent = new AIDetectionAgent(process.env.CLAUDE_API_KEY);
  const generator = new ScriptGenerator(process.env.CLAUDE_API_KEY);
  
  const scripts = generator.getAllScripts();
  const results = [];

  for (const script of scripts) {
    console.log(`\n🔍 Checking: ${script.topic}`);
    const analysis = await agent.analyzeAndHumanize(script.script);
    
    results.push({
      id: script.id,
      topic: script.topic,
      score: analysis.aiDetectionScore,
      safe: analysis.publicationSafe,
      rewritten: analysis.rewrittenContent
    });

    // Delay pour éviter rate limiting
    await new Promise(r => setTimeout(r, 2000));
  }

  // Sauvegarder les résultats
  const fs = require('fs');
  fs.writeFileSync('ai-check-results.json', JSON.stringify(results, null, 2));
  console.log(`\n✅ Saved ${results.length} results to ai-check-results.json`);
}

checkAllScripts().catch(console.error);
```

### **Option 3 : Scheduled Task (Cron)**

```bash
# Vérifier tous les scripts chaque matin à 6am
# Ajoutez ceci à votre crontab :

0 6 * * * cd /home/user/video-creator-ai && node batch-check.js

# Ou utilisez un scheduling Zapier / Make pour Render
```

---

## **💡 Exemples Pratiques**

### **Exemple 1 : Script Généré vs Humanisé**

**❌ Score AI élevé (75/100) :**
```
Leveraging cutting-edge artificial intelligence technology, our innovative 
platform empowers content creators to efficiently optimize their digital presence 
through advanced algorithmic analysis and automated workflow optimization.
```

**✅ Rewritten (Score 28/100) :**
```
We built a tool that helps creators like you grow faster. It analyzes trends, 
writes scripts, and posts everywhere — all in one place. No fluff, no nonsense.
```

### **Exemple 2 : Instagram Post**

**Avant :**
```
Optimizing content distribution across multiple social media channels has never 
been more accessible. Our platform leverages machine learning algorithms...
```

**Après (Humanisé) :**
```
finally, growing on social media doesn't have to be complicated. we do the hard 
work — you keep the creativity. 6 engines, 1 dashboard, 100% you.
```

### **Exemple 3 : Workflow Complet**

```
1. Générez script → Score AI = 65 (MOYEN)
   ↓
2. Lancez AI Detection → Suggestions de humanization
   ↓
3. Appliquez rewritten content OR edit manually
   ↓
4. Re-check → Score = 32 (BON) ✅
   ↓
5. Publier sans crainte 🚀
```

---

## **🚀 Quick Start**

### **Étape 1 : Installer**
```bash
npm install  # L'agent est inclus
```

### **Étape 2 : Générer un Script**
Utilisez le dashboard → Générer un Script

### **Étape 3 : Vérifier avec AI Detection**
```bash
# Via Dashboard
POST /api/check-ai-detection
{
  "scriptId": "votre_script_id",
  "platform": "instagram"
}
```

### **Étape 4 : Appliquer les Corrections**
Utilisez le contenu `rewrittenContent` suggéré, ou modifiez manuellement

### **Étape 5 : Publier**
Lancez la publication une fois score < 60

---

## **📊 Monitoring & Analytics**

### **Voir tous les scores IA**
```bash
node batch-check.js  # Génère ai-check-results.json
cat ai-check-results.json | jq '.[] | {topic, score, safe}'
```

### **Tendance AI Scores**
```javascript
// Vérifier si vos scripts deviennent plus "humains" au fil du temps
const results = require('./ai-check-results.json');
const avgScore = results.reduce((s, r) => s + r.score, 0) / results.length;
console.log(`Average AI Score: ${avgScore}/100`);
```

---

## **⚠️ Limites & Disclaimers**

1. **L'AI Detection n'est pas parfaite** — elle détecte les patterns courants, pas tous les cas
2. **Contexte compte** — le même texte peut sembler plus/moins "AI" selon le contexte
3. **Évolution** — les détecteurs IA évoluent, il faut réentraîner régulièrement
4. **Humans write AI-like content too** — Pas de score 100% de certitude

---

## **🔗 Ressources**

- **OpenAI AI Detection** : https://platform.openai.com/docs/guides/moderation
- **AI Detection Best Practices** : https://www.anthropic.com/news/how-ai-detection-works
- **Platform Policies** :
  - TikTok Creator Fund : Penalizes low engagement + "suspicious" posts
  - Instagram Reels : Suppresses low-quality/AI-looking content
  - YouTube Shorts : Demonetizes AI-only videos
  - X/Twitter : May flag as bot/AI-generated

---

**Dernière mise à jour :** 2026-07-19  
**Agent Version :** 1.0  
**Status :** Prêt pour production ✅
