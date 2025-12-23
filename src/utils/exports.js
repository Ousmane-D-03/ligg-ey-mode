// src/utils/exports.js
import { formatPrice, formatFullDate } from './formatters';

/**
 * Convertit un array d'objets en CSV
 */
export const arrayToCSV = (data, headers) => {
  if (!data || data.length === 0) return '';

  // En-têtes
  const headerRow = headers.map(h => `"${h.label}"`).join(',');
  
  // Lignes de données
  const rows = data.map(item => {
    return headers.map(h => {
      const value = h.key.split('.').reduce((obj, key) => obj?.[key], item);
      // Échapper les guillemets et virgules
      const escaped = String(value || '').replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(',');
  });

  return [headerRow, ...rows].join('\n');
};

/**
 * Télécharge un fichier CSV
 */
export const downloadCSV = (csvContent, filename) => {
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Exporte les transactions en CSV
 */
export const exportTransactionsCSV = (orders) => {
  const headers = [
    { key: 'orderNumber', label: 'Numéro commande' },
    { key: 'createdAt', label: 'Date' },
    { key: 'buyerName', label: 'Acheteur' },
    { key: 'sellerName', label: 'Vendeur' },
    { key: 'articleTitle', label: 'Article' },
    { key: 'articlePrice', label: 'Prix article' },
    { key: 'deliveryFee', label: 'Frais livraison' },
    { key: 'commission', label: 'Commission' },
    { key: 'totalAmount', label: 'Total' },
    { key: 'status', label: 'Statut' }
  ];

  const formattedData = orders.map(order => ({
    ...order,
    createdAt: formatFullDate(order.createdAt),
    articlePrice: formatPrice(order.articlePrice),
    deliveryFee: formatPrice(order.deliveryFee),
    commission: formatPrice(order.commission),
    totalAmount: formatPrice(order.totalAmount)
  }));

  const csv = arrayToCSV(formattedData, headers);
  const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCSV(csv, filename);
};

/**
 * Exporte les utilisateurs en CSV
 */
export const exportUsersCSV = (users) => {
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'fullName', label: 'Nom' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Téléphone' },
    { key: 'city', label: 'Ville' },
    { key: 'accountType', label: 'Type compte' },
    { key: 'rating', label: 'Note' },
    { key: 'totalSales', label: 'Ventes' },
    { key: 'createdAt', label: 'Inscription' }
  ];

  const formattedData = users.map(user => ({
    ...user,
    createdAt: formatFullDate(user.createdAt)
  }));

  const csv = arrayToCSV(formattedData, headers);
  const filename = `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCSV(csv, filename);
};

/**
 * Exporte les articles en CSV
 */
export const exportArticlesCSV = (articles) => {
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Titre' },
    { key: 'category', label: 'Catégorie' },
    { key: 'brand', label: 'Marque' },
    { key: 'size', label: 'Taille' },
    { key: 'condition', label: 'État' },
    { key: 'price', label: 'Prix' },
    { key: 'quantity', label: 'Stock' },
    { key: 'city', label: 'Ville' },
    { key: 'sellerName', label: 'Vendeur' },
    { key: 'views', label: 'Vues' },
    { key: 'isAvailable', label: 'Disponible' },
    { key: 'createdAt', label: 'Publié le' }
  ];

  const formattedData = articles.map(article => ({
    ...article,
    price: formatPrice(article.price),
    isAvailable: article.isAvailable ? 'Oui' : 'Non',
    createdAt: formatFullDate(article.createdAt)
  }));

  const csv = arrayToCSV(formattedData, headers);
  const filename = `articles_${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCSV(csv, filename);
};

/**
 * Génère un rapport financier mensuel
 */
export const generateMonthlyReport = (orders, month, year) => {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= startDate && orderDate <= endDate;
  });

  const stats = {
    totalOrders: filteredOrders.length,
    totalRevenue: filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0),
    totalCommission: filteredOrders.reduce((sum, o) => sum + o.commission, 0),
    averageOrderValue: filteredOrders.length > 0 
      ? filteredOrders.reduce((sum, o) => sum + o.totalAmount, 0) / filteredOrders.length 
      : 0,
    completedOrders: filteredOrders.filter(o => o.status === 'completed').length,
    pendingOrders: filteredOrders.filter(o => o.status === 'pending_payment' || o.status === 'payment_confirming').length
  };

  return {
    period: `${month + 1}/${year}`,
    stats,
    orders: filteredOrders
  };
};

