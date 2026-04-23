import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import { JourneyExperience } from '@/components/JourneyExperience'
import { siteConfig } from '@/content/site'
import { tracks } from '@/content/tracks'

export const metadata: Metadata = {
  title: 'Journey',
  description: '围绕《行走》展开的滚动声音叙事，把城市夜路、创作阶段和自我追问同步到音乐播放体验。',
  alternates: {
    canonical: '/journey',
  },
  openGraph: {
    type: 'website',
    url: '/journey',
    siteName: siteConfig.name,
    title: `Journey | ${siteConfig.name}`,
    description: '围绕《行走》展开的滚动声音叙事，把城市夜路、创作阶段和自我追问同步到音乐播放体验。',
    images: tracks[0]?.cover
      ? [
          {
            url: tracks[0].cover,
            width: 1200,
            height: 1200,
            alt: 'Sing Walking Journey',
          },
        ]
      : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Journey | ${siteConfig.name}`,
    description: '围绕《行走》展开的滚动声音叙事，把城市夜路、创作阶段和自我追问同步到音乐播放体验。',
    images: tracks[0]?.cover ? [tracks[0].cover] : undefined,
  },
}

export default function JourneyPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0B]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B0B0B]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link 
            href="/" 
            className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </Link>
        </div>
      </header>

      <JourneyExperience />
    </main>
  )
}
