import { Link } from 'react-router-dom';

const Accueil = () => {
  // On vérifie si l'utilisateur Ahmad est connecté
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50">
      {/* Background Decoratif (Animations de flou en arrière-plan) */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-slate-50 rounded-full blur-[100px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Texte Bienvenue Animé */}
          <div className="mb-6 animate-fadeInDown" style={{ animationDelay: '0.1s' }}>
            <span className="typewriter inline-block text-2xl md:text-5xl font-black text-blue-600 tracking-widest uppercase">
              Bienvenue sur Sama-Avis
            </span>
          </div>

          {/* Texte Dalal Ak Diam Animé */}
          <div className="mb-8 animate-fadeInDown" style={{ animationDelay: '0.3s' }}>
            <span className="typewriter inline-block text-2xl md:text-5xl font-black text-slate-800 tracking-widest uppercase">
              Dalal Ak Diam
            </span>
          </div>

          {/* Badge Animé */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-blue-50 border border-blue-100 rounded-full animate-bounce-slow animate-fadeInDown" style={{ animationDelay: '0.2s' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-blue-700 uppercase">
              Plateforme Officielle - Dakar
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 leading-[0.9] tracking-tighter animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
            Votre voix, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
              notre action.
            </span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            SamaAvis permet à chaque citoyen de Dakar de signaler un incident en 30 secondes. 
            Simple Rapide Efficace
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-scaleIn" style={{ animationDelay: '0.5s' }}>
            {/* BOUTON RAPPORT (SEULEMENT POUR UTILISATEURS CONNECTÉS NON-ADMIN) */}
            {user && user.role !== 'admin' && (
              <Link 
                to="/signaler" 
                className="group relative px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-200"
              >
                <span className="relative z-10">
                  Faire un signalement
                </span>
                <div className="absolute inset-0 bg-blue-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            )}

            {!user && (
              <Link 
                to="/register" 
                className="group relative px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-200"
              >
                <span className="relative z-10">
                  Rejoindre l'aventure
                </span>
                <div className="absolute inset-0 bg-blue-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            )}

            {!user && (
              <Link to="/login" className="text-slate-900 font-black text-sm border-b-2 border-slate-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-all">
                Déjà Membre ? Se connecter
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid avec Hover Effects */}
      <section className="px-6 pb-32">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard 
            icon="✨" 
            title="Design Épuré" 
            desc="Une interface pensée pour la rapidité, même en plein mouvement dans les rues de Dakar." 
            delay="delay-0"
          />
          <FeatureCard 
            icon="🎯" 
            title="Précision GPS" 
            desc="Géolocalisez vos signalements avec une précision chirurgicale pour les équipes d'intervention." 
            delay="delay-150"
          />
          <FeatureCard 
            icon="🤝" 
            title="Impact Réel" 
            desc="Suivez l'évolution de vos demandes et voyez votre quartier s'améliorer jour après jour." 
            delay="delay-300"
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
  <div className={`group p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 hover:-translate-y-2 animate-fadeInUp ${delay}`} style={{ animationDelay: delay ? `${parseInt(delay.replace('delay-', '')) * 50}ms` : '0s' }}>
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:rotate-12 transition-all duration-500 group-hover:text-white">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default Accueil;