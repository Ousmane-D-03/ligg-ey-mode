// src/components/common/Button.jsx
import { Loader2 } from 'lucide-react';

/**
 * Composant Button réutilisable
 * @param {object} props
 * @param {string} props.variant - primary, secondary, outline, ghost, danger
 * @param {string} props.size - sm, md, lg
 * @param {boolean} props.loading - Afficher le spinner
 * @param {boolean} props.disabled - Désactiver le bouton
 * @param {boolean} props.fullWidth - Prendre toute la largeur
 * @param {React.ReactNode} props.children - Contenu du bouton
 * @param {React.ReactNode} props.icon - Icône (optionnel)
 * @param {string} props.className - Classes CSS additionnelles
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  icon,
  className = '',
  type = 'button',
  ...props
}) => {
  // Classes de base
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variantes de couleur
  const variantClasses = {
    primary: 'bg-green-700 text-white hover:bg-green-800 focus:ring-green-500 active:bg-green-900',
    secondary: 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500 active:bg-orange-700',
    outline: 'border-2 border-green-700 text-green-700 hover:bg-green-50 focus:ring-green-500',
    ghost: 'text-green-700 hover:bg-green-50 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800'
  };

  // Tailles
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Classes finales
  const finalClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={finalClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {!loading && icon && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </button>
  );
};

export default Button;
