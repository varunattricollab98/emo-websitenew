import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Clock, User, Calendar, FileText, ChevronDown } from 'lucide-react'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import SmartImage from '../components/ui/SmartImage'
import ArticleBlocks from '../components/ui/ArticleBlocks'
import SectionHeading from '../components/ui/SectionHeading'
import TalkToExpert from '../components/ui/TalkToExpert'
import SchemaScript from '../components/seo/SchemaScript'
import { articleSchema, breadcrumbSchema } from '../components/seo/schemas'
import { useBlogPost, useBlogPosts, formatPostDate } from '../hooks/useBlogPosts'
import { useMeta } from '../hooks/useMeta'

/**
 * Collapsible Table of Contents component.
 * Auto-generated from article H2 headings. Only renders when there are 3+ headings.
 */
function TableOfContents({ headings }) {
  const [open, setOpen] = useState(() => window.innerWidth >= 1024)

  if (!headings || headings.length < 3) return null

  return (
    <div className="rounded-2xl border border-primary-100/70 bg-white shadow-soft">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4"
      >
        <span className="text-sm font-bold text-navy-dark">Table of Contents</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ol className="border-t border-primary-100/50 px-5 py-4 space-y-2">
              {headings.map((heading, idx) => {
                const id = heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                return (
                  <li key={id + idx}>
                    <a
                      href={`#${id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="flex items-start gap-2 text-sm text-slate-600 transition-colors hover:text-primary"
                    >
                      <span className="flex-none font-semibold text-primary/60">{idx + 1}.</span>
                      <span className="leading-snug">{heading}</span>
                    </a>
                  </li>
                )
              })}
            </ol>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function BlogPost() {
  const { slug } = useParams()
  const { post, loaded } = useBlogPost(slug)
  const { posts } = useBlogPosts()

  useMeta({
    title: post
      ? post.meta_title || `${post.title} | EaseMyOffice Blog`
      : 'Blog | EaseMyOffice',
    description: post ? post.meta_description || post.excerpt : undefined,
    path: `/blog/${slug}`,
    image: post?.cover_image,
  })

  // Still fetching, keep the layout stable instead of flashing "not found".
  if (!loaded) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <div className="h-3 w-40 animate-pulse rounded bg-primary-50" />
          <div className="mt-6 h-9 w-4/5 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-slate-100" />
          <div className="mt-8 h-64 w-full animate-pulse rounded-3xl bg-primary-100/60" />
          <div className="mt-8 space-y-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-3.5 w-full animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Loaded and genuinely absent.
  if (!post) {
    return (
      <section className="section-padding bg-white">
        <div className="container-custom max-w-lg text-center">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
            <FileText className="h-7 w-7" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-navy-dark">Post not found</h1>
          <p className="mt-2 text-slate-600">
            This post may have been moved or unpublished.
          </p>
          <Button to="/blog" className="mt-7">
            <ArrowLeft className="h-4 w-4" />
            Back to the blog
          </Button>
        </div>
      </section>
    )
  }

  // Prefer posts from the same category, fall back to the latest.
  const related = posts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aMatch = a.category && a.category === post.category ? 0 : 1
      const bMatch = b.category && b.category === post.category ? 0 : 1
      return aMatch - bMatch
    })
    .slice(0, 3)

  const breadcrumbItems = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title },
  ]

  return (
    <>
      <SchemaScript
        schemas={[
          articleSchema({
            title: post.title,
            description: post.excerpt || post.meta_description || post.title,
            url: `/blog/${post.slug}`,
            datePublished: post.published_at,
            dateModified: post.updated_at || post.published_at,
          }),
          breadcrumbSchema(breadcrumbItems),
        ].filter(Boolean)}
      />

      {/* Header */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 tech-dots opacity-40 [mask-image:radial-gradient(ellipse_70%_60%_at_40%_40%,#000,transparent)]" />

        <div className="container-custom relative py-12 lg:py-16">
          <div className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span>/</span>
            <Link to="/blog" className="hover:text-primary">
              Blog
            </Link>
            <span>/</span>
            <span className="line-clamp-1 font-semibold text-navy-dark">{post.title}</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mt-6 max-w-3xl"
          >
            {post.category && (
              <span className="inline-flex items-center rounded-full bg-primary-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                {post.category}
              </span>
            )}

            <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-navy-dark text-balance sm:text-4xl">
              {post.title}
            </h1>

            {post.excerpt && (
              <p className="mt-4 text-lg leading-relaxed text-slate-600">{post.excerpt}</p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-primary-100 pt-5 text-sm font-medium text-slate-500">
              {post.author && (
                <span className="inline-flex items-center gap-1.5">
                  <User className="h-4 w-4 text-primary/70" />
                  {post.author}
                </span>
              )}
              {post.published_at && (
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary/70" />
                  {formatPostDate(post.published_at)}
                </span>
              )}
              {post.read_minutes ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-primary/70" />
                  {post.read_minutes} min read
                </span>
              ) : null}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover image */}
      {post.cover_image && (
        <section className="bg-white pt-10">
          <div className="container-custom max-w-4xl">
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-primary-100/70 shadow-card">
                <SmartImage
                  src={post.cover_image}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Table of Contents */}
      {post.blocks?.length > 0 && (
        <section className="bg-white pt-8">
          <div className="container-custom max-w-3xl">
            <TableOfContents
              headings={post.blocks
                .filter((b) => b && b.h)
                .map((b) => b.h)
                .slice(0, 30)}
            />
          </div>
        </section>
      )}

      {/* Body */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          {post.blocks?.length > 0 ? (
            <Reveal>
              <ArticleBlocks blocks={post.blocks} lead />
            </Reveal>
          ) : (
            <p className="text-slate-500">This post has no content yet.</p>
          )}

          <div className="mt-12 border-t border-primary-100 pt-8">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:text-primary-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all posts
            </Link>
          </div>
        </div>
      </section>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="section-padding bg-surface-light">
          <div className="container-custom">
            <SectionHeading eyebrow="Keep Reading" title="Related Posts" accent="Related" />
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 0.07}>
                  <Link
                    to={`/blog/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-primary-100/60 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
                  >
                    <div className="relative h-36 overflow-hidden">
                      {p.cover_image ? (
                        <SmartImage
                          src={p.cover_image}
                          alt={p.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary-gradient">
                          <FileText className="h-9 w-9 text-white/70" />
                        </div>
                      )}
                      {p.category && (
                        <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm">
                          {p.category}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-sm font-bold leading-snug text-navy-dark transition-colors group-hover:text-primary">
                        {p.title}
                      </h3>
                      {p.excerpt && (
                        <p className="mt-2 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-600">
                          {p.excerpt}
                        </p>
                      )}
                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                        Read more
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <TalkToExpert city="India" />
    </>
  )
}
