/**
 * A deliberately small client router for a five-page brochure site:
 * path matching is exact, links use the History API, and the server renders
 * a fixed location. Keeps the JavaScript bundle (and hydration cost) small.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react'

interface Location {
  pathname: string
  hash: string
}

interface RouterValue extends Location {
  navigate: (to: string) => void
}

const RouterContext = createContext<RouterValue>({ pathname: '/', hash: '', navigate: () => {} })

export const normalizePath = (pathname: string) => pathname.replace(/\/+$/, '') || '/'

const readLocation = (): Location => ({
  pathname: normalizePath(window.location.pathname),
  hash: window.location.hash,
})

export function BrowserRouter({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState(readLocation)

  useEffect(() => {
    const sync = () => setLocation(readLocation())
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.href)
    const samePage = normalizePath(url.pathname) === normalizePath(window.location.pathname)
    if (url.href !== window.location.href) window.history.pushState(null, '', url)
    // Same-page links: jump to the anchor, or back to the top. Smoothness
    // follows the CSS `scroll-behavior`, which respects reduced motion.
    if (samePage) {
      const target = url.hash && document.getElementById(decodeURIComponent(url.hash.slice(1)))
      if (target) target.scrollIntoView()
      else if (!url.hash) window.scrollTo({ top: 0 })
    }
    setLocation(readLocation())
  }, [])

  const value = useMemo(() => ({ ...location, navigate }), [location, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

/** Fixed-location router used when prerendering. */
export function StaticRouter({ location, children }: { location: string; children: ReactNode }) {
  const url = new URL(location, 'http://localhost')
  const value = useMemo(
    () => ({ pathname: normalizePath(url.pathname), hash: url.hash, navigate: () => {} }),
    [url.pathname, url.hash],
  )
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

export const useLocation = () => useContext(RouterContext)

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { to: string }

export function Link({ to, onClick, ...props }: LinkProps) {
  const { navigate } = useLocation()
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    if (event.defaultPrevented || event.button !== 0 || modified || props.target) return
    event.preventDefault()
    navigate(to)
  }
  return <a href={to} onClick={handleClick} {...props} />
}

type NavLinkProps = Omit<LinkProps, 'className' | 'children'> & {
  end?: boolean
  className?: string | ((state: { isActive: boolean }) => string)
  children?: ReactNode | ((state: { isActive: boolean }) => ReactNode)
}

export function NavLink({ to, end = false, className, children, ...props }: NavLinkProps) {
  const { pathname } = useLocation()
  const target = normalizePath(to)
  const isActive = end ? pathname === target : pathname === target || pathname.startsWith(`${target}/`)
  return (
    <Link
      to={to}
      aria-current={isActive ? 'page' : undefined}
      className={typeof className === 'function' ? className({ isActive }) : className}
      {...props}
    >
      {typeof children === 'function' ? children({ isActive }) : children}
    </Link>
  )
}
