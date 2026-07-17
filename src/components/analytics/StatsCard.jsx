export default function StatsCard({ icon, color, label, value, subtitle }) {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    red: 'bg-red-100 text-red-600',
    amber: 'bg-amber-100 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorMap[color] || 'bg-gray-100 text-gray-600'}`}>
          <i className={`fas fa-${icon}`}></i>
        </div>
        <div>
          <p className="text-[10px] text-gray-400 uppercase">{label}</p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
      {subtitle && <p className="text-[10px] text-gray-400 mt-2">{subtitle}</p>}
    </div>
  );
}