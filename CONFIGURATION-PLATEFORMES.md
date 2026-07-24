# 🎯 GUIDE COMPLET - Configuration des 6 Plateformes

## Vue d'ensemble
Ce guide vous montre comment configurer chaque plateforme pour la publication RÉELLE (pas simulation).

---

## 📋 CHECKLIST AVANT DE COMMENCER
- [ ] Vous avez des comptes sur chaque plateforme
- [ ] Vous êtes connecté en tant qu'administrateur
- [ ] Vous avez un navigateur à côté (pour copier les tokens)

---

## 1️⃣ TIKTOK (PRIORITÉ 1 - Le Plus Viral)

### Étape 1: Créer une Application TikTok
1. Allez sur https://developers.tiktok.com/
2. Connectez-vous avec votre compte TikTok (créez-en un si nécessaire)
3. Cliquez sur **"Create an app"**
4. Nom: `Video Creator AI`
5. Sélectionnez: **"Web"** comme plateforme

### Étape 2: Obtenir les Credentials
1. Allez dans **"Development"** → **"Sandbox"**
2. Notez votre **Client ID** et **Client Secret**
3. Définissez la URL de redirection: `http://localhost:3000/auth/tiktok`

### Étape 3: Obtenir le Token d'Accès
1. Allez sur: https://www.tiktok.com/oauth (avec votre compte personnel)
2. Vous verrez un token - **copiez-le**

### Étape 4: Ajouter au système
Sur votre laptop, ouvrez `.env` et ajoutez:
```
TIKTOK_ACCESS_TOKEN=votre_token_ici
```

---

## 2️⃣ INSTAGRAM (PRIORITÉ 2 - Facile à Configurer)

### Étape 1: Créer une App Facebook/Instagram
1. Allez sur https://developers.facebook.com/
2. Connectez-vous avec votre compte Facebook
3. Cliquez sur **"My Apps"** → **"Create App"**
4. Type: **"Consumer"**
5. Nom: `Video Creator AI`

### Étape 2: Ajouter Instagram Graph API
1. Dans l'app, cliquez sur **"Products"** → **"Instagram Graph API"**
2. Cliquez sur **"Set Up"**

### Étape 3: Obtenir le Token
1. Allez dans **"Tools"** → **"Graph API Explorer"**
2. Sélectionnez votre app
3. Changez de **"Get"** à **"POST"**
4. Cherchez votre Instagram Business Account ID
5. Générez un **Long-lived Access Token** (valide 60 jours)

### Étape 4: Ajouter au système
Sur votre laptop, ouvrez `.env` et ajoutez:
```
INSTAGRAM_ACCESS_TOKEN=votre_token_ici
```

---

## 3️⃣ YOUTUBE (PRIORITÉ 3)

### Étape 1: Activer YouTube Data API
1. Allez sur https://console.cloud.google.com/
2. Créez un nouveau projet: `Video Creator AI`
3. Activez **YouTube Data API v3**
4. Créez une clé API (OAuth 2.0)

### Étape 2: Obtenir les Credentials
1. Téléchargez le fichier JSON (client_secret)
2. Notez votre **Client Secret**

### Étape 3: Autoriser votre compte YouTube
1. Allez sur: https://myaccount.google.com/
2. Autorisez l'accès à votre chaîne YouTube

### Étape 4: Ajouter au système
Sur votre laptop, ouvrez `.env` et ajoutez:
```
YOUTUBE_CLIENT_SECRET=votre_client_secret_ici
```

---

## 4️⃣ TWITTER/X (PRIORITÉ 4)

### Étape 1: Créer une App Twitter
1. Allez sur https://developer.twitter.com/en/portal/dashboard
2. Connectez-vous avec votre compte Twitter
3. Cliquez sur **"Create an app"**
4. Nom: `Video Creator AI`
5. Sélectionnez **Read and Write** permissions

### Étape 2: Obtenir la Clé API
1. Allez dans **"Keys and tokens"**
2. Copiez votre **API Key** (celle qui commence par `AAAA...`)

### Étape 3: Ajouter au système
Sur votre laptop, ouvrez `.env` et ajoutez:
```
X_API_KEY=votre_api_key_ici
```

---

## 5️⃣ LINKEDIN (PRIORITÉ 5)

### Étape 1: Créer une App LinkedIn
1. Allez sur https://www.linkedin.com/developers/apps
2. Cliquez sur **"Create app"**
3. Nom: `Video Creator AI`
4. Page LinkedIn: (votre page professionnelle)

### Étape 2: Obtenir le Token
1. Allez dans **"Auth"**
2. Autorisez votre compte
3. Copiez le **Access Token**

### Étape 3: Ajouter au système
Sur votre laptop, ouvrez `.env` et ajoutez:
```
LINKEDIN_ACCESS_TOKEN=votre_token_ici
```

---

## 6️⃣ FACEBOOK (PRIORITÉ 6)

### Étape 1: Créer une Page Facebook
1. Allez sur https://www.facebook.com/pages/
2. Créez une **nouvelle page** (ou utilisez celle existante)

### Étape 2: Obtenir le Token de Page
1. Allez sur https://developers.facebook.com/
2. Allez dans **Tools** → **Graph API Explorer**
3. Générez un token pour votre page
4. Copiez le **Page Access Token**

### Étape 3: Ajouter au système
Sur votre laptop, ouvrez `.env` et ajoutez:
```
FACEBOOK_PAGE_TOKEN=votre_page_token_ici
```

---

## ✅ FICHIER .ENV FINAL

Votre fichier `.env` devrait maintenant ressembler à:

```
CLAUDE_API_KEY=sk-ant-api03-YOUR_API_KEY_HERE_FROM_CONSOLE_ANTHROPIC_COM
MONGODB_URI=

# Plateformes (ajoutez vos tokens ici)
TIKTOK_ACCESS_TOKEN=your_tiktok_token
INSTAGRAM_ACCESS_TOKEN=your_instagram_token
YOUTUBE_CLIENT_SECRET=your_youtube_secret
X_API_KEY=your_twitter_api_key
LINKEDIN_ACCESS_TOKEN=your_linkedin_token
FACEBOOK_PAGE_TOKEN=your_facebook_page_token

NODE_ENV=development
```

---

## 🔄 APRÈS LA CONFIGURATION

1. **Sauvegardez le `.env`**
2. **Redémarrez le serveur** (Ctrl + C, puis `npm start`)
3. **Testez une publication** avec le bouton "Générer Script"
4. **Vérifiez les posts** sur vos comptes réels

---

## 🤖 ZAPIER (AUTOMATISATION)

Une fois les 6 plateformes configurées, configurez Zapier:

1. Allez sur https://zapier.com/
2. Créez un Zap: **"Trigger: Webhook"** → **"Action: Publish on [Platform]"**
3. Connectez chaque plateforme
4. Testez le flux complet

---

## ⚠️ NOTES IMPORTANTES

- **Tokens expirent**: Configurez le renouvellement automatique
- **Limites de taux**: Attendez entre les publications (1-2 sec)
- **Test d'abord**: Testez avec du contenu de test avant d'automatiser
- **Pas de spam**: Ne publiez pas le même contenu en boucle

---

## 🆘 BESOIN D'AIDE?

Si une plateforme ne fonctionne pas:
1. Vérifiez que le token n'est pas expiré
2. Vérifiez les permissions de l'app
3. Testez le token directement avec `curl`

