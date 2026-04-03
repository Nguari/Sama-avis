const StatBox = ({ label, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
      <span className="text-slate-500 text-sm font-medium mb-1">{label}</span>
      <span className={`text-3xl font-bold ${color}`}>{value}</span>
    </div>
  );
};

export default StatBox;