const TicketCard = ({ ticket }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-3">
      <h3 className="font-bold text-slate-800">{ticket.titre}</h3>
      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
        ticket.statut === 'resolu' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
      }`}>
        {ticket.statut}
      </span>
    </div>
    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{ticket.description}</p>
    <div className="flex justify-between items-center text-xs text-slate-400">
      <span className="bg-slate-100 px-2 py-1 rounded">{ticket.categorie}</span>
      <span>{new Date(ticket.date_creation).toLocaleDateString()}</span>
    </div>
  </div>
);

export default TicketCard;