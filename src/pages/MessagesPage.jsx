// src/pages/MessagesPage.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Send, 
  ArrowLeft,
  MoreVertical,
  Image as ImageIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMessaging } from '../context/MessagingContext';
import { ROUTES } from '../utils/constants';
import { formatRelativeTime } from '../utils/formatters';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';

const MessagesPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    conversations,
    activeConversation,
    sendMessage,
    getConversation,
    openConversation,
    closeConversation,
    loading
  } = useMessaging();

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  // Rediriger si non connecté
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  // Scroll automatique vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Charger une conversation
  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    const msgs = await openConversation(conversation.userId);
    setMessages(msgs);
  };

  // Envoyer un message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedConversation) return;

    setSendingMessage(true);
    const result = await sendMessage(
      selectedConversation.userId,
      messageInput,
      selectedConversation.articleId
    );

    if (result.success) {
      setMessageInput('');
      // Recharger la conversation
      const msgs = await getConversation(selectedConversation.userId);
      setMessages(msgs);
    }

    setSendingMessage(false);
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
    closeConversation();
  };

  // Filtrer les conversations par recherche
  const filteredConversations = conversations.filter(conv =>
    conv.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col overflow-hidden">
        <div className="bg-white rounded-lg shadow-sm flex-1 flex overflow-hidden">
          {/* Liste des conversations (sidebar) */}
          <div
            className={`w-full md:w-96 border-r border-gray-200 flex flex-col ${
              selectedConversation ? 'hidden md:flex' : 'flex'
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Messages</h2>
              
              {/* Barre de recherche */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une conversation..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>

            {/* Liste */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="spinner"></div>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <p className="text-gray-500 mb-4">
                    {searchQuery ? 'Aucune conversation trouvée' : 'Aucun message'}
                  </p>
                  {!searchQuery && (
                    <Button
                      variant="primary"
                      onClick={() => navigate(ROUTES.BROWSE)}
                    >
                      Parcourir les articles
                    </Button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredConversations.map((conv) => (
                    <button
                      key={conv.userId}
                      onClick={() => handleSelectConversation(conv)}
                      className={`w-full p-4 hover:bg-gray-50 transition-colors text-left ${
                        selectedConversation?.userId === conv.userId
                          ? 'bg-green-50'
                          : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar
                          src={conv.userAvatar}
                          name={conv.userName}
                          size="md"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-gray-900 truncate">
                              {conv.userName}
                            </p>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {formatRelativeTime(conv.lastMessageTime)}
                            </span>
                          </div>
                          
                          {conv.articleTitle && (
                            <p className="text-xs text-gray-500 mb-1 truncate">
                              📦 {conv.articleTitle}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-600 truncate">
                              {conv.lastMessage}
                            </p>
                            {conv.unreadCount > 0 && (
                              <Badge variant="error" size="sm" className="ml-2 flex-shrink-0">
                                {conv.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Zone de conversation */}
          <div
            className={`flex-1 flex flex-col ${
              !selectedConversation ? 'hidden md:flex' : 'flex'
            }`}
          >
            {selectedConversation ? (
              <>
                {/* Header de conversation */}
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleBackToList}
                      className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    
                    <Avatar
                      src={selectedConversation.userAvatar}
                      name={selectedConversation.userName}
                      size="md"
                    />
                    
                    <div>
                      <p className="font-semibold text-gray-900">
                        {selectedConversation.userName}
                      </p>
                      {selectedConversation.articleTitle && (
                        <button
                          onClick={() => navigate(`/article/${selectedConversation.articleId}`)}
                          className="text-xs text-green-700 hover:underline"
                        >
                          Voir l'article →
                        </button>
                      )}
                    </div>
                  </div>

                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => {
                    const isOwn = msg.senderId === user.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            isOwn
                              ? 'bg-green-700 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="break-words">{msg.messageText}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwn ? 'text-green-100' : 'text-gray-500'
                            }`}
                          >
                            {formatRelativeTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input message */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <textarea
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e);
                          }
                        }}
                        placeholder="Écrivez votre message..."
                        rows={1}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        style={{ minHeight: '44px', maxHeight: '120px' }}
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!messageInput.trim()}
                      loading={sendingMessage}
                      className="flex-shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
                  </p>
                </form>
              </>
            ) : (
              // État vide (desktop uniquement)
              <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Vos messages
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Sélectionnez une conversation pour commencer à discuter
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
