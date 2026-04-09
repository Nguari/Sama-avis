// FRONTEND — ScrollToTop.jsx : Bouton flottant pour remonter en haut de la page.
import { useState, useEffect } from 'react';

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Écouter le scroll et afficher/cacher le bouton
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Nettoyer l'écouteur quand le composant est démonté
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Ne rien afficher si on est en haut de la page
  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-lg shadow-blue-600/30 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
      title="Remonter en haut"
    >
      ↑
    </button>
  );
};

export default ScrollToTop;
