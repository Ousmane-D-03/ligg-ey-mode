// src/context/ArticlesContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  incrementArticleViews,
  getUserFavorites,
  addToFavorites,
  removeFromFavorites
} from '../utils/storage';
import { validateArticleForm } from '../utils/validators';
import { useAuth } from './AuthContext';

const ArticlesContext = createContext();

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (!context) {
    throw new Error('useArticles must be used within ArticlesProvider');
  }
  return context;
};

export const ArticlesProvider = ({ children }) => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    size: '',
    condition: '',
    city: '',
    search: ''
  });
  const [sortBy, setSortBy] = useState('recent'); // recent, price-asc, price-desc, popular

  // Charger les articles au démarrage
  useEffect(() => {
    loadArticles();
  }, []);

  // Charger les favoris quand l'utilisateur change
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const data = await getArticles();
      setArticles(data);
    } catch (err) {
      console.error('Error loading articles:', err);
      setError('Erreur lors du chargement des articles');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      if (!user) return;
      const favs = await getUserFavorites(user.id);
      setFavorites(favs);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  };

  /**
   * Créer un nouvel article
   */
  const createNewArticle = async (formData) => {
    try {
      if (!user) {
        return { success: false, error: 'Vous devez être connecté' };
      }

      setError(null);
      setLoading(true);

      // Validation
      const validation = validateArticleForm(formData);
      if (!validation.valid) {
        setError(validation.errors);
        return { success: false, errors: validation.errors };
      }

      // Créer l'article
      const newArticle = await createArticle({
        ...formData,
        sellerId: user.id,
        sellerName: user.fullName,
        sellerCity: user.city,
        sellerRating: user.rating || 0,
        quantity: formData.quantity || 1,
        initialQuantity: formData.quantity || 1 // Pour historique
      });

      // Ajouter à la liste locale
      setArticles(prev => [newArticle, ...prev]);

      return { success: true, article: newArticle };
    } catch (err) {
      console.error('Create article error:', err);
      const errorMsg = 'Erreur lors de la création de l\'article';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Mettre à jour un article
   */
  const updateExistingArticle = async (articleId, updates) => {
    try {
      setLoading(true);
      const updated = await updateArticle(articleId, updates);
      
      if (updated) {
        // Mettre à jour dans la liste locale
        setArticles(prev =>
          prev.map(a => (a.id === articleId ? updated : a))
        );
        return { success: true, article: updated };
      }

      return { success: false, error: 'Article non trouvé' };
    } catch (err) {
      console.error('Update article error:', err);
      return { success: false, error: 'Erreur lors de la mise à jour' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Décrémenter le stock d'un article
   */
  const decrementStock = async (articleId) => {
    try {
      const article = await getArticle(articleId);
      if (!article) return { success: false, error: 'Article non trouvé' };

      const newQuantity = (article.quantity || 1) - 1;
      
      // Si stock à 0, marquer comme non disponible
      const updates = {
        quantity: Math.max(0, newQuantity),
        isAvailable: newQuantity > 0
      };

      await updateArticle(articleId, updates);
      
      // Mettre à jour dans la liste locale
      setArticles(prev =>
        prev.map(a => (a.id === articleId ? { ...a, ...updates } : a))
      );

      return { success: true, newQuantity };
    } catch (err) {
      console.error('Decrement stock error:', err);
      return { success: false, error: 'Erreur' };
    }
  };
  const deleteExistingArticle = async (articleId) => {
    try {
      setLoading(true);
      const success = await deleteArticle(articleId);
      
      if (success) {
        // Retirer de la liste locale
        setArticles(prev => prev.filter(a => a.id !== articleId));
        return { success: true };
      }

      return { success: false, error: 'Erreur lors de la suppression' };
    } catch (err) {
      console.error('Delete article error:', err);
      return { success: false, error: 'Erreur lors de la suppression' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupérer un article par ID
   */
  const getArticle = async (articleId) => {
    try {
      const article = await getArticleById(articleId);
      if (article) {
        // Incrémenter les vues
        await incrementArticleViews(articleId);
      }
      return article;
    } catch (err) {
      console.error('Get article error:', err);
      return null;
    }
  };

  /**
   * Filtrer et trier les articles
   */
  const getFilteredArticles = () => {
    let filtered = [...articles];

    // Filtrer par disponibilité ET stock
    filtered = filtered.filter(a => a.isAvailable && (a.quantity || 1) > 0);

    // Filtrer par recherche
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        a =>
          a.title.toLowerCase().includes(search) ||
          a.description.toLowerCase().includes(search) ||
          a.brand.toLowerCase().includes(search)
      );
    }

    // Filtrer par catégorie
    if (filters.category) {
      filtered = filtered.filter(a => a.category === filters.category);
    }

    // Filtrer par prix
    if (filters.minPrice) {
      filtered = filtered.filter(a => a.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(a => a.price <= parseInt(filters.maxPrice));
    }

    // Filtrer par taille
    if (filters.size) {
      filtered = filtered.filter(a => a.size === filters.size);
    }

    // Filtrer par état
    if (filters.condition) {
      filtered = filtered.filter(a => a.condition === filters.condition);
    }

    // Filtrer par ville
    if (filters.city) {
      filtered = filtered.filter(a => a.city === filters.city);
    }

    // Trier
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }

    return filtered;
  };

  /**
   * Récupérer les articles d'un vendeur
   */
  const getSellerArticles = (sellerId) => {
    return articles.filter(a => a.sellerId === sellerId);
  };

  /**
   * Récupérer les articles favoris
   */
  const getFavoriteArticles = () => {
    return articles.filter(a => favorites.includes(a.id));
  };

  /**
   * Ajouter/retirer des favoris
   */
  const toggleFavorite = async (articleId) => {
    try {
      if (!user) {
        return { success: false, error: 'Vous devez être connecté' };
      }

      const isFavorite = favorites.includes(articleId);

      if (isFavorite) {
        await removeFromFavorites(user.id, articleId);
        setFavorites(prev => prev.filter(id => id !== articleId));
      } else {
        await addToFavorites(user.id, articleId);
        setFavorites(prev => [...prev, articleId]);
      }

      return { success: true, isFavorite: !isFavorite };
    } catch (err) {
      console.error('Toggle favorite error:', err);
      return { success: false, error: 'Erreur' };
    }
  };

  /**
   * Vérifier si un article est favori
   */
  const isFavorite = (articleId) => {
    return favorites.includes(articleId);
  };

  const value = {
    articles,
    favorites,
    loading,
    error,
    filters,
    sortBy,
    setFilters,
    setSortBy,
    createNewArticle,
    updateExistingArticle,
    deleteExistingArticle,
    decrementStock,
    getArticle,
    getFilteredArticles,
    getSellerArticles,
    getFavoriteArticles,
    toggleFavorite,
    isFavorite,
    refreshArticles: loadArticles
  };

  return (
    <ArticlesContext.Provider value={value}>
      {children}
    </ArticlesContext.Provider>
  );
};
