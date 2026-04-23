'use client'

import { create } from 'zustand'

interface Track {
  id: string
  title: string
  artist: string
  cover: string
  audioUrl: string
  duration?: number
}

interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  wavesurfer: any
  duration: number
  currentTime: number
  setTrack: (track: Track, play?: boolean) => void
  setWavesurfer: (ws: any) => void
  togglePlay: () => void
  setDuration: (duration: number) => void
  setCurrentTime: (time: number) => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  wavesurfer: null,
  duration: 0,
  currentTime: 0,
  setTrack: (track, play = false) => set({ currentTrack: track, isPlaying: play, currentTime: 0 }),
  setWavesurfer: (ws) => set({ wavesurfer: ws }),
  togglePlay: () => {
    const { wavesurfer, isPlaying } = get()
    if (wavesurfer) {
      if (isPlaying) {
        wavesurfer.pause()
      } else {
        wavesurfer.play()
      }
      set({ isPlaying: !isPlaying })
    }
  },
  setDuration: (duration) => set({ duration }),
  setCurrentTime: (time) => set({ currentTime: time }),
}))
