import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Clock, User, Calendar, FileText, PenLine } from 'lucide-react'
import SectionHeading from '../components/ui/SectionHeading'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import SmartImage from '../components/ui/SmartImage'
import SchemaScript from '../components/seo/SchemaScript'
import { webPageSchema, breadcrumbSchema } from '../components/seo/schemas'
import { useBlogPosts, formatPostDate } from '../hooks/useBlogPosts'
import { useMeta } from '../hooks/useMeta'

const ALL = 'All'

/** Small meta row shown on cards and the featured post. */
function PostMeta({ post, light = false }) {
  const tone = light ? 'text-primary-100/70' : 'text-slate-500'
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium ${tone}`}>
      {post.author && (
        <span className="inline-flex items-center gap-1.5">
          <User className="h-3.5 w-3.5" />
          {post.author}
        </span>
      )}
      {post.published_at && (
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          {formatPostDate(post.published_at)}
        </span>
      )}
      {post.read_minutes ? (
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {post.read_minutes} min read
        </span>
      ) : null}
    </div>
  )
}

export default function Blog() {
  const { posts, loaded } = useBlogPosts()
  const [activeCategory, setActiveCategory] = useState(ALL)

  useMeta({
    title: 'Blog, Virtual Office, GST & Compliance Insights | EaseMyOffice',
    description:
      'Practical guides on virtual offices, GST registration, company incorporation and business compliance in India, written by the EaseMyOffice team.',
    path: '/blog',
  })

  const categories = useMemo(() => {
    const found = [...new Set(posts.map((p) => p.category).filter(Boolean))].sort()
    return [ALL, ...found]
  }, [posts])

  const visible = useMemo(
    () => (activeCategory === ALL ? posts : posts.filter((p) => p.category === activeCategory)),
    [posts, activeCategory]
  )

  // Only promote a featured post when the reader is looking at everything,
  // otherwise the filter appears to be ignored.
  const featured = activeCategory === ALL ? visible.find((p) => p.is_featured) : null
  const rest = featured ? visible.filter((p) => p.slug !== featured.slug) : visible

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Blog' },
  ]

  return (
    <>
      <SchemaScript
        schemas={[
          webPageSchema({
            title: 'Blog, Virtual Office & Compliance Insights, EaseMyOffice',
            description:
              'Practical guides on virtual offices, GST registration, company incorporation and business compliance in India.',
            url: '/blog',
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
            <span className="font-semibold text-navy-dark">Blog</span>
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
              EaseMyOffice Blog
            </span>

            <h1 className="mt-5 text-3xl font-extrabold leading-[1.15] tracking-tight text-navy-dark text-balance sm:text-4xl lg:text-[2.9rem] lg:leading-[1.1]">
              Insights on <span className="gradient-text">virtual offices</span>, GST &amp;
              compliance
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600">
              Practical, jargon-free guides from the team that handles thousands of GST and company
              registrations every year.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category filter */}
      {categories.length > 1 && (
        <section className="border-y border-primary-100 bg-white">
          <div className="container-custom py-5">
            <div className="flex flex-wrap gap-2.5">
              {categories.map((cat) => {
                const active = cat === activeCategory
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                      active
                        ? 'border-primary bg-primary text-white shadow-card'
                        : 'border-primary-100 bg-white text-navy-dark hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-soft'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Posts */}
      <section className="section-padding bg-surface-light">
        <div className="container-custom">
          {/* Nothing published yet, or the table has not been created */}
          {loaded && posts.length === 0 && (
            <Reveal>
              <div className="mx-auto max-w-xl rounded-3xl border border-primary-100 bg-white p-10 text-center shadow-card">
                <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
                  <PenLine className="h-7 w-7" />
                </span>
                <h2 className="mt-5 text-xl font-bold text-navy-dark">
                  Our first posts are on the way
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  We are putting together practical guides on virtual offices, GST registration and
                  company incorporation. In the meantime, our service pages already cover the
                  essentials in depth.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Button to="/virtual-office/gst-registration" size="md">
                    GST Registration Guide <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button to="/virtual-office" variant="outline" size="md">
                    Explore Locations
                  </Button>
                </div>
              </div>
            </Reveal>
          )}

          {/* Loading skeletons */}
          {!loaded && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={`skeleton-${i}`}
                  className="overflow-hidden rounded-2xl border border-primary-100/60 bg-white shadow-card"
                >
                  <div className="h-44 animate-pulse bg-primary-100/70" />
                  <div className="p-5">
                    <div className="h-3 w-20 animate-pulse rounded bg-primary-50" />
                    <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                    <div className="mt-2 h-3 w-full animate-pulse rounded bg-slate-100" />
                    <div className="mt-1.5 h-3 w-2/3 animate-pulse rounded bg-slate-100" />
                    <div className="mt-4 h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Featured post */}
          {featured && (
            <Reveal>
              <Link
                to={`/blog/${featured.slug}`}
                className="group mb-10 grid overflow-hidden rounded-3xl border border-primary-100/60 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover lg:grid-cols-2"
              >
                <div className="relative h-56 overflow-hidden lg:h-full lg:min-h-[22rem]">
                  {featured.cover_image ? (
                    <SmartImage
                      src={featured.cover_image}
                      alt={featured.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary-gradient">
                      <FileText className="h-12 w-12 text-white/70" />
                    </div>
                  )}
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-card">
                    Featured
                  </span>
                </div>

                <div className="flex flex-col justify-center p-7 lg:p-10">
                  {featured.category && (
                    <span className="inline-flex w-fit items-center rounded-full bg-primary-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                      {featured.category}
                    </span>
                  )}
                  <h2 className="mt-4 text-2xl font-extrabold leading-tight text-navy-dark transition-colors group-hover:text-primary sm:text-3xl">
                    {featured.title}
                  </h2>
                  {featured.excerpt && (
                    <p className="mt-3 leading-relaxed text-slate-600">{featured.excerpt}</p>
                  )}
                  <div className="mt-5">
                    <PostMeta post={featured} />
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                    Read the guide
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          {/* Post grid */}
          {rest.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, i) => (
                <Reveal key={post.slug} delay={(i % 3) * 0.07}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100/60 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
                  >
                    <div className="relative h-44 overflow-hidden">
                      {post.cover_image ? (
                        <SmartImage
                          src={post.cover_image}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary-gradient">
                          <FileText className="h-10 w-10 text-white/70" />
                        </div>
                      )}
                      {post.category && (
                        <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm">
                          {post.category}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-base font-bold leading-snug text-navy-dark transition-colors group-hover:text-primary">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-4 border-t border-primary-100/40 pt-3">
                        <PostMeta post={post} />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}

          {/* Filter matched nothing */}
          {loaded && posts.length > 0 && visible.length === 0 && (
            <div className="rounded-2xl border border-primary-100 bg-white p-8 text-center shadow-soft">
              <p className="font-semibold text-navy-dark">
                No posts in {activeCategory} yet.
              </p>
              <button
                type="button"
                onClick={() => setActiveCategory(ALL)}
                className="mt-3 text-sm font-bold text-primary hover:text-primary-700"
              >
                View all posts
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
