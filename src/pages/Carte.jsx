import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';

// Correction pour l'icône par défaut qui disparait parfois avec Webpack/Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// Couleur du badge selon le statut
const couleurStatut = (statut) => {
  switch (statut) {
    case 'recu':     return 'bg-yellow-100 text-yellow-700';
    case 'assigne':  return 'bg-blue-100 text-blue-700';
    case 'en_cours': return 'bg-orange-100 text-orange-700';
    case 'resolu':   return 'bg-green-100 text-green-700';
    default:         return 'bg-slate-100 text-slate-700';
  }
};

const Carte = () => {
  const [tickets, setTickets]       = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur]         = useState('');

  // Coordonnées de Dakar
  const positionDakar = [14.7167, -17.4677];

  useEffect(() => {
    api.get('/tickets')
      .then(res => {
        // Filtre les tickets sans coordonnées GPS
        const avecCoords = res.data.filter(t => t.latitude && t.longitude);
        setTickets(avecCoords);
      })
      .catch(() => setErreur('Impossible de charger les signalements'))
      .finally(() => setChargement(false));
  }, []);

  return (
    <div className="h-[calc(100vh-80px)] min-h-[600px] w-full relative">

      {/* Bandeau titre */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 text-center">
          <h2 className="font-black text-slate-900">Carte des Signalements</h2>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Dakar, Sénégal</p>
          {chargement && <p className="text-xs text-blue-500 mt-1">Chargement des signalements...</p>}
          {erreur    && <p className="text-xs text-red-500 mt-1">{erreur}</p>}
          {!chargement && !erreur && (
            <p className="text-xs text-green-600 font-bold mt-1">{tickets.length} signalement(s) affiché(s)</p>
          )}
        </div>
      </div>

      {/* Carte */}
      <MapContainer
        center={positionDakar}
        zoom={13}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Marqueurs des vrais tickets */}
        {tickets.map(ticket => (
          <Marker key={ticket.id} position={[ticket.latitude, ticket.longitude]}>
            <Popup className="rounded-xl overflow-hidden">
              <div className="p-2 min-w-[180px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${couleurStatut(ticket.statut)}`}>
                    {ticket.statut.replace('_', ' ')}
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {ticket.categorie}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mt-1">{ticket.titre}</h3>
                {ticket.description && (
                  <p className="text-xs text-slate-500 mt-1">{ticket.description}</p>
                )}
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(ticket.date_creation).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Carte;