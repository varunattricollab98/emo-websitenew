import { motion } from 'framer-motion'
import { Mail, Headset, UserCog, PhoneCall, Building2, Package } from 'lucide-react'
import SmartImage from '../ui/SmartImage'

const benefits = [
  {
    icon: Mail,
    title: 'Smart Mail Management',
    desc: 'Receive, organise and forward all your important business mail and documents — handled for you, hassle-free.',
  },
  {
    icon: Headset,
    title: 'Dedicated Customer Assistance',
    desc: 'A responsive support team is always ready to help you whenever you need guidance or quick answers.',
  },
  {
    icon: UserCog,
    title: 'Virtual Office Assistance',
    desc: 'Get professional admin support to manage your day-to-day operational tasks efficiently and on time.',
  },
  {
    icon: PhoneCall,
    title: 'Business Call Handling',
    desc: 'Professional call-answering and forwarding so you never miss an important client communication.',
  },
  {
    icon: Building2,
    title: 'Premium Business Address',
    desc: 'Build instant credibility with a prestigious commercial address in prime locations — at minimal setup cost.',
  },
  {
    icon: Package,
    title: 'Courier & Package Handling',
    desc: 'Secure receipt and safe handling of parcels, couriers and documents delivered on your behalf.',
  },
]

export default function WhyVirtualOffice() {
  return (
    <section
      className="relative overflow-hidden py-20 lg:py-28"
      style={{ background: 'linear-gradient(135deg, #0a1a30 0%, #11417c 55%, #17559a 100%)' }}
    >
      {/* subtle office texture + glows */}
      <SmartImage
        src="https://easemyoffice.in/wp-content/uploads/2024/09/98rkhw.webp"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.12] mix-blend-luminosity"
      />
      <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.06]" />
      <div className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-primary-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="container-custom relative">
        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-gold" />
            Benefits of a Virtual Office
          </span>
          <h2 className="mt-5 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            Why Choose a Virtual Office?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-blue-100/80">
            Everything you need to run a professional, compliant business — without the cost of a
            physical office. Here&apos;s what you get with EaseMyOffice.
          </p>
        </motion.div>

        {/* benefits grid */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-4 sm:grid-cols-2">
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.1]"
            >
              <span className="inline-flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/15 transition-transform duration-300 group-hover:scale-110">
                <b.icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">{b.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-blue-100/70">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
