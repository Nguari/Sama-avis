import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAdmin = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    confirmPassword: ''
  });
  
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Vérifier que l'utilisateur est admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <div className="text-center">
          <p className="text-2xl font-black text-red-600">Accès refusé</p>
          <p className="text-slate-500 mt-2">Seuls les administrateurs peuvent créer des administrateurs.</p>
        </div>
      </div>
    );
  }

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!formData.nom || !formData.prenom || !formData.email || !formData.mot_de_passe) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (formData.mot_de_passe.length < 6) {
      setMessage('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }

    if (formData.mot_de_passe !== formData.confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/auth/inscription-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          mot_de_passe: formData.mot_de_passe,
          adminSecret: 'sama_avis_admin_secret_2024'
        })
      });

      const data = await response.json();
      if (response.ok) {
        setMessage('✓ Administrateur ajouté avec succès !');
        setFormData({ nom: '', prenom: '', email: '', mot_de_passe: '', confirmPassword: '' });
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else {
        setMessage(data.message || 'Erreur lors de l\'ajout.');
      }
    } catch (err) {
      setMessage('Erreur lors de l\'ajout de l\'administrateur.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="rounded-[3rem] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-12 mb-8 shadow-2xl shadow-slate-900/20">
          <button
            onClick={() => navigate('/admin')}
            className="mb-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full transition-colors"
          >
            ← Retour au tableau de bord
          </button>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.35em] text-slate-200">
              Gestion des Administrateurs
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              Ajouter un Administrateur
            </h1>
            <p className="text-slate-300 text-lg max-w-lg">
              Ajoutez un nouveau compte administrateur à votre équipe pour gérer collaborativement les signalements.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white rounded-[3rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden">
          <div className="p-12 md:p-16 space-y-8">
            {message && (
              <div className={`p-5 rounded-2xl text-sm font-bold text-center uppercase tracking-wider ${
                message.includes('✓') 
                  ? 'bg-green-50 text-green-600' 
                  : 'bg-red-50 text-red-600'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleCreateAdmin} className="space-y-8">
              {/* Nom et Prenom */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">
                  Nom
                </label>
                <input
                  type="text"
                  placeholder="Ex: Dupont"
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value})}
                  className="w-full px-7 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-bold border border-transparent"
                  required
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">
                  Prenom
                </label>
                <input
                  type="text"
                  placeholder="Ex: Jean"
                  value={formData.prenom}
                  onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                  className="w-full px-7 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-bold border border-transparent"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">
                  Adresse Email
                </label>
                <input
                  type="email"
                  placeholder="Ex: admin2@sama-avis.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-7 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-bold border border-transparent"
                  required
                />
              </div>

              {/* Mot de passe */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">
                    Mot de Passe
                  </label>
                  <input
                    type="password"
                    placeholder="Minimum 6 caractères"
                    value={formData.mot_de_passe}
                    onChange={(e) => setFormData({...formData, mot_de_passe: e.target.value})}
                    className="w-full px-7 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-bold border border-transparent"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[11px] font-black text-blue-600 uppercase tracking-widest ml-1">
                    Confirmer le Mot de Passe
                  </label>
                  <input
                    type="password"
                    placeholder="Confirmez le mot de passe"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full px-7 py-5 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all font-bold border border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Note importante */}
              <div className="rounded-2xl bg-blue-50 border border-blue-100 p-5">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">📌 Important</p>
                <p className="text-sm text-blue-700 mt-2">
                  Le nouvel administrateur aura accès complet au tableau de bord. Assurez-vous de partager les identifiants de manière sécurisée.
                </p>
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-5 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {loading ? '⏳ Ajout en cours...' : '✓ Ajouter l\'Administrateur'}
              </button>
            </form>

            {/* Information supplémentaire */}
            <div className="border-t border-slate-100 pt-8 flex items-start gap-4">
              <span className="text-2xl">ℹ️</span>
              <div>
                <p className="text-xs uppercase tracking-widest font-bold text-slate-600 mb-2">Accès administrateur</p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Une fois créé, le nouvel administrateur pourra se connecter avec son email et mot de passe. Il aura accès à tous les signalements et à la possibilité de créer d'autres administrateurs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAdmin;
