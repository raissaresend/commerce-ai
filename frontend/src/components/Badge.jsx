// - variant: 'success' (verde), 'warning' (laranja), 'danger' (vermelho)

export default function Badge({ text, variant = "default" }) {
  const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";

  const variants = {
    success: "bg-green-100 text-green-800",
    warning: "bg-orange-100 text-orange-800",
    danger: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800",
  };

  return <span className={`${baseClasses} ${variants[variant]}`}>{text}</span>;
}
