// src/components/common/Card.jsx

/**
 * Composant Card réutilisable
 * @param {object} props
 * @param {React.ReactNode} props.children - Contenu de la carte
 * @param {boolean} props.hover - Effet hover
 * @param {boolean} props.clickable - Curseur pointer
 * @param {function} props.onClick - Fonction au clic
 * @param {string} props.padding - none, sm, md, lg
 * @param {string} props.className - Classes CSS additionnelles
 */
const Card = ({
  children,
  hover = false,
  clickable = false,
  onClick,
  padding = 'md',
  className = '',
  ...props
}) => {
  // Classes de base
  const baseClasses = 'bg-white rounded-lg shadow-md transition-all duration-200';
  
  // Effet hover
  const hoverClasses = hover || clickable 
    ? 'hover:shadow-lg hover:-translate-y-0.5' 
    : '';
  
  // Curseur
  const cursorClasses = clickable || onClick 
    ? 'cursor-pointer' 
    : '';
  
  // Padding
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  // Classes finales
  const finalClasses = [
    baseClasses,
    hoverClasses,
    cursorClasses,
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={finalClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card.Header - En-tête de carte
 */
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`border-b border-gray-200 pb-3 mb-3 ${className}`} {...props}>
    {children}
  </div>
);

/**
 * Card.Body - Corps de carte
 */
Card.Body = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

/**
 * Card.Footer - Pied de carte
 */
Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`border-t border-gray-200 pt-3 mt-3 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
