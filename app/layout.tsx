import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GlobalPlayer } from '@/components/GlobalPlayer'
import { siteConfig } from '@/content/site'
import { tracks } from '@/content/tracks'

const inter = Inter({ subsets: ['latin'] })
const defaultImage = tracks[0]?.cover

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ['Sing', '行走', 'Sing Walking', '独立音乐', '音乐作品集', '原创音乐', 'Journey'],
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: '/',
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: defaultImage
      ? [
          {
            url: defaultImage,
            width: 1200,
            height: 1200,
            alt: siteConfig.title,
          },
        ]
      : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: defaultImage ? [defaultImage] : undefined,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-[#0B0B0B] text-white antialiased`}>
        {children}
        <GlobalPlayer />
      </body>
    </html>
  )
}
