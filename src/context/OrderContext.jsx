// src/context/OrderContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useArticles } from './ArticlesContext';

const OrderContext = createContext();

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};

// Statuts de commande
export const ORDER_STATUS = {
  PENDING_PAYMENT: 'pending_payment',      // En attente de paiement
  PAYMENT_CONFIRMING: 'payment_confirming', // Paiement à confirmer
  PAID: 'paid',                            // Payé et confirmé
  SHIPPED: 'shipped',                      // Expédié
  DELIVERED: 'delivered',                  // Livré
  COMPLETED: 'completed',                  // Terminé (avec notation)
  CANCELLED: 'cancelled',                  // Annulé
  DISPUTED: 'disputed'                     // Litige
};

export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING_PAYMENT]: 'En attente de paiement',
  [ORDER_STATUS.PAYMENT_CONFIRMING]: 'Paiement en cours de vérification',
  [ORDER_STATUS.PAID]: 'Payé',
  [ORDER_STATUS.SHIPPED]: 'Expédié',
  [ORDER_STATUS.DELIVERED]: 'Livré',
  [ORDER_STATUS.COMPLETED]: 'Terminé',
  [ORDER_STATUS.CANCELLED]: 'Annulé',
  [ORDER_STATUS.DISPUTED]: 'Litige'
};

export const OrderProvider = ({ children }) => {
  const { user } = useAuth();
  const { decrementStock } = useArticles();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les commandes depuis le storage
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Simuler chargement depuis storage
      const savedOrders = localStorage.getItem('liggeey_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveOrders = (newOrders) => {
    setOrders(newOrders);
    localStorage.setItem('liggeey_orders', JSON.stringify(newOrders));
  };

  /**
   * Créer une commande
   */
  const createOrder = async (orderData) => {
    try {
      if (!user) {
        return { success: false, error: 'Vous devez être connecté' };
      }

      // Générer numéro de commande unique
      const orderNumber = `LM-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

      const newOrder = {
        id: orderNumber,
        orderNumber,
        buyerId: user.id,
        buyerName: user.fullName,
        buyerPhone: user.phone,
        sellerId: orderData.sellerId,
        sellerName: orderData.sellerName,
        articleId: orderData.articleId,
        articleTitle: orderData.articleTitle,
        articleImage: orderData.articleImage,
        articlePrice: orderData.articlePrice,
        deliveryFee: orderData.deliveryFee || 0,
        commission: orderData.commission,
        totalAmount: orderData.totalAmount,
        deliveryMethod: orderData.deliveryMethod,
        deliveryAddress: orderData.deliveryAddress || null,
        status: ORDER_STATUS.PENDING_PAYMENT,
        paymentMethod: 'wave',
        trackingNumber: null,
        createdAt: new Date().toISOString(),
        paidAt: null,
        shippedAt: null,
        deliveredAt: null,
        completedAt: null
      };

      const updatedOrders = [...orders, newOrder];
      saveOrders(updatedOrders);

      // Décrémenter le stock de l'article
      await decrementStock(orderData.articleId);

      return { success: true, order: newOrder };
    } catch (error) {
      console.error('Create order error:', error);
      return { success: false, error: 'Erreur lors de la création de la commande' };
    }
  };

  /**
   * Mettre à jour le statut d'une commande
   */
  const updateOrderStatus = async (orderId, newStatus, additionalData = {}) => {
    try {
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          const updates = { status: newStatus, ...additionalData };
          
          // Ajouter timestamps selon le statut
          if (newStatus === ORDER_STATUS.PAID) {
            updates.paidAt = new Date().toISOString();
          } else if (newStatus === ORDER_STATUS.SHIPPED) {
            updates.shippedAt = new Date().toISOString();
          } else if (newStatus === ORDER_STATUS.DELIVERED) {
            updates.deliveredAt = new Date().toISOString();
          } else if (newStatus === ORDER_STATUS.COMPLETED) {
            updates.completedAt = new Date().toISOString();
          }
          
          return { ...order, ...updates };
        }
        return order;
      });

      saveOrders(updatedOrders);
      return { success: true };
    } catch (error) {
      console.error('Update order status error:', error);
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }
  };

  /**
   * Marquer le paiement comme effectué (côté acheteur)
   */
  const markPaymentSent = async (orderId) => {
    return await updateOrderStatus(orderId, ORDER_STATUS.PAYMENT_CONFIRMING);
  };

  /**
   * Confirmer le paiement (côté admin)
   */
  const confirmPayment = async (orderId) => {
    return await updateOrderStatus(orderId, ORDER_STATUS.PAID);
  };

  /**
   * Marquer comme expédié
   */
  const markAsShipped = async (orderId, trackingNumber) => {
    return await updateOrderStatus(orderId, ORDER_STATUS.SHIPPED, { trackingNumber });
  };

  /**
   * Marquer comme livré
   */
  const markAsDelivered = async (orderId) => {
    return await updateOrderStatus(orderId, ORDER_STATUS.DELIVERED);
  };

  /**
   * Annuler une commande
   */
  const cancelOrder = async (orderId, reason) => {
    return await updateOrderStatus(orderId, ORDER_STATUS.CANCELLED, { cancellationReason: reason });
  };

  /**
   * Ouvrir un litige
   */
  const openDispute = async (orderId, reason) => {
    return await updateOrderStatus(orderId, ORDER_STATUS.DISPUTED, { disputeReason: reason });
  };

  /**
   * Obtenir les commandes de l'utilisateur
   */
  const getUserOrders = (userId) => {
    return orders.filter(order => order.buyerId === userId || order.sellerId === userId);
  };

  /**
   * Obtenir les commandes en attente de confirmation (pour admin)
   */
  const getPendingConfirmationOrders = () => {
    return orders.filter(order => order.status === ORDER_STATUS.PAYMENT_CONFIRMING);
  };

  /**
   * Obtenir une commande par ID
   */
  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId);
  };

  const value = {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    markPaymentSent,
    confirmPayment,
    markAsShipped,
    markAsDelivered,
    cancelOrder,
    openDispute,
    getUserOrders,
    getPendingConfirmationOrders,
    getOrderById,
    ORDER_STATUS,
    ORDER_STATUS_LABELS
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};
