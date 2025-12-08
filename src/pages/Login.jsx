// src/pages/Login.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, error, setError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
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

    const result = await login(formData);

    if (result.success) {
      navigate(ROUTES.HOME);
    } else {
      setErrors(result.errors || {});
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-700 rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">L</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Bon retour !
          </h2>
          <p className="mt-2 text-gray-600">
            Connectez-vous pour accéder à votre compte
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

            {/* Mot de passe oublié */}
            <div className="flex items-center justify-end">
              <Link
                to="/mot-de-passe-oublie"
                className="text-sm text-green-700 hover:text-green-800"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton submit */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
            >
              Se connecter
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Pas encore de compte ?
              </span>
            </div>
          </div>

          {/* Lien inscription */}
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate(ROUTES.SIGNUP)}
          >
            Créer un compte
          </Button>
        </Card>

        {/* Note de sécurité */}
        <p className="mt-4 text-center text-xs text-gray-500">
          En vous connectant, vous acceptez nos{' '}
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

export default Login;
