import { motion } from 'framer-motion'
import { Phone, ArrowRight } from 'lucide-react'
import Button from './Button'

export default function CTABand({
  title = 'Ready to Set Up Your Business Address?',
  subtitle = 'Join 5,000+ businesses that trust EaseMyOffice. Get started in minutes with a dedicated compliance manager by your side.',
  primaryLabel = 'Get Started',
  primaryTo = '/contact',
}) {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-navy-gradient px-6 py-14 text-center shadow-card-hover sm:px-12 lg:py-20"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-primary-800/40 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white text-balance">{title}</h2>
            <p className="mt-4 text-lg text-primary-100">{subtitle}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button to={primaryTo} variant="white" size="lg">
                {primaryLabel}
                <ArrowRight className="h-5 w-5" />
              </Button>
              <a
                href="tel:8882735038"
                className="btn-base border-2 border-white/40 px-8 py-4 text-base text-white hover:bg-white/10"
              >
                <Phone className="h-5 w-5" />
                888-273-5038
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
