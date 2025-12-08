// src/context/MessagingContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
  getMessages,
  createMessage,
  getConversationMessages,
  markMessageAsRead
} from '../utils/storage';
import { useAuth } from './AuthContext';

const MessagingContext = createContext();

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error('useMessaging must be used within MessagingProvider');
  }
  return context;
};

export const MessagingProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les messages au démarrage et quand l'utilisateur change
  useEffect(() => {
    if (user) {
      loadMessages();
    } else {
      setMessages([]);
      setConversations([]);
      setActiveConversation(null);
    }
  }, [user]);

  // Mettre à jour les conversations quand les messages changent
  useEffect(() => {
    if (user && messages.length > 0) {
      buildConversations();
    }
  }, [messages, user]);

  /**
   * Charger tous les messages de l'utilisateur
   */
  const loadMessages = async () => {
    try {
      if (!user) return;
      
      setLoading(true);
      const allMessages = await getMessages();
      
      // Filtrer les messages de l'utilisateur
      const userMessages = allMessages.filter(
        m => m.senderId === user.id || m.receiverId === user.id
      );
      
      setMessages(userMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('Erreur lors du chargement des messages');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Construire la liste des conversations
   */
  const buildConversations = () => {
    if (!user) return;

    const convMap = new Map();

    messages.forEach(msg => {
      const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
      
      if (!convMap.has(otherUserId)) {
        convMap.set(otherUserId, {
          userId: otherUserId,
          userName: msg.senderId === user.id ? msg.receiverName : msg.senderName,
          userAvatar: msg.senderId === user.id ? msg.receiverAvatar : msg.senderAvatar,
          lastMessage: msg.messageText,
          lastMessageTime: msg.createdAt,
          unreadCount: 0,
          articleId: msg.articleId || null,
          articleTitle: msg.articleTitle || null
        });
      }

      const conv = convMap.get(otherUserId);
      
      // Mettre à jour le dernier message si plus récent
      if (new Date(msg.createdAt) > new Date(conv.lastMessageTime)) {
        conv.lastMessage = msg.messageText;
        conv.lastMessageTime = msg.createdAt;
      }

      // Compter les messages non lus
      if (msg.receiverId === user.id && !msg.isRead) {
        conv.unreadCount++;
      }
    });

    // Convertir en tableau et trier par date
    const convArray = Array.from(convMap.values()).sort(
      (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );

    setConversations(convArray);
  };

  /**
   * Envoyer un nouveau message
   */
  const sendMessage = async (receiverId, messageText, articleId = null) => {
    try {
      if (!user) {
        return { success: false, error: 'Vous devez être connecté' };
      }

      if (!messageText || messageText.trim().length === 0) {
        return { success: false, error: 'Le message ne peut pas être vide' };
      }

      setLoading(true);

      const newMessage = await createMessage({
        senderId: user.id,
        senderName: user.fullName,
        senderAvatar: user.profilePicture,
        receiverId,
        messageText: messageText.trim(),
        articleId
      });

      // Ajouter à la liste locale
      setMessages(prev => [...prev, newMessage]);

      return { success: true, message: newMessage };
    } catch (err) {
      console.error('Send message error:', err);
      return { success: false, error: 'Erreur lors de l\'envoi' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupérer les messages d'une conversation
   */
  const getConversation = async (otherUserId) => {
    try {
      if (!user) return [];

      const conversationMessages = await getConversationMessages(user.id, otherUserId);
      
      // Marquer les messages reçus comme lus
      conversationMessages.forEach(async msg => {
        if (msg.receiverId === user.id && !msg.isRead) {
          await markMessageAsRead(msg.id);
        }
      });

      // Mettre à jour la liste locale
      await loadMessages();

      return conversationMessages;
    } catch (err) {
      console.error('Get conversation error:', err);
      return [];
    }
  };

  /**
   * Ouvrir une conversation
   */
  const openConversation = async (otherUserId) => {
    try {
      setActiveConversation(otherUserId);
      const msgs = await getConversation(otherUserId);
      return msgs;
    } catch (err) {
      console.error('Open conversation error:', err);
      return [];
    }
  };

  /**
   * Fermer la conversation active
   */
  const closeConversation = () => {
    setActiveConversation(null);
  };

  /**
   * Compter le total de messages non lus
   */
  const getTotalUnreadCount = () => {
    return conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  };

  /**
   * Obtenir le nombre de messages non lus d'une conversation
   */
  const getConversationUnreadCount = (otherUserId) => {
    const conv = conversations.find(c => c.userId === otherUserId);
    return conv ? conv.unreadCount : 0;
  };

  /**
   * Vérifier s'il y a une conversation avec un utilisateur
   */
  const hasConversationWith = (otherUserId) => {
    return conversations.some(c => c.userId === otherUserId);
  };

  /**
   * Démarrer une nouvelle conversation
   */
  const startConversation = async (otherUserId, otherUserName, initialMessage, articleId = null) => {
    try {
      if (!user) {
        return { success: false, error: 'Vous devez être connecté' };
      }

      // Envoyer le premier message
      const result = await sendMessage(otherUserId, initialMessage, articleId);
      
      if (result.success) {
        // Ouvrir la conversation
        await openConversation(otherUserId);
      }

      return result;
    } catch (err) {
      console.error('Start conversation error:', err);
      return { success: false, error: 'Erreur' };
    }
  };

  const value = {
    messages,
    conversations,
    activeConversation,
    loading,
    error,
    sendMessage,
    getConversation,
    openConversation,
    closeConversation,
    getTotalUnreadCount,
    getConversationUnreadCount,
    hasConversationWith,
    startConversation,
    refreshMessages: loadMessages
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};
