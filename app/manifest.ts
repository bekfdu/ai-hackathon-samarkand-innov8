import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'EduCheck - Qo\'lda yozilgan insholarni tekshiring',
    short_name: 'EduCheck',
    description: 'AI yordamida insholaringizni tez va aniq tahlil qiling. To\'rt tilda qo\'llab-quvvatlash.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#6366f1',
    orientation: 'portrait-primary',
    categories: ['education', 'productivity', 'utilities'],
    lang: 'uz',
    scope: '/',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any'
      }
    ],
    screenshots: [
      {
        src: '/screenshot-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow'
      }
    ],
    shortcuts: [
      {
        name: 'Rasm yuklash',
        short_name: 'Yuklash',
        description: 'Insho rasmini yuklang',
        url: '/upload',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }]
      },
      {
        name: 'Grammatika tekshirish',
        short_name: 'Grammatika',
        description: 'Matnni tekshiring',
        url: '/grammar',
        icons: [{ src: '/icon-192x192.png', sizes: '192x192' }]
      }
    ]
  }
}
