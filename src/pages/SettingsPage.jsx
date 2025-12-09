// src/pages/SettingsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Lock, 
  Bell, 
  Trash2,
  Save,
  Upload,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROUTES, CITIES } from '../utils/constants';
import { validateEmail, validatePhone, validatePassword } from '../utils/validators';
import { imageToBase64, validateImage } from '../utils/formatters';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Modal from '../components/common/Modal';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, logout, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('profile'); // profile, security, notifications
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Profile form
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    city: '',
    bio: '',
    profilePicture: null
  });
  const [profileErrors, setProfileErrors] = useState({});

  // Security form
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securityErrors, setSecurityErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Notifications
  const [notifications, setNotifications] = useState({
    email: true,
    messages: true,
    sales: true,
    favorites: false
  });

  // Rediriger si non connecté
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  // Initialiser le formulaire avec les données user
  useEffect(() => {
    if (user) {
      setProfileForm({
        fullName: user.fullName || '',
        phone: user.phone || '',
        city: user.city || '',
        bio: user.bio || '',
        profilePicture: user.profilePicture || null
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityForm(prev => ({ ...prev, [name]: value }));
    if (securityErrors[name]) {
      setSecurityErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImage(file);
    if (!validation.valid) {
      setProfileErrors(prev => ({ ...prev, profilePicture: validation.error }));
      return;
    }

    try {
      const base64 = await imageToBase64(file);
      setProfileForm(prev => ({ ...prev, profilePicture: base64 }));
      setProfileErrors(prev => ({ ...prev, profilePicture: '' }));
    } catch (error) {
      setProfileErrors(prev => ({ ...prev, profilePicture: 'Erreur lors du chargement' }));
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setProfileErrors({});

    // Validation
    const errors = {};
    if (!profileForm.fullName.trim()) {
      errors.fullName = 'Le nom est requis';
    }
    const phoneValidation = validatePhone(profileForm.phone);
    if (!phoneValidation.valid) {
      errors.phone = phoneValidation.error;
    }
    if (!profileForm.city) {
      errors.city = 'La ville est requise';
    }

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      setLoading(false);
      return;
    }

    const result = await updateProfile(profileForm);

    if (result.success) {
      setSuccessMessage('Profil mis à jour avec succès !');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setProfileErrors({ general: result.error });
    }

    setLoading(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setSecurityErrors({});

    // Validation
    const errors = {};
    if (!securityForm.currentPassword) {
      errors.currentPassword = 'Le mot de passe actuel est requis';
    }
    const passwordValidation = validatePassword(securityForm.newPassword);
    if (!passwordValidation.valid) {
      errors.newPassword = passwordValidation.error;
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (Object.keys(errors).length > 0) {
      setSecurityErrors(errors);
      setLoading(false);
      return;
    }

    // TODO: Vérifier le mot de passe actuel et mettre à jour
    // Pour le moment, simulation
    setSuccessMessage('Mot de passe mis à jour avec succès !');
    setSecurityForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setTimeout(() => setSuccessMessage(''), 3000);

    setLoading(false);
  };

  const handleDeleteAccount = async () => {
    // TODO: Implémenter la suppression du compte
    await logout();
    navigate(ROUTES.HOME);
  };

  const cityOptions = CITIES.map(city => ({ value: city, label: city }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Paramètres
            </h1>
            <p className="text-gray-600">
              Gérez votre compte et vos préférences
            </p>
          </div>

          {/* Message de succès */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              {successMessage}
            </div>
          )}

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-4 px-1 border-b-2 font-medium transition-colors flex items-center ${
                    activeTab === 'profile'
                      ? 'border-green-700 text-green-700'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <User className="w-5 h-5 mr-2" />
                  Profil
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`pb-4 px-1 border-b-2 font-medium transition-colors flex items-center ${
                    activeTab === 'security'
                      ? 'border-green-700 text-green-700'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Sécurité
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`pb-4 px-1 border-b-2 font-medium transition-colors flex items-center ${
                    activeTab === 'notifications'
                      ? 'border-green-700 text-green-700'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Bell className="w-5 h-5 mr-2" />
                  Notifications
                </button>
              </div>
            </div>
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card padding="lg">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>

                {profileErrors.general && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {profileErrors.general}
                  </div>
                )}

                {/* Photo de profil */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Photo de profil
                  </label>
                  <div className="flex items-center space-x-4">
                    <Avatar
                      src={profileForm.profilePicture}
                      name={profileForm.fullName}
                      size="xl"
                    />
                    <div>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label htmlFor="avatar-upload">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          icon={<Upload className="w-4 h-4" />}
                          onClick={() => document.getElementById('avatar-upload').click()}
                        >
                          Changer la photo
                        </Button>
                      </label>
                      {profileErrors.profilePicture && (
                        <p className="text-sm text-red-600 mt-1">{profileErrors.profilePicture}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Input
                  label="Nom complet"
                  name="fullName"
                  value={profileForm.fullName}
                  onChange={handleProfileChange}
                  error={profileErrors.fullName}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  value={user?.email}
                  disabled
                  helperText="L'email ne peut pas être modifié"
                />

                <Input
                  label="Téléphone"
                  name="phone"
                  value={profileForm.phone}
                  onChange={handleProfileChange}
                  error={profileErrors.phone}
                  required
                />

                <Select
                  label="Ville"
                  name="city"
                  value={profileForm.city}
                  onChange={handleProfileChange}
                  options={cityOptions}
                  error={profileErrors.city}
                  required
                />

                <Input
                  label="Bio"
                  type="textarea"
                  name="bio"
                  value={profileForm.bio}
                  onChange={handleProfileChange}
                  rows={4}
                  helperText="Quelques mots sur vous"
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    icon={<Save className="w-5 h-5" />}
                  >
                    Enregistrer les modifications
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <Card padding="lg">
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <h2 className="text-xl font-semibold mb-4">Changer le mot de passe</h2>

                  {securityErrors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      {securityErrors.general}
                    </div>
                  )}

                  <div className="relative">
                    <Input
                      label="Mot de passe actuel"
                      type={showPasswords.current ? 'text' : 'password'}
                      name="currentPassword"
                      value={securityForm.currentPassword}
                      onChange={handleSecurityChange}
                      error={securityErrors.currentPassword}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="Nouveau mot de passe"
                      type={showPasswords.new ? 'text' : 'password'}
                      name="newPassword"
                      value={securityForm.newPassword}
                      onChange={handleSecurityChange}
                      error={securityErrors.newPassword}
                      required
                      helperText="Min. 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="Confirmer le nouveau mot de passe"
                      type={showPasswords.confirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={securityForm.confirmPassword}
                      onChange={handleSecurityChange}
                      error={securityErrors.confirmPassword}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    >
                      {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      loading={loading}
                    >
                      Changer le mot de passe
                    </Button>
                  </div>
                </form>
              </Card>

              {/* Danger Zone */}
              <Card padding="lg" className="border-2 border-red-200">
                <h2 className="text-xl font-semibold mb-4 text-red-600">Zone dangereuse</h2>
                <p className="text-gray-600 mb-4">
                  La suppression de votre compte est irréversible. Toutes vos données seront définitivement effacées.
                </p>
                <Button
                  variant="danger"
                  icon={<Trash2 className="w-5 h-5" />}
                  onClick={() => setShowDeleteModal(true)}
                >
                  Supprimer mon compte
                </Button>
              </Card>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card padding="lg">
              <h2 className="text-xl font-semibold mb-6">Préférences de notification</h2>
              
              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Notifications par email</p>
                    <p className="text-sm text-gray-500">Recevoir des emails pour les activités importantes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                    className="w-5 h-5 text-green-700 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Nouveaux messages</p>
                    <p className="text-sm text-gray-500">Être notifié quand vous recevez un message</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.messages}
                    onChange={(e) => setNotifications(prev => ({ ...prev, messages: e.target.checked }))}
                    className="w-5 h-5 text-green-700 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Ventes et achats</p>
                    <p className="text-sm text-gray-500">Notifications pour vos transactions</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.sales}
                    onChange={(e) => setNotifications(prev => ({ ...prev, sales: e.target.checked }))}
                    className="w-5 h-5 text-green-700 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">Favoris disponibles</p>
                    <p className="text-sm text-gray-500">Être notifié quand un article favori baisse de prix</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.favorites}
                    onChange={(e) => setNotifications(prev => ({ ...prev, favorites: e.target.checked }))}
                    className="w-5 h-5 text-green-700 rounded"
                  />
                </label>
              </div>

              <div className="mt-6 flex justify-end">
                <Button variant="primary" icon={<Save className="w-5 h-5" />}>
                  Enregistrer les préférences
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Modal de suppression */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Supprimer votre compte"
        footer={
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              fullWidth
            >
              Annuler
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteAccount}
              fullWidth
            >
              Supprimer définitivement
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-red-800 font-medium">⚠️ Cette action est irréversible !</p>
          </div>
          <p className="text-gray-700">
            Êtes-vous sûr de vouloir supprimer votre compte ? Toutes vos données, y compris vos articles, messages et favoris seront définitivement effacés.
          </p>
          <p className="text-gray-700">
            Si vous avez des articles en vente, ils seront également supprimés.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
