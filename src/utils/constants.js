// src/utils/constants.js

// Catégories d'articles
export const CATEGORIES = {
  ROBES: 'robes',
  PANTALONS: 'pantalons',
  JUPES: 'jupes',
  HAUTS: 'hauts',
  CHAUSSURES: 'chaussures',
  SACS: 'sacs',
  ACCESSOIRES: 'accessoires',
  SPORT: 'sport',
  ENFANTS: 'enfants',
  HOMME: 'homme'
};

export const CATEGORY_LABELS = {
  [CATEGORIES.ROBES]: 'Robes',
  [CATEGORIES.PANTALONS]: 'Pantalons',
  [CATEGORIES.JUPES]: 'Jupes',
  [CATEGORIES.HAUTS]: 'Hauts & T-shirts',
  [CATEGORIES.CHAUSSURES]: 'Chaussures',
  [CATEGORIES.SACS]: 'Sacs',
  [CATEGORIES.ACCESSOIRES]: 'Accessoires',
  [CATEGORIES.SPORT]: 'Sport',
  [CATEGORIES.ENFANTS]: 'Enfants',
  [CATEGORIES.HOMME]: 'Homme'
};

// Tailles disponibles
export const SIZES = {
  CLOTHING: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
  SHOES_EU: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46'],
  KIDS: ['2 ans', '3 ans', '4 ans', '5 ans', '6 ans', '8 ans', '10 ans', '12 ans', '14 ans', '16 ans']
};

// États des articles
export const CONDITION = {
  NEW: 'new',
  VERY_GOOD: 'very_good',
  GOOD: 'good',
  ACCEPTABLE: 'acceptable'
};

export const CONDITION_LABELS = {
  [CONDITION.NEW]: 'Neuf avec étiquette',
  [CONDITION.VERY_GOOD]: 'Très bon état',
  [CONDITION.GOOD]: 'Bon état',
  [CONDITION.ACCEPTABLE]: 'État satisfaisant'
};

// Villes du Sénégal
export const CITIES = [
  'Dakar',
  'Pikine',
  'Guédiawaye',
  'Rufisque',
  'Thiès',
  'Kaolack',
  'Saint-Louis',
  'Mbour',
  'Ziguinchor',
  'Diourbel',
  'Louga',
  'Tambacounda',
  'Kolda',
  'Fatick',
  'Kaffrine',
  'Sédhiou',
  'Matam',
  'Kédougou'
];

// Options de livraison
export const DELIVERY_OPTIONS = {
  MEETUP: 'meetup',
  SHIPPING: 'shipping'
};

export const DELIVERY_LABELS = {
  [DELIVERY_OPTIONS.MEETUP]: 'Rencontre en personne',
  [DELIVERY_OPTIONS.SHIPPING]: 'Livraison'
};

// Types de compte
export const ACCOUNT_TYPES = {
  INDIVIDUAL: 'individual',
  BUSINESS: 'business'
};

export const ACCOUNT_TYPE_LABELS = {
  [ACCOUNT_TYPES.INDIVIDUAL]: 'Particulier',
  [ACCOUNT_TYPES.BUSINESS]: 'Entreprise'
};

// Badges utilisateur
export const USER_BADGES = {
  NEW: 'new',
  RELIABLE: 'reliable',
  TOP_SELLER: 'top_seller',
  FAST_REPLY: 'fast_reply',
  VERIFIED: 'verified'
};

export const BADGE_LABELS = {
  [USER_BADGES.NEW]: 'Nouveau',
  [USER_BADGES.RELIABLE]: 'Vendeur fiable',
  [USER_BADGES.TOP_SELLER]: 'Top vendeur',
  [USER_BADGES.FAST_REPLY]: 'Réponse rapide',
  [USER_BADGES.VERIFIED]: 'Vérifié'
};

// Limites de prix (en FCFA)
export const PRICE_LIMITS = {
  MIN: 500,
  MAX: 500000
};

