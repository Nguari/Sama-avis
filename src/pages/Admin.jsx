import React, { useEffect, useState } from 'react';
import StatBox from '../components/StatBox';

const Admin = () => {
  const [tickets] = useState([
    { id: 1, titre: "Éclairage Plateau", categorie: "Électricité", statut: "En cours", date: "04/04/2026" }
  ]);

  return (
    <div className="max-w-6xl mx-auto p-10 space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Panel de Gestion</h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Dakar Municipalité</p>
        </div>
        <div className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm shadow-sm italic">
          Session Admin : Ahmad
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatBox label="Signalements" value="156" color="bg-slate-900 text-white" />
        <StatBox label="Actifs" value="42" color="bg-blue-600 text-white" />
        <StatBox label="Rétablis" value="114" color="bg-emerald-500 text-white" />
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-black text-slate-800">Dernières interventions</h3>
          <button className="text-xs font-black text-blue-600 uppercase tracking-widest">Tout voir</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <th className="p-8">Incident</th>
                <th className="p-8">Secteur</th>
                <th className="p-8">État</th>
                <th className="p-8">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {tickets.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-8">
                    <p className="font-bold text-slate-900">{t.titre}</p>
                    <p className="text-xs text-slate-400 font-medium">{t.date}</p>
                  </td>
                  <td className="p-8"><span className="px-4 py-2 bg-slate-100 rounded-full text-xs font-bold text-slate-600 uppercase">{t.categorie}</span></td>
                  <td className="p-8"><span className="flex items-center gap-2 font-black text-xs text-amber-600">● {t.statut}</span></td>
                  <td className="p-8">
                    <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">⚙️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;