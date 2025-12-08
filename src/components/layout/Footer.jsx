// src/components/layout/Footer.jsx
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone 
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Section principale */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* À propos */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-green-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-xl font-bold text-white">
                Liggéey Mode
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              La première marketplace dédiée à la mode d'occasion au Sénégal. 
              Achetez et vendez en toute sécurité.
            </p>
            <p className="text-sm font-medium text-white mb-2">
              Daay ko, Jënd ko, Liggeey ak yoon wi !
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to={ROUTES.BROWSE}
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  Parcourir les articles
                </Link>
              </li>
              <li>
                <Link
                  to={ROUTES.SELL}
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  Vendre un article
                </Link>
              </li>
              <li>
                <Link
                  to="/comment-ca-marche"
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  Comment ça marche ?
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/faq"
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link
                  to="/politique-confidentialite"
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  to="/conditions-utilisation"
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link
                  to="/securite"
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  Sécurité
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  Dakar, Sénégal
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
                <a
                  href="tel:+221771234567"
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  +221 77 123 45 67
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-green-500 flex-shrink-0" />
                <a
                  href="mailto:contact@liggeeymode.sn"
                  className="text-sm hover:text-green-500 transition-colors"
                >
                  contact@liggeeymode.sn
                </a>
              </li>
            </ul>

            {/* Réseaux sociaux */}
            <div className="flex items-center space-x-4 mt-4">
              <a
                href="https://facebook.com/liggeeymode"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://instagram.com/liggeeymode"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} Liggéey Mode. Tous droits réservés.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <span>🇸🇳 Fait au Sénégal avec ❤️</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
