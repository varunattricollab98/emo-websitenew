import { Link } from 'react-router-dom'
import { Headset, Star, ShieldCheck, ArrowRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import FaqAccordion from '../ui/FaqAccordion'
import { caFaqs } from '../../data/caServices'

export default function CAFaq() {
  return (
    <section className="section-padding relative overflow-hidden bg-surface-light">
      <div className="pointer-events-none absolute inset-0 tech-dots opacity-50 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000,transparent)]" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-primary-300/15 blur-3xl" />

      <div className="container-custom relative">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          {/* ===== left: heading + support card (sticky) ===== */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title="Frequently Asked Questions"
              accent="Questions"
              subtitle="Everything you need to know about our CA, GST, tax and compliance services."
            />

            <Reveal className="mt-8">
              <div
                className="relative overflow-hidden rounded-2xl p-7 text-white shadow-card-hover"
                style={{
                  background: 'linear-gradient(135deg, #0a1a30 0%, #11417c 60%, #2c679e 120%)',
                }}
              >
                <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.07]" />
                <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary-300/25 blur-3xl" />

                <div className="relative">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-white ring-1 ring-white/20 backdrop-blur">
                    <Headset className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 text-xl font-bold">Still have questions?</h3>
                  <p className="mt-2 text-sm leading-relaxed text-blue-100/80">
                    Talk to a compliance expert — get a clear, honest answer and the right plan for
                    your business.
                  </p>
                  <Button to="/contact" variant="white" className="mt-5">
                    Talk to an Expert
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-5 text-xs font-medium text-blue-100/80">
                    <span className="inline-flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                      4.9/5 on Google
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                      1,200+ accounts managed
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ===== right: accordion ===== */}
          <Reveal>
            <FaqAccordion items={caFaqs} />
            <div className="mt-6 flex justify-center lg:justify-start">
              <Link
                to="/faq"
                className="group inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-6 py-3 text-sm font-bold text-primary shadow-soft transition-all hover:border-primary/40 hover:shadow-card"
              >
                View All FAQs
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
