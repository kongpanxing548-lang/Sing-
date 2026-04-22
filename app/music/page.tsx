import Link from 'next/link'
import { ArrowLeft, Music, ChevronRight } from 'lucide-react'
import { allTracks, formatDuration } from '@/lib/tracks'
import { PlayButton } from '@/components/PlayButton'

export default function MusicPage() {
  return (
    <main className="min-h-screen bg-[#0B0B0B]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B0B0B]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
      <div className="pt-24 pb-32 px-6 md:px-12 lg:px-24">
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
              共 {allTracks.length} 首原创作品，涵盖电子、氛围、独立等多种风格。
            </p>
          </div>

          {/* Track List */}
          <div className="space-y-2">
            {allTracks.map((track, index) => (
              <Link
                key={track.id}
                href={`/track/${track.id}`}
                className="group flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 transition-all duration-300"
              >
                <span className="w-8 text-center text-white/30 text-sm">
                  {index + 1}
                </span>
                
                <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                  <img 
                    src={track.cover} 
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayButton track={track} size="sm" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{track.title}</h3>
                  <p className="text-white/50 text-sm truncate">{track.artist}</p>
                </div>

                <div className="hidden md:flex items-center gap-6 text-sm text-white/40">
                  <span className="w-20">{track.genre}</span>
                  <span className="w-16">{track.year}</span>
                  <span className="w-16 text-right">{formatDuration(track.duration)}</span>
                </div>

                <div className="md:hidden text-sm text-white/40">
                  {formatDuration(track.duration)}
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
