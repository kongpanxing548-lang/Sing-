'use client'

import { useEffect, useRef, useState } from 'react'
import { usePlayerStore } from '@/store/player'
import { Play, Pause, Volume2 } from 'lucide-react'

export function GlobalPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    setWavesurfer, 
    togglePlay, 
    setDuration, 
    setCurrentTime 
  } = usePlayerStore()
  
  const containerRef = useRef<HTMLDivElement>(null)
  const wavesurferRef = useRef<any>(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current || !currentTrack) return
    
    setIsReady(false)
    setError(null)

    const initWavesurfer = async () => {
      try {
        const WaveSurfer = (await import('wavesurfer.js')).default
        
        // 清理之前的实例
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy()
        }
        
        wavesurferRef.current = WaveSurfer.create({
          container: containerRef.current!,
          waveColor: 'rgba(230, 184, 0, 0.4)',
          progressColor: '#E6B800',
          cursorColor: '#FFFFFF',
          barWidth: 2,
          barGap: 1,
          height: 40,
          normalize: true,
          responsive: true,
        })

        setWavesurfer(wavesurferRef.current)

        wavesurferRef.current.on('ready', () => {
          setDuration(wavesurferRef.current.getDuration())
          setIsReady(true)
          if (isPlaying) {
            wavesurferRef.current.play()
          }
        })

        wavesurferRef.current.on('audioprocess', () => {
          setCurrentTime(wavesurferRef.current.getCurrentTime())
        })

        wavesurferRef.current.on('finish', () => {
          // 可以在这里添加播放完成的逻辑，比如自动播放下一首
        })

        wavesurferRef.current.on('error', (err: any) => {
          console.error('Wavesurfer error:', err)
          setError('音频加载失败')
        })

        // 加载音频
        await wavesurferRef.current.load(currentTrack.audioUrl)
      } catch (err) {
        console.error('Failed to init wavesurfer:', err)
        setError('播放器初始化失败')
      }
    }

    initWavesurfer()

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy()
      }
    }
  }, [currentTrack, setWavesurfer, setDuration, setCurrentTime])

  // 处理播放/暂停切换
  useEffect(() => {
    if (wavesurferRef.current && isReady) {
      if (isPlaying) {
        wavesurferRef.current.play()
      } else {
        wavesurferRef.current.pause()
      }
    }
  }, [isPlaying, isReady])

  if (!currentTrack) return null

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#0B0B0B]/95 backdrop-blur-md border-t border-[#E6B800]/20 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* 封面 */}
          <div className="relative w-14 h-14 rounded overflow-hidden flex-shrink-0">
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className="w-1 bg-[#E6B800] animate-pulse"
                      style={{ 
                        height: `${Math.random() * 16 + 8}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 歌曲信息 */}
          <div className="flex-shrink-0 w-32 md:w-48">
            <div className="text-sm font-medium text-white truncate">
              {currentTrack.title}
            </div>
            <div className="text-xs text-white/50 truncate">
              {currentTrack.artist}
            </div>
          </div>

          {/* 播放按钮 */}
          <button
            onClick={togglePlay}
            disabled={!isReady}
            className="w-10 h-10 rounded-full bg-[#E6B800] text-[#0B0B0B] flex items-center justify-center hover:bg-[#E6B800]/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" fill="currentColor" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
            )}
          </button>

          {/* 波形可视化 */}
          <div className="flex-1 min-w-0">
            <div ref={containerRef} className="w-full" />
            {error && (
              <div className="text-xs text-red-400 text-center">{error}</div>
            )}
          </div>

          {/* 音量图标 */}
          <Volume2 className="w-5 h-5 text-white/40 flex-shrink-0" />
        </div>
      </div>
    </div>
  )
}
