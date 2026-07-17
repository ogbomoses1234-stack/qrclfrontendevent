export default function ToggleSwitch({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      {label && <span className="text-xs text-gray-600">{label}</span>}
      <div className="relative inline-block w-10 h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`block w-10 h-5 rounded-full transition-colors ${
            checked ? 'bg-emerald-500' : 'bg-gray-300'
          }`}
        ></div>
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        ></div>
      </div>
    </label>
  );
}