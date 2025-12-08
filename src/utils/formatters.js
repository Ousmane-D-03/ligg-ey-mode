// src/utils/formatters.js

/**
 * Formate un prix en FCFA avec séparateurs de milliers
 * @param {number} price - Prix en FCFA
 * @returns {string} Prix formaté (ex: "15 000 FCFA")
 */
export const formatPrice = (price) => {
  if (!price && price !== 0) return '0 FCFA';
  return `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} FCFA`;
};

/**
 * Formate une date relative (il y a X temps)
 * @param {Date|string} date - Date à formatter
 * @returns {string} Date relative (ex: "il y a 2 heures")
 */
export const formatRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `il y a ${diffMins} min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays < 30) return `il y a ${diffDays}j`;
  if (diffMonths < 12) return `il y a ${diffMonths} mois`;
  return `il y a ${diffYears} an${diffYears > 1 ? 's' : ''}`;
};

/**
 * Formate une date complète
 * @param {Date|string} date - Date à formatter
 * @returns {string} Date formatée (ex: "15 décembre 2024")
 */
export const formatFullDate = (date) => {
  const d = new Date(date);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('fr-FR', options);
};

/**
 * Formate un numéro de téléphone sénégalais
 * @param {string} phone - Numéro de téléphone
 * @returns {string} Numéro formaté (ex: "77 123 45 67")
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 9) {
    return `${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

/**
 * Tronque un texte avec ellipse
 * @param {string} text - Texte à tronquer
 * @param {number} maxLength - Longueur maximale
 * @returns {string} Texte tronqué
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Calcule la commission sur une vente
 * @param {number} price - Prix de l'article
 * @param {number} rate - Taux de commission (0.08 pour 8%)
 * @param {number} minCommission - Commission minimale
 * @returns {number} Commission en FCFA
 */
export const calculateCommission = (price, rate = 0.08, minCommission = 200) => {
  const commission = Math.round(price * rate);
  return Math.max(commission, minCommission);
};

/**
 * Génère un slug à partir d'un titre
 * @param {string} title - Titre à slugifier
 * @returns {string} Slug (ex: "robe-rouge-taille-m")
 */
export const slugify = (title) => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Génère un ID unique
 * @returns {string} ID unique
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Formate la note moyenne avec étoiles
 * @param {number} rating - Note (0-5)
 * @returns {string} Note formatée (ex: "4.5 ⭐")
 */
export const formatRating = (rating) => {
  if (!rating && rating !== 0) return 'Pas encore noté';
  return `${rating.toFixed(1)} ⭐`;
};

/**
 * Calcule le montant total d'une transaction
 * @param {number} price - Prix article
 * @param {number} deliveryFee - Frais de livraison
 * @param {number} commission - Commission
 * @returns {object} Détails du montant
 */
export const calculateTransactionTotal = (price, deliveryFee = 0, commission = 0) => {
  const total = price + deliveryFee + commission;
  return {
    itemPrice: price,
    deliveryFee,
    commission,
    total
  };
};

/**
 * Valide une image uploadée
 * @param {File} file - Fichier image
 * @param {number} maxSizeMB - Taille max en MB
 * @returns {object} {valid: boolean, error: string}
 */
export const validateImage = (file, maxSizeMB = 5) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Format non supporté. Utilisez JPG, PNG ou WebP'
    };
  }
  
  const maxSize = maxSizeMB * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `L'image est trop grande (max ${maxSizeMB}MB)`
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Convertit une image en base64
 * @param {File} file - Fichier image
 * @returns {Promise<string>} Base64 de l'image
 */
export const imageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

/**
 * Formate un nombre avec K, M (1000 = 1K)
 * @param {number} num - Nombre à formatter
 * @returns {string} Nombre formaté
 */
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Extrait les initiales d'un nom
 * @param {string} name - Nom complet
 * @returns {string} Initiales (ex: "JD" pour "John Doe")
 */
export const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};

/**
 * Génère une couleur de fond aléatoire pour avatar
 * @param {string} name - Nom de l'utilisateur
 * @returns {string} Couleur hexadécimale
 */
export const getAvatarColor = (name) => {
  const colors = [
    '#2E7D32', '#1976D2', '#D32F2F', '#F57C00',
    '#7B1FA2', '#0097A7', '#689F38', '#C2185B'
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export default {
  formatPrice,
  formatRelativeTime,
  formatFullDate,
  formatPhoneNumber,
  truncateText,
  calculateCommission,
  slugify,
  generateId,
  formatRating,
  calculateTransactionTotal,
  validateImage,
  imageToBase64,
  formatNumber,
  getInitials,
  getAvatarColor
};
