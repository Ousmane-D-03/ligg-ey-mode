// src/pages/Signup.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROUTES, CITIES, ACCOUNT_TYPES, ACCOUNT_TYPE_LABELS } from '../utils/constants';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Card from '../components/common/Card';

const Signup = () => {
  const navigate = useNavigate();
  const { signup, isAuthenticated, setError } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    city: '',
    accountType: ACCOUNT_TYPES.INDIVIDUAL,
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated()) {
      navigate(ROUTES.HOME);
    }
  }, [isAuthenticated, navigate]);

  // Nettoyer les erreurs au changement
  useEffect(() => {
    setError(null);
    setErrors({});
  }, [formData, setError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await signup(formData);

    if (result.success) {
      navigate(ROUTES.HOME);
    } else {
      setErrors(result.errors || {});
    }

    setLoading(false);
  };

  // Options pour le select de ville
  const cityOptions = CITIES.map(city => ({
    value: city,
    label: city
  }));

  // Options pour le type de compte
  const accountTypeOptions = [
    { value: ACCOUNT_TYPES.INDIVIDUAL, label: ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.INDIVIDUAL] },
    { value: ACCOUNT_TYPES.BUSINESS, label: ACCOUNT_TYPE_LABELS[ACCOUNT_TYPES.BUSINESS] }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-700 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">L</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Créer un compte
          </h2>
          <p className="mt-2 text-gray-600">
            Rejoignez la communauté Liggéey Mode
          </p>
        </div>

        {/* Formulaire */}
        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Erreur générale */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            {/* Type de compte */}
            <Select
              label="Type de compte"
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              options={accountTypeOptions}
              error={errors.accountType}
              required
            />

            {/* Grille 2 colonnes pour desktop */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Nom complet */}
              <Input
                label="Nom complet"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder={formData.accountType === ACCOUNT_TYPES.BUSINESS ? "Nom de la boutique" : "Prénom Nom"}
                error={errors.fullName}
                required
                icon={formData.accountType === ACCOUNT_TYPES.BUSINESS ? <Building className="w-5 h-5" /> : <User className="w-5 h-5" />}
              />

              {/* Téléphone */}
              <Input
                label="Numéro de téléphone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="77 123 45 67"
                error={errors.phone}
                required
                helperText="Format: 77XXXXXXX ou 78XXXXXXX"
                icon={<Phone className="w-5 h-5" />}
              />
            </div>

            {/* Email */}
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              error={errors.email}
              required
              icon={<Mail className="w-5 h-5" />}
            />

            {/* Ville */}
            <Select
              label="Ville"
              name="city"
              value={formData.city}
              onChange={handleChange}
              options={cityOptions}
              placeholder="Sélectionnez votre ville"
              error={errors.city}
              required
            />

            {/* Grille 2 colonnes pour mots de passe */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Mot de passe */}
              <div className="relative">
                <Input
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  error={errors.password}
                  required
                  helperText="Min. 8 caractères"
                  icon={<Lock className="w-5 h-5" />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Confirmation mot de passe */}
              <div className="relative">
                <Input
                  label="Confirmer le mot de passe"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  error={errors.confirmPassword}
                  required
                  icon={<Lock className="w-5 h-5" />}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Bio (optionnel) */}
            <Input
              label="Bio (optionnel)"
              type="textarea"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder={formData.accountType === ACCOUNT_TYPES.BUSINESS ? "Décrivez votre boutique..." : "Parlez un peu de vous..."}
              rows={3}
              helperText="Quelques mots sur vous ou votre activité"
            />

            {/* Bouton submit */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
            >
              Créer mon compte
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Vous avez déjà un compte ?
              </span>
            </div>
          </div>

          {/* Lien connexion */}
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Se connecter
          </Button>
        </Card>

        {/* Note de sécurité */}
        <p className="mt-4 text-center text-xs text-gray-500">
          En créant un compte, vous acceptez nos{' '}
          <Link to="/conditions" className="text-green-700 hover:underline">
            conditions d'utilisation
          </Link>{' '}
          et notre{' '}
          <Link to="/confidentialite" className="text-green-700 hover:underline">
            politique de confidentialité
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
