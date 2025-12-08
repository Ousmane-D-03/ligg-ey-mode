// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  getUserByEmail,
  createUser,
  updateUser
} from '../utils/storage';
import { validateLoginForm, validateSignupForm } from '../utils/validators';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error('Error loading user:', err);
      setError('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Inscription d'un nouvel utilisateur
   */
  const signup = async (formData) => {
    try {
      setError(null);
      setLoading(true);

      // Validation
      const validation = validateSignupForm(formData);
      if (!validation.valid) {
        setError(validation.errors);
        return { success: false, errors: validation.errors };
      }

      // Vérifier si l'email existe déjà
      const existingUser = await getUserByEmail(formData.email);
      if (existingUser) {
        const error = { email: 'Cet email est déjà utilisé' };
        setError(error);
        return { success: false, errors: error };
      }

      // Créer l'utilisateur (sans stocker le mot de passe en clair en production!)
      const newUser = await createUser({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        accountType: formData.accountType || 'individual',
        bio: formData.bio || '',
        profilePicture: null,
        // NOTE: En production, hasher le mot de passe avec bcrypt!
        passwordHash: formData.password // TEMPORAIRE - À changer!
      });

      // Connecter automatiquement
      await setCurrentUser(newUser);
      setUser(newUser);

      return { success: true, user: newUser };
    } catch (err) {
      console.error('Signup error:', err);
      const error = { general: 'Erreur lors de l\'inscription' };
      setError(error);
      return { success: false, errors: error };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Connexion d'un utilisateur
   */
  const login = async (formData) => {
    try {
      setError(null);
      setLoading(true);

      // Validation
      const validation = validateLoginForm(formData);
      if (!validation.valid) {
        setError(validation.errors);
        return { success: false, errors: validation.errors };
      }

      // Trouver l'utilisateur
      const existingUser = await getUserByEmail(formData.email);
      if (!existingUser) {
        const error = { email: 'Email ou mot de passe incorrect' };
        setError(error);
        return { success: false, errors: error };
      }

      // Vérifier le mot de passe
      // NOTE: En production, utiliser bcrypt.compare!
      if (existingUser.passwordHash !== formData.password) {
        const error = { password: 'Email ou mot de passe incorrect' };
        setError(error);
        return { success: false, errors: error };
      }

      // Connecter l'utilisateur
      await setCurrentUser(existingUser);
      setUser(existingUser);

      return { success: true, user: existingUser };
    } catch (err) {
      console.error('Login error:', err);
      const error = { general: 'Erreur lors de la connexion' };
      setError(error);
      return { success: false, errors: error };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Déconnexion
   */
  const logout = async () => {
    try {
      await clearCurrentUser();
      setUser(null);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      return { success: false };
    }
  };

  /**
   * Mise à jour du profil
   */
  const updateProfile = async (updates) => {
    try {
      if (!user) {
        return { success: false, error: 'Non connecté' };
      }

      setLoading(true);
      const updatedUser = await updateUser(user.id, updates);
      
      if (updatedUser) {
        await setCurrentUser(updatedUser);
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      }

      return { success: false, error: 'Erreur lors de la mise à jour' };
    } catch (err) {
      console.error('Update profile error:', err);
      return { success: false, error: 'Erreur lors de la mise à jour' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Vérifier si l'utilisateur est connecté
   */
  const isAuthenticated = () => {
    return !!user;
  };

  /**
   * Vérifier si l'utilisateur est le propriétaire
   */
  const isOwner = (userId) => {
    return user && user.id === userId;
  };

  const value = {
    user,
    loading,
    error,
    signup,
    login,
    logout,
    updateProfile,
    isAuthenticated,
    isOwner,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
