'use client'

import { useEffect, useRef } from 'react'
import { usePlayerStore } from '@/store/player'
import { Play, Pause } from 'lucide-react'

interface PlayButtonProps {
  track: {
    id: string
    title: string
    artist: string
    cover: string
    audioUrl: string
    duration?: number
  }
  size?: 'sm' | 'md' | 'lg'
}

export function PlayButton({ track, size = 'md' }: PlayButtonProps) {
  const { currentTrack, isPlaying, setTrack, togglePlay } = usePlayerStore()
  const isCurrentTrack = currentTrack?.id === track.id
  
  const handleClick = () => {
    if (isCurrentTrack) {
      togglePlay()
    } else {
      setTrack(track, true)
    }
  }
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }
  
  return (
    <button
      onClick={handleClick}
      className={`${sizeClasses[size]} rounded-full bg-[#E6B800] text-[#0B0B0B] flex items-center justify-center hover:bg-[#E6B800]/90 transition-all duration-300 hover:scale-105`}
    >
      {isCurrentTrack && isPlaying ? (
        <Pause className={iconSizes[size]} fill="currentColor" />
      ) : (
        <Play className={iconSizes[size]} fill="currentColor" />
      )}
    </button>
  )
}
