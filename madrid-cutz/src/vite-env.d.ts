/// <reference types="vite/client" />

// vite-imagetools: `import url from './logo.png?w=600&format=webp'` (single file → URL string)
declare module '*format=webp' {
  const src: string
  export default src
}

// vite-imagetools: `import pic from './photo.jpg?w=800;1600&format=avif;webp&as=picture'`
declare module '*as=picture' {
  const picture: {
    sources: Record<string, string>
    img: { src: string; w: number; h: number }
  }
  export default picture
}
