import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ticketService } from '../services/api';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const Carte = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const positionDakar = [14.7167, -17.4677];

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // ticketService.getAllTickets() retourne déjà response.data directement
        const data = await ticketService.getAllTickets();
        setTickets(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Erreur lors du chargement des signalements');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'recu':     return 'bg-yellow-100 text-yellow-700';
      case 'assigne':  return 'bg-blue-100 text-blue-700';
      case 'en_cours': return 'bg-orange-100 text-orange-700';
      case 'resolu':   return 'bg-green-100 text-green-700';
      default:         return 'bg-slate-100 text-slate-700';
    }
  };

  const getCategoryEmoji = (categorie) => {
    switch (categorie) {
      case 'voirie':    return '🛣️';
      case 'eclairage': return '💡';
      case 'proprete':  return '🗑️';
      case 'eau':       return '🚰';
      case 'sante':     return '❤️';
      default:          return '📍';
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] min-h-[600px] w-full relative">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 text-center">
          <h2 className="font-black text-slate-900">Carte des Signalements</h2>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Dakar, Sénégal</p>
          {loading && <p className="text-xs text-blue-600 mt-2">Chargement...</p>}
          {error   && <p className="text-xs text-red-600 mt-2">{error}</p>}
          {!loading && !error && (
            <p className="text-xs text-green-600 mt-2">
              {tickets.length} signalement{tickets.length > 1 ? 's' : ''} affiché{tickets.length > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

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

        {tickets.map((ticket) => {
          if (!ticket.latitude || !ticket.longitude) return null;

          return (
            <Marker key={ticket.id} position={[parseFloat(ticket.latitude), parseFloat(ticket.longitude)]}>
              <Popup className="rounded-xl overflow-hidden">
                <div className="p-3 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getCategoryEmoji(ticket.categorie)}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getStatusColor(ticket.statut)}`}>
                      {ticket.statut?.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{ticket.titre}</h3>
                  <p className="text-xs text-slate-600 mb-2">{ticket.description || 'Aucune description'}</p>
                  <p className="text-xs text-slate-500">
                    Signalé le {new Date(ticket.date_creation).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Carte;