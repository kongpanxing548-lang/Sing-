import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ArrowLeft, Calendar, Clock3, Disc3, Music2, PenLine, Radio } from 'lucide-react'
import { PlayButton } from '@/components/PlayButton'
import { siteConfig } from '@/content/site'
import { getTrackBySlug, tracks } from '@/content/tracks'
import { publicPath } from '@/lib/publicPath'

interface TrackPageProps {
  params: {
    slug: string
  }
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function generateStaticParams() {
  return tracks.map((track) => ({
    slug: track.slug,
  }))
}

export function generateMetadata({ params }: TrackPageProps): Metadata {
  const track = getTrackBySlug(params.slug)

  if (!track) {
    return {
      title: '作品不存在 | Sing Walking',
    }
  }

  const description = track.seoDescription ?? track.excerpt

  return {
    title: track.title,
    description,
    alternates: {
      canonical: `/music/${track.slug}`,
    },
    openGraph: {
      type: 'music.song',
      url: `/music/${track.slug}`,
      siteName: siteConfig.name,
      title: `${track.title} | ${siteConfig.name}`,
      description,
      images: [
        {
          url: track.cover,
          width: 1200,
          height: 1200,
          alt: `${track.title} cover`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${track.title} | ${siteConfig.name}`,
      description,
      images: [track.cover],
    },
  }
}

export default function TrackPage({ params }: TrackPageProps) {
  const track = getTrackBySlug(params.slug)

  if (!track) notFound()

  const lyrics = track.lyrics?.split('\n').filter(Boolean) ?? []
  const credits = Object.entries(track.credits ?? {}).filter(([, value]) => Boolean(value))
  const relatedTracks = tracks.filter((item) => item.id !== track.id).slice(0, 3)

  return (
    <main className="min-h-screen bg-[#0B0B0B] pb-40 md:pb-32">
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#0B0B0B]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/music"
            className="text-white/60 hover:text-white transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            返回音乐库
          </Link>
          <Link href="/journey" className="text-sm text-white/45 hover:text-[#E6B800] transition-colors">
            Journey
          </Link>
        </div>
      </header>

      <section className="relative overflow-hidden pt-24 px-4 sm:px-6 md:px-12 lg:px-24">
        <div className="absolute inset-0 opacity-70">
          <img src={publicPath(track.cover)} alt="" className="h-full w-full object-cover blur-3xl scale-110 opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B]/40 via-[#0B0B0B]/85 to-[#0B0B0B]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl grid gap-10 lg:grid-cols-[0.92fr_1.08fr] items-end min-h-0 md:min-h-[72vh]">
          <div className="max-w-xl">
            <p className="mb-4 text-xs sm:text-sm font-medium uppercase tracking-[0.24em] sm:tracking-[0.3em] text-[#E6B800]">
              Song Page
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-light tracking-normal text-white mb-5 md:mb-6">
              {track.title}
            </h1>
            <p className="text-lg md:text-2xl leading-relaxed text-white/70 mb-7 md:mb-8">
              {track.moodTag}
            </p>
            <div className="flex flex-wrap gap-3 mb-9">
              {track.genre.map((genre) => (
                <span key={genre} className="border border-white/15 px-3 py-1 text-sm text-white/55">
                  {genre}
                </span>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <PlayButton track={track} size="lg" />
              <div className="grid grid-cols-1 min-[390px]:grid-cols-3 gap-px bg-white/10 text-sm min-w-0 sm:min-w-[360px]">
                <div className="bg-[#111] p-4 min-[390px]:p-3 sm:p-4">
                  <Calendar className="w-4 h-4 text-[#E6B800] mb-3" />
                  <p className="text-white/40">发布</p>
                  <strong className="text-white font-normal">{track.releaseDate}</strong>
                </div>
                <div className="bg-[#111] p-4 min-[390px]:p-3 sm:p-4">
                  <Clock3 className="w-4 h-4 text-[#E6B800] mb-3" />
                  <p className="text-white/40">时长</p>
                  <strong className="text-white font-normal">{formatDuration(track.duration)}</strong>
                </div>
                <div className="bg-[#111] p-4 min-[390px]:p-3 sm:p-4">
                  <Disc3 className="w-4 h-4 text-[#E6B800] mb-3" />
                  <p className="text-white/40">作者</p>
                  <strong className="text-white font-normal">{track.artist}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="relative justify-self-start lg:justify-self-end w-full max-w-md">
            <div className="aspect-square overflow-hidden border border-white/10 bg-white/5">
              <img src={publicPath(track.cover)} alt={track.title} className="h-full w-full object-cover" />
            </div>
            <p className="mt-5 text-sm leading-7 text-white/45">{track.note ?? track.excerpt}</p>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 md:px-12 lg:px-24 py-16 md:py-20">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1fr_0.72fr]">
          <div className="space-y-12">
            <article>
              <div className="mb-6 flex items-center gap-3 text-[#E6B800]">
                <PenLine className="w-5 h-5" />
                <h2 className="text-2xl font-light text-white">创作故事</h2>
              </div>
              <div className="grid gap-px bg-white/10 md:grid-cols-3">
                {track.story &&
                  Object.entries(track.story).map(([key, value]) => (
                    <div key={key} className="bg-[#10100f] p-5 sm:p-6 min-h-0 md:min-h-52">
                      <p className="mb-6 text-sm uppercase tracking-[0.2em] text-[#E6B800]/80">
                        {key === 'background' ? 'Background' : key === 'trigger' ? 'Trigger' : 'Expression'}
                      </p>
                      <p className="text-white/60 leading-7">{value}</p>
                    </div>
                  ))}
              </div>
            </article>

            {lyrics.length > 0 && (
              <article>
                <div className="mb-6 flex items-center gap-3 text-[#E6B800]">
                  <Music2 className="w-5 h-5" />
                  <h2 className="text-2xl font-light text-white">歌词片段</h2>
                </div>
                <div className="border-l border-[#E6B800]/50 pl-5 sm:pl-6 py-2">
                  {lyrics.map((line) => (
                    <p key={line} className="text-xl sm:text-2xl md:text-3xl leading-relaxed text-white/80">
                      {line}
                    </p>
                  ))}
                </div>
              </article>
            )}
          </div>

          <aside className="space-y-8">
            <section className="border border-white/10 p-6 bg-white/[0.03]">
              <div className="mb-5 flex items-center gap-3">
                <Radio className="w-5 h-5 text-[#E6B800]" />
                <h2 className="text-xl font-light text-white">制作信息</h2>
              </div>
              <dl className="space-y-4">
                {credits.length > 0 ? (
                  credits.map(([key, value]) => (
                    <div key={key} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                      <dt className="mb-1 text-sm text-white/35">{key}</dt>
                      <dd className="text-white/70">{value}</dd>
                    </div>
                  ))
                ) : (
                  <p className="text-white/45 leading-7">制作信息预留中，后续可补充编曲、混音、母带和 DAW 细节。</p>
                )}
              </dl>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-light text-white">继续听</h2>
              <div className="space-y-3">
                {relatedTracks.map((item) => (
                  <Link
                    key={item.id}
                    href={`/music/${item.slug}`}
                    className="group flex gap-4 border border-white/10 p-3 hover:bg-white/[0.04] transition"
                  >
                    <img src={publicPath(item.cover)} alt={item.title} className="h-16 w-16 object-cover" />
                    <span className="min-w-0">
                      <strong className="block truncate text-white font-normal group-hover:text-[#E6B800] transition-colors">
                        {item.title}
                      </strong>
                      <span className="mt-1 block line-clamp-2 text-sm leading-6 text-white/45">{item.excerpt}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  )
}
