# 🛍️ Liggéey Mode

> **La première marketplace dédiée à la mode d'occasion au Sénégal**

Liggéey Mode est une plateforme inspirée de Vinted, adaptée au contexte sénégalais, permettant aux particuliers et entreprises (friperies, boutiques, créateurs) de vendre et acheter des vêtements de seconde main en toute sécurité.

**Slogan :** *Daay ko, Jënd ko, Liggeey ak yoon wi !* (Vends-le, achète-le, travaille avec style !)

---

## 🎯 Vision du projet

### Opportunité de marché
- 92% des femmes dakaroises achètent des vêtements importés
- Marché de la friperie massif au Sénégal (Colobane, Keur Mbaye Fall)
- Aucun concurrent direct spécialisé dans la mode d'occasion
- Population jeune, connectée et en croissance

### Problèmes résolus
✅ Pas de plateforme sécurisée pour vendre/acheter de la mode d'occasion  
✅ Risque d'arnaques dans les transactions à distance  
✅ Manque de visibilité pour les petites friperies et créateurs  
✅ Difficulté à évaluer la fiabilité des vendeurs  

---

## ✨ Fonctionnalités principales

### MVP (Phase 1 - 8 semaines)
- 🔐 **Authentification** : Inscription/Connexion sécurisée
- 👤 **Deux types de comptes** : Particulier (gratuit) / Entreprise (freemium)
- 📸 **Publication d'articles** : Photos multiples, description, prix, état
- 🔍 **Recherche avancée** : Filtres (catégorie, taille, prix, ville, marque)
- 💬 **Messagerie intégrée** : Chat en temps réel entre acheteur/vendeur
- 🤝 **Mode rencontre** : Arrangement lieu de rendez-vous pour transaction en personne
- ⭐ **Système de notation** : Évaluation mutuelle après transaction
- 🏆 **Badges de confiance** : Nouveau, Vendeur fiable, Top vendeur
- ❤️ **Favoris** : Sauvegarder articles préférés
- 📱 **Mobile-first** : Interface optimisée pour smartphones

### Phase 2 (Post-MVP - Mois 2-3)
- 💳 **Paiement sécurisé** : Intégration PayDunya (Wave, Orange Money, Free Money)
- 🔒 **Système ESCROW** : Argent bloqué jusqu'à confirmation de réception
- 🚚 **Livraison intégrée** : Partenariat DHL, La Poste, coursiers locaux
- 📦 **Tracking** : Suivi de colis en temps réel
- ⚖️ **Gestion des litiges** : Arbitrage en cas de problème
- 💰 **Dashboard vendeur** : Statistiques, revenus, retraits

### Phase 3 (Scale - Mois 4-6)
- 🏢 **Comptes Entreprise Premium** : Fonctionnalités avancées
- 📊 **Analytics détaillées** : Performance vendeurs, tendances
- 📤 **Upload en masse** : Import CSV pour boutiques
- 🤖 **IA modération** : Détection automatique d'images frauduleuses
- 📱 **App mobile native** : iOS et Android (React Native)
- 🎁 **Programme de fidélité** : Récompenses utilisateurs actifs

---

## 🏗️ Architecture technique

### Stack Frontend
```
React 18+ (Hooks, Context API)
Tailwind CSS (styling responsive)
React Router (navigation)
Lucide React (icônes)
```

### Stockage (MVP)
```
API de persistance intégrée
Données sauvegardées entre sessions
Pas de backend externe nécessaire
```

### Migration Production (Phase 2)
```
Backend: Node.js + Express / Python + FastAPI
Base de données: PostgreSQL (Supabase/Neon)
Stockage images: Cloudinary
Auth: JWT + OAuth2
Paiement: PayDunya API
Notifications: SMS (Teranga) + Push (Firebase)
```

### Hébergement
```
Frontend: Vercel / Netlify (gratuit)
Backend: Railway / Render / Fly.io (gratuit)
Images: Cloudinary (25GB gratuit)
DB: Supabase (500MB gratuit)
CDN: Cloudflare (gratuit)
```

---

## 💰 Modèle économique

### Commissions sur transactions
| Type de compte | Taux | Commission minimum |
|----------------|------|-------------------|
| Particulier    | 8%   | 200 FCFA          |
| Entreprise Premium | 5% | 200 FCFA       |

