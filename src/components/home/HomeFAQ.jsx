import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import FaqAccordion from '../ui/FaqAccordion'
import { faqs } from '../../data/faqs'

export default function HomeFAQ() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Everything you need to know about virtual offices, GST and compliance."
        />
        <Reveal className="mt-12">
          <FaqAccordion items={faqs} />
        </Reveal>
      </div>
    </section>
  )
}
