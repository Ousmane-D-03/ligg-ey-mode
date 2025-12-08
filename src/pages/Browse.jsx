// src/pages/Browse.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  X,
  Heart,
  ShoppingBag,
  MapPin
} from 'lucide-react';
import { useArticles } from '../context/ArticlesContext';
import { useAuth } from '../context/AuthContext';
import { 
  ROUTES, 
  CATEGORIES, 
  CATEGORY_LABELS,
  CONDITION,
  CONDITION_LABELS,
  CITIES,
  SIZES
} from '../utils/constants';
import { formatPrice, formatRelativeTime } from '../utils/formatters';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Select from '../components/common/Select';

const Browse = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  
  const {
    getFilteredArticles,
    filters,
    setFilters,
    sortBy,
    setSortBy,
    toggleFavorite,
    isFavorite,
    loading
  } = useArticles();

  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Initialiser les filtres depuis l'URL
  useEffect(() => {
    const category = searchParams.get('category');
    if (category && category !== filters.category) {
      setFilters(prev => ({ ...prev, category }));
    }
  }, [searchParams]);

  // Récupérer les articles filtrés
  const articles = getFilteredArticles();

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, search: searchInput }));
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      size: '',
      condition: '',
      city: '',
      search: ''
    });
    setSearchInput('');
    setSearchParams({});
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleFavoriteClick = async (e, articleId) => {
    e.stopPropagation();
    if (!user) {
      navigate(ROUTES.LOGIN);
      return;
    }
    await toggleFavorite(articleId);
  };

  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  // Compter les filtres actifs
  const activeFiltersCount = Object.entries(filters).filter(
    ([key, value]) => value && key !== 'search'
  ).length;

  // Options pour les selects
  const categoryOptions = [
    { value: '', label: 'Toutes les catégories' },
    ...Object.keys(CATEGORIES).map(key => ({
      value: CATEGORIES[key],
      label: CATEGORY_LABELS[CATEGORIES[key]]
    }))
  ];

  const conditionOptions = [
    { value: '', label: 'Tous les états' },
    ...Object.keys(CONDITION).map(key => ({
      value: CONDITION[key],
      label: CONDITION_LABELS[CONDITION[key]]
    }))
  ];

  const cityOptions = [
    { value: '', label: 'Toutes les villes' },
    ...CITIES.map(city => ({ value: city, label: city }))
  ];

  const sizeOptions = [
    { value: '', label: 'Toutes les tailles' },
    ...SIZES.CLOTHING.map(size => ({ value: size, label: size }))
  ];

  const sortOptions = [
    { value: 'recent', label: 'Plus récents' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'popular', label: 'Plus populaires' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header avec recherche et filtres */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          {/* Barre de recherche */}
          <form onSubmit={handleSearchSubmit} className="mb-4">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={handleSearchChange}
                placeholder="Rechercher des articles..."
                className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    handleFilterChange('search', '');
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>

          {/* Barre de tri et filtres */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Bouton filtres mobile */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              icon={<SlidersHorizontal className="w-4 h-4" />}
              className="sm:hidden"
            >
              Filtres
              {activeFiltersCount > 0 && (
                <Badge variant="primary" size="sm" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>

            {/* Tri */}
            <div className="flex-1 sm:max-w-xs">
              <Select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                options={sortOptions}
              />
            </div>

            {/* Nombre de résultats */}
            <p className="text-sm text-gray-600 text-center sm:text-left">
              <strong>{articles.length}</strong> article{articles.length > 1 ? 's' : ''} trouvé{articles.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filtres latéraux (Desktop) */}
          <aside className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:w-64 flex-shrink-0`}>
            <Card padding="lg" className="sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Filtres</h3>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                  >
                    Réinitialiser
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {/* Catégorie */}
                <Select
                  label="Catégorie"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  options={categoryOptions}
                />

                {/* Prix */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix (FCFA)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    />
                  </div>
                </div>

                {/* Taille */}
                <Select
                  label="Taille"
                  value={filters.size}
                  onChange={(e) => handleFilterChange('size', e.target.value)}
                  options={sizeOptions}
                />

                {/* État */}
                <Select
                  label="État"
                  value={filters.condition}
                  onChange={(e) => handleFilterChange('condition', e.target.value)}
                  options={conditionOptions}
                />

                {/* Ville */}
                <Select
                  label="Ville"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  options={cityOptions}
                />
              </div>
            </Card>
          </aside>

          {/* Liste des articles */}
          <main className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="spinner"></div>
              </div>
            ) : articles.length === 0 ? (
              <Card padding="lg" className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun article trouvé
                </h3>
                <p className="text-gray-600 mb-6">
                  Essayez de modifier vos critères de recherche
                </p>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                >
                  Réinitialiser les filtres
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {articles.map((article) => (
                  <Card
                    key={article.id}
                    clickable
                    onClick={() => handleArticleClick(article.id)}
                    padding="none"
                    className="overflow-hidden group"
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

                      {/* Bouton favori */}
                      <button
                        onClick={(e) => handleFavoriteClick(e, article.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                        aria-label="Ajouter aux favoris"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isFavorite(article.id)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-600'
                          }`}
                        />
                      </button>
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default Browse;
