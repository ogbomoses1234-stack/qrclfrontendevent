export default function Button({ children, variant = 'primary', icon, className = '', ...props }) {
  const base = 'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition';
  
  const variants = {
    // Changed from blue-600/700 to orange-600/700
    primary: 'bg-orange-600 text-white hover:bg-orange-700',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-200',
    outline: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-gray-500 hover:text-gray-800',
  };

  return (
    <button className={`${base} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {icon && <i className={`fas fa-${icon}`}></i>}
      {children}
    </button>
  );
}