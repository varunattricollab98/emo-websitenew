import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  TrendingUp,
  GraduationCap,
  HeartPulse,
  Laptop,
  Users,
  Sparkles,
  Mail,
  ChevronDown,
  Building2,
  Send,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import ArticleBlocks from '../components/ui/ArticleBlocks'
import ClientsStrip from '../components/virtual-office/ClientsStrip'
import SchemaScript from '../components/seo/SchemaScript'
import { webPageSchema, breadcrumbSchema } from '../components/seo/schemas'
import { useJobOpenings } from '../hooks/useJobOpenings'
import { useMeta } from '../hooks/useMeta'
import { markdownToBlocks } from '../utils/markdownToBlocks'

const DEFAULT_APPLY_EMAIL = 'contact@easemyoffice.in'

// Brand copy, not data. These are stable so they live in code.
const perks = [
  {
    icon: TrendingUp,
    title: 'Real growth, fast',
    desc: 'We are scaling across 100+ cities. Take on more scope in a year here than in three elsewhere.',
  },
  {
    icon: Sparkles,
    title: 'Ownership from day one',
    desc: 'Small teams, real decisions. You own outcomes, not just tasks, from your first month.',
  },
  {
    icon: GraduationCap,
    title: 'Learning budget',
    desc: 'Certifications, courses and conferences that make you better at your craft, on us.',
  },
  {
    icon: Laptop,
    title: 'Flexible working',
    desc: 'Hybrid by default. We care about the work you ship, not the hours you sit at a desk.',
  },
  {
    icon: Users,
    title: 'A team you will like',
    desc: 'Low ego, high trust, and offsites that people actually look forward to.',
  },
]

const CAREER_EMAIL = 'contact@easemyoffice.in'
const WEB3FORMS_KEY = '24c2a048-dac6-4a5a-8956-2b36139f22fc'

const educationOptions = [
  { value: '', label: 'Select your educational status' },
  { value: 'Graduated', label: 'Graduated' },
  { value: 'Post Graduated', label: 'Post Graduated' },
  { value: 'Undergraduate', label: 'Undergraduate' },
  { value: 'Other', label: 'Other' },
]

