// src/components/layout/Header.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Heart, 
  MessageCircle, 
  User, 
  Menu, 
  X,
  Plus,
  LogOut,
  Settings,
  Package
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMessaging } from '../../context/MessagingContext';
import { ROUTES } from '../../utils/constants';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalUnreadCount } = useMessaging();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const unreadCount = getTotalUnreadCount();

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate(ROUTES.HOME);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Liggéey Mode
            </span>
          </Link>

          {/* Barre de recherche (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Rechercher des articles..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                onFocus={() => navigate(ROUTES.BROWSE)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated() ? (
              <>
                {/* Bouton Vendre */}
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => navigate(ROUTES.SELL)}
                >
                  Vendre
                </Button>

                {/* Favoris */}
                <Link
                  to={ROUTES.FAVORITES}
                  className="relative p-2 text-gray-600 hover:text-green-700 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Favoris"
                >
                  <Heart className="w-6 h-6" />
                </Link>

                {/* Messages */}
                <Link
                  to={ROUTES.MESSAGES}
                  className="relative p-2 text-gray-600 hover:text-green-700 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Messages"
                >
                  <MessageCircle className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Menu utilisateur */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Avatar
                      src={user?.profilePicture}
                      name={user?.fullName}
                      size="sm"
                    />
                  </button>

                  {/* Dropdown menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user?.fullName}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>

                      <Link
                        to={ROUTES.MY_PROFILE}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Mon profil
                      </Link>

                      <Link
                        to={ROUTES.MY_PROFILE}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Package className="w-4 h-4 mr-3" />
                        Mes articles
                      </Link>

                      <Link
                        to={ROUTES.SETTINGS}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Paramètres
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Déconnexion
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Connexion
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(ROUTES.SIGNUP)}
                >
                  Inscription
                </Button>
              </div>
            )}
          </div>

          {/* Menu mobile button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Barre de recherche mobile */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onFocus={() => navigate(ROUTES.BROWSE)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            {isAuthenticated() ? (
              <>
                <Link
                  to={ROUTES.SELL}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Plus className="w-5 h-5 mr-3" />
                  Vendre un article
                </Link>

                <Link
                  to={ROUTES.FAVORITES}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Heart className="w-5 h-5 mr-3" />
                  Favoris
                </Link>

                <Link
                  to={ROUTES.MESSAGES}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Messages
                  {unreadCount > 0 && (
                    <Badge variant="error" size="sm" className="ml-auto">
                      {unreadCount}
                    </Badge>
                  )}
                </Link>

                <Link
                  to={ROUTES.MY_PROFILE}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5 mr-3" />
                  Mon profil
                </Link>

                <Link
                  to={ROUTES.SETTINGS}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="w-5 h-5 mr-3" />
                  Paramètres
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => {
                    navigate(ROUTES.LOGIN);
                    setMobileMenuOpen(false);
                  }}
                >
                  Connexion
                </Button>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    navigate(ROUTES.SIGNUP);
                    setMobileMenuOpen(false);
                  }}
                >
                  Inscription
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
