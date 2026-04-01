import React, { useEffect, useState } from 'react';
// import { ticketService } from '../services/api.js'; <--- AJOUTE // ICI
import StatBox from '../components/StatBox';

const Admin = () => {
  // On remplace le state vide par un ticket de test pour voir si l'affichage marche
  const [tickets, setTickets] = useState([
    { id: 1, titre: "Panne d'éclairage Médina", categorie: "Électricité", statut: "recu" }
  ]);

  // On commente temporairement la fonction qui utilise l'API
  const fetchTickets = () => {
    // ticketService.getAllTickets().then(res => setTickets(res.data));
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    // await ticketService.updateStatus(id, newStatus);
    // fetchTickets(); 
  };
  
  // ... reste du code ...

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <StatBox label="Total" value={tickets.length} color="text-slate-700" />
  <StatBox label="En attente" value={tickets.filter(t => t.statut === 'recu').length} color="text-amber-600" />
  <StatBox label="Résolus" value={tickets.filter(t => t.statut === 'resolu').length} color="text-green-600" />
</div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold text-slate-700">Titre</th>
              <th className="p-4 font-semibold text-slate-700">Catégorie</th>
              <th className="p-4 font-semibold text-slate-700">Statut</th>
              <th className="p-4 font-semibold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="p-4 font-medium">{t.titre}</td>
                <td className="p-4 text-slate-500 capitalize">{t.categorie}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold 
                    ${t.statut === 'resolu' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {t.statut}
                  </span>
                </td>
                <td className="p-4">
                  <select 
                    className="border border-slate-300 rounded p-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                    value={t.statut}
                  >
                    <option value="recu">Reçu</option>
                    <option value="assigne">Assigné</option>
                    <option value="en_cours">En cours</option>
                    <option value="resolu">Résolu</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;