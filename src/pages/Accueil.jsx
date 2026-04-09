// FRONTEND — Accueil.jsx : Page d'accueil avec stats, piliers, témoignages et CTA.
// Accueil.jsx — Page d'accueil de Sama Avis
import { Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import FormTemoignage from '../components/FormTemoignage';

const Accueil = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr && userStr !== 'undefined' && userStr !== 'null' ? JSON.parse(userStr) : null;

  const [stats, setStats]           = useState({ total: 0, resolus: 0, categories: 0, taux: 0 });
  const [temoignages, setTemoignages] = useState([]);

  // Charger les statistiques depuis l'API
  const fetchStats = useCallback(() => {
    api.get('/tickets').then(res => {
      const tickets    = Array.isArray(res.data) ? res.data : [];
      const resolus    = tickets.filter(t => t.statut === 'resolu').length;
      const categories = new Set(tickets.map(t => t.categorie)).size;
      const taux       = tickets.length > 0 ? Math.round((resolus / tickets.length) * 100) : 0;
      setStats({ total: tickets.length, resolus, categories, taux });
    }).catch(() => {});
  }, []);

  // Charger les témoignages approuvés
  const fetchTemoignages = useCallback(() => {
    api.get('/temoignages').then(res => {
      setTemoignages(Array.isArray(res.data) ? res.data : []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    fetchStats();
    fetchTemoignages();
    // Rafraîchissement automatique toutes les 30 secondes
    const interval = setInterval(fetchStats, 30000);
    const onVisible = () => { if (document.visibilityState === 'visible') fetchStats(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', onVisible); };
  }, [fetchStats, fetchTemoignages]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50">
      {/* Fond décoratif */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-slate-50 rounded-full blur-[100px]"></div>
      </div>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6 animate-fadeInDown" style={{ animationDelay: '0.1s' }}>
            <span className="typewriter inline-block text-2xl md:text-5xl font-black text-blue-600 tracking-widest uppercase">
              Bienvenue sur Sama-Avis
            </span>
          </div>
          <div className="mb-8 animate-fadeInDown" style={{ animationDelay: '0.3s' }}>
            <span className="typewriter inline-block text-2xl md:text-4xl font-black text-slate-800 tracking-widest uppercase">
              Dalal Ak Diam 🇸🇳
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-blue-50 border border-blue-100 rounded-full animate-bounce-slow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] text-blue-700 uppercase">Plateforme Officielle — Dakar</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-4 leading-[0.9] tracking-tighter animate-slideInLeft">
            Votre voix, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">notre action.</span>
          </h1>

          <p className="text-lg font-black text-blue-600 uppercase tracking-[0.2em] mb-6">
            Le citoyen, acteur de la performance publique.
          </p>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
            SamaAvis permet à chaque citoyen de Dakar de signaler un incident en 30 secondes. Simple. Rapide. Efficace.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-scaleIn" style={{ animationDelay: '0.5s' }}>
            {user && user.role !== 'admin' && (
              <Link to="/signaler" className="group relative px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-200">
                <span className="relative z-10">Faire un signalement</span>
                <div className="absolute inset-0 bg-blue-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            )}
            {!user && (
              <>
                <Link to="/register" className="group relative px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-200">
                  <span className="relative z-10">Rejoindre l'aventure</span>
                  <div className="absolute inset-0 bg-blue-600 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300"></div>
                </Link>
                <Link to="/login" className="text-slate-900 font-black text-sm border-b-2 border-slate-900 pb-1 hover:text-blue-600 hover:border-blue-600 transition-all">
                  Déjà Membre ? Se connecter
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── STATS EN TEMPS RÉEL ── */}
      <section className="px-6 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900 rounded-[3rem] p-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-2xl">
            {[
              { value: stats.total,      label: 'Signalements soumis',  color: 'text-white',       suffix: '' },
              { value: stats.resolus,    label: 'Problèmes résolus',    color: 'text-emerald-400', suffix: '' },
              { value: stats.categories, label: 'Catégories actives',   color: 'text-blue-400',    suffix: '' },
              { value: stats.taux,       label: 'Taux de résolution',   color: 'text-amber-400',   suffix: '%' },
            ].map(({ value, label, color, suffix }, i) => (
              <div key={i} className={i > 0 ? 'border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6' : ''}>
                <p className={`text-4xl md:text-5xl font-black ${color}`}>{value}{suffix}</p>
                <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black mt-2">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ── */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Simple & Rapide</span>
            <h2 className="text-4xl font-black text-slate-900 mt-3 tracking-tight">Comment ça marche ?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', icon: '📝', title: 'Inscrivez-vous',  desc: "Créez votre compte citoyen en moins d'une minute." },
              { step: '02', icon: '📍', title: 'Signalez',        desc: 'Décrivez le problème et géolocalisez-le précisément.' },
              { step: '03', icon: '📸', title: 'Prouvez',         desc: 'Ajoutez des photos ou vidéos pour appuyer votre signalement.' },
              { step: '04', icon: '✅', title: 'Suivez',          desc: "Suivez l'évolution de votre dossier en temps réel." },
            ].map(({ step, icon, title, desc }) => (
              <div key={step} className="relative bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <span className="absolute top-6 right-6 text-[10px] font-black text-slate-200 tracking-widest">{step}</span>
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-black text-slate-900 text-lg mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LES 2 PILIERS ── */}
      <section className="px-6 pb-24 bg-slate-900">
        <div className="max-w-6xl mx-auto py-20">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Architecture de la solution</span>
            <h2 className="text-4xl font-black text-white mt-3 tracking-tight">Les 2 Piliers de Sama Avis</h2>
            <p className="text-slate-400 mt-3 font-medium max-w-2xl mx-auto">Une solution complète pensée pour les citoyens, les collectivités et l'avenir.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: '📱', color: 'from-blue-600 to-blue-500', label: 'Pilier A',
                title: 'Interface Citoyen', subtitle: 'Accessibilité maximale',
                points: ['3 clics pour signaler un incident', 'Capture GPS automatique', 'Suivi en temps réel : Reçu → Assigné → Résolu', 'Notifications à chaque étape', 'Support USSD/SMS sans internet'],
              },
              {
                icon: '🏛️', color: 'from-slate-700 to-slate-600', label: 'Pilier B',
                title: 'Dashboard Administratif', subtitle: 'Pilotage par la donnée',
                points: ['Heatmap des zones critiques', 'Assignation aux équipes de terrain', "Mesure des délais d'exécution", 'Rapports automatisés', 'Envoi direct aux mairies concernées'],
              },
            ].map(({ icon, color, label, title, subtitle, points }) => (
              <div key={title} className="bg-slate-800 rounded-[2rem] p-8 border border-slate-700 hover:border-blue-500 transition-all duration-300 group">
                <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>{icon}</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">{label}</span>
                <h3 className="text-xl font-black text-white mt-2 mb-1">{title}</h3>
                <p className="text-slate-400 text-xs font-bold mb-5 uppercase tracking-wider">{subtitle}</p>
                <ul className="space-y-2">
                  {points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                      <span className="text-blue-400 mt-0.5 shrink-0">→</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INCLUSIVITÉ USSD ── */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Inclusivité numérique</span>
              <h2 className="text-4xl font-black text-slate-900 mt-3 mb-5 tracking-tight">Personne ne sera laissé de côté</h2>
              <p className="text-slate-500 leading-relaxed mb-6">
                Sama Avis est accessible à <strong>tous les citoyens</strong>, même sans smartphone ni connexion internet.
              </p>
              <div className="space-y-3">
                {[
                  { icon: '📱', text: 'Application mobile (iOS & Android)' },
                  { icon: '💻', text: 'Interface web responsive' },
                  { icon: '📟', text: 'Menu USSD sans internet' },
                  { icon: '✉️', text: 'Signalement par SMS' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <span className="text-xl">{icon}</span>
                    <span className="font-bold text-slate-700 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-slate-900 rounded-[2rem] p-8 font-mono text-sm">
              <p className="text-slate-400 text-xs mb-4 uppercase tracking-widest font-sans font-black">Exemple USSD</p>
              <div className="space-y-3">
                <div className="bg-slate-800 rounded-xl p-4"><p className="text-green-400">📟 Composez : *338#</p></div>
                <div className="bg-slate-800 rounded-xl p-4 space-y-1">
                  <p className="text-white font-bold">Sama Avis — Signalement</p>
                  <p className="text-slate-300">1. Voirie / Routes</p>
                  <p className="text-slate-300">2. Éclairage Public</p>
                  <p className="text-slate-300">3. Eau & Assainissement</p>
                  <p className="text-slate-300">4. Propreté</p>
                  <p className="text-blue-400">→ Tapez votre choix</p>
                </div>
                <div className="bg-emerald-900/50 border border-emerald-700 rounded-xl p-4">
                  <p className="text-emerald-400">✅ Signalement #A4F2 enregistré !</p>
                  <p className="text-slate-400 text-xs mt-1">Vous recevrez un SMS de suivi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── IMPACTS ATTENDUS ── */}
      <section className="px-6 pb-24 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-5xl mx-auto py-20">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200">Objectifs & Résultats</span>
            <h2 className="text-4xl font-black text-white mt-3 tracking-tight">Impacts Attendus</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🔍', titre: 'Transparence', desc: 'Restaurer la confiance des populations en montrant que chaque voix compte et reçoit une réponse concrète.', stat: '100%', statLabel: 'des signalements traçables' },
              { icon: '⚡', titre: 'Réactivité',   desc: "Réduire le temps moyen de réparation des infrastructures publiques grâce à une assignation automatique.", stat: '-40%', statLabel: "délai d'intervention" },
              { icon: '💰', titre: 'Optimisation', desc: 'Allouer les ressources publiques là où les besoins sont les plus urgents, sur la base de données cartographiées.', stat: '+30%', statLabel: 'efficacité budgétaire' },
            ].map(({ icon, titre, desc, stat, statLabel }) => (
              <div key={titre} className="bg-white/10 backdrop-blur-sm rounded-[2rem] p-8 border border-white/20 text-white hover:bg-white/20 transition-all">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-black mb-3">{titre}</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-6">{desc}</p>
                <div className="border-t border-white/20 pt-4">
                  <p className="text-3xl font-black">{stat}</p>
                  <p className="text-blue-200 text-xs uppercase tracking-widest font-bold mt-1">{statLabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOUVERNANCE PAR LA PREUVE ── */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-slate-900 rounded-[3rem] p-12 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 text-9xl font-black rotate-12 select-none">PROOF</div>
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Notre philosophie</span>
              <h2 className="text-4xl font-black text-white mt-3 mb-6 tracking-tight">La Gouvernance par la Preuve 🏆</h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-8 max-w-3xl">
                Contrairement aux boîtes à idées classiques, Sama Avis crée un <strong className="text-white">cercle vertueux</strong>. Ce n'est pas seulement une application — c'est un <strong className="text-blue-400">contrat de performance entre l'État et le peuple</strong>.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: '1', icon: '📢', title: 'Le citoyen signale', desc: 'Un problème réel, géolocalisé, avec preuve photo.' },
                  { step: '2', icon: '⚙️', title: "L'État agit",        desc: 'Les équipes sont assignées, les délais mesurés.' },
                  { step: '3', icon: '✅', title: 'La preuve est faite', desc: 'Le citoyen voit le résultat. La confiance se construit.' },
                ].map(({ step, icon, title, desc }) => (
                  <div key={step} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white font-black text-xs">{step}</span>
                      <span className="text-2xl">{icon}</span>
                    </div>
                    <h4 className="font-black text-white mb-2">{title}</h4>
                    <p className="text-slate-400 text-sm">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard icon="✨" title="Design Épuré"   desc="Une interface pensée pour la rapidité, même en plein mouvement dans les rues de Dakar." />
          <FeatureCard icon="🎯" title="Précision GPS"  desc="Géolocalisez vos signalements avec une précision chirurgicale pour les équipes d'intervention." />
          <FeatureCard icon="🤝" title="Impact Réel"    desc="Suivez l'évolution de vos demandes et voyez votre quartier s'améliorer jour après jour." />
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">Ils témoignent</span>
            <h2 className="text-4xl font-black text-slate-900 mt-3 tracking-tight">Ce que disent nos citoyens</h2>
          </div>

          {/* Vrais témoignages ou exemples */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {temoignages.length > 0
              ? temoignages.slice(0, 6).map(tm => (
                <div key={tm.id} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-xl flex items-center justify-center font-black">
                      {tm.auteur?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-yellow-400 text-sm">{'★'.repeat(tm.note)}{'☆'.repeat(5 - tm.note)}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic mb-5">"{tm.contenu}"</p>
                  <p className="font-black text-slate-900 text-sm">{tm.auteur}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">
                    {new Date(tm.date_creation).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))
              : [
                { nom: 'Fatou D.',     quartier: 'Médina',              texte: "J'ai signalé une fuite d'eau et elle a été réparée en 3 jours. Incroyable !", emoji: '🌊' },
                { nom: 'Moussa K.',    quartier: 'Parcelles Assainies', texte: 'Grâce à Sama Avis, notre rue est enfin éclairée la nuit. Merci !',           emoji: '💡' },
                { nom: 'Aïssatou B.', quartier: 'Keur Massar',         texte: 'Simple à utiliser, même pour ma mère. Le suivi en temps réel est top.',       emoji: '📱' },
              ].map(({ nom, quartier, texte, emoji }) => (
                <div key={nom} className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{emoji}</span>
                    <span className="text-yellow-400 text-sm">★★★★★</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed italic mb-6">"{texte}"</p>
                  <p className="font-black text-slate-900">{nom}</p>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">{quartier}</p>
                </div>
              ))
            }
          </div>

          {/* Formulaire pour les citoyens connectés */}
          {user && user.role !== 'admin' && <FormTemoignage onSuccess={fetchTemoignages} />}
          {!user && (
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
              <p className="text-blue-700 font-bold text-sm">
                <Link to="/login" className="underline underline-offset-4 hover:text-blue-900">Connectez-vous</Link> pour partager votre expérience avec Sama Avis.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      {!user && (
        <section className="px-6 pb-32">
          <div className="max-w-4xl mx-auto bg-slate-900 rounded-[3rem] p-14 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent rounded-[3rem]"></div>
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Rejoignez le mouvement</span>
              <h2 className="text-4xl font-black text-white mb-4 mt-3 tracking-tight">Prêt à agir pour Dakar ?</h2>
              <p className="text-slate-300 mb-8 font-medium max-w-xl mx-auto">Rejoignez des milliers de citoyens qui améliorent leur quartier.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register" className="inline-block px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-lg hover:bg-blue-500 hover:scale-105 transition-all shadow-xl shadow-blue-600/30">
                  Créer mon compte gratuitement
                </Link>
                <Link to="/login" className="inline-block px-10 py-5 bg-white/10 text-white rounded-2xl font-black text-lg hover:bg-white/20 transition-all border border-white/20">
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="group p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 hover:-translate-y-2">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:bg-blue-600 group-hover:rotate-12 transition-all duration-500">{icon}</div>
    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default Accueil;
