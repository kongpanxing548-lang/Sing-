import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, Music, Tag, Calendar, Activity } from 'lucide-react'
import { getTrackById, formatDuration, allTracks } from '@/lib/tracks'
import { PlayButton } from '@/components/PlayButton'

interface TrackPageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  return allTracks.map((track) => ({ id: track.id }))
}

export async function generateMetadata({ params }: TrackPageProps): Promise<Metadata> {
  const track = getTrackById(params.id)
  if (!track) {
    return { title: 'Track Not Found | Sing Walking' }
  }
  return {
    title: `${track.title} — Sing Walking`,
    description: track.description,
  }
}

export default function TrackPage({ params }: TrackPageProps) {
  const track = getTrackById(params.id)

  if (!track) {
    notFound()
  }

  const otherTracks = allTracks
    .filter((t) => t.id !== track.id)
    .slice(0, 3)

  return (
    <main className="min-h-screen bg-[#0B0B0B]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B0B0B]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/music"
            className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            返回音乐库
          </Link>
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-[#E6B800]" />
            <span className="text-white font-medium">{track.title}</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="pt-24 pb-12 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Cover Art */}
            <div className="relative aspect-square rounded-2xl overflow-hidden group">
              <img
                src={track.cover}
                alt={track.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayButton track={track} size="lg" />
              </div>
            </div>

            {/* Track Info */}
            <div className="flex flex-col gap-6">
              <div>
                <span className="text-[#E6B800] text-sm tracking-[0.2em] uppercase font-medium mb-3 block">
                  {track.genre} · {track.year}
                </span>
                <h1 className="text-4xl md:text-5xl font-light text-white mb-2">
                  {track.title}
                </h1>
                <p className="text-xl text-white/60">{track.artist}</p>
              </div>

              {/* Play Button */}
              <div className="flex items-center gap-4">
                <PlayButton track={track} size="lg" />
                <span className="text-white/40 text-sm">
                  点击播放
                </span>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Clock className="w-4 h-4 text-[#E6B800]" />
                  <div>
                    <div className="text-xs text-white/40">时长</div>
                    <div className="text-white text-sm">{formatDuration(track.duration)}</div>
                  </div>
                </div>
                {track.bpm && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <Activity className="w-4 h-4 text-[#E6B800]" />
                    <div>
                      <div className="text-xs text-white/40">BPM</div>
                      <div className="text-white text-sm">{track.bpm}</div>
                    </div>
                  </div>
                )}
                {track.key && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                    <Music className="w-4 h-4 text-[#E6B800]" />
                    <div>
                      <div className="text-xs text-white/40">调性</div>
                      <div className="text-white text-sm">{track.key}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                  <Calendar className="w-4 h-4 text-[#E6B800]" />
                  <div>
                    <div className="text-xs text-white/40">发行</div>
                    <div className="text-white text-sm">{track.year}</div>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {track.tags && track.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {track.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full bg-white/10 text-white/60 text-xs flex items-center gap-1"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {track.description && (
                <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                  <p className="text-white/70 text-sm leading-relaxed">
                    {track.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* More Tracks Section */}
      {otherTracks.length > 0 && (
        <div className="px-6 md:px-12 lg:px-24 pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="border-t border-white/10 pt-12">
              <h2 className="text-2xl font-light text-white mb-8">
                更多作品
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {otherTracks.map((t) => (
                  <Link
                    key={t.id}
                    href={`/track/${t.id}`}
                    className="group block"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden mb-3">
                      <img
                        src={t.cover}
                        alt={t.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#E6B800] text-[#0B0B0B] flex items-center justify-center">
                          <Music className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                    <h3 className="text-white font-medium group-hover:text-[#E6B800] transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-white/50 text-sm">{t.artist}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
