import { Link } from 'react-router-dom'
import { useLeadModal } from '../../context/LeadModalContext'

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
  onClick,
  ...props
}) {
  const { openLeadModal } = useLeadModal()
  const classes = `${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`

  // Intercept /contact links → open lead popup instead of navigating
  if (to === '/contact' && !onClick) {
    return (
      <button
        className={classes}
        onClick={() =>
          openLeadModal({
            title: 'Get a Free Consultation',
            subtitle: 'Share your details and our team will call you back within one business day.',
          })
        }
        {...props}
      >
        {children}
      </button>
    )
  }

  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...props}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} onClick={onClick} {...props}>
        {children}
      </a>
    )
  }
  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  )
}
