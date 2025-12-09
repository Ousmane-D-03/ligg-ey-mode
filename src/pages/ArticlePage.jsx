// src/pages/ArticlePage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Calendar,
  MessageCircle,
  Shield,
  ArrowLeft,
  Star,
  ChevronLeft,
  ChevronRight,
  Flag
} from 'lucide-react';
import { useArticles } from '../context/ArticlesContext';
import { useAuth } from '../context/AuthContext';
import { useMessaging } from '../context/MessagingContext';
import { 
  ROUTES, 
  CATEGORY_LABELS,
  CONDITION_LABELS,
  DELIVERY_LABELS
} from '../utils/constants';
import { formatPrice, formatRelativeTime, formatRating } from '../utils/formatters';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { getArticle, toggleFavorite, isFavorite } = useArticles();
  const { startConversation } = useMessaging();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  // Charger l'article
  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    setLoading(true);
    const data = await getArticle(id);
    setArticle(data);
    setLoading(false);
  };

  const handleFavoriteClick = async () => {
    if (!isAuthenticated()) {
      navigate(ROUTES.LOGIN);
      return;
    }
    await toggleFavorite(id);
  };

  const handleContactSeller = () => {
    if (!isAuthenticated()) {
      navigate(ROUTES.LOGIN);
      return;
    }

    if (article.sellerId === user.id) {
      return; // Ne peut pas se contacter soi-même
    }

    setShowContactModal(true);
    setMessage(`Bonjour, je suis intéressé(e) par votre article "${article.title}".`);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setSendingMessage(true);
    const result = await startConversation(
      article.sellerId,
      article.sellerName,
      message,
      article.id
    );

    if (result.success) {
      setShowContactModal(false);
      navigate(ROUTES.MESSAGES);
    }
    setSendingMessage(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `${article.title} - ${formatPrice(article.price)}`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      // Copier le lien
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié !');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === article.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? article.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card padding="lg" className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article non trouvé</h2>
          <Button onClick={() => navigate(ROUTES.BROWSE)}>
            Retour aux articles
          </Button>
        </Card>
      </div>
    );
  }

  const isOwnArticle = user && article.sellerId === user.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Bouton retour */}
        <Button
          variant="ghost"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          Retour
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Colonne gauche - Images et détails */}
          <div className="lg:col-span-2 space-y-6">
            {/* Galerie d'images */}
            <Card padding="none" className="overflow-hidden">
              {/* Image principale */}
              <div className="relative aspect-square bg-gray-200">
                {article.images?.[currentImageIndex] ? (
                  <img
                    src={article.images[currentImageIndex]}
                    alt={article.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Pas d'image
                  </div>
                )}

                {/* Boutons navigation */}
                {article.images?.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Indicateur */}
                {article.images?.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {article.images.length}
                  </div>
                )}
              </div>

              {/* Miniatures */}
              {article.images?.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {article.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        index === currentImageIndex
                          ? 'border-green-700'
                          : 'border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${article.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            {/* Détails de l'article */}
            <Card padding="lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <Badge variant="gray" size="sm" className="mb-2">
                    {CATEGORY_LABELS[article.category]}
                  </Badge>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {article.title}
                  </h1>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Publié {formatRelativeTime(article.createdAt)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Partager"
                  >
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => {/* Signaler */}}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Signaler"
                  >
                    <Flag className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">État</p>
                    <p className="font-medium">{CONDITION_LABELS[article.condition]}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Taille</p>
                    <p className="font-medium">{article.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Marque</p>
                    <p className="font-medium">{article.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Couleur</p>
                    <p className="font-medium">{article.color || 'Non spécifié'}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-gray-900 whitespace-pre-line">
                    {article.description}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Livraison</p>
                  <div className="flex flex-wrap gap-2">
                    {article.deliveryOptions?.map((option) => (
                      <Badge key={option} variant="gray">
                        {DELIVERY_LABELS[option]}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-900">{article.city}, Sénégal</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Colonne droite - Prix et vendeur */}
          <div className="space-y-6">
            {/* Prix et actions */}
            <Card padding="lg" className="sticky top-20">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-1">Prix</p>
                <p className="text-4xl font-bold text-green-700">
                  {formatPrice(article.price)}
                </p>
              </div>

              {!isOwnArticle ? (
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    fullWidth
                    size="lg"
                    icon={<MessageCircle className="w-5 h-5" />}
                    onClick={handleContactSeller}
                  >
                    Contacter le vendeur
                  </Button>

                  <Button
                    variant="outline"
                    fullWidth
                    icon={<Heart className={isFavorite(id) ? "w-5 h-5 fill-current" : "w-5 h-5"} />}
                    onClick={handleFavoriteClick}
                  >
                    {isFavorite(id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Badge variant="info" size="md" className="w-full justify-center">
                    Votre article
                  </Badge>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => navigate(`${ROUTES.SELL}?edit=${id}`)}
                  >
                    Modifier l'article
                  </Button>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-green-700 mr-2" />
                  <span>Paiement sécurisé</span>
                </div>
              </div>
            </Card>

            {/* Info vendeur */}
            <Card padding="lg">
              <h3 className="font-semibold text-lg mb-4">Vendeur</h3>

              <div 
                className="flex items-center space-x-3 mb-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={() => navigate(`/profil/${article.sellerId}`)}
              >
                <Avatar
                  src={article.sellerAvatar}
                  name={article.sellerName}
                  size="lg"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{article.sellerName}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    {formatRating(article.sellerRating || 0)}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {article.sellerCity}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de contact */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Contacter le vendeur"
        footer={
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowContactModal(false)}
              fullWidth
            >
              Annuler
            </Button>
            <Button
              variant="primary"
              onClick={handleSendMessage}
              loading={sendingMessage}
              fullWidth
            >
              Envoyer
            </Button>
          </div>
        }
      >
        <Input
          type="textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          rows={5}
        />
      </Modal>
    </div>
  );
};

export default ArticlePage;
