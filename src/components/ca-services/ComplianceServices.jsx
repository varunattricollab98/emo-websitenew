import { motion } from 'framer-motion'
import { FileCheck2, Landmark, IndianRupee, ShieldCheck, ArrowRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import { useLeadModal } from '../../context/LeadModalContext'

const services = [
  {
    icon: FileCheck2,
    title: 'GST Registration',
    desc: 'End-to-end GST registration with document prep, filing and ARN tracking.',
    price: '1,499',
  },
  {
    icon: Landmark,
    title: 'Company Registration',
    desc: 'Private Limited, LLP or OPC incorporation — DIN, DSC, MOA/AOA and PAN included.',
    price: '6,999',
    popular: true,
  },
  {
    icon: IndianRupee,
    title: 'Income Tax E-Filing',
    desc: 'Accurate ITR filing for individuals and businesses by qualified professionals.',
    price: '999',
  },
  {
    icon: ShieldCheck,
    title: 'Trademark Registration',
    desc: 'Protect your brand with class search, application and objection handling.',
    price: '5,999',
  },
]

export default function ComplianceServices() {
  const { openLeadModal } = useLeadModal()

  const start = (title) =>
    openLeadModal({
      title,
      subtitle: 'Share your details and our compliance expert will call you back.',
      service: title,
    })

  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          eyebrow="CA Services"
          title="Complete compliance, one partner"
          accent="one partner"
          subtitle="Trusted by thousands of founders to keep their businesses running smoothly."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
            >
              <div
                className={`group relative flex h-full flex-col rounded-2xl bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 ${
                  s.popular
                    ? 'shadow-card-hover ring-2 ring-gold'
                    : 'shadow-card ring-1 ring-primary-100/70 hover:ring-primary/40 hover:shadow-card-hover'
                }`}
              >
                {s.popular && (
                  <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-gold to-gold-dark px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-gold-glow">
                    Popular
                  </span>
                )}

                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-gradient text-white shadow-card ring-1 ring-white/30">
                  <s.icon className="h-6 w-6" />
                </span>

                <h3 className="mt-4 text-base font-bold text-navy-dark">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{s.desc}</p>

                <p className="mt-4 text-sm font-extrabold text-primary">From ₹{s.price}</p>

                <button
                  type="button"
                  onClick={() => start(s.title)}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary transition-colors hover:text-primary-700"
                >
                  Get started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
