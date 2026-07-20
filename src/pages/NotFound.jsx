import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Compass } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-hero-gradient">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-primary-100/50 blur-3xl" />
      <div className="container-custom relative text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
          <Compass className="h-8 w-8" />
        </span>
        <p className="mt-8 text-7xl font-extrabold gradient-text sm:text-8xl">404</p>
        <h1 className="mt-4 text-2xl font-bold text-navy-dark sm:text-3xl">Page not found</h1>
        <p className="mx-auto mt-3 max-w-md text-slate-600">
          The page you are looking for doesn't exist or has moved. Let's get you back on track.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button to="/" size="lg">
            <Home className="h-5 w-5" /> Back to Home
          </Button>
          <Button to="/contact" variant="outline" size="lg">
            <ArrowLeft className="h-5 w-5" /> Contact Support
          </Button>
        </div>
      </div>
    </section>
  )
}
