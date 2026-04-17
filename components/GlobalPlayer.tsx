'use client'

import { useEffect, useRef } from 'react'
import { usePlayerStore } from '@/store/player'

export function GlobalPlayer() {
  const { currentTrack, isPlaying, setWavesurfer, togglePlay, setDuration, setCurrentTime } = usePlayerStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<any>(null)

  useEffect(() => {
    if (!containerRef.current || !currentTrack) return

    const initWavesurfer = async () => {
      const WaveSurfer = (await import('wavesurfer.js')).default
      
      wavesurferRef.current = WaveSurfer.create({
        container: containerRef.current!,
        waveColor: '#E6B800',
        progressColor: '#FFFFFF',
        cursorColor: '#E6B800',
        barWidth: 2,
        barGap: 1,
        height: 60,
        normalize: true,
      })

      wavesurferRef.current.load(currentTrack.audioUrl)
      setWavesurfer(wavesurferRef.current)

      wavesurferRef.current.on('ready', () => {
        setDuration(wavesurferRef.current.getDuration())
      })

      wavesurferRef.current.on('audioprocess', () => {
        setCurrentTime(wavesurferRef.current.getCurrentTime())
      })
    }

    initWavesurfer()

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy()
      }
    }
  }, [currentTrack])

  if (!currentTrack) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0B0B0B]/95 backdrop-blur-sm border-t border-[#E6B800]/20 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <img src={currentTrack.cover} alt={currentTrack.title} className="w-12 h-12 rounded object-cover" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{currentTrack.title}</div>
          <div className="text-xs text-white/60 truncate">{currentTrack.artist}</div>
          <div ref={containerRef} className="mt-2" />
        </div>
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[#E6B800] text-[#0B0B0B] flex items-center justify-center hover:bg-[#E6B800]/90 transition"
        >
          {isPlaying ? '❚❚' : '▶'}
        </button>
      </div>
    </div>
  )
}
