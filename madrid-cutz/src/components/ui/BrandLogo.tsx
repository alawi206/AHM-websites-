import logo from '../../assets/brand/madrid-cutz-logo.png?w=160;320;520;760;1000&format=avif;webp&as=picture'
import logoMask from '../../assets/brand/madrid-cutz-logo.png?w=640&format=webp'
import { Picture } from './primitives'

type Props = {
  className?: string
  /** `sizes` attribute for the responsive image. */
  sizes: string
  priority?: boolean
  /** Periodic band of light across the metal, clipped to the logo's own shape. */
  shine?: boolean
  /** Warm halo behind the emblem. */
  glow?: boolean
  alt?: string
}

/** The Madrid Cutz emblem: crown, MC monogram, clippers and the hexagon-lit shop. */
export function BrandLogo({ className = '', sizes, priority = false, shine = false, glow = false, alt = 'Madrid Cutz' }: Props) {
  const mask = `url(${logoMask})`
  return (
    <div className={`relative isolate ${className}`}>
      {glow && (
        <div
          aria-hidden="true"
          className="absolute inset-[6%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(246,198,83,0.34),rgba(246,198,83,0.08)_45%,transparent_70%)] blur-2xl"
        />
      )}
      <Picture
        picture={logo}
        alt={alt}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        className="block"
        imgClassName="block h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.75)]"
      />
      {shine && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-overlay motion-reduce:hidden"
          style={{
            maskImage: mask,
            WebkitMaskImage: mask,
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        >
          <span className="absolute inset-y-[-10%] left-0 w-2/5 animate-[shine_8s_cubic-bezier(0.45,0,0.2,1)_1.6s_infinite] bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        </div>
      )}
    </div>
  )
}
