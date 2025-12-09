// src/pages/FavoritesPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, MapPin, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useArticles } from '../context/ArticlesContext';
import { ROUTES, CATEGORY_LABELS, CONDITION_LABELS } from '../utils/constants';
import { formatPrice, formatRelativeTime } from '../utils/formatters';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const FavoritesPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { getFavoriteArticles, toggleFavorite, loading } = useArticles();

  // Rediriger si non connecté
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  const favoriteArticles = getFavoriteArticles();

  const handleRemoveFavorite = async (e, articleId) => {
    e.stopPropagation();
    await toggleFavorite(articleId);
  };

  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Heart className="w-8 h-8 text-red-500 fill-current mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Mes favoris</h1>
          </div>
          <p className="text-gray-600">
            {favoriteArticles.length} article{favoriteArticles.length > 1 ? 's' : ''} sauvegardé{favoriteArticles.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Contenu */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner"></div>
          </div>
        ) : favoriteArticles.length === 0 ? (
          <Card padding="lg" className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              Aucun favori pour le moment
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez à ajouter des articles que vous aimez à vos favoris
            </p>
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.BROWSE)}
            >
              Parcourir les articles
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favoriteArticles.map((article) => (
              <Card
                key={article.id}
                clickable
                onClick={() => handleArticleClick(article.id)}
                padding="none"
                className="overflow-hidden group relative"
              >
                {/* Image */}
                <div className="aspect-square bg-gray-200 relative overflow-hidden">
                  {article.images?.[0] ? (
                    <img
                      src={article.images[0]}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingBag className="w-12 h-12" />
                    </div>
                  )}

                  {/* Badge nouveau */}
                  {new Date() - new Date(article.createdAt) < 86400000 && (
                    <Badge
                      variant="primary"
                      size="sm"
                      className="absolute top-2 left-2"
                    >
                      Nouveau
                    </Badge>
                  )}

                  {/* Bouton retirer des favoris */}
                  <button
                    onClick={(e) => handleRemoveFavorite(e, article.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors group/remove"
                    aria-label="Retirer des favoris"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>

                  {/* Badge non disponible */}
                  {!article.isAvailable && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="error" size="md">
                        Non disponible
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="p-3">
                  <p className="text-xs text-gray-500 mb-1">
                    {CATEGORY_LABELS[article.category]}
                  </p>
                  <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 text-sm">
                    {article.title}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-lg font-bold text-green-700">
                      {formatPrice(article.price)}
                    </p>
                    <Badge variant="gray" size="sm">
                      {CONDITION_LABELS[article.condition]}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {article.city}
                    </div>
                    <span>{formatRelativeTime(article.createdAt)}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Actions supplémentaires */}
        {favoriteArticles.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">
              Vous avez trouvé ce que vous cherchiez ?
            </p>
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.BROWSE)}
            >
              Découvrir plus d'articles
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;