// Limites d'images
export const IMAGE_LIMITS = {
  MIN: 3,
  MAX: 10,
  MAX_SIZE_MB: 5
};

// Statuts de transaction
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed'
};

// Statuts de paiement
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  HELD: 'held',
  RELEASED: 'released',
  REFUNDED: 'refunded'
};

// Moyens de paiement
export const PAYMENT_METHODS = {
  CASH: 'cash',
  WAVE: 'wave',
  ORANGE_MONEY: 'orange_money',
  FREE_MONEY: 'free_money'
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHODS.CASH]: 'Espèces',
  [PAYMENT_METHODS.WAVE]: 'Wave',
  [PAYMENT_METHODS.ORANGE_MONEY]: 'Orange Money',
  [PAYMENT_METHODS.FREE_MONEY]: 'Free Money'
};

// Taux de commission
export const COMMISSION_RATES = {
  [ACCOUNT_TYPES.INDIVIDUAL]: 0.08, // 8%
  [ACCOUNT_TYPES.BUSINESS]: 0.05     // 5%
};

export const MIN_COMMISSION = 200; // FCFA

// Frais de livraison de base (en FCFA)
export const SHIPPING_FEES = {
  DAKAR_INTRA: 1500,
  DAKAR_REGION: 2500,
  OTHER_REGIONS: 3500,
  EXPRESS: 5000
};

// Messages système
export const SYSTEM_MESSAGES = {
  WELCOME: 'Bienvenue sur Liggéey Mode !',
  ARTICLE_PUBLISHED: 'Votre article a été publié avec succès',
  ARTICLE_SOLD: 'Félicitations ! Votre article a été vendu',
  TRANSACTION_COMPLETED: 'Transaction terminée. N\'oubliez pas de noter votre partenaire',
  ERROR_GENERIC: 'Une erreur est survenue. Veuillez réessayer.'
};

// Durées (en jours)
export const DURATIONS = {
  ESCROW_RELEASE: 7,           // Libération auto après 7 jours
  SHIPPING_DEADLINE: 2,        // Vendeur doit expédier sous 2 jours
  DISPUTE_RESOLUTION: 5,       // Résolution litige en 5 jours max
  NEW_SELLER_DELAY: 14        // Paiement retardé pour nouveaux vendeurs
};

// Seuils pour badges
export const BADGE_THRESHOLDS = {
  RELIABLE_SALES: 20,
  RELIABLE_RATING: 4.5,
  TOP_SELLER_SALES: 100,
  TOP_SELLER_RATING: 4.7,
  FAST_REPLY_HOURS: 2
};

// Regex pour validation
export const VALIDATION_REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_SN: /^(77|78|76|70|75)[0-9]{7}$/,
  PRICE: /^[0-9]+$/
};

// Routes de l'application
export const ROUTES = {
  HOME: '/',
  BROWSE: '/parcourir',
  ARTICLE: '/article/:id',
  PROFILE: '/profil/:id',
  MY_PROFILE: '/mon-profil',
  MESSAGES: '/messages',
  FAVORITES: '/favoris',
  SELL: '/vendre',
  LOGIN: '/connexion',
  SIGNUP: '/inscription',
  SETTINGS: '/parametres'
};

export default {
  CATEGORIES,
  CATEGORY_LABELS,
  SIZES,
  CONDITION,
  CONDITION_LABELS,
  CITIES,
  DELIVERY_OPTIONS,
  DELIVERY_LABELS,
  ACCOUNT_TYPES,
  ACCOUNT_TYPE_LABELS,
  USER_BADGES,
  BADGE_LABELS,
  PRICE_LIMITS,
  IMAGE_LIMITS,
  TRANSACTION_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
  COMMISSION_RATES,
  MIN_COMMISSION,
  SHIPPING_FEES,
  SYSTEM_MESSAGES,
  DURATIONS,
  BADGE_THRESHOLDS,
  VALIDATION_REGEX,
  ROUTES
};
