import { Link } from 'react-router-dom';

const Accueil = () => {
  return (
    <div className="max-w-4xl mx-auto text-center py-16 px-4">
      {/* Section Titre */}
      <div className="mb-12">
        <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
          Sama <span className="text-blue-600">Avis</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Améliorons Dakar ensemble. Signalez les problèmes de voirie, d'éclairage ou de propreté directement aux services municipaux.
        </p>
      </div>

      {/* Bouton d'action principal */}
      <div className="flex justify-center gap-4">
        <Link 
          to="/signaler" 
          className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-105"
        >
          Signaler un problème
        </Link>
      </div>

      {/* Petites icônes d'info (Optionnel pour le look) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-sm font-medium text-slate-500">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 text-xl">📸</div>
          <p>Prenez une photo</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 text-xl">📍</div>
          <p>Localisez le lieu</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 text-xl">🚀</div>
          <p>Suivez la résolution</p>
        </div>
      </div>
    </div>
  );
};

export default Accueil;