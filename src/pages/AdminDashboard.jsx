// src/pages/AdminDashboard.jsx - VERSION DYNAMIQUE
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, Users, Package, AlertTriangle, Settings, FileText,
  TrendingUp, Clock, CheckCircle, DollarSign, Download, Eye,
  Ban, CheckSquare, Trash2, Search, Star, ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useArticles } from '../context/ArticlesContext';
import { useOrders, ORDER_STATUS, ORDER_STATUS_LABELS } from '../context/OrderContext';
import { getUsers, updateUser, deleteArticle as deleteArticleStorage } from '../utils/storage';
import { formatPrice, formatFullDate, formatRelativeTime } from '../utils/formatters';
import { ROUTES, CATEGORY_LABELS, CONDITION_LABELS } from '../utils/constants';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { articles, deleteExistingArticle, refreshArticles } = useArticles();
  const { 
    orders, 
    confirmPayment,
    getPendingConfirmationOrders,
    getUserOrders 
  } = useOrders();

  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [platformConfig, setPlatformConfig] = useState({
    commission: { individual: 8, business: 5 },
    wave: { businessName: 'Liggéey Mode', phone: '+221 77 123 45 67' },
    shipping: { dakarIntra: 1500, dakarRegion: 2500, otherRegions: 3500 }
  });

  // Vérifier auth
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  // Charger les utilisateurs
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const allUsers = await getUsers();
    setUsers(allUsers);
    setLoading(false);
  };

  // Calculer les stats en temps réel
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.totalSales > 0).length,
    totalArticles: articles.length,
    activeArticles: articles.filter(a => a.isAvailable && a.quantity > 0).length,
    totalOrders: orders.length,
    pendingOrders: getPendingConfirmationOrders().length,
    completedOrders: orders.filter(o => o.status === ORDER_STATUS.COMPLETED).length,
    totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
    totalCommission: orders.reduce((sum, o) => sum + o.commission, 0)
  };

  const handleConfirmPayment = async (orderId) => {
    const result = await confirmPayment(orderId);
    if (result.success) {
      alert('Paiement confirmé ! Le vendeur peut expédier.');
    }
  };

  const handleSuspendUser = async (userId) => {
    const user = users.find(u => u.id === userId);
    await updateUser(userId, { suspended: !user.suspended });
    await loadUsers();
  };

  const handleDeleteArticle = async (articleId) => {
    const result = await deleteExistingArticle(articleId);
    if (result.success) {
      alert('Article supprimé');
      setShowDeleteModal(null);
      await refreshArticles();
    }
  };

  const exportCSV = (type) => {
    alert(`Export ${type} - Fonctionnalité complète avec exports.js`);
  };

  const saveConfig = () => {
    localStorage.setItem('platform_config', JSON.stringify(platformConfig));
    alert('Configuration sauvegardée !');
  };

  // ONGLET 1: VUE D'ENSEMBLE
  const renderOverview = () => {
    const pendingPayments = getPendingConfirmationOrders();

    return (
      <div className="space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Utilisateurs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                <p className="text-xs text-gray-500 mt-1">{stats.activeUsers} actifs</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Articles</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalArticles}</p>
                <p className="text-xs text-gray-500 mt-1">{stats.activeArticles} en vente</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Commandes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
                <p className="text-xs text-gray-500 mt-1">{stats.pendingOrders} en attente</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Revenus</p>
                <p className="text-3xl font-bold text-green-700">{formatPrice(stats.totalCommission)}</p>
                <p className="text-xs text-gray-500 mt-1">Commissions</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </Card>
        </div>

        {/* Paiements en attente */}
        <Card padding="lg">
          <h3 className="text-lg font-semibold mb-4">
            Paiements à confirmer ({pendingPayments.length})
          </h3>
          {pendingPayments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucun paiement en attente</p>
          ) : (
            <div className="space-y-3">
              {pendingPayments.map(order => (
                <div key={order.id} className="border-b border-gray-200 pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">
                        {order.buyerName} → {formatPrice(order.totalAmount)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatRelativeTime(order.createdAt)}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleConfirmPayment(order.id)}
                    >
                      Confirmer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Dernières commandes */}
        <Card padding="lg">
          <h3 className="text-lg font-semibold mb-4">Dernières commandes</h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-gray-600">{order.articleTitle}</p>
                </div>
                <div className="text-right">
                  <Badge variant={
                    order.status === ORDER_STATUS.COMPLETED ? 'success' :
                    order.status === ORDER_STATUS.PAID ? 'info' :
                    'warning'
                  }>
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatPrice(order.totalAmount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  // ONGLET 2: UTILISATEURS
  const renderUsers = () => {
    const filteredUsers = users.filter(u => 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg"
            />
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <Button
            variant="outline"
            icon={<Download className="w-5 h-5" />}
            onClick={() => exportCSV('utilisateurs')}
          >
            Export CSV
          </Button>
        </div>

        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ventes</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Note</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wave</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">{u.fullName}</p>
                        <p className="text-xs text-gray-500">
                          {u.accountType === 'business' ? 'Entreprise' : 'Particulier'}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div>
                        <p>{u.email}</p>
                        <p className="text-gray-500">{u.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{u.city}</td>
                    <td className="px-4 py-3 text-sm">{u.totalSales || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                        <span className="text-sm">{(u.rating || 0).toFixed(1)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {u.waveFullName && u.wavePhone ? (
                        <Badge variant="success" size="sm">Configuré</Badge>
                      ) : (
                        <Badge variant="warning" size="sm">Manquant</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => navigate(`/profil/${u.id}`)}
                          className="p-2 border rounded hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSuspendUser(u.id)}
                          className="p-2 border rounded hover:bg-gray-50"
                        >
                          {u.suspended ? (
                            <CheckSquare className="w-4 h-4 text-green-600" />
                          ) : (
                            <Ban className="w-4 h-4 text-red-600" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  // ONGLET 3: ARTICLES
  const renderArticles = () => {
    const filteredArticles = filterStatus === 'all' 
      ? articles 
      : filterStatus === 'active' 
      ? articles.filter(a => a.isAvailable && a.quantity > 0) 
      : articles.filter(a => !a.isAvailable || a.quantity === 0);

    return (
      <div className="space-y-4">
        <div className="flex gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">Tous ({articles.length})</option>
            <option value="active">En vente ({articles.filter(a => a.isAvailable && a.quantity > 0).length})</option>
            <option value="sold">Vendus ({articles.filter(a => !a.isAvailable || a.quantity === 0).length})</option>
          </select>
          <Button
            variant="outline"
            icon={<Download className="w-5 h-5" />}
            onClick={() => exportCSV('articles')}
          >
            Export CSV
          </Button>
        </div>

        {filteredArticles.length === 0 ? (
          <Card padding="lg" className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun article trouvé</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredArticles.map(article => (
              <Card key={article.id} padding="none" className="overflow-hidden">
                <div className="aspect-square bg-gray-200 relative">
                  {article.images?.[0] ? (
                    <img src={article.images[0]} alt={article.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  {(!article.isAvailable || article.quantity === 0) && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="error">Vendu</Badge>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-500 mb-1">{CATEGORY_LABELS[article.category]}</p>
                  <p className="font-medium text-sm line-clamp-2 mb-2">{article.title}</p>
                  <p className="text-lg font-bold text-green-700 mb-2">{formatPrice(article.price)}</p>
                  {article.quantity > 0 && (
                    <p className="text-xs text-gray-500 mb-2">Stock: {article.quantity}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/article/${article.id}`)}
                      className="flex-1 px-3 py-1 border rounded text-sm hover:bg-gray-50 flex items-center justify-center"
                    >
                      <Eye className="w-4 h-4 mr-1" /> Voir
                    </button>
                    <button
                      onClick={() => setShowDeleteModal(article.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  // ONGLET 4: CONFIGURATION
  const renderConfig = () => (
    <div className="space-y-6">
      <Card padding="lg">
        <h3 className="text-lg font-semibold mb-4">Taux de commission</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Particuliers (%)</label>
            <input
              type="number"
              value={platformConfig.commission.individual}
              onChange={(e) => setPlatformConfig({
                ...platformConfig,
                commission: { ...platformConfig.commission, individual: parseInt(e.target.value) }
              })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Entreprises (%)</label>
            <input
              type="number"
              value={platformConfig.commission.business}
              onChange={(e) => setPlatformConfig({
                ...platformConfig,
                commission: { ...platformConfig.commission, business: parseInt(e.target.value) }
              })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
        <Button
          variant="primary"
          className="mt-4"
          onClick={saveConfig}
        >
          Enregistrer
        </Button>
      </Card>

      <Card padding="lg">
        <h3 className="text-lg font-semibold mb-4">Wave Business</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom entreprise</label>
            <input
              type="text"
              value={platformConfig.wave.businessName}
              onChange={(e) => setPlatformConfig({
                ...platformConfig,
                wave: { ...platformConfig.wave, businessName: e.target.value }
              })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Numéro Wave</label>
            <input
              type="text"
              value={platformConfig.wave.phone}
              onChange={(e) => setPlatformConfig({
                ...platformConfig,
                wave: { ...platformConfig.wave, phone: e.target.value }
              })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
        </div>
        <Button
          variant="primary"
          className="mt-4"
          onClick={saveConfig}
        >
          Enregistrer
        </Button>
      </Card>
    </div>
  );

  // ONGLET 5: RAPPORTS
  const renderReports = () => (
    <div className="space-y-4">
      <div className="grid md:grid-cols-3 gap-4">
        <Card
          padding="lg"
          clickable
          onClick={() => exportCSV('transactions')}
        >
          <FileText className="w-8 h-8 text-blue-600 mb-3" />
          <h4 className="font-semibold mb-2">Export transactions</h4>
          <p className="text-sm text-gray-600">Toutes les commandes en CSV</p>
        </Card>

        <Card
          padding="lg"
          clickable
          onClick={() => exportCSV('utilisateurs')}
        >
          <Users className="w-8 h-8 text-purple-600 mb-3" />
          <h4 className="font-semibold mb-2">Export utilisateurs</h4>
          <p className="text-sm text-gray-600">Liste complète</p>
        </Card>

        <Card
          padding="lg"
          clickable
          onClick={() => exportCSV('virements')}
        >
          <DollarSign className="w-8 h-8 text-orange-600 mb-3" />
          <h4 className="font-semibold mb-2">Liste virements</h4>
          <p className="text-sm text-gray-600">Paiements vendeurs</p>
        </Card>
      </div>

      <Card padding="lg">
        <h3 className="text-lg font-semibold mb-4">Statistiques globales</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Commandes</p>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Revenus</p>
            <p className="text-2xl font-bold text-green-700">{formatPrice(stats.totalRevenue)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Commissions</p>
            <p className="text-2xl font-bold text-blue-700">{formatPrice(stats.totalCommission)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Utilisateurs</p>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
        </div>
      </Card>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'articles', label: 'Articles', icon: Package },
    { id: 'config', label: 'Configuration', icon: Settings },
    { id: 'reports', label: 'Rapports', icon: FileText }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
          <p className="text-gray-600">Gestion de Liggéey Mode</p>
        </div>

        <div className="mb-6 overflow-x-auto">
          <div className="flex space-x-2 border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-700 text-green-700'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'articles' && renderArticles()}
        {activeTab === 'config' && renderConfig()}
        {activeTab === 'reports' && renderReports()}
      </div>

      {/* Modal suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4" padding="lg">
            <h3 className="text-lg font-semibold mb-4">Supprimer l'article</h3>
            <p className="text-gray-600 mb-6">
              Cette action est irréversible. L'article sera définitivement supprimé.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowDeleteModal(null)}
              >
                Annuler
              </Button>
              <Button
                variant="danger"
                fullWidth
                onClick={() => handleDeleteArticle(showDeleteModal)}
              >
                Supprimer
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