/** Career application form with Web3Forms integration. */
function CareerApplicationForm() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    education: '',
    experience: '',
  })
  const [cvFile, setCvFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setCvFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError('')

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Career Application | ${form.firstName} ${form.lastName}`,
          from_name: 'EaseMyOffice Careers',
          to: CAREER_EMAIL,
          'First Name': form.firstName,
          'Last Name': form.lastName,
          'Contact Number': form.phone,
          'Email Id': form.email,
          'Educational Status': form.education,
          Experience: form.experience,
          'CV Attached': cvFile ? `Candidate will email CV (${cvFile.name})` : 'Not provided',
          source: 'careers-page',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        setError('Something went wrong. Please try again or email us directly.')
      }
    } catch {
      setError('Network error. Please try again or email us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-primary-100 bg-white p-10 shadow-card">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-accent-emerald" />
          <h3 className="mt-4 text-2xl font-bold text-navy-dark">Application received!</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
            Thank you for your interest. Our team will review your profile and get back to you.
          </p>
          {cvFile && (
            <div className="mt-6 rounded-2xl border border-primary-100 bg-surface-light p-5 text-center">
              <FileText className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-2 text-sm font-semibold text-navy-dark">
                Please email your CV to complete your application
              </p>
              <a
                href={`mailto:${CAREER_EMAIL}?subject=${encodeURIComponent(
                  `CV - ${form.firstName} ${form.lastName}`
                )}&body=${encodeURIComponent(
                  `Hi,\n\nPlease find my CV attached.\n\nName: ${form.firstName} ${form.lastName}\nPhone: ${form.phone}\nEmail: ${form.email}\n\nThank you.`
                )}`}
                className="btn-base mt-4 bg-primary-gradient px-6 py-3 text-sm text-white shadow-card transition-all hover:shadow-glow hover:brightness-110"
              >
                <Mail className="h-4 w-4" />
                Email CV to {CAREER_EMAIL}
              </a>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary-100 bg-white p-8 shadow-card-hover">
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold via-gold-dark to-gold" />
      <form onSubmit={handleSubmit} className="space-y-5">
        <h3 className="text-xl font-bold text-navy-dark">Career Application Form</h3>
        <p className="text-sm text-slate-600">
          Fill in your details and we will reach out if there is a match.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-dark">
              First Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              placeholder="Enter your first name"
              className="w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-navy-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-dark">
              Last Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              placeholder="Enter your last name"
              className="w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-navy-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-dark">
              Contact Number <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
              className="w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-navy-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-dark">
              Email Id <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
              className="w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-navy-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-dark">
              Educational Status <span className="text-red-400">*</span>
            </label>
            <select
              name="education"
              value={form.education}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-navy-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              {educationOptions.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={!opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-navy-dark">
              Experience <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              required
              placeholder="e.g. 2 years, 6 months"
              className="w-full rounded-xl border border-primary-200 bg-white px-4 py-3 text-sm text-navy-dark outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-navy-dark">
            Attach CV <span className="text-xs font-normal text-slate-400">(PDF or DOC)</span>
          </label>
          <div className="relative rounded-xl border border-dashed border-primary-200 bg-surface-light p-4 text-center transition-colors hover:border-primary/50">
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="absolute inset-0 cursor-pointer opacity-0"
            />
            <FileText className="mx-auto h-8 w-8 text-primary/60" />
            {cvFile ? (
              <p className="mt-2 text-sm font-semibold text-navy-dark">{cvFile.name}</p>
            ) : (
              <p className="mt-2 text-sm text-slate-500">
                Click to browse or drag your file here
              </p>
            )}
            <p className="mt-1 text-xs text-slate-400">PDF, DOC up to 5 MB</p>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            After submitting, you will be prompted to email your CV to{' '}
            <span className="font-semibold text-primary">{CAREER_EMAIL}</span>
          </p>
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-2.5 text-center text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn-base w-full bg-primary-gradient px-6 py-3.5 text-white shadow-card hover:shadow-glow disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? 'Submitting...' : 'Submit Application'}
          {!submitting && <Send className="h-4 w-4" />}
        </button>
      </form>
    </div>
  )
}

/** One expandable role card. */
function JobCard({ job, isOpen, onToggle }) {
  const applyEmail = job.apply_email || DEFAULT_APPLY_EMAIL
  const mailto = `mailto:${applyEmail}?subject=${encodeURIComponent(
    `Application for ${job.title}`
  )}`

  const pills = [
    job.department && { icon: Briefcase, text: job.department },
    job.location && { icon: MapPin, text: job.location },
    job.employment_type && { icon: Clock, text: job.employment_type },
    job.experience && { icon: TrendingUp, text: job.experience },
  ].filter(Boolean)

  return (
    <div className="overflow-hidden rounded-2xl border border-primary-100/70 bg-white shadow-card transition-all duration-300 hover:border-primary/30 hover:shadow-card-hover">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-start justify-between gap-4 p-6 text-left"
      >
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-navy-dark">{job.title}</h3>
          {pills.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {pills.map((p) => (
                <span
                  key={p.text}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary"
                >
                  <p.icon className="h-3.5 w-3.5" />
                  {p.text}
                </span>
              ))}
            </div>
          )}
        </div>
        <span
          className={`mt-1 inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-primary-50 text-primary transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      {isOpen && (
        <div className="border-t border-primary-100/60 px-6 pb-6 pt-5">
          {job.description && (
            <div className="mb-5">
              <ArticleBlocks blocks={markdownToBlocks(job.description)} />
            </div>
          )}

          {job.responsibilities && (
            <div className="mb-5">
              <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                What you will do
              </h4>
              <ArticleBlocks blocks={markdownToBlocks(job.responsibilities)} />
            </div>
          )}

          {job.requirements && (
            <div className="mb-6">
              <h4 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                What we are looking for
              </h4>
              <ArticleBlocks blocks={markdownToBlocks(job.requirements)} />
            </div>
          )}

          <a
            href={mailto}
            className="btn-base bg-primary-gradient px-6 py-3 text-sm text-white shadow-card transition-all hover:shadow-glow hover:brightness-110"
          >
            <Mail className="h-4 w-4" />
            Apply for this role
          </a>
          <p className="mt-3 text-xs text-slate-500">
            Applications go to{' '}
            <a href={`mailto:${applyEmail}`} className="font-semibold text-primary">
              {applyEmail}
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

export default function Careers() {
  const { jobs, loaded } = useJobOpenings()
  const [openId, setOpenId] = useState(null)

  useMeta({
    title: 'Careers at EaseMyOffice, Join Our Team',
    description:
      'Build the future of flexible workspaces in India. See open roles in sales, operations, engineering and marketing at EaseMyOffice.',
    path: '/careers',
  })

  const breadcrumbItems = [{ name: 'Home', url: '/' }, { name: 'Careers' }]

  return (
    <>
      <SchemaScript
        schemas={[
          webPageSchema({
            title: 'Careers at EaseMyOffice',
            description:
              'Build the future of flexible workspaces in India. Open roles in sales, operations, engineering and marketing.',
            url: '/careers',
            breadcrumbs: breadcrumbItems,
          }),
          breadcrumbSchema(breadcrumbItems),
        ].filter(Boolean)}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 tech-dots opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_40%_40%,#000,transparent)]" />

        <div className="container-custom relative py-14 lg:py-18">
          <div className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <span className="font-semibold text-navy-dark">Careers</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 max-w-3xl"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-primary-200 bg-white px-5 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary shadow-soft">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              </span>
              We are hiring
            </span>

            <h1 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-navy-dark text-balance sm:text-4xl lg:text-[2.9rem] lg:leading-[1.1]">
              Build the future of <span className="gradient-text">flexible workspaces</span> in
              India
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
              We help thousands of businesses get compliant addresses and workspaces across 100+
              cities. If you like solving messy, real-world problems for real customers, you will
              like it here.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#openings"
                className="btn-base bg-primary-gradient px-7 py-3.5 text-base text-white shadow-card transition-all hover:shadow-glow hover:brightness-110"
              >
                See open roles <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href={`mailto:${DEFAULT_APPLY_EMAIL}`}
                className="btn-base border-2 border-primary/30 px-7 py-3.5 text-base text-primary hover:bg-primary-50"
              >
                <Mail className="h-5 w-5" />
                Write to us
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Open roles */}
      <section id="openings" className="section-padding scroll-mt-24 bg-surface-light">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Open Roles"
            title="Current openings"
            accent="openings"
            subtitle="Click a role to see the full brief and apply."
          />

          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {/* Loading */}
            {!loaded &&
              [0, 1, 2].map((i) => (
                <div
                  key={`job-skeleton-${i}`}
                  className="rounded-2xl border border-primary-100/70 bg-white p-6 shadow-card"
                >
                  <div className="h-5 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="mt-3 flex gap-2">
                    <div className="h-6 w-20 animate-pulse rounded-full bg-primary-50" />
                    <div className="h-6 w-24 animate-pulse rounded-full bg-primary-50" />
                    <div className="h-6 w-20 animate-pulse rounded-full bg-primary-50" />
                  </div>
                </div>
              ))}

            {/* Roles */}
            {loaded &&
              jobs.map((job) => (
                <JobCard
                  key={job.id || job.title}
                  job={job}
                  isOpen={openId === (job.id || job.title)}
                  onToggle={() =>
                    setOpenId(openId === (job.id || job.title) ? null : job.id || job.title)
                  }
                />
              ))}

            {/* No roles open */}
            {loaded && jobs.length === 0 && (
              <Reveal>
                <div className="rounded-3xl border border-primary-100 bg-white p-10 text-center shadow-card">
                  <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
                    <Briefcase className="h-7 w-7" />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-navy-dark">
                    No open roles right now
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                    We are not actively hiring at the moment, but we always welcome speculative
                    applications. Fill out the form below and tell us what you would want to own.
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="section-padding scroll-mt-24 bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Apply Now"
            title="Submit your application"
            accent="application"
            subtitle="Fill in your details below. We will review your profile and get back to you."
          />
          <div className="mx-auto mt-12 max-w-2xl">
            <Reveal>
              <CareerApplicationForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why join */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <SectionHeading
            eyebrow="Why EaseMyOffice"
            title="A place to do your best work"
            accent="best work"
            subtitle="We are a small team with a large footprint, which means your work is visible and it matters."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((p, i) => (
              <Reveal key={p.title} delay={(i % 3) * 0.07}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100/70 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:shadow-card-hover">
                  <span className="relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card ring-1 ring-white/30 transition-transform duration-300 group-hover:scale-105">
                    <p.icon className="h-7 w-7" />
                  </span>
                  <h3 className="relative mt-5 text-base font-bold text-navy-dark">{p.title}</h3>
                  <p className="relative mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {p.desc}
                  </p>
                  <span className="relative mt-5 h-1 w-8 rounded-full bg-emerald-400/50 transition-all duration-300 group-hover:w-16" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <ClientsStrip />

      {/* Closing CTA */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[2rem] px-6 py-14 text-center shadow-card-hover ring-1 ring-white/10 sm:px-12 lg:py-16"
            style={{
              background: 'linear-gradient(135deg, #0a1a30 0%, #0d2e5c 40%, #11417c 70%, #16508f 120%)',
            }}
          >
            <div className="pointer-events-none absolute inset-0 tech-grid opacity-[0.06]" />
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-300/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            <div className="relative mx-auto max-w-2xl">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/20">
                <Building2 className="h-7 w-7" />
              </span>
              <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
                Do not see a role that fits?
              </h2>
              <p className="mt-4 text-lg text-primary-100">
                We would still like to hear from you. Tell us what you are great at and where you
                think you could help.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href={`mailto:${DEFAULT_APPLY_EMAIL}?subject=${encodeURIComponent(
                    'Speculative application'
                  )}`}
                  className="btn-base bg-white px-8 py-4 text-base font-bold text-primary-800 shadow-card transition-all hover:brightness-105"
                >
                  <Mail className="h-5 w-5" />
                  {DEFAULT_APPLY_EMAIL}
                </a>
                <a
                  href="/about"
                  className="btn-base border-2 border-white/40 bg-transparent px-8 py-4 text-base text-white transition-colors hover:bg-white/10"
                >
                  About EaseMyOffice
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}
