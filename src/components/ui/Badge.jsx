const styles = {
  gold: 'bg-gradient-to-r from-gold to-gold-dark text-white shadow-gold-glow',
  green: 'bg-accent-green/10 text-accent-emerald border border-accent-green/30',
  blue: 'bg-primary-50 text-primary-700 border border-primary-200',
  navy: 'bg-navy/5 text-navy border border-navy/15',
  white: 'bg-white/15 text-white border border-white/25 backdrop-blur',
}

export default function Badge({ children, variant = 'blue', className = '', icon: Icon }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide ${
        styles[variant] || styles.blue
      } ${className}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  )
}
