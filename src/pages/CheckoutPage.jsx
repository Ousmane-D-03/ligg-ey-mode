// src/pages/CheckoutPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  QrCode, 
  Copy, 
  Check, 
  AlertCircle,
  Phone,
  Package,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useArticles } from '../context/ArticlesContext';
import { useOrders } from '../context/OrderContext';
import { ROUTES, DELIVERY_OPTIONS } from '../utils/constants';
import { formatPrice, calculateCommission } from '../utils/formatters';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const { getArticle } = useArticles();
  const { createOrder, markPaymentSent } = useOrders();

  const articleId = searchParams.get('article');
  const deliveryMethod = searchParams.get('delivery') || DELIVERY_OPTIONS.MEETUP;

  const [article, setArticle] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [paymentSent, setPaymentSent] = useState(false);

  // Configuration Wave Business (À REMPLACER)
  const WAVE_CONFIG = {
    phone: '+221 7X XXX XX XX', // À remplacer avec votre numéro
    qrCodeUrl: '/placeholder-qr-wave.png', // À remplacer avec votre QR
    businessName: 'Liggéey Mode'
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(ROUTES.LOGIN);
      return;
    }
    loadArticleAndCreateOrder();
  }, [articleId]);

  const loadArticleAndCreateOrder = async () => {
    setLoading(true);
    
    const articleData = await getArticle(articleId);
    if (!articleData) {
      navigate(ROUTES.BROWSE);
      return;
    }

    setArticle(articleData);

    // Calculer les montants
    const deliveryFee = deliveryMethod === DELIVERY_OPTIONS.SHIPPING ? 2500 : 0;
    const commission = calculateCommission(articleData.price);
    const totalAmount = articleData.price + deliveryFee + commission;

    // Créer la commande
    const result = await createOrder({
      sellerId: articleData.sellerId,
      sellerName: articleData.sellerName,
      articleId: articleData.id,
      articleTitle: articleData.title,
      articleImage: articleData.images?.[0],
      articlePrice: articleData.price,
      deliveryFee,
      commission,
      totalAmount,
      deliveryMethod
    });

    if (result.success) {
      setOrder(result.order);
    }

    setLoading(false);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(WAVE_CONFIG.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentSent = async () => {
    if (!order) return;

    const result = await markPaymentSent(order.id);
    if (result.success) {
      setPaymentSent(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!article || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card padding="lg" className="text-center">
          <h2 className="text-2xl font-bold mb-4">Commande introuvable</h2>
          <Button onClick={() => navigate(ROUTES.BROWSE)}>
            Retour aux articles
          </Button>
        </Card>
      </div>
    );
  }

  if (paymentSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card padding="lg" className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-12 h-12 text-green-700" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Paiement en cours de vérification
            </h2>
            
            <p className="text-lg text-gray-600 mb-6">
              Merci ! Nous vérifions votre paiement. Vous recevrez une notification dès confirmation.
            </p>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
              <p className="text-sm text-blue-800">
                <strong>Numéro de commande :</strong> {order.orderNumber}
              </p>
              <p className="text-sm text-blue-800 mt-1">
                Conservez ce numéro pour suivre votre commande
              </p>
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate('/mes-commandes')}
              >
                Voir mes commandes
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate(ROUTES.HOME)}
              >
                Retour à l'accueil
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Paiement
            </h1>
            <p className="text-gray-600">
              Commande #{order.orderNumber}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Instructions de paiement */}
            <div className="lg:col-span-2 space-y-6">
              {/* Alerte importante */}
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-orange-600 mr-3 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <p className="font-semibold mb-1">⚠️ Important</p>
                  <p>N'oubliez pas d'inclure le <strong>numéro de commande</strong> dans le message Wave pour que nous puissions identifier votre paiement.</p>
                </div>
              </div>

              {/* QR Code Wave */}
              <Card padding="lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <QrCode className="w-6 h-6 mr-2 text-blue-600" />
                  Option 1 : Scanner le QR Code
                </h2>
                
                <div className="text-center py-6">
                  <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg mb-4">
                    <img 
                      src={WAVE_CONFIG.qrCodeUrl} 
                      alt="QR Code Wave"
                      className="w-64 h-64 object-contain"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23f3f4f6" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-size="14"%3EQR Code à venir%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">
                    Scannez avec Wave pour payer
                  </p>
                </div>

                <ol className="space-y-2 text-sm text-gray-700">
                  <li>1️⃣ Ouvrez votre application <strong>Wave</strong></li>
                  <li>2️⃣ Appuyez sur <strong>"Scanner"</strong></li>
                  <li>3️⃣ Scannez ce QR Code</li>
                  <li>4️⃣ Le montant sera pré-rempli : <strong>{formatPrice(order.totalAmount)}</strong></li>
                  <li>5️⃣ Dans le message, écrivez : <strong className="text-green-700">{order.orderNumber}</strong></li>
                  <li>6️⃣ Confirmez le paiement</li>
                </ol>
              </Card>

              {/* Paiement manuel */}
              <Card padding="lg">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Phone className="w-6 h-6 mr-2 text-blue-600" />
                  Option 2 : Paiement manuel
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro Wave {WAVE_CONFIG.businessName}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={WAVE_CONFIG.phone}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        onClick={handleCopyPhone}
                      >
                        {copied ? 'Copié' : 'Copier'}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Montant à envoyer
                    </label>
                    <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-2xl font-bold text-green-700">
                        {formatPrice(order.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message à inclure (OBLIGATOIRE)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={order.orderNumber}
                        readOnly
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Copy className="w-4 h-4" />}
                        onClick={handleCopyOrderNumber}
                      >
                        Copier
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>💡 Astuce :</strong> Copiez le numéro de commande avant d'ouvrir Wave pour le coller facilement dans le message.
                  </p>
                </div>
              </Card>

              {/* Bouton confirmation */}
              <Card padding="lg" className="bg-green-50 border-2 border-green-200">
                <p className="text-sm text-gray-700 mb-4">
                  Une fois le paiement effectué via Wave, cliquez sur le bouton ci-dessous :
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<Check className="w-5 h-5" />}
                  onClick={handlePaymentSent}
                >
                  J'ai effectué le paiement
                </Button>
              </Card>
            </div>

            {/* Résumé */}
            <div className="space-y-6">
              <Card padding="lg">
                <h3 className="font-semibold text-lg mb-4">Résumé de la commande</h3>

                {/* Article */}
                <div className="flex gap-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    {article.images?.[0] ? (
                      <img src={article.images[0]} alt={article.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 line-clamp-2 text-sm">
                      {article.title}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Vendeur : {article.sellerName}
                    </p>
                  </div>
                </div>

                {/* Détails prix */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix article</span>
                    <span className="font-medium">{formatPrice(article.price)}</span>
                  </div>
                  
                  {order.deliveryFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frais de livraison</span>
                      <span className="font-medium">{formatPrice(order.deliveryFee)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frais de service</span>
                    <span className="font-medium">{formatPrice(order.commission)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-green-700">
                      {formatPrice(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Sécurité */}
              <Card padding="lg" className="bg-blue-50">
                <div className="flex items-start">
                  <CreditCard className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Paiement sécurisé</p>
                    <p>Votre argent est protégé jusqu'à réception de l'article.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
