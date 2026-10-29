/**
 * Dev-only page used by scripts/render-art.mjs to bake still frames of the
 * hex-light ceiling into image files. Not part of the production build.
 */
import { createRoot } from 'react-dom/client'
import '../src/index.css'
import { HexLights, type Shot } from '../src/components/hex/HexLights'

const params = new URLSearchParams(location.search)
const num = (key: string) => (params.has(key) ? Number(params.get(key)) : undefined)
const shot: Partial<Shot> = Object.fromEntries(
  (['pitch', 'yaw', 'roll', 'focal', 'halfW', 'floor'] as const).map((k) => [k, num(k)]).filter(([, v]) => v !== undefined),
)

createRoot(document.getElementById('root')!).render(
  <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
    <HexLights
      mode={params.get('mode') === 'overhead' ? 'overhead' : 'tunnel'}
      still
      shot={shot}
      exposure={num('exposure') ?? 1.25}
      onReady={() => document.body.setAttribute('data-ready', '1')}
    />
  </div>,
)
