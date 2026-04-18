import Link from 'next/link'
import { ArrowLeft, Music } from 'lucide-react'
import { PlayButton } from '@/components/PlayButton'

// 完整音乐库数据
const allTracks = [
  {
    id: '1',
    title: '夜行者',
    artist: 'Sing',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 372,
    genre: '电子',
    year: '2024',
  },
  {
    id: '2',
    title: '城市微光',
    artist: 'Sing',
    cover: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 285,
    genre: '氛围',
    year: '2024',
  },
  {
    id: '3',
    title: '独白',
    artist: 'Sing',
    cover: 'https://images.unsplash.com/photo-1516280440614-6697288d5d38?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 198,
    genre: '独立',
    year: '2023',
  },
  {
    id: '4',
    title: '归途',
    artist: 'Sing',
    cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 324,
    genre: '电子',
    year: '2023',
  },
  {
    id: '5',
    title: '晨光',
    artist: 'Sing',
    cover: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    duration: 256,
    genre: '氛围',
    year: '2024',
  },
  {
    id: '6',
    title: '边界',
    artist: 'Sing',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    duration: 289,
    genre: '实验',
    year: '2023',
  },
]

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

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
              <div 
                key={track.id}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
