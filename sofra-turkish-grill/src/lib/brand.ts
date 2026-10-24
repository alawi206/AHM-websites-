// Optional official logo files. Add `logo-light.(svg|png|webp)` (for dark
// backgrounds) and/or `logo-dark.(svg|png|webp)` (for light backgrounds) to
// src/assets/brand to replace the typographic wordmark.
const logos = import.meta.glob<string>('../assets/brand/logo-*.{svg,png,webp}', {
  eager: true,
  import: 'default',
  query: '?url',
})

const find = (variant: 'light' | 'dark') =>
  Object.entries(logos).find(([path]) => path.includes(`logo-${variant}.`))?.[1]

export const logo = {
  light: find('light'),
  dark: find('dark') ?? find('light'),
}
