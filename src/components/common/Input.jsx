// src/components/common/Input.jsx
import { AlertCircle } from 'lucide-react';

/**
 * Composant Input réutilisable avec validation
 * @param {object} props
 * @param {string} props.label - Label du champ
 * @param {string} props.type - Type d'input (text, email, password, number, tel, textarea)
 * @param {string} props.placeholder - Placeholder
 * @param {string} props.value - Valeur
 * @param {function} props.onChange - Fonction de changement
 * @param {string} props.error - Message d'erreur
 * @param {boolean} props.required - Champ requis
 * @param {boolean} props.disabled - Champ désactivé
 * @param {string} props.helperText - Texte d'aide
 * @param {number} props.rows - Nombre de lignes (pour textarea)
 * @param {React.ReactNode} props.icon - Icône (optionnel)
 */
const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  helperText,
  rows = 4,
  icon,
  className = '',
  name,
  id,
  ...props
}) => {
  const inputId = id || name || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  
  // Classes de base pour input
  const baseInputClasses = 'w-full px-4 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2';
  
  // Classes selon l'état
  const stateClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-green-500 focus:border-green-500';
  
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white';
  
  const finalInputClasses = `${baseInputClasses} ${stateClasses} ${disabledClasses} ${icon ? 'pl-10' : ''} ${className}`;

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={finalInputClasses}
          {...props}
        />
      );
    }

    return (
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={finalInputClasses}
        {...props}
      />
    );
  };

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input container avec icône */}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        {renderInput()}
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="flex items-center mt-1 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 mr-1" />
          <span>{error}</span>
        </div>
      )}

      {/* Texte d'aide */}
      {!error && helperText && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
