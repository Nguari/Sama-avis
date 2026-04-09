// FRONTEND — LangContext.jsx : Contexte de langue FR/Wolof. Fournit useLang() dans toute l'app.
import { createContext, useContext, useState } from 'react';
import translations from './translations';

// Créer le contexte de langue
const LangContext = createContext();

// Provider : enveloppe l'app et rend la langue accessible partout
export const LangProvider = ({ children }) => {
  // Récupérer la langue sauvegardée ou utiliser le français par défaut
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'fr');

  // Basculer entre français et wolof
  const toggleLang = () => {
    const nouvelleLang = lang === 'fr' ? 'wo' : 'fr';
    setLang(nouvelleLang);
    localStorage.setItem('lang', nouvelleLang);
  };

  // Fonction de traduction : retourne le texte dans la langue active
  // Si la clé n'existe pas en wolof, retourne le français par défaut
  const t = (cle) => translations[lang]?.[cle] || translations['fr']?.[cle] || cle;

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte facilement
// Usage : const { lang, toggleLang, t } = useLang();
export const useLang = () => useContext(LangContext);
