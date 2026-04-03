import React, { useState } from 'react';

const Signalement = () => {
  const [formData, setFormData] = useState({
    titre: '',
    categorie: 'voirie',
    description: '',
    priorite: 'normale'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Signalement envoyé ! (Simulation)");
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {/* Header du formulaire */}
          <div className="bg-blue-600 p-8 text-white">
            <h2 className="text-3xl font-black mb-2">Nouveau Signalement</h2>
            <p className="text-blue-100 opacity-90">Aidez-nous à identifier les zones à améliorer à Dakar.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Titre du problème */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Quel est le problème ?</label>
              <input 
                type="text"
                placeholder="Ex: Lampadaire cassé, Nid de poule..."
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 transition-all outline-none text-slate-900"
                onChange={(e) => setFormData({...formData, titre: e.target.value})}
                required
              />
            </div>

            {/* Catégorie et Priorité */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Catégorie</label>
                <select 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none appearance-none"
                  onChange={(e) => setFormData({...formData, categorie: e.target.value})}
                >
                  <option value="voirie">🛣️ Voirie / Routes</option>
                  <option value="eclairage">💡 Éclairage Public</option>
                  <option value="proprete">♻️ Propreté / Ordures</option>
                  <option value="autre">⚙️ Autre</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Urgence</label>
                <select 
                  className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none appearance-none"
                  onChange={(e) => setFormData({...formData, priorite: e.target.value})}
                >
                  <option value="basse">Faible</option>
                  <option value="normale">Normale</option>
                  <option value="haute">Critique 🚨</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Précisions supplémentaires</label>
              <textarea 
                rows="4"
                placeholder="Décrivez la situation en quelques mots..."
                className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            {/* Bouton de validation */}
            <button 
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-slate-200"
            >
              Envoyer le signalement
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Signalement;