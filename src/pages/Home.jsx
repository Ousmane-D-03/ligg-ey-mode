// src/pages/Home.jsx
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Shield, 
  Zap, 
  Heart, 
  TrendingUp,
  ShoppingBag,
  Users,
  Star
} from 'lucide-react';
import { useArticles } from '../context/ArticlesContext';
import { ROUTES, CATEGORIES, CATEGORY_LABELS } from '../utils/constants';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { formatPrice, formatRelativeTime } from '../utils/formatters';

const Home = () => {
  const navigate = useNavigate();
  const { getFilteredArticles } = useArticles();
  
  // Récupérer les derniers articles
  const recentArticles = getFilteredArticles().slice(0, 8);

  // Catégories populaires
  const popularCategories = [
    { key: CATEGORIES.ROBES, icon: '👗' },
    { key: CATEGORIES.PANTALONS, icon: '👖' },
    { key: CATEGORIES.CHAUSSURES, icon: '👟' },
    { key: CATEGORIES.SACS, icon: '👜' },
    { key: CATEGORIES.HAUTS, icon: '👕' },
    { key: CATEGORIES.ACCESSOIRES, icon: '⌚' }
  ];

  const handleCategoryClick = (category) => {
    navigate(`${ROUTES.BROWSE}?category=${category}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-700 via-green-600 to-green-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              La mode d'occasion au Sénégal
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-50">
              Daay ko, Jënd ko, Liggeey ak yoon wi !
            </p>
            <p className="text-lg mb-10 text-green-100">
              Achetez et vendez des vêtements de seconde main en toute sécurité
            </p>
            
            {/* Search bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div 
                className="relative cursor-pointer"
                onClick={() => navigate(ROUTES.BROWSE)}
              >
                <input
                  type="text"
                  placeholder="Rechercher des vêtements, chaussures, sacs..."
                  className="w-full px-6 py-4 pl-14 rounded-full text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-green-300 shadow-xl"
                  readOnly
                />
                <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate(ROUTES.BROWSE)}
                className="shadow-lg"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Parcourir les articles
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(ROUTES.SELL)}
                className="bg-white text-green-700 hover:bg-gray-50 border-2 border-white shadow-lg"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Vendre mes vêtements
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories populaires */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Catégories populaires
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCategories.map((cat) => (
              <Card
                key={cat.key}
                clickable
                onClick={() => handleCategoryClick(cat.key)}
                className="text-center py-6 hover:border-green-500 border-2 border-transparent"
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <p className="font-medium text-gray-900">
                  {CATEGORY_LABELS[cat.key]}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Pourquoi Liggéey Mode ?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sécurisé</h3>
              <p className="text-gray-600">
                Paiement sécurisé et système de notation pour votre tranquillité
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Rapide</h3>
              <p className="text-gray-600">
                Publiez vos articles en quelques minutes et vendez rapidement
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Local</h3>
              <p className="text-gray-600">
                Rencontre en personne à Dakar ou livraison partout au Sénégal
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Communauté</h3>
              <p className="text-gray-600">
                Rejoignez une communauté de passionnés de mode au Sénégal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Articles récents */}
      {recentArticles.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold">Articles récents</h2>
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.BROWSE)}
              >
                Voir tout
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {recentArticles.map((article) => (
                <Card
                  key={article.id}
                  clickable
                  onClick={() => navigate(`/article/${article.id}`)}
                  padding="none"
                  className="overflow-hidden"
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-200 relative overflow-hidden">
                    {article.images?.[0] ? (
                      <img
                        src={article.images[0]}
                        alt={article.title}
                        className="w-full h-full object-cover"
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
                  </div>

                  {/* Infos */}
                  <div className="p-3">
                    <p className="text-sm text-gray-500 mb-1">
                      {CATEGORY_LABELS[article.category]}
                    </p>
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-green-700">
                        {formatPrice(article.price)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {article.city}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to action */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Inscrivez-vous gratuitement et rejoignez la communauté
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigate(ROUTES.SIGNUP)}
            className="shadow-lg"
          >
            Créer mon compte
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-green-700 mb-2">
                {recentArticles.length}+
              </p>
              <p className="text-gray-600">Articles disponibles</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-700 mb-2">100%</p>
              <p className="text-gray-600">Gratuit</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-green-700 mb-2">8%</p>
              <p className="text-gray-600">Commission seulement</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-2">
                <Star className="w-8 h-8 text-yellow-500 fill-current" />
                <p className="text-4xl font-bold text-green-700 ml-2">4.8</p>
              </div>
              <p className="text-gray-600">Note moyenne</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
