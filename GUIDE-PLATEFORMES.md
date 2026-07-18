# 📱 Guide d'inscription aux plateformes de publication

Video Creator AI peut publier sur 6 plateformes. Pour chacune, il faut **deux
choses** :

1. **Un compte créateur** sur la plateforme (là où les vidéos apparaîtront).
2. **Un accès développeur (API)** pour que le système publie automatiquement
   à votre place — c'est l'identifiant à mettre dans le fichier `.env`.

Le dashboard affiche ✅ quand une plateforme est connectée et ⚠️ quand elle ne
l'est pas (dans ce cas la publication est **simulée**).

> 💡 Conseil : commencez par créer les comptes créateurs et publiez
> manuellement les scripts générés. Les accès API demandent souvent une
> validation par la plateforme (quelques jours) — faites ces demandes en
> parallèle.

---

## 🎵 TikTok — variable `TIKTOK_ACCESS_TOKEN`

**Compte créateur :**
1. Téléchargez l'application TikTok ou allez sur https://www.tiktok.com/signup
2. Créez le compte avec votre e-mail professionnel.
3. Dans *Profil → Paramètres → Compte*, passez en **Compte professionnel**
   (gratuit — donne accès aux statistiques).

**Accès API (publication automatique) :**
1. Allez sur https://developers.tiktok.com et connectez-vous avec le compte TikTok.
2. Créez une application (*Manage apps → Connect an app*).
3. Demandez l'accès à la **Content Posting API** (produit « Direct Post »).
   TikTok examine la demande — décrivez l'usage : « publication automatique de
   mes propres vidéos courtes générées par IA ».
4. Une fois approuvé, récupérez le jeton d'accès OAuth et mettez-le dans
   `TIKTOK_ACCESS_TOKEN`.

---

## 📸 Instagram Reels — variable `INSTAGRAM_ACCESS_TOKEN`

**Compte créateur :**
1. Créez un compte sur https://www.instagram.com (application ou web).
2. Dans *Paramètres → Type de compte*, passez en **Compte professionnel**
   (obligatoire pour l'API).

**Accès API :**
1. Il faut une **Page Facebook** liée au compte Instagram (voir section
   Facebook ci-dessous) — c'est une exigence de Meta.
2. Allez sur https://developers.facebook.com et créez une application
   (*Mes apps → Créer une app*, type « Business »).
3. Ajoutez le produit **Instagram Graph API**.
4. Générez un jeton d'accès longue durée avec les permissions
   `instagram_content_publish` et `pages_show_list` (outil : *Graph API
   Explorer*).
5. Mettez ce jeton dans `INSTAGRAM_ACCESS_TOKEN`.

---

## 🎬 YouTube Shorts — variables `YOUTUBE_CLIENT_ID` / `YOUTUBE_CLIENT_SECRET`

**Compte créateur :**
1. Créez un compte Google (ou utilisez le vôtre) : https://accounts.google.com
2. Allez sur https://www.youtube.com et créez votre **chaîne** (*Paramètres →
   Créer une chaîne*).

**Accès API :**
1. Allez sur https://console.cloud.google.com et créez un **projet**.
2. Dans *API et services → Bibliothèque*, activez **YouTube Data API v3**.
3. Dans *Identifiants*, créez un **ID client OAuth 2.0** (type : application
   Web ou de bureau).
4. Copiez l'ID client et le secret dans `YOUTUBE_CLIENT_ID` et
   `YOUTUBE_CLIENT_SECRET`.
5. Note : l'envoi de vidéos consomme le quota gratuit (une vidéo ≈ 1600
   unités sur 10 000/jour — largement suffisant pour démarrer).

---

## 𝕏 Twitter/X — variables `X_API_KEY` / `X_API_SECRET`

**Compte créateur :**
1. Créez le compte sur https://x.com/i/flow/signup

**Accès API :**
1. Allez sur https://developer.x.com et inscrivez-vous au programme
   développeur (l'offre **Free** permet de poster).
2. Créez un projet et une application dans le portail développeur.
3. Dans l'onglet *Keys and tokens*, générez l'**API Key** et l'**API Secret**.
4. Mettez-les dans `X_API_KEY` et `X_API_SECRET`.

---

## 💼 LinkedIn — variable `LINKEDIN_ACCESS_TOKEN`

**Compte créateur :**
1. Créez le compte sur https://www.linkedin.com/signup
2. Optionnel mais recommandé : créez une **Page entreprise** (*Produits →
   Créer une page LinkedIn*) pour publier au nom de la marque.

**Accès API :**
1. Allez sur https://developer.linkedin.com et créez une application
   (*Create app* — il faut la lier à une Page entreprise).
2. Dans *Products*, demandez **Share on LinkedIn** (permission `w_member_social`).
3. Générez un jeton OAuth 2.0 (outil : *Token Generator*).
4. Mettez-le dans `LINKEDIN_ACCESS_TOKEN`.

---

## 📘 Facebook — variable `FACEBOOK_PAGE_TOKEN`

**Compte créateur :**
1. Créez un compte sur https://www.facebook.com si besoin.
2. Créez une **Page** (*Menu → Pages → Créer une Page*) — les publications
   automatiques se font sur une Page, pas sur un profil personnel.

**Accès API :**
1. Réutilisez l'application Meta créée pour Instagram
   (https://developers.facebook.com).
2. Ajoutez les permissions `pages_manage_posts` et `pages_read_engagement`.
3. Dans *Graph API Explorer*, générez un **jeton de Page** (sélectionnez
   votre Page dans le menu déroulant).
4. Mettez-le dans `FACEBOOK_PAGE_TOKEN`.

---

## Ordre conseillé

| Priorité | Plateforme | Pourquoi |
|---|---|---|
| 1 | TikTok | Cœur de cible des vidéos courtes virales |
| 2 | YouTube Shorts | Portée massive, API bien documentée, quota gratuit |
| 3 | Instagram Reels + Facebook | Même application Meta pour les deux — faites-les ensemble |
| 4 | Twitter/X | Rapide à configurer (offre Free) |
| 5 | LinkedIn | Utile surtout pour du contenu B2B |

## Après inscription

1. Copiez chaque clé dans votre `.env` (jamais dans le code, jamais commité).
2. Sur Render : *Environment → Add Environment Variable*.
3. Redémarrez le serveur : le dashboard affichera ✅ pour chaque plateforme
   connectée.

⚠️ La connexion des vraies API de publication (upload effectif des vidéos)
n'est pas encore implémentée dans le code — le dashboard indique pour
l'instant quels identifiants sont configurés. C'est l'étape suivante logique
du projet une fois vos comptes créés.
