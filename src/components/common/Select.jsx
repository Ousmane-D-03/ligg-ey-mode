// src/components/common/Select.jsx
import { AlertCircle, ChevronDown } from 'lucide-react';

/**
 * Composant Select réutilisable
 * @param {object} props
 * @param {string} props.label - Label du champ
 * @param {string} props.value - Valeur sélectionnée
 * @param {function} props.onChange - Fonction de changement
 * @param {Array} props.options - Liste des options [{value, label}]
 * @param {string} props.placeholder - Placeholder
 * @param {string} props.error - Message d'erreur
 * @param {boolean} props.required - Champ requis
 * @param {boolean} props.disabled - Champ désactivé
 * @param {string} props.helperText - Texte d'aide
 */
const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Sélectionner...',
  error,
  required = false,
  disabled = false,
  helperText,
  className = '',
  name,
  id,
  ...props
}) => {
  const selectId = id || name || `select-${label?.toLowerCase().replace(/\s+/g, '-')}`;
  
  // Classes de base
  const baseClasses = 'w-full px-4 py-2 pr-10 border rounded-lg appearance-none transition-colors focus:outline-none focus:ring-2';
  
  // Classes selon l'état
  const stateClasses = error
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-green-500 focus:border-green-500';
  
  const disabledClasses = disabled 
    ? 'bg-gray-100 cursor-not-allowed' 
    : 'bg-white cursor-pointer';
  
  const finalClasses = `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`;

  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Select container */}
      <div className="relative">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={finalClasses}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          
          {options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Icône chevron */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
          <ChevronDown className="w-5 h-5" />
        </div>
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

export default Select;
