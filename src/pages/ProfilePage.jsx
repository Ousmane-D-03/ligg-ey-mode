// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Star, 
  Package,
  ShoppingBag,
  Settings,
  MessageCircle,
  Award,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useArticles } from '../context/ArticlesContext';
import { getUserById } from '../utils/storage';
import { ROUTES, CATEGORY_LABELS, CONDITION_LABELS, BADGE_LABELS } from '../utils/constants';
import { formatPrice, formatRelativeTime, formatRating, getInitials } from '../utils/formatters';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useAuth();
  const { getSellerArticles } = useArticles();

  const [profileUser, setProfileUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // active, sold

  // Déterminer si c'est le profil de l'utilisateur connecté
  const isOwnProfile = currentUser && (!id || id === currentUser.id);
  const profileId = id || currentUser?.id;

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const loadProfile = async () => {
    setLoading(true);
    
    try {
      // Si c'est son propre profil
      if (isOwnProfile) {
        setProfileUser(currentUser);
      } else {
        // Charger le profil de l'autre utilisateur
        const user = await getUserById(profileId);
        setProfileUser(user);
      }

      // Charger les articles du vendeur
      const userArticles = getSellerArticles(profileId);
      setArticles(userArticles);
    } catch (error) {
      console.error('Error loading profile:', error);
    }

    setLoading(false);
  };

  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  const handleContactSeller = () => {
    if (!isAuthenticated()) {
      navigate(ROUTES.LOGIN);
      return;
    }
    navigate(ROUTES.MESSAGES);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card padding="lg" className="text-center">
          <h2 className="text-2xl font-bold mb-4">Utilisateur non trouvé</h2>
          <Button onClick={() => navigate(ROUTES.HOME)}>
            Retour à l'accueil
          </Button>
        </Card>
      </div>
    );
  }

  // Filtrer les articles selon l'onglet
  const activeArticles = articles.filter(a => a.isAvailable);
  const soldArticles = articles.filter(a => !a.isAvailable);
  const displayedArticles = activeTab === 'active' ? activeArticles : soldArticles;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header du profil */}
        <Card padding="lg" className="mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar et infos principales */}
            <div className="flex flex-col items-center md:items-start">
              <Avatar
                src={profileUser.profilePicture}
                name={profileUser.fullName}
                size="xl"
                className="mb-4"
              />
              
              {isOwnProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Settings className="w-4 h-4" />}
                  onClick={() => navigate(ROUTES.SETTINGS)}
                  fullWidth
                >
                  Modifier le profil
                </Button>
              )}
            </div>

            {/* Informations */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {profileUser.fullName}
                  </h1>
                  
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {profileUser.badges?.map((badgeKey) => (
                      <Badge key={badgeKey} variant="primary" size="sm">
                        {BADGE_LABELS[badgeKey]}
                      </Badge>
                    ))}
                    {profileUser.accountType === 'business' && (
                      <Badge variant="secondary" size="sm" icon="shield">
                        Compte Entreprise
                      </Badge>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 fill-current mr-1" />
                      <span className="font-medium">{formatRating(profileUser.rating)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Package className="w-5 h-5 mr-1" />
                      <span>{profileUser.totalSales || 0} vente{profileUser.totalSales > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!isOwnProfile && (
                  <Button
                    variant="primary"
                    icon={<MessageCircle className="w-5 h-5" />}
                    onClick={handleContactSeller}
                  >
                    Contacter
                  </Button>
                )}
              </div>

              {/* Infos supplémentaires */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {profileUser.city}, Sénégal
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Membre depuis {new Date(profileUser.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </div>
              </div>

              {/* Bio */}
              {profileUser.bio && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-gray-700">{profileUser.bio}</p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Onglets */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('active')}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'active'
                    ? 'border-green-700 text-green-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                En vente ({activeArticles.length})
              </button>
              <button
                onClick={() => setActiveTab('sold')}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'sold'
                    ? 'border-green-700 text-green-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Vendus ({soldArticles.length})
              </button>
            </div>
          </div>
        </div>

        {/* Articles */}
        {displayedArticles.length === 0 ? (
          <Card padding="lg" className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {activeTab === 'active' ? 'Aucun article en vente' : 'Aucun article vendu'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isOwnProfile
                ? activeTab === 'active'
                  ? 'Commencez à vendre vos articles'
                  : 'Vous n\'avez encore rien vendu'
                : activeTab === 'active'
                ? 'Ce vendeur n\'a pas d\'articles en vente pour le moment'
                : 'Ce vendeur n\'a pas encore vendu d\'articles'}
            </p>
            {isOwnProfile && activeTab === 'active' && (
              <Button
                variant="primary"
                onClick={() => navigate(ROUTES.SELL)}
              >
                Vendre un article
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {displayedArticles.map((article) => (
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

                  {/* Badge vendu */}
                  {!article.isAvailable && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="error" size="md">
                        Vendu
                      </Badge>
                    </div>
                  )}

                  {/* Badge nouveau */}
                  {article.isAvailable && new Date() - new Date(article.createdAt) < 86400000 && (
                    <Badge
                      variant="primary"
                      size="sm"
                      className="absolute top-2 left-2"
                    >
                      Nouveau
                    </Badge>
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
      </div>
    </div>
  );
};

export default ProfilePage;
