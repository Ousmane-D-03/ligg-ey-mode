// src/utils/validators.js
import { VALIDATION_REGEX, PRICE_LIMITS, IMAGE_LIMITS } from './constants';

/**
 * Valide une adresse email
 * @param {string} email - Email à valider
 * @returns {object} {valid: boolean, error: string}
 */
export const validateEmail = (email) => {
  if (!email) {
    return { valid: false, error: 'L\'email est requis' };
  }
  
  if (!VALIDATION_REGEX.EMAIL.test(email)) {
    return { valid: false, error: 'Email invalide' };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide un numéro de téléphone sénégalais
 * @param {string} phone - Numéro à valider
 * @returns {object} {valid: boolean, error: string}
 */
export const validatePhone = (phone) => {
  if (!phone) {
    return { valid: false, error: 'Le numéro de téléphone est requis' };
  }
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (!VALIDATION_REGEX.PHONE_SN.test(cleaned)) {
    return { 
      valid: false, 
      error: 'Numéro invalide. Format: 77 XXX XX XX' 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide un mot de passe
 * @param {string} password - Mot de passe à valider
 * @returns {object} {valid: boolean, error: string}
 */
export const validatePassword = (password) => {
  if (!password) {
    return { valid: false, error: 'Le mot de passe est requis' };
  }
  
  if (password.length < 8) {
    return { 
      valid: false, 
      error: 'Le mot de passe doit contenir au moins 8 caractères' 
    };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { 
      valid: false, 
      error: 'Le mot de passe doit contenir au moins une majuscule' 
    };
  }
  
  if (!/[a-z]/.test(password)) {
    return { 
      valid: false, 
      error: 'Le mot de passe doit contenir au moins une minuscule' 
    };
  }
  
  if (!/[0-9]/.test(password)) {
    return { 
      valid: false, 
      error: 'Le mot de passe doit contenir au moins un chiffre' 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide la confirmation de mot de passe
 * @param {string} password - Mot de passe
 * @param {string} confirmPassword - Confirmation
 * @returns {object} {valid: boolean, error: string}
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (!confirmPassword) {
    return { valid: false, error: 'Veuillez confirmer le mot de passe' };
  }
  
  if (password !== confirmPassword) {
    return { 
      valid: false, 
      error: 'Les mots de passe ne correspondent pas' 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide un nom
 * @param {string} name - Nom à valider
 * @param {string} fieldName - Nom du champ pour message d'erreur
 * @returns {object} {valid: boolean, error: string}
 */
export const validateName = (name, fieldName = 'Nom') => {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: `${fieldName} est requis` };
  }
  
  if (name.trim().length < 2) {
    return { 
      valid: false, 
      error: `${fieldName} doit contenir au moins 2 caractères` 
    };
  }
  
  if (name.trim().length > 50) {
    return { 
      valid: false, 
      error: `${fieldName} ne peut pas dépasser 50 caractères` 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide un prix
 * @param {string|number} price - Prix à valider
 * @returns {object} {valid: boolean, error: string}
 */
export const validatePrice = (price) => {
  if (!price && price !== 0) {
    return { valid: false, error: 'Le prix est requis' };
  }
  
  const priceNum = typeof price === 'string' ? parseInt(price, 10) : price;
  
  if (isNaN(priceNum)) {
    return { valid: false, error: 'Le prix doit être un nombre' };
  }
  
  if (priceNum < PRICE_LIMITS.MIN) {
    return { 
      valid: false, 
      error: `Le prix minimum est de ${PRICE_LIMITS.MIN} FCFA` 
    };
  }
  
  if (priceNum > PRICE_LIMITS.MAX) {
    return { 
      valid: false, 
      error: `Le prix maximum est de ${PRICE_LIMITS.MAX} FCFA` 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide un titre d'article
 * @param {string} title - Titre à valider
 * @returns {object} {valid: boolean, error: string}
 */
export const validateArticleTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Le titre est requis' };
  }
  
  if (title.trim().length < 10) {
    return { 
      valid: false, 
      error: 'Le titre doit contenir au moins 10 caractères' 
    };
  }
  
  if (title.trim().length > 100) {
    return { 
      valid: false, 
      error: 'Le titre ne peut pas dépasser 100 caractères' 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide une description d'article
 * @param {string} description - Description à valider
 * @returns {object} {valid: boolean, error: string}
 */
export const validateArticleDescription = (description) => {
  if (!description || description.trim().length === 0) {
    return { valid: false, error: 'La description est requise' };
  }
  
  if (description.trim().length < 50) {
    return { 
      valid: false, 
      error: 'La description doit contenir au moins 50 caractères' 
    };
  }
  
  if (description.trim().length > 2000) {
    return { 
      valid: false, 
      error: 'La description ne peut pas dépasser 2000 caractères' 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide un ensemble d'images
 * @param {Array} images - Liste d'images
 * @returns {object} {valid: boolean, error: string}
 */
export const validateArticleImages = (images) => {
  if (!images || images.length === 0) {
    return { 
      valid: false, 
      error: 'Au moins une image est requise' 
    };
  }
  
  if (images.length < IMAGE_LIMITS.MIN) {
    return { 
      valid: false, 
      error: `Vous devez ajouter au moins ${IMAGE_LIMITS.MIN} images` 
    };
  }
  
  if (images.length > IMAGE_LIMITS.MAX) {
    return { 
      valid: false, 
      error: `Vous ne pouvez pas ajouter plus de ${IMAGE_LIMITS.MAX} images` 
    };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide un champ requis
 * @param {any} value - Valeur à valider
 * @param {string} fieldName - Nom du champ
 * @returns {object} {valid: boolean, error: string}
 */
export const validateRequired = (value, fieldName = 'Ce champ') => {
  if (!value || (typeof value === 'string' && value.trim().length === 0)) {
    return { valid: false, error: `${fieldName} est requis` };
  }
  
  return { valid: true, error: null };
};

/**
 * Valide un formulaire d'inscription
 * @param {object} formData - Données du formulaire
 * @returns {object} {valid: boolean, errors: object}
 */
export const validateSignupForm = (formData) => {
  const errors = {};
  
  const nameValidation = validateName(formData.fullName, 'Nom complet');
  if (!nameValidation.valid) errors.fullName = nameValidation.error;
  
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.valid) errors.email = emailValidation.error;
  
  const phoneValidation = validatePhone(formData.phone);
  if (!phoneValidation.valid) errors.phone = phoneValidation.error;
  
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.valid) errors.password = passwordValidation.error;
  
  const confirmValidation = validatePasswordConfirmation(
    formData.password, 
    formData.confirmPassword
  );
  if (!confirmValidation.valid) errors.confirmPassword = confirmValidation.error;
  
  const cityValidation = validateRequired(formData.city, 'La ville');
  if (!cityValidation.valid) errors.city = cityValidation.error;
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valide un formulaire de connexion
 * @param {object} formData - Données du formulaire
 * @returns {object} {valid: boolean, errors: object}
 */
export const validateLoginForm = (formData) => {
  const errors = {};
  
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.valid) errors.email = emailValidation.error;
  
  const passwordValidation = validateRequired(formData.password, 'Mot de passe');
  if (!passwordValidation.valid) errors.password = passwordValidation.error;
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Valide un formulaire d'article
 * @param {object} formData - Données du formulaire
 * @returns {object} {valid: boolean, errors: object}
 */
export const validateArticleForm = (formData) => {
  const errors = {};
  
  const titleValidation = validateArticleTitle(formData.title);
  if (!titleValidation.valid) errors.title = titleValidation.error;
  
  const descValidation = validateArticleDescription(formData.description);
  if (!descValidation.valid) errors.description = descValidation.error;
  
  const priceValidation = validatePrice(formData.price);
  if (!priceValidation.valid) errors.price = priceValidation.error;
  
  const categoryValidation = validateRequired(formData.category, 'La catégorie');
  if (!categoryValidation.valid) errors.category = categoryValidation.error;
  
  const sizeValidation = validateRequired(formData.size, 'La taille');
  if (!sizeValidation.valid) errors.size = sizeValidation.error;
  
  const conditionValidation = validateRequired(formData.condition, 'L\'état');
  if (!conditionValidation.valid) errors.condition = conditionValidation.error;
  
  const brandValidation = validateRequired(formData.brand, 'La marque');
  if (!brandValidation.valid) errors.brand = brandValidation.error;
  
  const cityValidation = validateRequired(formData.city, 'La ville');
  if (!cityValidation.valid) errors.city = cityValidation.error;
  
  const imagesValidation = validateArticleImages(formData.images);
  if (!imagesValidation.valid) errors.images = imagesValidation.error;
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validatePasswordConfirmation,
  validateName,
  validatePrice,
  validateArticleTitle,
  validateArticleDescription,
  validateArticleImages,
  validateRequired,
  validateSignupForm,
  validateLoginForm,
  validateArticleForm
};
