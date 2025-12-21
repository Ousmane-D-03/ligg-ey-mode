// src/pages/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  Package, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Users,
  Copy,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useOrders, ORDER_STATUS, ORDER_STATUS_LABELS } from '../context/OrderContext';
import { ROUTES } from '../utils/constants';
import { formatPrice, formatRelativeTime } from '../utils/formatters';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { 
    orders, 
    getPendingConfirmationOrders,
    confirmPayment,
    ORDER_STATUS 
  } = useOrders();

  const [activeTab, setActiveTab] = useState('pending');
  const [copied, setCopied] = useState(null);

  // Vérifier l'authentification
  useEffect(() => {
    // Attendre que l'auth soit chargée
    if (!authLoading) {
      if (!isAuthenticated()) {
        navigate(ROUTES.LOGIN);
      }
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Afficher spinner pendant le chargement
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // Si pas connecté (au cas où)
  if (!user) {
    return null;
  }

  const handleConfirmPayment = async (orderId) => {
    const result = await confirmPayment(orderId);
    if (result.success) {
      alert('Paiement confirmé ! Le vendeur peut maintenant expédier.');
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Statistiques
  const pendingOrders = orders.filter(o => o.status === ORDER_STATUS.PAYMENT_CONFIRMING);
  const confirmedOrders = orders.filter(o => o.status === ORDER_STATUS.PAID);
  const completedOrders = orders.filter(o => o.status === ORDER_STATUS.COMPLETED);
  
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.commission, 0);
  const pendingAmount = pendingOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Filtrer selon l'onglet
  let displayedOrders = [];
  if (activeTab === 'pending') {
    displayedOrders = pendingOrders;
  } else if (activeTab === 'confirmed') {
    displayedOrders = confirmedOrders;
  } else {
    displayedOrders = completedOrders;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dashboard Admin
          </h1>
          <p className="text-gray-600">
            Gestion des paiements et commandes Liggéey Mode
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En attente</p>
                <p className="text-2xl font-bold text-orange-600">
                  {pendingOrders.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {formatPrice(pendingAmount)} à vérifier
            </p>
          </Card>

          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Confirmés</p>
                <p className="text-2xl font-bold text-blue-600">
                  {confirmedOrders.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              En cours d'expédition
            </p>
          </Card>

          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Terminés</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedOrders.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Transactions finalisées
            </p>
          </Card>

          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenus totaux</p>
                <p className="text-2xl font-bold text-green-700">
                  {formatPrice(totalRevenue)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-700" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Commissions perçues
            </p>
          </Card>
        </div>

        {/* Onglets */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('pending')}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'pending'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                En attente ({pendingOrders.length})
              </button>
              <button
                onClick={() => setActiveTab('confirmed')}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'confirmed'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Confirmés ({confirmedOrders.length})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
                  activeTab === 'completed'
                    ? 'border-green-600 text-green-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Terminés ({completedOrders.length})
              </button>
            </div>
          </div>
        </div>

        {/* Liste des commandes */}
        {displayedOrders.length === 0 ? (
          <Card padding="lg" className="text-center py-12">
            <p className="text-gray-500">Aucune commande dans cette catégorie</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {displayedOrders.map((order) => (
              <Card key={order.id} padding="lg">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Info commande */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-lg text-gray-900">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatRelativeTime(order.createdAt)}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          order.status === ORDER_STATUS.PAYMENT_CONFIRMING ? 'warning' :
                          order.status === ORDER_STATUS.PAID ? 'info' :
                          order.status === ORDER_STATUS.COMPLETED ? 'success' :
                          'gray'
                        }
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 mb-1">Article</p>
                        <p className="font-medium">{order.articleTitle}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Acheteur</p>
                        <p className="font-medium">{order.buyerName}</p>
                        <p className="text-xs text-gray-500">{order.buyerPhone}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Vendeur</p>
                        <p className="font-medium">{order.sellerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 mb-1">Montant</p>
                        <p className="font-bold text-green-700">
                          {formatPrice(order.totalAmount)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Commission: {formatPrice(order.commission)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 lg:w-64 space-y-3">
                    {order.status === ORDER_STATUS.PAYMENT_CONFIRMING && (
                      <>
                        <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg text-sm">
                          <p className="font-medium text-orange-800 mb-2">
                            À vérifier dans Wave :
                          </p>
                          <div className="space-y-1 text-xs text-orange-700">
                            <p>✓ Montant: {formatPrice(order.totalAmount)}</p>
                            <p>✓ Message: {order.orderNumber}</p>
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          fullWidth
                          onClick={() => handleConfirmPayment(order.id)}
                        >
                          Confirmer le paiement
                        </Button>
                      </>
                    )}

                    {order.status === ORDER_STATUS.COMPLETED && (
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm">
                        <p className="font-medium text-blue-800 mb-2">
                          À virer au vendeur:
                        </p>
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs text-blue-700">Montant</p>
                            <p className="font-bold text-blue-900">
                              {formatPrice(order.articlePrice - order.commission)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={order.sellerPhone || '+221 7X XXX XX XX'}
                              readOnly
                              className="flex-1 px-2 py-1 bg-white border border-blue-200 rounded text-xs"
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              icon={copied === order.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              onClick={() => handleCopy(order.sellerPhone, order.id)}
                            />
                          </div>
                        </div>
                      </div>
                    )}
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

export default AdminDashboard;
