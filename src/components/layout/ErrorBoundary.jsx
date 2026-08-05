import { Component } from 'react'

/**
 * Catches any runtime error in the React tree and shows a friendly fallback
 * instead of a blank white page. Critical for production robustness.
 *
 * Also handles chunk loading failures (stale deploy) by auto-reloading once.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught error:', error, info)

    // Auto-reload on chunk loading failure (happens after a new deploy
    // when old cached HTML references chunks that no longer exist)
    if (
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('Loading chunk') ||
      error?.message?.includes('Loading CSS chunk') ||
      error?.name === 'ChunkLoadError'
    ) {
      // Only reload once to avoid infinite loops
      const lastReload = sessionStorage.getItem('chunk-reload')
      if (!lastReload || Date.now() - Number(lastReload) > 10000) {
        sessionStorage.setItem('chunk-reload', String(Date.now()))
        window.location.reload()
        return
      }
    }
  }

  handleReset = () => {
    this.setState({ hasError: false })
    // Send the user home for a clean state
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-gradient text-white shadow-card">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="mt-6 text-2xl font-extrabold text-navy-dark sm:text-3xl">
            Something went wrong
          </h1>
          <p className="mt-3 max-w-md text-slate-500">
            Sorry, this page ran into an unexpected error. Please try again. Our team has been
            notified.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-base bg-primary-gradient px-6 py-3 text-sm text-white shadow-card hover:shadow-glow"
            >
              Reload page
            </button>
            <button
              type="button"
              onClick={this.handleReset}
              className="btn-base border-2 border-primary/30 px-6 py-3 text-sm text-primary hover:bg-primary-50"
            >
              Back to Home
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
