// src/components/common/WaveConfigModal.jsx
import { useState } from 'react';
import { Phone, User, AlertCircle, CheckCircle } from 'lucide-react';
import { validatePhone } from '../../utils/validators';
import Modal from './Modal';
import Button from './Button';
import Input from './Input';

/**
 * Modal de configuration Wave (obligatoire pour vendre)
 */
const WaveConfigModal = ({ isOpen, onClose, onSave, currentConfig = null }) => {
  const [formData, setFormData] = useState({
    waveFullName: currentConfig?.waveFullName || '',
    wavePhone: currentConfig?.wavePhone || ''
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    // Validation
    const newErrors = {};
    
    if (!formData.waveFullName.trim()) {
      newErrors.waveFullName = 'Le nom complet est requis';
    } else if (formData.waveFullName.trim().length < 3) {
      newErrors.waveFullName = 'Le nom doit contenir au moins 3 caractères';
    }

    const phoneValidation = validatePhone(formData.wavePhone);
    if (!phoneValidation.valid) {
      newErrors.wavePhone = phoneValidation.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSaving(false);
      return;
    }

    // Sauvegarder
    await onSave(formData);
    setSaving(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Pas de fermeture si obligatoire
      title="Configuration Wave Business"
      size="md"
      closeOnOverlayClick={false}
      showCloseButton={currentConfig !== null} // Fermer seulement si déjà configuré
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Alerte importante */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">📱 Configuration obligatoire</p>
              <p>
                Pour recevoir vos paiements après chaque vente, configurez votre compte Wave.
                Les acheteurs paient Liggéey Mode qui vous verse ensuite le montant (moins la commission).
              </p>
            </div>
          </div>
        </div>

        {/* Nom complet */}
        <Input
          label="Nom complet sur votre compte Wave"
          name="waveFullName"
          value={formData.waveFullName}
          onChange={handleChange}
          placeholder="Ex: Moussa Diop"
          error={errors.waveFullName}
          required
          icon={<User className="w-5 h-5" />}
          helperText="Exactement comme sur votre compte Wave"
        />

        {/* Numéro Wave */}
        <Input
          label="Numéro Wave"
          name="wavePhone"
          value={formData.wavePhone}
          onChange={handleChange}
          placeholder="77 123 45 67"
          error={errors.wavePhone}
          required
          icon={<Phone className="w-5 h-5" />}
          helperText="Votre numéro Wave pour recevoir les paiements"
        />

        {/* Info commission */}
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-green-800">
              <p className="font-semibold mb-1">💰 Comment ça marche ?</p>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>L'acheteur paie Liggéey Mode</li>
                <li>Vous expédiez l'article</li>
                <li>L'acheteur confirme la réception</li>
                <li>Nous vous versons le montant (moins 8% de commission)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Boutons */}
        <div className="flex gap-3">
          {currentConfig && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Annuler
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            fullWidth
          >
            {currentConfig ? 'Mettre à jour' : 'Enregistrer et continuer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default WaveConfigModal;
