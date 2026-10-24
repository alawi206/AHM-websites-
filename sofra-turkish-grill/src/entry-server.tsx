import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from './lib/router'
import { App } from './App'
import { headTags } from './lib/head'
import { notFoundRoute, routes } from './routes'
import './styles/index.css'

export { routes, notFoundRoute, headTags }
export { SITE_URL } from './data/business'

export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </StrictMode>,
  )
}