**Exemple :** Article à 15 000 FCFA → Commission 1 200 FCFA

### Abonnement Entreprise Premium
- **Prix :** 5 000 - 10 000 FCFA/mois
- **Avantages :** Articles illimités, upload en masse, statistiques, mise en avant

### Autres sources de revenus
- Publicité in-app (bannières, articles sponsorisés)
- Services premium (mise en avant d'article : 500 FCFA/semaine)
- Photos professionnelles (3 000 FCFA/séance)

### Objectifs Année 1
- **Utilisateurs :** 10 000
- **Transactions :** 5 000
- **GMV :** 50 000 000 FCFA
- **Revenus commission :** 4 000 000 FCFA
- **Revenus abonnements :** 4 500 000 FCFA
- **Total :** ~10 500 000 FCFA

---

## 🚀 Roadmap de développement

### Sprint 1-2 : Fondations (Semaine 1-2)
- [ ] Setup projet React + Tailwind + Routing
- [ ] Architecture composants et dossiers
- [ ] Système d'authentification (inscription/connexion)
- [ ] Stockage persistant intégré
- [ ] Gestion d'état globale (Context API)
- [ ] Layout principal (Header, Footer, Navigation)

### Sprint 3-4 : Core Features (Semaine 3-4)
- [ ] Formulaire création d'article (multi-étapes)
- [ ] Upload multiple d'images (drag & drop)
- [ ] Page liste articles (grid view)
- [ ] Page détail article
- [ ] Système de recherche avec barre
- [ ] Filtres avancés (catégorie, prix, taille, ville)
- [ ] Tri des résultats (récent, prix, popularité)
- [ ] Édition/suppression d'articles
- [ ] Système de favoris

### Sprint 5-6 : Social et Transactions (Semaine 5-6)
- [ ] Page profil utilisateur (public/privé)
- [ ] Édition profil (photo, bio, infos)
- [ ] Historique ventes/achats
- [ ] Messagerie en temps réel
- [ ] Liste des conversations
- [ ] Notifications messages non lus
- [ ] Flux transaction mode "rencontre"
- [ ] Système de notation (0-5 étoiles)
- [ ] Commentaires vendeur/acheteur
- [ ] Attribution badges automatiques

### Sprint 7-8 : Polish et Déploiement (Semaine 7-8)
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Animations et transitions fluides
- [ ] Loading states et skeletons
- [ ] Messages d'erreur clairs et utiles
- [ ] Optimisation performances (lazy loading images)
- [ ] Validation formulaires robuste
- [ ] Gestion erreurs réseau
- [ ] Accessibilité (a11y)
- [ ] SEO basique (meta tags, sitemap)
- [ ] Tests utilisateurs (5-10 personnes)
- [ ] Build production optimisé
- [ ] Déploiement sur Vercel/Netlify
- [ ] Configuration nom de domaine
- [ ] Analytics (Google Analytics)
- [ ] Monitoring erreurs (Sentry)

### Post-MVP : Paiement et Livraison (Mois 2-3)
- [ ] Migration vers backend API (Node.js/Python)
- [ ] Migration base de données PostgreSQL
- [ ] Intégration PayDunya (Wave, Orange Money)
- [ ] Système ESCROW complet
- [ ] Sélection service de livraison
- [ ] Calcul frais de livraison dynamique
- [ ] Génération étiquettes de livraison
- [ ] Tracking de colis
- [ ] Gestion des litiges (interface admin)
- [ ] Dashboard vendeur (revenus, retraits)

---

## 📊 KPIs et métriques de succès

### Critères de succès MVP
Le MVP sera considéré comme réussi si :
- ✅ **500+ utilisateurs** inscrits en 3 mois
- ✅ **2 000+ articles** publiés
- ✅ **100+ transactions** complétées (rencontre)
- ✅ **Note moyenne plateforme > 4.2/5**
- ✅ **Taux de rétention jour 7 > 15%**
- ✅ **Au moins 10 vendeurs actifs récurrents**

### Métriques à suivre
**Engagement :**
- DAU/MAU ratio (utilisateurs actifs quotidiens/mensuels)
- Temps moyen par session : > 5 minutes
- Nombre de recherches par utilisateur : > 3
- Articles vus par session : > 10

**Performance vendeur :**
- Temps moyen avant première vente : < 14 jours
- Taux de conversion listing : 5-10%
- Taux de réponse messages : > 80%
- Note moyenne vendeurs : > 4.3/5

**Transactions :**
- Panier moyen : 15 000 - 20 000 FCFA
- Taux de litiges : < 2%
- Taux de satisfaction : > 90%

---

## 🛡️ Sécurité et conformité

### Protection des données
- ✅ Chiffrement des mots de passe (bcrypt)
- ✅ Validation stricte des inputs (XSS, injection)
- ✅ Certificat SSL/TLS obligatoire
- ✅ RGPD compliant (consentement, droit à l'effacement)
- ✅ Politique de confidentialité claire

### Prévention des fraudes
- ✅ Système escrow pour transactions à distance
- ✅ Modération proactive des articles
- ✅ Signalement et blocage utilisateurs
- ✅ Vérification identité pour gros montants
- ✅ Détection comportements suspects

---

## 📁 Structure du projet

```
liggeey-mode/
├── public/
│   ├── index.html
│   └── assets/
│       ├── logo.svg
│       └── images/
├── src/
│   ├── components/
│   │   ├── common/          # Composants réutilisables
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Badge.jsx
│   │   ├── layout/          # Layout principal
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Navigation.jsx
│   │   ├── auth/            # Authentification
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── articles/        # Gestion articles
│   │   │   ├── ArticleCard.jsx
│   │   │   ├── ArticleList.jsx
│   │   │   ├── ArticleDetail.jsx
│   │   │   ├── CreateArticle.jsx
│   │   │   └── EditArticle.jsx
│   │   ├── search/          # Recherche et filtres
│   │   │   ├── SearchBar.jsx
│   │   │   ├── Filters.jsx
│   │   │   └── SortOptions.jsx
│   │   ├── messaging/       # Messagerie
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── ConversationList.jsx
│   │   │   └── MessageBubble.jsx
│   │   ├── profile/         # Profils
│   │   │   ├── UserProfile.jsx
│   │   │   ├── EditProfile.jsx
│   │   │   └── SalesHistory.jsx
│   │   └── transactions/    # Transactions
│   │       ├── OrderSummary.jsx
│   │       ├── RatingForm.jsx
│   │       └── TransactionHistory.jsx
│   ├── pages/               # Pages principales
│   │   ├── Home.jsx
│   │   ├── Browse.jsx
│   │   ├── ArticlePage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── MessagesPage.jsx
│   │   ├── FavoritesPage.jsx
│   │   ├── SellPage.jsx
│   │   └── NotFound.jsx
│   ├── context/             # State management
│   │   ├── AuthContext.jsx
│   │   ├── ArticlesContext.jsx
│   │   └── MessagingContext.jsx
│   ├── hooks/               # Custom hooks
│   │   ├── useAuth.js
│   │   ├── useArticles.js
│   │   └── useMessaging.js
│   ├── utils/               # Utilitaires
│   │   ├── storage.js       # API stockage persistant
│   │   ├── validators.js    # Validation formulaires
│   │   ├── formatters.js    # Formatage prix, dates
│   │   └── constants.js     # Constantes (catégories, tailles)
│   ├── styles/
│   │   └── index.css        # Tailwind + styles globaux
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🎨 Design System

### Palette de couleurs
```css
/* Principales */
--primary: #2E7D32      /* Vert (action, success) */
--secondary: #FF9800    /* Orange (accents, warnings) */
--dark: #212121         /* Texte principal */
--light: #F5F5F5        /* Arrière-plans */

/* États */
--success: #4CAF50
--error: #F44336
--warning: #FFC107
--info: #2196F3

/* Gris */
--gray-100: #F5F5F5
--gray-300: #E0E0E0
--gray-500: #9E9E9E
--gray-700: #616161
--gray-900: #212121
```

### Typographie
```css
/* Titres */
h1: text-4xl font-bold (36px)
h2: text-3xl font-semibold (30px)
h3: text-2xl font-semibold (24px)
h4: text-xl font-medium (20px)

/* Corps */
body: text-base (16px)
small: text-sm (14px)
tiny: text-xs (12px)
```

### Espacements
```
xs: 0.25rem (4px)
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
2xl: 3rem (48px)
```

---

## 🧪 Tests

### Tests à implémenter
- [ ] Tests unitaires (composants critiques)
- [ ] Tests d'intégration (flux utilisateur)
- [ ] Tests e2e (Cypress/Playwright)
- [ ] Tests accessibilité (axe-core)
- [ ] Tests performance (Lighthouse)

### Commandes
```bash
# Tests unitaires
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:coverage
```

---

## 📦 Installation et lancement

### Prérequis
```
Node.js >= 18.x
npm >= 9.x ou yarn >= 1.22
```

### Installation
```bash
# Cloner le repo
git clone https://github.com/votre-username/liggeey-mode.git
cd liggeey-mode

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

### Variables d'environnement
Créer un fichier `.env` à la racine :
```env
VITE_APP_NAME=Liggéey Mode
VITE_APP_URL=https://liggeeymode.sn
VITE_API_URL=http://localhost:3000 (phase 2)
VITE_PAYDUNYA_KEY=your_key_here (phase 2)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud (phase 2)
```

---

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Production
vercel --prod
```

### Netlify
```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Déployer
netlify deploy

# Production
netlify deploy --prod
```

### Configuration domaine
1. Acheter `liggeeymode.sn` chez un registrar .sn
2. Ajouter domaine custom dans Vercel/Netlify
3. Configurer DNS (A record ou CNAME)
4. Activer SSL automatique

---

## 📈 Marketing et lancement

### Stratégie de lancement
1. **Bêta fermée** (50 testeurs sélectionnés à Dakar)
2. **Collecte feedback** et itérations rapides
3. **Partenariats influenceurs** mode sénégalais (Instagram/TikTok)
4. **Événement de lancement** physique (friperie Colobane)
5. **Campagne social media** (Instagram, Facebook, WhatsApp)
6. **Programme de parrainage** (1000 FCFA crédit par filleul)

### Canaux d'acquisition
- 📱 **Instagram/TikTok** : Contenu mode, lookbooks, témoignages
- 👥 **Facebook Groups** : Communautés mode Dakar
- 💬 **WhatsApp** : Groupes ciblés, statuts
- 🎓 **Ambassadeurs campus** : UCAD, UGB, universités
- 🏪 **Partenariats friperies** : QR codes en boutique

---

## 🤝 Contribution

### Guidelines
1. **Fork** le projet
2. Créer une **branche feature** (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une **Pull Request**

### Code style
- Utiliser Prettier pour le formatage
- ESLint pour la qualité du code
- Nommer composants en PascalCase
- Nommer fonctions en camelCase
- Commenter le code complexe

---

## 📞 Contact et support

### Équipe
- **Développement Frontend** : [Votre nom]
- **DevOps & Backend** : [À définir]
- **Design** : [À définir]
- **Marketing** : [À définir]

### Liens utiles
- 🌐 **Site web** : https://liggeeymode.sn (à venir)
- 📧 **Email** : contact@liggeeymode.sn
- 📱 **WhatsApp** : +221 XX XXX XX XX
- 📘 **Facebook** : @LiggeeyMode
- 📷 **Instagram** : @liggeeymode

### Ressources
- 📚 [Documentation technique](docs/TECHNICAL.md)
- 🎨 [Guide de design](docs/DESIGN_GUIDE.md)
- 🔧 [API Documentation](docs/API.md) (Phase 2)
- ❓ [FAQ](docs/FAQ.md)

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🙏 Remerciements

Merci à tous ceux qui croient en ce projet et qui veulent transformer la mode d'occasion au Sénégal !

**Liggéey Mode** - *Daay ko, Jënd ko, Liggeey ak yoon wi !*

---

## 📊 Statut du projet

![Status](https://img.shields.io/badge/status-en%20développement-yellow)
![Version](https://img.shields.io/badge/version-0.1.0--MVP-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Dernière mise à jour :** Décembre 2024  
**Lancement prévu :** Février 2025  
**Région cible :** Dakar, Sénégal 🇸🇳
