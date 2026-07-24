# 📱 Guide d'Intégration des Plateformes

Ce guide vous aide à configurer chaque plateforme de publication pour Video Creator AI.

## 🎯 Résumé des Plateformes

| Plateforme | Priorité | Difficulté | Temps |
|------------|----------|-----------|-------|
| 📱 **TikTok** | ⭐⭐⭐ | Moyen | 15 min |
| 📸 **Instagram Reels** | ⭐⭐⭐ | Moyen | 15 min |
| 🎬 **YouTube Shorts** | ⭐⭐ | Moyen | 20 min |
| 𝕏 **Twitter/X** | ⭐ | Facile | 10 min |
| 💼 **LinkedIn** | ⭐ | Facile | 10 min |
| 👥 **Facebook** | ⭐ | Moyen | 15 min |

---

## 📱 TikTok - Configuration Complète

### Étape 1: Créer un Compte TikTok Business
1. Aller sur https://www.tiktok.com/
2. Créer un compte ou se connecter
3. Basculer vers compte professionnel → Sélectionner "Créateur"

### Étape 2: Obtenir l'Accès à l'API TikTok
1. Aller sur https://developers.tiktok.com/
2. Cliquer "Register now" → Créer un compte développeur
3. Créer une application:
   - Nom: "Video Creator AI"
   - Type: "Native app" ou "Server"
4. Attendre l'approbation (24-48h)
5. Obtenir: `TIKTOK_CLIENT_ID`, `TIKTOK_CLIENT_SECRET`, `TIKTOK_ACCESS_TOKEN`

### Étape 3: Configurer dans .env
```
TIKTOK_CLIENT_ID=your_client_id_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
TIKTOK_ACCESS_TOKEN=your_access_token_here
TIKTOK_VIDEO_UPLOAD_ENABLED=true
```

### 📊 Performances Attendues
- Temps de publication: 2-5 secondes
- Limite: 10 vidéos/jour (gratuit)
- Format optimal: 9:16, 540x960px

---

## 📸 Instagram Reels - Configuration

### Étape 1: Compte Business
1. Aller sur https://www.instagram.com/
2. Créer un compte ou se connecter
3. Basculer vers compte professionnel

### Étape 2: Meta Business
1. Aller sur https://business.facebook.com/
2. Créer un compte Business
3. Connecter votre compte Instagram

### Étape 3: Tokens Meta
1. Aller sur https://developers.facebook.com/
2. Créer une application
3. Ajouter "Instagram Graph API" et "Facebook Graph API"
4. Générer le token d'accès long terme

### Étape 4: .env
```
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id
INSTAGRAM_ACCESS_TOKEN=your_access_token
INSTAGRAM_VIDEO_UPLOAD_ENABLED=true
```

---

## 🎬 YouTube Shorts - Configuration

### Étape 1: Canal YouTube
1. Aller sur https://youtube.com/
2. Créer un canal
3. Vérifier le canal

### Étape 2: API YouTube
1. Aller sur https://console.cloud.google.com/
2. Créer un projet "Video Creator AI"
3. Ajouter "YouTube Data API v3"
4. Créer des identifiants OAuth 2.0

### Étape 3: .env
```
YOUTUBE_API_KEY=your_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id
YOUTUBE_VIDEO_UPLOAD_ENABLED=true
```

---

## 𝕏 Twitter/X - Configuration

### Étape 1: API Access
1. Aller sur https://developer.twitter.com/
2. Appliquer pour l'accès
3. Obtenir: `API_KEY`, `API_SECRET`, `BEARER_TOKEN`

### Étape 2: .env
```
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_BEARER_TOKEN=your_bearer_token
TWITTER_VIDEO_UPLOAD_ENABLED=true
```

---

## 💼 LinkedIn - Configuration

### Étape 1: API Access
1. Aller sur https://www.linkedin.com/developers/
2. Créer une application
3. Attendre l'approbation

### Étape 2: .env
```
LINKEDIN_CLIENT_ID=your_client_id
LINKEDIN_CLIENT_SECRET=your_client_secret
LINKEDIN_ACCESS_TOKEN=your_access_token
LINKEDIN_PROFILE_ID=your_profile_id
LINKEDIN_VIDEO_UPLOAD_ENABLED=true
```

---

## 👥 Facebook - Configuration

### Étape 1: Page & Business
1. Créer une page Facebook
2. Connecter à Meta Business

### Étape 2: Tokens
1. Aller sur https://developers.facebook.com/
2. Générer un token d'accès long terme

### Étape 3: .env
```
FACEBOOK_PAGE_ID=your_page_id
FACEBOOK_ACCESS_TOKEN=your_access_token
FACEBOOK_VIDEO_UPLOAD_ENABLED=true
```

---

## 📊 Checklist d'Intégration

### Priorité 1 - À Faire D'Abord
- [ ] TikTok (API approuvée)
- [ ] Instagram Reels (Meta Business connecté)

### Priorité 2 - Après Priorité 1
- [ ] YouTube Shorts (API active)
- [ ] Facebook (Page créée)

### Priorité 3 - Compléments
- [ ] Twitter/X (API approuvée)
- [ ] LinkedIn (App approuvée)

---

## 🚀 Prochaines Étapes

1. Commencer par TikTok + Instagram (plus rapide)
2. Ajouter YouTube + Facebook (couverture maximale)
3. Optionnel: Twitter/X + LinkedIn (audiences spécifiques)
4. Configurer Zapier pour l'auto-publication (ZAPIER-SETUP.md)

✨ **Besoin d'aide?** Consultez les logs ou ouvrez une issue GitHub!
