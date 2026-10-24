import type { ReactElement } from 'react'
import { pages, type PageMeta } from './data/seo'
import { normalizePath } from './lib/router'
import { CateringPage } from './pages/CateringPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { MenuPage } from './pages/MenuPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { StoryPage } from './pages/StoryPage'

export interface AppRoute {
  meta: PageMeta
  element: ReactElement
}

export const routes: AppRoute[] = [
  { meta: pages.home, element: <HomePage /> },
  { meta: pages.menu, element: <MenuPage /> },
  { meta: pages.story, element: <StoryPage /> },
  { meta: pages.catering, element: <CateringPage /> },
  { meta: pages.contact, element: <ContactPage /> },
]

export const notFoundRoute: AppRoute = { meta: pages.notFound, element: <NotFoundPage /> }

export const metaForPath = (pathname: string) =>
  routes.find((r) => r.meta.path === normalizePath(pathname))?.meta ?? notFoundRoute.meta
