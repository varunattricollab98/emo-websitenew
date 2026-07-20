import { Link } from 'react-router-dom'

const variants = {
  primary:
    'btn-base bg-primary-gradient text-white shadow-card hover:shadow-glow hover:brightness-110',
  navy: 'btn-base bg-navy text-white shadow-card hover:bg-navy-dark',
  outline:
    'btn-base border-2 border-primary text-primary bg-white hover:bg-primary-50',
  ghost: 'btn-base text-primary hover:bg-primary-50',
  gold: 'btn-base bg-gradient-to-r from-gold to-gold-dark text-white shadow-card hover:shadow-gold-glow',
  white: 'btn-base bg-white text-primary-800 shadow-card hover:bg-primary-50',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm sm:text-base',
  lg: 'px-8 py-4 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  className = '',
  ...props
}) {
  const classes = `${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
