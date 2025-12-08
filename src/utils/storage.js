// src/utils/storage.js

/**
 * API de stockage persistant pour Liggéey Mode
 * Utilise le stockage intégré de Claude pour sauvegarder les données
 */

const STORAGE_KEYS = {
  USERS: 'liggeey_users',
  ARTICLES: 'liggeey_articles',
  MESSAGES: 'liggeey_messages',
  TRANSACTIONS: 'liggeey_transactions',
  FAVORITES: 'liggeey_favorites',
  CURRENT_USER: 'liggeey_current_user'
};

/**
 * Vérifie si window.storage est disponible
 */
const isStorageAvailable = () => {
  return typeof window !== 'undefined' && window.storage;
};

/**
 * Récupère des données du stockage
 * @param {string} key - Clé de stockage
 * @returns {Promise<any>} Données récupérées
 */
export const getStorageData = async (key) => {
  if (!isStorageAvailable()) {
    console.warn('Storage API not available, using fallback');
    const fallback = localStorage.getItem(key);
    return fallback ? JSON.parse(fallback) : null;
  }

  try {
    const result = await window.storage.get(key);
    return result && result.value ? JSON.parse(result.value) : null;
  } catch (error) {
    console.error(`Error getting ${key}:`, error);
    return null;
  }
};

/**
 * Sauvegarde des données dans le stockage
 * @param {string} key - Clé de stockage
 * @param {any} data - Données à sauvegarder
 * @returns {Promise<boolean>} Succès de l'opération
 */
