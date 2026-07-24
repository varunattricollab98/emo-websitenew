import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ScrollText, Mail, Phone, MapPin, ArrowRight, Check } from 'lucide-react'

/**
 * Shared premium layout for legal pages (Privacy, Terms, Refund).
 * `sections` = [{ h, body?: string[], list?: string[] }]
 */
export default function LegalLayout({ eyebrow = 'Legal', title, subtitle, updated, sections = [] }) {
  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 tech-dots opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_40%_40%,#000,transparent)]" />
        <div className="container-custom relative py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-primary-200 bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-soft">
              <ScrollText className="h-4 w-4" />
              {eyebrow}
            </span>
            <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-navy-dark sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            {subtitle && <p className="mt-4 max-w-2xl text-lg text-slate-600">{subtitle}</p>}
            {updated && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-slate-500 shadow-soft backdrop-blur">
                Last updated: {updated}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* content */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          {sections.map((sec, i) => (
            <motion.div
              key={sec.h}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.4, delay: (i % 3) * 0.04 }}
              className="mb-9 scroll-mt-24"
            >
              <h2 className="flex items-start gap-3 text-xl font-bold text-navy-dark">
                <span className="mt-1 inline-flex h-6 w-1.5 flex-none rounded-full bg-gradient-to-b from-gold to-gold-dark" />
                {sec.h}
              </h2>
              <div className="mt-3 space-y-3 pl-[1.125rem]">
                {sec.body?.map((p, j) => (
                  <p key={j} className="leading-relaxed text-slate-600">
                    {p}
                  </p>
                ))}
                {sec.list && (
                  <ul className="space-y-2.5">
                    {sec.list.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-slate-600">
                        <span className="mt-1 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-accent-green/10 text-accent-emerald">
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}

          {/* contact card */}
          <div className="mt-12 overflow-hidden rounded-2xl border border-primary-100 bg-surface-light p-7 shadow-soft">
            <h3 className="text-lg font-bold text-navy-dark">Questions? Get in touch</h3>
            <p className="mt-1.5 text-sm text-slate-500">
              EaseMyOffice is operated by Narula Technologies LLP.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a
                href="mailto:contact@easemyoffice.in"
                className="flex items-center gap-3 rounded-xl border border-primary-100 bg-white px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-card"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-gradient text-white">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-navy-dark">contact@easemyoffice.in</span>
              </a>
              <a
                href="tel:8882735038"
                className="flex items-center gap-3 rounded-xl border border-primary-100 bg-white px-4 py-3 transition-all hover:-translate-y-0.5 hover:shadow-card"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary-gradient text-white">
                  <Phone className="h-4 w-4" />
                </span>
                <span className="text-sm font-semibold text-navy-dark">888-273-5038</span>
              </a>
            </div>
            <p className="mt-4 flex items-start gap-2.5 text-sm text-slate-500">
              <MapPin className="mt-0.5 h-4 w-4 flex-none text-primary" />
              336, Udyog Vihar Phase 4, Sector 19, Gurugram, Haryana 122016
            </p>
            <Link
              to="/contact"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-700"
            >
              Contact our team
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
