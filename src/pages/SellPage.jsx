// src/pages/SellPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  X, 
  Image as ImageIcon,
  AlertCircle,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useArticles } from '../context/ArticlesContext';
import { 
  ROUTES,
  CATEGORIES,
  CATEGORY_LABELS,
  CONDITION,
  CONDITION_LABELS,
  CITIES,
  SIZES,
  DELIVERY_OPTIONS,
  DELIVERY_LABELS,
  IMAGE_LIMITS
} from '../utils/constants';
import { validateImage, imageToBase64 } from '../utils/formatters';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Card from '../components/common/Card';

const SellPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { createNewArticle } = useArticles();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    brand: '',
    size: '',
    color: '',
    condition: '',
    price: '',
    city: user?.city || '',
    deliveryOptions: [DELIVERY_OPTIONS.MEETUP],
    images: []
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Info, 2: Photos, 3: Prix

  // Rediriger si non connecté
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(ROUTES.LOGIN);
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Nettoyer l'erreur du champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDeliveryOptionToggle = (option) => {
    setFormData(prev => ({
      ...prev,
      deliveryOptions: prev.deliveryOptions.includes(option)
        ? prev.deliveryOptions.filter(o => o !== option)
        : [...prev.deliveryOptions, option]
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (formData.images.length + files.length > IMAGE_LIMITS.MAX) {
      setErrors(prev => ({
        ...prev,
        images: `Vous ne pouvez ajouter que ${IMAGE_LIMITS.MAX} images maximum`
      }));
      return;
    }

    const newImages = [];
    for (const file of files) {
      const validation = validateImage(file);
      if (!validation.valid) {
        setErrors(prev => ({ ...prev, images: validation.error }));
        continue;
      }

      try {
        const base64 = await imageToBase64(file);
        newImages.push(base64);
      } catch (error) {
        console.error('Error converting image:', error);
      }
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));

    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
      if (!formData.description.trim()) newErrors.description = 'La description est requise';
      if (!formData.category) newErrors.category = 'La catégorie est requise';
      if (!formData.brand.trim()) newErrors.brand = 'La marque est requise';
      if (!formData.size) newErrors.size = 'La taille est requise';
      if (!formData.condition) newErrors.condition = "L'état est requis";
      if (!formData.city) newErrors.city = 'La ville est requise';
    }

    if (currentStep === 2) {
      if (formData.images.length < IMAGE_LIMITS.MIN) {
        newErrors.images = `Vous devez ajouter au moins ${IMAGE_LIMITS.MIN} images`;
      }
    }

    if (currentStep === 3) {
      if (!formData.price) newErrors.price = 'Le prix est requis';
      if (formData.price && (formData.price < 500 || formData.price > 500000)) {
        newErrors.price = 'Le prix doit être entre 500 et 500 000 FCFA';
      }
      if (formData.deliveryOptions.length === 0) {
        newErrors.deliveryOptions = 'Choisissez au moins une option de livraison';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(3)) return;

    setLoading(true);

    const result = await createNewArticle(formData);

    if (result.success) {
      navigate(`/article/${result.article.id}`);
    } else {
      setErrors(result.errors || {});
      setStep(1); // Retour à la première étape si erreurs
    }

    setLoading(false);
  };

  // Options pour les selects
  const categoryOptions = Object.keys(CATEGORIES).map(key => ({
    value: CATEGORIES[key],
    label: CATEGORY_LABELS[CATEGORIES[key]]
  }));

  const conditionOptions = Object.keys(CONDITION).map(key => ({
    value: CONDITION[key],
    label: CONDITION_LABELS[CONDITION[key]]
  }));

  const cityOptions = CITIES.map(city => ({ value: city, label: city }));

  const sizeOptions = SIZES.CLOTHING.map(size => ({ value: size, label: size }));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Vendre un article
            </h1>
            <p className="text-gray-600">
              Remplissez les informations pour publier votre article
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${step >= 1 ? 'text-green-700' : 'text-gray-400'}`}>
                1. Informations
              </span>
              <span className={`text-sm font-medium ${step >= 2 ? 'text-green-700' : 'text-gray-400'}`}>
                2. Photos
              </span>
              <span className={`text-sm font-medium ${step >= 3 ? 'text-green-700' : 'text-gray-400'}`}>
                3. Prix & Livraison
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-700 transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Informations */}
            {step === 1 && (
              <Card padding="lg" className="space-y-6">
                <h2 className="text-xl font-semibold">Informations de l'article</h2>

                <Input
                  label="Titre"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex: Robe rouge taille M"
                  error={errors.title}
                  required
                  helperText="Soyez précis et descriptif (10-100 caractères)"
                />

                <Input
                  label="Description"
                  type="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez votre article en détail..."
                  error={errors.description}
                  required
                  rows={5}
                  helperText="Mentionnez l'état, les défauts éventuels, etc. (min. 50 caractères)"
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <Select
                    label="Catégorie"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    options={categoryOptions}
                    placeholder="Sélectionnez une catégorie"
                    error={errors.category}
                    required
                  />

                  <Input
                    label="Marque"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Ex: Zara, H&M, Nike..."
                    error={errors.brand}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Select
                    label="Taille"
                    name="size"
                    value={formData.size}
                    onChange={handleChange}
                    options={sizeOptions}
                    placeholder="Sélectionnez une taille"
                    error={errors.size}
                    required
                  />

                  <Input
                    label="Couleur"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="Ex: Rouge, Bleu..."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Select
                    label="État"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    options={conditionOptions}
                    placeholder="Sélectionnez l'état"
                    error={errors.condition}
                    required
                  />

                  <Select
                    label="Ville"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    options={cityOptions}
                    placeholder="Votre ville"
                    error={errors.city}
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                  >
                    Suivant
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 2: Photos */}
            {step === 2 && (
              <Card padding="lg" className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Photos de l'article</h2>
                  <p className="text-sm text-gray-600">
                    Ajoutez entre {IMAGE_LIMITS.MIN} et {IMAGE_LIMITS.MAX} photos. 
                    La première sera la photo principale.
                  </p>
                </div>

                {/* Zone d'upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-900 mb-2">
                      Cliquez pour ajouter des photos
                    </p>
                    <p className="text-sm text-gray-500">
                      JPG, PNG ou WebP • Max 5 MB par image
                    </p>
                  </label>
                </div>

                {errors.images && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.images}
                  </div>
                )}

                {/* Aperçu des images */}
                {formData.images.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      {formData.images.length} photo{formData.images.length > 1 ? 's' : ''} ajoutée{formData.images.length > 1 ? 's' : ''}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((img, index) => (
                        <div key={index} className="relative aspect-square group">
                          <img
                            src={img}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-green-700 text-white text-xs px-2 py-1 rounded">
                              Principale
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                  >
                    Retour
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    onClick={handleNext}
                  >
                    Suivant
                  </Button>
                </div>
              </Card>
            )}

            {/* Step 3: Prix et livraison */}
            {step === 3 && (
              <Card padding="lg" className="space-y-6">
                <h2 className="text-xl font-semibold">Prix et livraison</h2>

                <Input
                  label="Prix"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="15000"
                  error={errors.price}
                  required
                  helperText="Entre 500 et 500 000 FCFA • Commission de 8% à la vente"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Options de livraison <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {Object.keys(DELIVERY_OPTIONS).map((key) => {
                      const option = DELIVERY_OPTIONS[key];
                      return (
                        <label
                          key={option}
                          className="flex items-start p-4 border-2 rounded-lg cursor-pointer hover:border-green-500 transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={formData.deliveryOptions.includes(option)}
                            onChange={() => handleDeliveryOptionToggle(option)}
                            className="mt-1 mr-3"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {DELIVERY_LABELS[option]}
                            </p>
                            <p className="text-sm text-gray-500">
                              {option === DELIVERY_OPTIONS.MEETUP
                                ? 'Rencontrez l\'acheteur en personne'
                                : 'Envoi par transporteur (frais à définir)'}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {errors.deliveryOptions && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.deliveryOptions}
                    </p>
                  )}
                </div>

                {/* Récapitulatif */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">Récapitulatif</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Prix de vente</span>
                      <span className="font-medium">
                        {formData.price ? `${parseInt(formData.price).toLocaleString()} FCFA` : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Commission (8%)</span>
                      <span className="font-medium text-gray-900">
                        {formData.price ? `${Math.round(parseInt(formData.price) * 0.08).toLocaleString()} FCFA` : '-'}
                      </span>
                    </div>
                    <div className="border-t border-gray-300 pt-2 flex justify-between">
                      <span className="font-semibold text-gray-900">Vous recevrez</span>
                      <span className="font-bold text-green-700">
                        {formData.price ? `${Math.round(parseInt(formData.price) * 0.92).toLocaleString()} FCFA` : '-'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                  >
                    Retour
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    loading={loading}
                    icon={<Check className="w-5 h-5" />}
                  >
                    Publier l'article
                  </Button>
                </div>
              </Card>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
