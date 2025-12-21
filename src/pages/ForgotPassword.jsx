// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { ROUTES } from '../utils/constants';
import { validateEmail } from '../utils/validators';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    const validation = validateEmail(email);
    if (!validation.valid) {
      setError(validation.error);
      setLoading(false);
      return;
    }

    // TODO: Implémenter l'envoi d'email de réinitialisation
    // Pour le moment, simulation
    setTimeout(() => {
      setEmailSent(true);
      setLoading(false);
    }, 1500);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <Card padding="lg" className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-700" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Email envoyé !
            </h2>
            
            <p className="text-gray-600 mb-6">
              Un email de réinitialisation a été envoyé à <strong>{email}</strong>. 
              Vérifiez votre boîte de réception et suivez les instructions.
            </p>

            <p className="text-sm text-gray-500 mb-6">
              Vous n'avez pas reçu l'email ? Vérifiez vos spams ou réessayez dans quelques minutes.
            </p>

            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => setEmailSent(false)}
              >
                Renvoyer l'email
              </Button>
              
              <Link to={ROUTES.LOGIN}>
                <Button variant="outline" fullWidth>
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

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
            Mot de passe oublié ?
          </h2>
          <p className="mt-2 text-gray-600">
            Entrez votre email pour réinitialiser votre mot de passe
          </p>
        </div>

        {/* Formulaire */}
        <Card padding="lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Email */}
            <Input
              label="Email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              icon={<Mail className="w-5 h-5" />}
            />

            <p className="text-sm text-gray-600">
              Nous vous enverrons un lien de réinitialisation à cette adresse email.
            </p>

            {/* Bouton submit */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
            >
              Envoyer le lien
            </Button>
          </form>

          {/* Retour */}
          <div className="mt-6">
            <Link
              to={ROUTES.LOGIN}
              className="flex items-center justify-center text-sm text-green-700 hover:text-green-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à la connexion
            </Link>
          </div>
        </Card>

        {/* Note de sécurité */}
        <p className="mt-4 text-center text-xs text-gray-500">
          Si vous ne trouvez pas l'email, vérifiez votre dossier spam ou{' '}
          <Link to="/contact" className="text-green-700 hover:underline">
            contactez-nous
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
