import PageHero from '../components/ui/PageHero'
import Reveal from '../components/ui/Reveal'
import FaqAccordion from '../components/ui/FaqAccordion'
import CTABand from '../components/ui/CTABand'
import { faqs } from '../data/faqs'

export default function Faq() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently Asked"
        highlight="Questions"
        subtitle="Everything you need to know about virtual offices, GST registration, company incorporation and compliance."
      />
      <section className="section-padding">
        <div className="container-custom">
          <Reveal className="mx-auto max-w-3xl">
            <FaqAccordion items={faqs} />
          </Reveal>
        </div>
      </section>
      <CTABand
        title="Still Have Questions?"
        subtitle="Our virtual-office experts are here to help. Get a clear, honest answer within one business day."
        primaryLabel="Talk to an Expert"
      />
    </>
  )
}
