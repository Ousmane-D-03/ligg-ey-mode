// src/context/DisputeContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { generateId } from '../utils/formatters';

const DisputeContext = createContext();

export const useDisputes = () => {
  const context = useContext(DisputeContext);
  if (!context) {
    throw new Error('useDisputes must be used within DisputeProvider');
  }
  return context;
};

// Statuts de litige
export const DISPUTE_STATUS = {
  OPEN: 'open',
  INVESTIGATING: 'investigating',
  RESOLVED_REFUND: 'resolved_refund',
  RESOLVED_BUYER: 'resolved_buyer',
  RESOLVED_SELLER: 'resolved_seller',
  CLOSED: 'closed'
};

export const DISPUTE_STATUS_LABELS = {
  [DISPUTE_STATUS.OPEN]: 'Ouvert',
  [DISPUTE_STATUS.INVESTIGATING]: 'En cours d\'investigation',
  [DISPUTE_STATUS.RESOLVED_REFUND]: 'Résolu - Remboursement',
  [DISPUTE_STATUS.RESOLVED_BUYER]: 'Résolu - En faveur de l\'acheteur',
  [DISPUTE_STATUS.RESOLVED_SELLER]: 'Résolu - En faveur du vendeur',
  [DISPUTE_STATUS.CLOSED]: 'Fermé'
};

// Raisons de litige
export const DISPUTE_REASONS = {
  NOT_RECEIVED: 'not_received',
  NOT_AS_DESCRIBED: 'not_as_described',
  DAMAGED: 'damaged',
  FAKE: 'fake',
  COMMUNICATION: 'communication',
  OTHER: 'other'
};

export const DISPUTE_REASON_LABELS = {
  [DISPUTE_REASONS.NOT_RECEIVED]: 'Article non reçu',
  [DISPUTE_REASONS.NOT_AS_DESCRIBED]: 'Non conforme à la description',
  [DISPUTE_REASONS.DAMAGED]: 'Article endommagé',
  [DISPUTE_REASONS.FAKE]: 'Article contrefait',
  [DISPUTE_REASONS.COMMUNICATION]: 'Problème de communication',
  [DISPUTE_REASONS.OTHER]: 'Autre'
};

export const DisputeProvider = ({ children }) => {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Charger les litiges depuis le storage
  useEffect(() => {
    loadDisputes();
  }, []);

  const loadDisputes = async () => {
    try {
      setLoading(true);
      const saved = localStorage.getItem('liggeey_disputes');
      if (saved) {
        setDisputes(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveDisputes = (newDisputes) => {
    setDisputes(newDisputes);
    localStorage.setItem('liggeey_disputes', JSON.stringify(newDisputes));
  };

  /**
   * Créer un nouveau litige
   */
  const createDispute = async (disputeData) => {
    try {
      if (!user) {
        return { success: false, error: 'Vous devez être connecté' };
      }

      const newDispute = {
        id: generateId(),
        orderId: disputeData.orderId,
        orderNumber: disputeData.orderNumber,
        articleId: disputeData.articleId,
        articleTitle: disputeData.articleTitle,
        buyerId: disputeData.buyerId,
        buyerName: disputeData.buyerName,
        sellerId: disputeData.sellerId,
        sellerName: disputeData.sellerName,
        amount: disputeData.amount,
        reason: disputeData.reason,
        description: disputeData.description,
        evidence: disputeData.evidence || [], // Photos, captures
        status: DISPUTE_STATUS.OPEN,
        messages: [],
        resolution: null,
        createdAt: new Date().toISOString(),
        resolvedAt: null,
        resolvedBy: null
      };

      const updated = [...disputes, newDispute];
      saveDisputes(updated);

      return { success: true, dispute: newDispute };
    } catch (error) {
      console.error('Create dispute error:', error);
      return { success: false, error: 'Erreur lors de la création du litige' };
    }
  };

  /**
   * Mettre à jour le statut d'un litige
   */
  const updateDisputeStatus = async (disputeId, status, resolution = null) => {
    try {
      const updated = disputes.map(d => {
        if (d.id === disputeId) {
          return {
            ...d,
            status,
            resolution,
            resolvedAt: status !== DISPUTE_STATUS.OPEN && status !== DISPUTE_STATUS.INVESTIGATING 
              ? new Date().toISOString() 
              : null,
            resolvedBy: user?.id
          };
        }
        return d;
      });

      saveDisputes(updated);
      return { success: true };
    } catch (error) {
      console.error('Update dispute status error:', error);
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }
  };

  /**
   * Ajouter un message à un litige
   */
  const addDisputeMessage = async (disputeId, message) => {
    try {
      const updated = disputes.map(d => {
        if (d.id === disputeId) {
          return {
            ...d,
            messages: [
              ...d.messages,
              {
                id: generateId(),
                senderId: user.id,
                senderName: user.fullName,
                senderRole: 'admin', // ou 'buyer'/'seller'
                text: message,
                createdAt: new Date().toISOString()
              }
            ]
          };
        }
        return d;
      });

      saveDisputes(updated);
      return { success: true };
    } catch (error) {
      console.error('Add dispute message error:', error);
      return { success: false, error: 'Erreur lors de l\'envoi' };
    }
  };

  /**
   * Résoudre un litige avec remboursement
   */
  const resolveWithRefund = async (disputeId, refundAmount, reason) => {
    return await updateDisputeStatus(
      disputeId,
      DISPUTE_STATUS.RESOLVED_REFUND,
      {
        type: 'refund',
        amount: refundAmount,
        reason,
        decidedAt: new Date().toISOString()
      }
    );
  };

  /**
   * Résoudre un litige en faveur de l'acheteur
   */
  const resolveForBuyer = async (disputeId, reason) => {
    return await updateDisputeStatus(
      disputeId,
      DISPUTE_STATUS.RESOLVED_BUYER,
      {
        type: 'buyer_favor',
        reason,
        decidedAt: new Date().toISOString()
      }
    );
  };

  /**
   * Résoudre un litige en faveur du vendeur
   */
  const resolveForSeller = async (disputeId, reason) => {
    return await updateDisputeStatus(
      disputeId,
      DISPUTE_STATUS.RESOLVED_SELLER,
      {
        type: 'seller_favor',
        reason,
        decidedAt: new Date().toISOString()
      }
    );
  };

  /**
   * Obtenir les litiges ouverts
   */
  const getOpenDisputes = () => {
    return disputes.filter(d => 
      d.status === DISPUTE_STATUS.OPEN || 
      d.status === DISPUTE_STATUS.INVESTIGATING
    );
  };

  /**
   * Obtenir les litiges résolus
   */
  const getResolvedDisputes = () => {
    return disputes.filter(d => 
      d.status !== DISPUTE_STATUS.OPEN && 
      d.status !== DISPUTE_STATUS.INVESTIGATING
    );
  };

  /**
   * Obtenir un litige par ID
   */
  const getDisputeById = (disputeId) => {
    return disputes.find(d => d.id === disputeId);
  };

  const value = {
    disputes,
    loading,
    createDispute,
    updateDisputeStatus,
    addDisputeMessage,
    resolveWithRefund,
    resolveForBuyer,
    resolveForSeller,
    getOpenDisputes,
    getResolvedDisputes,
    getDisputeById,
    DISPUTE_STATUS,
    DISPUTE_STATUS_LABELS,
    DISPUTE_REASONS,
    DISPUTE_REASON_LABELS
  };

  return (
    <DisputeContext.Provider value={value}>
      {children}
    </DisputeContext.Provider>
  );
};
