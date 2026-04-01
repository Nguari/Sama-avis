import { Link } from 'react-router-dom';

const Accueil = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-600 uppercase bg-blue-50 rounded-full">
            Service Citoyen - Dakar
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1]">
            Rendez votre ville <br />
            <span className="text-blue-600">meilleure ensemble.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
            Signalez les problèmes de voirie, d'éclairage ou de propreté en 2 minutes et suivez leur résolution en temps réel.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signaler" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-105 transition-transform">
              Signaler un problème
            </Link>
            <Link to="/carte" className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-colors">
              Voir la carte
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="📸" 
            title="Photo Rapide" 
            desc="Prenez une photo du problème et envoyez-la instantanément." 
          />
          <FeatureCard 
            icon="📍" 
            title="Géo-localisation" 
            desc="Le lieu exact est détecté automatiquement pour les services municipaux." 
          />
          <FeatureCard 
            icon="🚀" 
            title="Suivi Direct" 
            desc="Recevez une notification dès que le problème est résolu." 
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

export default Accueil;