export const setStorageData = async (key, data) => {
  if (!isStorageAvailable()) {
    console.warn('Storage API not available, using fallback');
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  }

  try {
    await window.storage.set(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error setting ${key}:`, error);
    return false;
  }
};

/**
 * Supprime des données du stockage
 * @param {string} key - Clé de stockage
 * @returns {Promise<boolean>} Succès de l'opération
 */
export const deleteStorageData = async (key) => {
  if (!isStorageAvailable()) {
    localStorage.removeItem(key);
    return true;
  }

  try {
    await window.storage.delete(key);
    return true;
  } catch (error) {
    console.error(`Error deleting ${key}:`, error);
    return false;
  }
};

// ==================== USERS ====================

/**
 * Récupère tous les utilisateurs
 * @returns {Promise<Array>} Liste des utilisateurs
 */
export const getUsers = async () => {
  const users = await getStorageData(STORAGE_KEYS.USERS);
  return users || [];
};

/**
 * Récupère un utilisateur par ID
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<object|null>} Utilisateur trouvé
 */
export const getUserById = async (userId) => {
  const users = await getUsers();
  return users.find(u => u.id === userId) || null;
};

/**
 * Récupère un utilisateur par email
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<object|null>} Utilisateur trouvé
 */
export const getUserByEmail = async (email) => {
  const users = await getUsers();
  return users.find(u => u.email === email) || null;
};

/**
 * Crée un nouvel utilisateur
 * @param {object} userData - Données de l'utilisateur
 * @returns {Promise<object>} Utilisateur créé
 */
export const createUser = async (userData) => {
  const users = await getUsers();
  const newUser = {
    ...userData,
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    rating: 0,
    totalSales: 0,
    totalPurchases: 0,
    badges: ['new']
  };
  users.push(newUser);
  await setStorageData(STORAGE_KEYS.USERS, users);
  return newUser;
};

/**
 * Met à jour un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {object} updates - Données à mettre à jour
 * @returns {Promise<object|null>} Utilisateur mis à jour
 */
export const updateUser = async (userId, updates) => {
  const users = await getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates, updatedAt: new Date().toISOString() };
  await setStorageData(STORAGE_KEYS.USERS, users);
  return users[index];
};

// ==================== CURRENT USER ====================

/**
 * Récupère l'utilisateur connecté
 * @returns {Promise<object|null>} Utilisateur connecté
 */
export const getCurrentUser = async () => {
  return await getStorageData(STORAGE_KEYS.CURRENT_USER);
};

/**
 * Définit l'utilisateur connecté
 * @param {object} user - Utilisateur à connecter
 * @returns {Promise<boolean>} Succès de l'opération
 */
export const setCurrentUser = async (user) => {
  return await setStorageData(STORAGE_KEYS.CURRENT_USER, user);
};

/**
 * Déconnecte l'utilisateur actuel
 * @returns {Promise<boolean>} Succès de l'opération
 */
export const clearCurrentUser = async () => {
  return await deleteStorageData(STORAGE_KEYS.CURRENT_USER);
};

// ==================== ARTICLES ====================

/**
 * Récupère tous les articles
 * @returns {Promise<Array>} Liste des articles
 */
export const getArticles = async () => {
  const articles = await getStorageData(STORAGE_KEYS.ARTICLES);
  return articles || [];
};

/**
 * Récupère un article par ID
 * @param {string} articleId - ID de l'article
 * @returns {Promise<object|null>} Article trouvé
 */
export const getArticleById = async (articleId) => {
  const articles = await getArticles();
  return articles.find(a => a.id === articleId) || null;
};

/**
 * Crée un nouvel article
 * @param {object} articleData - Données de l'article
 * @returns {Promise<object>} Article créé
 */
export const createArticle = async (articleData) => {
  const articles = await getArticles();
  const newArticle = {
    ...articleData,
    id: `article_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    views: 0,
    favorites: 0,
    isAvailable: true
  };
  articles.push(newArticle);
  await setStorageData(STORAGE_KEYS.ARTICLES, articles);
  return newArticle;
};

/**
 * Met à jour un article
 * @param {string} articleId - ID de l'article
 * @param {object} updates - Données à mettre à jour
 * @returns {Promise<object|null>} Article mis à jour
 */
export const updateArticle = async (articleId, updates) => {
  const articles = await getArticles();
  const index = articles.findIndex(a => a.id === articleId);
  if (index === -1) return null;
  
  articles[index] = { ...articles[index], ...updates, updatedAt: new Date().toISOString() };
  await setStorageData(STORAGE_KEYS.ARTICLES, articles);
  return articles[index];
};

/**
 * Supprime un article
 * @param {string} articleId - ID de l'article
 * @returns {Promise<boolean>} Succès de l'opération
 */
export const deleteArticle = async (articleId) => {
  const articles = await getArticles();
  const filtered = articles.filter(a => a.id !== articleId);
  return await setStorageData(STORAGE_KEYS.ARTICLES, filtered);
};

/**
 * Incrémente le compteur de vues d'un article
 * @param {string} articleId - ID de l'article
 * @returns {Promise<boolean>} Succès de l'opération
 */
export const incrementArticleViews = async (articleId) => {
  const article = await getArticleById(articleId);
  if (!article) return false;
  return await updateArticle(articleId, { views: (article.views || 0) + 1 });
};

// ==================== FAVORITES ====================

/**
 * Récupère les favoris d'un utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Array>} Liste des IDs d'articles favoris
 */
export const getUserFavorites = async (userId) => {
  const favorites = await getStorageData(STORAGE_KEYS.FAVORITES);
  return favorites ? (favorites[userId] || []) : [];
};

/**
 * Ajoute un article aux favoris
 * @param {string} userId - ID de l'utilisateur
 * @param {string} articleId - ID de l'article
 * @returns {Promise<boolean>} Succès de l'opération
 */
export const addToFavorites = async (userId, articleId) => {
  const favorites = (await getStorageData(STORAGE_KEYS.FAVORITES)) || {};
  if (!favorites[userId]) favorites[userId] = [];
  if (!favorites[userId].includes(articleId)) {
    favorites[userId].push(articleId);
  }
  return await setStorageData(STORAGE_KEYS.FAVORITES, favorites);
};

/**
 * Retire un article des favoris
 * @param {string} userId - ID de l'utilisateur
 * @param {string} articleId - ID de l'article
 * @returns {Promise<boolean>} Succès de l'opération
 */
export const removeFromFavorites = async (userId, articleId) => {
  const favorites = (await getStorageData(STORAGE_KEYS.FAVORITES)) || {};
  if (favorites[userId]) {
    favorites[userId] = favorites[userId].filter(id => id !== articleId);
  }
  return await setStorageData(STORAGE_KEYS.FAVORITES, favorites);
};

// ==================== MESSAGES ====================

/**
 * Récupère tous les messages
 * @returns {Promise<Array>} Liste des messages
 */
export const getMessages = async () => {
  const messages = await getStorageData(STORAGE_KEYS.MESSAGES);
  return messages || [];
};

/**
 * Crée un nouveau message
 * @param {object} messageData - Données du message
 * @returns {Promise<object>} Message créé
 */
export const createMessage = async (messageData) => {
  const messages = await getMessages();
  const newMessage = {
    ...messageData,
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    isRead: false
  };
  messages.push(newMessage);
  await setStorageData(STORAGE_KEYS.MESSAGES, messages);
  return newMessage;
};

/**
 * Récupère les messages d'une conversation
 * @param {string} userId1 - ID du premier utilisateur
 * @param {string} userId2 - ID du second utilisateur
 * @returns {Promise<Array>} Messages de la conversation
 */
export const getConversationMessages = async (userId1, userId2) => {
  const messages = await getMessages();
  return messages.filter(m => 
    (m.senderId === userId1 && m.receiverId === userId2) ||
    (m.senderId === userId2 && m.receiverId === userId1)
  ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

/**
 * Marque un message comme lu
 * @param {string} messageId - ID du message
 * @returns {Promise<boolean>} Succès de l'opération
 */
export const markMessageAsRead = async (messageId) => {
  const messages = await getMessages();
  const index = messages.findIndex(m => m.id === messageId);
  if (index === -1) return false;
  messages[index].isRead = true;
  return await setStorageData(STORAGE_KEYS.MESSAGES, messages);
};

// ==================== TRANSACTIONS ====================

/**
 * Récupère toutes les transactions
 * @returns {Promise<Array>} Liste des transactions
 */
export const getTransactions = async () => {
  const transactions = await getStorageData(STORAGE_KEYS.TRANSACTIONS);
  return transactions || [];
};

/**
 * Crée une nouvelle transaction
 * @param {object} transactionData - Données de la transaction
 * @returns {Promise<object>} Transaction créée
 */
export const createTransaction = async (transactionData) => {
  const transactions = await getTransactions();
  const newTransaction = {
    ...transactionData,
    id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  transactions.push(newTransaction);
  await setStorageData(STORAGE_KEYS.TRANSACTIONS, transactions);
  return newTransaction;
};

/**
 * Met à jour une transaction
 * @param {string} transactionId - ID de la transaction
 * @param {object} updates - Données à mettre à jour
 * @returns {Promise<object|null>} Transaction mise à jour
 */
export const updateTransaction = async (transactionId, updates) => {
  const transactions = await getTransactions();
  const index = transactions.findIndex(t => t.id === transactionId);
  if (index === -1) return null;
  
  transactions[index] = { ...transactions[index], ...updates };
  await setStorageData(STORAGE_KEYS.TRANSACTIONS, transactions);
  return transactions[index];
};

export default {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  incrementArticleViews,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites,
  getMessages,
  createMessage,
  getConversationMessages,
  markMessageAsRead,
  getTransactions,
  createTransaction,
  updateTransaction
};
