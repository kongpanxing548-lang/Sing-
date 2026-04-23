'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { Pause, Play, Route } from 'lucide-react'
import { journeyChapters } from '@/content/journey'
import { tracks } from '@/content/tracks'
import { usePlayerStore } from '@/store/player'

const palette = {
  city: { accent: '#3AA7A3', glow: 'rgba(58, 167, 163, 0.18)', rail: 'rgba(58, 167, 163, 0.35)' },
  resist: { accent: '#E6B800', glow: 'rgba(230, 184, 0, 0.16)', rail: 'rgba(230, 184, 0, 0.35)' },
  midnight: { accent: '#7D8CFF', glow: 'rgba(125, 140, 255, 0.16)', rail: 'rgba(125, 140, 255, 0.35)' },
  self: { accent: '#B75275', glow: 'rgba(183, 82, 117, 0.18)', rail: 'rgba(183, 82, 117, 0.35)' },
  forward: { accent: '#F3F1E7', glow: 'rgba(243, 241, 231, 0.14)', rail: 'rgba(243, 241, 231, 0.35)' },
}

export function JourneyExperience() {
  const [activeIndex, setActiveIndex] = useState(0)
  const beatRefs = useRef<Array<HTMLElement | null>>([])
  const activeIndexRef = useRef(0)
  const { currentTrack, isPlaying, setTrack } = usePlayerStore()
  const activeChapter = journeyChapters[activeIndex]
  const activeTrack = tracks.find((track) => track.id === activeChapter.trackId) ?? tracks[0]
  const activePalette = palette[activeChapter.palette ?? 'city']

  useEffect(() => {
    activeIndexRef.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    const activate = (index: number, syncTrack: boolean) => {
      const chapter = journeyChapters[index]
      if (!chapter) return

      if (activeIndexRef.current !== index) {
        activeIndexRef.current = index
        setActiveIndex(index)
      }

      const track = tracks.find((item) => item.id === chapter.trackId)
      if (syncTrack && track && currentTrack?.id !== track.id) {
        setTrack(track, isPlaying)
      }
    }

    let ticking = false
    const updateFromScroll = () => {
      ticking = false
      const center = window.innerHeight * 0.48
      let bestIndex = 0
      let bestDistance = Number.POSITIVE_INFINITY

      beatRefs.current.forEach((beat, index) => {
        if (!beat) return
        const rect = beat.getBoundingClientRect()
        const beatCenter = rect.top + rect.height / 2
        const distance = Math.abs(beatCenter - center)
        if (distance < bestDistance) {
          bestDistance = distance
          bestIndex = index
        }
      })

      activate(bestIndex, true)
    }

    const queueUpdate = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(updateFromScroll)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (!visible) return
        activate(Number((visible.target as HTMLElement).dataset.journeyIndex), true)
      },
      { rootMargin: '-24% 0px -38% 0px', threshold: [0.2, 0.45, 0.68] },
    )

    beatRefs.current.forEach((beat) => {
      if (beat) observer.observe(beat)
    })

    activate(0, false)
    queueUpdate()
    window.addEventListener('scroll', queueUpdate, { passive: true })
    window.addEventListener('resize', queueUpdate)

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', queueUpdate)
      window.removeEventListener('resize', queueUpdate)
    }
  }, [currentTrack?.id, isPlaying, setTrack])

  const playChapter = (index: number) => {
    const chapter = journeyChapters[index]
    const track = tracks.find((item) => item.id === chapter?.trackId)
    if (!track) return
    setActiveIndex(index)
    activeIndexRef.current = index
    setTrack(track, true)
    beatRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const jumpTo = (index: number) => {
    beatRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#0B0B0B] px-4 sm:px-6 pb-40 pt-24 md:px-12 md:pb-28 md:pt-28 lg:px-24"
      style={
        {
          '--journey-accent': activePalette.accent,
          '--journey-glow': activePalette.glow,
          '--journey-rail': activePalette.rail,
        } as CSSProperties
      }
    >
      <div className="pointer-events-none absolute inset-0 opacity-80">
        <div className="absolute inset-x-0 top-0 h-px bg-[var(--journey-accent)]/40" />
        <div className="absolute left-[12%] top-0 h-full w-px bg-gradient-to-b from-transparent via-[var(--journey-rail)] to-transparent" />
        <div className="absolute right-[18%] top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_22%,var(--journey-glow),transparent_34rem)]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="lg:sticky lg:top-28 lg:h-[calc(100vh-7rem)]">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--journey-accent)]/50 text-[var(--journey-accent)]">
                <Route className="h-5 w-5" />
              </div>
              <p className="mb-3 text-xs sm:text-sm font-medium uppercase tracking-[0.24em] sm:tracking-[0.3em] text-[var(--journey-accent)]">
                Walking Journey
              </p>
              <h1 className="mb-5 md:mb-6 text-4xl sm:text-5xl font-light tracking-normal text-white md:text-7xl">
                行走
              </h1>
              <p className="max-w-md text-base sm:text-lg leading-relaxed text-white/55">
                滚动章节会同步当前曲目；如果你已经在播放，声音会跟着叙事继续往前走。
              </p>
            </div>

            <div className="mt-10">
              <div className="mb-5 border-l border-[var(--journey-accent)]/50 pl-4">
                <p className="mb-2 text-sm text-[var(--journey-accent)]">{activeChapter.eyebrow}</p>
                <strong className="block text-2xl font-light text-white">{activeTrack.title}</strong>
                <p className="mt-2 text-sm leading-relaxed text-white/45">{activeTrack.moodTag}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {journeyChapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    type="button"
                    onClick={() => jumpTo(index)}
                    aria-label={`跳到 ${chapter.eyebrow}`}
                    className={`h-2.5 rounded-full transition-all ${
                      activeIndex === index
                        ? 'w-10 bg-[var(--journey-accent)]'
                        : 'w-2.5 bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-10 lg:space-y-16">
          {journeyChapters.map((chapter, index) => {
            const track = tracks.find((item) => item.id === chapter.trackId) ?? tracks[0]
            const isActive = activeIndex === index
            const isCurrent = currentTrack?.id === track.id

            return (
              <article
                key={chapter.id}
                ref={(node) => {
                  beatRefs.current[index] = node
                }}
                data-journey-index={index}
                className={`relative min-h-0 md:min-h-[58vh] border-l px-5 py-8 transition-all duration-500 sm:px-6 md:px-10 md:py-10 ${
                  isActive
                    ? 'border-[var(--journey-accent)] bg-white/[0.055]'
                    : 'border-white/10 bg-white/[0.025]'
                }`}
              >
                <div className="absolute -left-[5px] top-12 h-2.5 w-2.5 rounded-full bg-[var(--journey-accent)] shadow-[0_0_24px_var(--journey-accent)]" />
                <small className="mb-6 md:mb-8 block text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[var(--journey-accent)]">
                  {chapter.eyebrow}
                </small>
                <h2 className="mb-5 md:mb-6 max-w-2xl text-3xl sm:text-4xl font-light tracking-normal text-white md:text-6xl">
                  {chapter.title}
                </h2>
                {chapter.quote && (
                  <blockquote className="mb-7 md:mb-8 max-w-2xl text-xl sm:text-2xl leading-snug text-white/80 md:text-3xl">
                    “{chapter.quote}”
                  </blockquote>
                )}
                <div className="max-w-2xl space-y-4 text-base leading-8 text-white/55">
                  {chapter.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-white/35">同步曲目</p>
                    <Link
                      href={`/music/${track.slug}`}
                      className="mt-1 inline-flex text-lg text-white hover:text-[var(--journey-accent)] transition-colors"
                    >
                      {track.title}
                    </Link>
                  </div>
                  <button
                    type="button"
                    onClick={() => playChapter(index)}
                    className="inline-flex h-12 items-center justify-center gap-3 border border-[var(--journey-accent)]/60 px-5 text-sm font-medium text-[var(--journey-accent)] transition hover:bg-[var(--journey-accent)] hover:text-[#0B0B0B]"
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="h-4 w-4" fill="currentColor" />
                    ) : (
                      <Play className="h-4 w-4" fill="currentColor" />
                    )}
                    播放这一段
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
