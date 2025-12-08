// src/components/common/Badge.jsx
import { 
  CheckCircle, 
  Star, 
  Zap, 
  Shield, 
  Award,
  AlertCircle,
  Clock,
  XCircle
} from 'lucide-react';

/**
 * Composant Badge réutilisable
 * @param {object} props
 * @param {string} props.variant - success, warning, error, info, primary, secondary
 * @param {string} props.size - sm, md, lg
 * @param {string} props.icon - Type d'icône (check, star, zap, shield, award, alert, clock, x)
 * @param {React.ReactNode} props.children - Contenu du badge
 * @param {boolean} props.dot - Afficher un point au lieu d'une icône
 * @param {string} props.className - Classes CSS additionnelles
 */
const Badge = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  dot = false,
  className = ''
}) => {
  // Classes de base
  const baseClasses = 'inline-flex items-center font-medium rounded-full whitespace-nowrap';

  // Variantes de couleur
  const variantClasses = {
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    primary: 'bg-green-700 text-white',
    secondary: 'bg-orange-500 text-white',
    gray: 'bg-gray-100 text-gray-800'
  };

  // Tailles
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  // Tailles d'icônes
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  // Map des icônes
  const iconMap = {
    check: CheckCircle,
    star: Star,
    zap: Zap,
    shield: Shield,
    award: Award,
    alert: AlertCircle,
    clock: Clock,
    x: XCircle
  };

  // Classes finales
  const finalClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  // Rendu de l'icône
  const renderIcon = () => {
    if (dot) {
      return (
        <span 
          className={`inline-block rounded-full mr-1.5 ${
            size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-2.5 h-2.5' : 'w-2 h-2'
          } ${
            variant === 'success' ? 'bg-green-600' :
            variant === 'warning' ? 'bg-yellow-600' :
            variant === 'error' ? 'bg-red-600' :
            variant === 'info' ? 'bg-blue-600' :
            variant === 'primary' ? 'bg-white' :
            variant === 'secondary' ? 'bg-white' :
            'bg-gray-600'
          }`}
        />
      );
    }

    if (icon) {
      const IconComponent = iconMap[icon];
      if (IconComponent) {
        return (
          <IconComponent className={`${iconSizes[size]} mr-1`} />
        );
      }
    }

    return null;
  };

  return (
    <span className={finalClasses}>
      {renderIcon()}
      {children}
    </span>
  );
};

export default Badge;