/**
 * Exporte le rapport financier mensuel en CSV
 */
export const exportMonthlyReportCSV = (report) => {
  const statsData = [
    ['Période', report.period],
    ['Total commandes', report.stats.totalOrders],
    ['Revenus totaux', formatPrice(report.stats.totalRevenue)],
    ['Commissions totales', formatPrice(report.stats.totalCommission)],
    ['Valeur moyenne commande', formatPrice(Math.round(report.stats.averageOrderValue))],
    ['Commandes terminées', report.stats.completedOrders],
    ['Commandes en attente', report.stats.pendingOrders],
    [''],
    ['DÉTAIL DES TRANSACTIONS'],
    ['']
  ];

  const statsCSV = statsData.map(row => row.join(',')).join('\n');
  
  const headers = [
    { key: 'orderNumber', label: 'Numéro' },
    { key: 'createdAt', label: 'Date' },
    { key: 'totalAmount', label: 'Montant' },
    { key: 'commission', label: 'Commission' },
    { key: 'status', label: 'Statut' }
  ];

  const formattedOrders = report.orders.map(order => ({
    ...order,
    createdAt: formatFullDate(order.createdAt),
    totalAmount: formatPrice(order.totalAmount),
    commission: formatPrice(order.commission)
  }));

  const ordersCSV = arrayToCSV(formattedOrders, headers);
  
  const fullCSV = statsCSV + '\n' + ordersCSV;
  const filename = `rapport_${report.period.replace('/', '-')}.csv`;
  
  downloadCSV(fullCSV, filename);
};

/**
 * Génère la liste des virements à effectuer
 */
export const generatePayoutList = (orders) => {
  const completedOrders = orders.filter(o => o.status === 'completed');
  
  // Grouper par vendeur
  const payoutsBySeller = {};
  
  completedOrders.forEach(order => {
    if (!payoutsBySeller[order.sellerId]) {
      payoutsBySeller[order.sellerId] = {
        sellerId: order.sellerId,
        sellerName: order.sellerName,
        sellerPhone: order.sellerPhone || 'N/A',
        orders: [],
        totalAmount: 0
      };
    }
    
    const sellerAmount = order.articlePrice - order.commission;
    payoutsBySeller[order.sellerId].orders.push({
      orderNumber: order.orderNumber,
      articleTitle: order.articleTitle,
      amount: sellerAmount
    });
    payoutsBySeller[order.sellerId].totalAmount += sellerAmount;
  });

  return Object.values(payoutsBySeller);
};

/**
 * Exporte la liste des virements en CSV
 */
export const exportPayoutListCSV = (orders) => {
  const payouts = generatePayoutList(orders);
  
  const headers = [
    { key: 'sellerName', label: 'Vendeur' },
    { key: 'sellerPhone', label: 'Numéro Wave' },
    { key: 'orderCount', label: 'Nb commandes' },
    { key: 'totalAmount', label: 'Montant à virer' }
  ];

  const formattedData = payouts.map(payout => ({
    ...payout,
    orderCount: payout.orders.length,
    totalAmount: formatPrice(payout.totalAmount)
  }));

  const csv = arrayToCSV(formattedData, headers);
  const filename = `virements_${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadCSV(csv, filename);
};

export default {
  arrayToCSV,
  downloadCSV,
  exportTransactionsCSV,
  exportUsersCSV,
  exportArticlesCSV,
  generateMonthlyReport,
  exportMonthlyReportCSV,
  generatePayoutList,
  exportPayoutListCSV
};
