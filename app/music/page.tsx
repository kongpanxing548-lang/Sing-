import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, ArrowRight, Music } from 'lucide-react'
import { PlayButton } from '@/components/PlayButton'
import { siteConfig } from '@/content/site'
import { tracks } from '@/content/tracks'
import { publicPath } from '@/lib/publicPath'

export const metadata: Metadata = {
  title: '音乐库',
  description: '浏览 Sing Walking 的原创音乐作品，进入每首歌的故事、歌词片段与制作信息。',
  alternates: {
    canonical: '/music',
  },
  openGraph: {
    type: 'website',
    url: '/music',
    siteName: siteConfig.name,
    title: `音乐库 | ${siteConfig.name}`,
    description: '浏览 Sing Walking 的原创音乐作品，进入每首歌的故事、歌词片段与制作信息。',
    images: tracks[0]?.cover
      ? [
          {
            url: tracks[0].cover,
            width: 1200,
            height: 1200,
            alt: 'Sing Walking music library',
          },
        ]
      : undefined,
  },
  twitter: {
    card: 'summary_large_image',
    title: `音乐库 | ${siteConfig.name}`,
    description: '浏览 Sing Walking 的原创音乐作品，进入每首歌的故事、歌词片段与制作信息。',
    images: tracks[0]?.cover ? [tracks[0].cover] : undefined,
  },
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export default function MusicPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0B] pb-36 md:pb-0">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B0B0B]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link 
            href="/" 
            className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </Link>
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-[#E6B800]" />
            <span className="text-white font-medium">音乐库</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="pt-24 pb-32 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-12">
            <span className="text-[#E6B800] text-sm tracking-[0.3em] uppercase font-medium mb-2 block">
              Music Library
            </span>
            <h1 className="text-4xl md:text-5xl font-light text-white mb-4">
              全部作品
            </h1>
            <p className="text-white/50 max-w-xl">
              共 {tracks.length} 首原创作品，涵盖独立流行、氛围、游戏音频质感和现场感叙事。
            </p>
          </div>

          {/* Track List */}
          <div className="space-y-2">
            {tracks.map((track, index) => (
              <div 
                key={track.id}
                className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-white/5 transition-all duration-300"
              >
                <span className="hidden min-[390px]:block w-8 text-center text-white/30 text-sm">
                  {index + 1}
                </span>
                
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={publicPath(track.cover)}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayButton track={track} size="sm" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <Link href={`/music/${track.slug}`} className="inline-flex max-w-full items-center gap-2">
                    <h3 className="text-white font-medium truncate group-hover:text-[#E6B800] transition-colors">
                      {track.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#E6B800] transition-colors flex-shrink-0" />
                  </Link>
                  <p className="text-white/50 text-sm truncate">{track.excerpt}</p>
                </div>

                <div className="hidden md:flex items-center gap-6 text-sm text-white/40">
                  <span className="w-36 truncate">{track.genre.join(' / ')}</span>
                  <span className="w-16">{track.releaseDate.slice(0, 4)}</span>
                  <span className="w-16 text-right">{formatDuration(track.duration)}</span>
                </div>

                <div className="md:hidden text-sm text-white/40">
                  {formatDuration(track.duration)}
                </div>

                <Link
                  href={`/music/${track.slug}`}
                  className="hidden lg:inline-flex text-sm text-white/35 hover:text-[#E6B800] transition-colors"
                >
                  故事
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
