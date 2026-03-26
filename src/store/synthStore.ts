import { create } from 'zustand'
import * as Tone from 'tone'

export type PresetCategory = 'crystal' | 'bass' | 'lead' | 'pad' | 'fx' | 'nature' | 'synth'

export interface Preset {
  id: string
  name: string
  category: PresetCategory
  oscillator: {
    type: OscillatorType | 'fatsawtooth' | 'fmsquare' | 'pulse' | 'pwm' | 'noise'
    attack: number
    decay: number
    sustain: number
    release: number
  }
  filter: {
    type: BiquadFilterType
    frequency: number
    Q: number
    rolloff: number
  }
  effects: {
    reverb: number
    delay: number
    distortion: number
  }
}

interface SynthState {
  isPlaying: boolean
  isRecording: boolean
  bpm: number
  volume: number
  activePreset: Preset | null
  presets: Preset[]
  analyser: Tone.Analyser | null
  
  // Actions
  setPlaying: (playing: boolean) => void
  setRecording: (recording: boolean) => void
  setBpm: (bpm: number) => void
  setVolume: (volume: number) => void
  setActivePreset: (preset: Preset) => void
  playNote: (note: string) => void
  stopNote: (note: string) => void
}

// 预设库
const defaultPresets: Preset[] = [
  // Crystal - 水晶音色
  {
    id: 'prism',
    name: 'Prism',
    category: 'crystal',
    oscillator: { type: 'sine', attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.5 },
    filter: { type: 'lowpass', frequency: 2000, Q: 1, rolloff: -12 },
    effects: { reverb: 0.6, delay: 0.3, distortion: 0 }
  },
  {
    id: 'halo',
    name: 'Halo',
    category: 'crystal',
    oscillator: { type: 'triangle', attack: 0.05, decay: 0.3, sustain: 0.7, release: 0.8 },
    filter: { type: 'lowpass', frequency: 3000, Q: 2, rolloff: -12 },
    effects: { reverb: 0.7, delay: 0.4, distortion: 0 }
  },
  {
    id: 'shard',
    name: 'Shard',
    category: 'crystal',
    oscillator: { type: 'square', attack: 0.001, decay: 0.1, sustain: 0.6, release: 0.3 },
    filter: { type: 'bandpass', frequency: 1500, Q: 5, rolloff: -24 },
    effects: { reverb: 0.3, delay: 0.2, distortion: 0.1 }
  },
  {
    id: 'lumen',
    name: 'Lumen',
    category: 'crystal',
    oscillator: { type: 'sine', attack: 0.1, decay: 0.4, sustain: 0.9, release: 1.0 },
    filter: { type: 'lowpass', frequency: 1500, Q: 0.5, rolloff: -12 },
    effects: { reverb: 0.8, delay: 0.5, distortion: 0 }
  },
  {
    id: 'crystal-bell',
    name: 'Crystal Bell',
    category: 'crystal',
    oscillator: { type: 'sine', attack: 0.001, decay: 0.8, sustain: 0, release: 1.5 },
    filter: { type: 'highpass', frequency: 800, Q: 2, rolloff: -12 },
    effects: { reverb: 0.9, delay: 0.6, distortion: 0 }
  },
  {
    id: 'glass',
    name: 'Glass',
    category: 'crystal',
    oscillator: { type: 'triangle', attack: 0.01, decay: 0.5, sustain: 0.3, release: 0.8 },
    filter: { type: 'lowpass', frequency: 4000, Q: 1, rolloff: -12 },
    effects: { reverb: 0.7, delay: 0.4, distortion: 0 }
  },
  {
    id: 'ice',
    name: 'Ice',
    category: 'crystal',
    oscillator: { type: 'square', attack: 0.001, decay: 0.15, sustain: 0.4, release: 0.2 },
    filter: { type: 'highpass', frequency: 1000, Q: 3, rolloff: -24 },
    effects: { reverb: 0.4, delay: 0.2, distortion: 0.05 }
  },
  {
    id: 'prism-drift',
    name: 'Prism Drift',
    category: 'crystal',
    oscillator: { type: 'fatsawtooth', attack: 0.02, decay: 0.3, sustain: 0.7, release: 0.6 },
    filter: { type: 'lowpass', frequency: 2500, Q: 1.5, rolloff: -12 },
    effects: { reverb: 0.65, delay: 0.35, distortion: 0 }
  },

  // Bass - 低音
  {
    id: 'sub',
    name: 'Sub Bass',
    category: 'bass',
    oscillator: { type: 'sine', attack: 0.01, decay: 0.1, sustain: 1, release: 0.1 },
    filter: { type: 'lowpass', frequency: 200, Q: 0.5, rolloff: -12 },
    effects: { reverb: 0.1, delay: 0, distortion: 0.2 }
  },
  {
    id: 'wobble',
    name: 'Wobble',
    category: 'bass',
    oscillator: { type: 'sawtooth', attack: 0.01, decay: 0.2, sustain: 0.8, release: 0.2 },
    filter: { type: 'lowpass', frequency: 400, Q: 5, rolloff: -12 },
    effects: { reverb: 0.2, delay: 0, distortion: 0.15 }
  },
  {
    id: 'rumble',
    name: 'Rumble',
    category: 'bass',
    oscillator: { type: 'triangle', attack: 0.05, decay: 0.3, sustain: 0.9, release: 0.4 },
    filter: { type: 'lowpass', frequency: 300, Q: 2, rolloff: -12 },
    effects: { reverb: 0.3, delay: 0.1, distortion: 0.1 }
  },
  {
    id: 'pillow',
    name: 'Pillow',
    category: 'bass',
    oscillator: { type: 'sine', attack: 0.1, decay: 0.4, sustain: 0.9, release: 0.8 },
    filter: { type: 'lowpass', frequency: 250, Q: 0.5, rolloff: -12 },
    effects: { reverb: 0.5, delay: 0.2, distortion: 0 }
  },
  {
    id: ' Reese',
    name: ' Reese',
    category: 'bass',
    oscillator: { type: 'sawtooth', attack: 0.01, decay: 0.15, sustain: 0.8, release: 0.15 },
    filter: { type: 'lowpass', frequency: 350, Q: 3, rolloff: -24 },
    effects: { reverb: 0.25, delay: 0, distortion: 0.25 }
  },
  {
    id: 'growl',
    name: 'Growl',
    category: 'bass',
    oscillator: { type: 'pulse', attack: 0.01, decay: 0.1, sustain: 0.9, release: 0.1 },
    filter: { type: 'lowpass', frequency: 500, Q: 8, rolloff: -12 },
    effects: { reverb: 0.2, delay: 0, distortion: 0.3 }
  },

  // Lead - 主音
  {
    id: 'saw',
    name: 'Saw Lead',
    category: 'lead',
    oscillator: { type: 'sawtooth', attack: 0.01, decay: 0.1, sustain: 0.7, release: 0.2 },
    filter: { type: 'lowpass', frequency: 3000, Q: 2, rolloff: -12 },
    effects: { reverb: 0.2, delay: 0.2, distortion: 0.1 }
  },
  {
    id: 'pluck',
    name: 'Pluck',
    category: 'lead',
    oscillator: { type: 'fmsquare', attack: 0.001, decay: 0.3, sustain: 0, release: 0.5 },
    filter: { type: 'lowpass', frequency: 2500, Q: 1, rolloff: -24 },
    effects: { reverb: 0.4, delay: 0.3, distortion: 0 }
  },
  {
    id: 'soft-lead',
    name: 'Soft Lead',
    category: 'lead',
    oscillator: { type: 'triangle', attack: 0.05, decay: 0.2, sustain: 0.8, release: 0.3 },
    filter: { type: 'lowpass', frequency: 2000, Q: 1, rolloff: -12 },
    effects: { reverb: 0.3, delay: 0.15, distortion: 0 }
  },
  {
    id: 'aggressive',
    name: 'Aggressive',
    category: 'lead',
    oscillator: { type: 'sawtooth', attack: 0.001, decay: 0.05, sustain: 0.9, release: 0.1 },
    filter: { type: 'lowpass', frequency: 4000, Q: 4, rolloff: -24 },
    effects: { reverb: 0.15, delay: 0.1, distortion: 0.25 }
  },
  {
    id: 'square-lead',
    name: 'Square Lead',
    category: 'lead',
    oscillator: { type: 'square', attack: 0.01, decay: 0.15, sustain: 0.6, release: 0.2 },
    filter: { type: 'lowpass', frequency: 2500, Q: 2, rolloff: -12 },
    effects: { reverb: 0.25, delay: 0.2, distortion: 0.1 }
  },
  {
    id: 'organ',
    name: 'Organ',
    category: 'lead',
    oscillator: { type: 'triangle', attack: 0.01, decay: 0.1, sustain: 0.9, release: 0.1 },
    filter: { type: 'lowpass', frequency: 5000, Q: 0.5, rolloff: -12 },
    effects: { reverb: 0.4, delay: 0, distortion: 0 }
  },
  {
    id: 'synth-brass',
    name: 'Synth Brass',
    category: 'lead',
    oscillator: { type: 'sawtooth', attack: 0.02, decay: 0.2, sustain: 0.7, release: 0.3 },
    filter: { type: 'lowpass', frequency: 2800, Q: 3, rolloff: -12 },
    effects: { reverb: 0.3, delay: 0.1, distortion: 0.1 }
  },
  {
    id: 'acid',
    name: 'Acid',
    category: 'lead',
    oscillator: { type: 'sawtooth', attack: 0.001, decay: 0.1, sustain: 0.8, release: 0.1 },
    filter: { type: 'lowpass', frequency: 800, Q: 6, rolloff: -24 },
    effects: { reverb: 0.2, delay: 0.2, distortion: 0.15 }
  },

  // Pad - 氛围
  {
    id: 'ambient',
    name: 'Ambient Pad',
    category: 'pad',
    oscillator: { type: 'sine', attack: 0.5, decay: 0.3, sustain: 0.9, release: 1.5 },
    filter: { type: 'lowpass', frequency: 1500, Q: 0.5, rolloff: -12 },
    effects: { reverb: 0.9, delay: 0.6, distortion: 0 }
  },
  {
    id: 'drone',
    name: 'Drone',
    category: 'pad',
    oscillator: { type: 'triangle', attack: 0.3, decay: 0.5, sustain: 1, release: 1.0 },
    filter: { type: 'lowpass', frequency: 800, Q: 1, rolloff: -12 },
    effects: { reverb: 0.85, delay: 0.4, distortion: 0 }
  },
  {
    id: 'evolve',
    name: 'Evolve',
    category: 'pad',
    oscillator: { type: 'fatsawtooth', attack: 0.4, decay: 0.4, sustain: 0.9, release: 1.2 },
    filter: { type: 'lowpass', frequency: 2000, Q: 1.5, rolloff: -12 },
    effects: { reverb: 0.8, delay: 0.5, distortion: 0 }
  },
  {
    id: 'strings',
    name: 'Strings',
    category: 'pad',
    oscillator: { type: 'sawtooth', attack: 0.2, decay: 0.3, sustain: 0.8, release: 0.8 },
    filter: { type: 'lowpass', frequency: 3000, Q: 1, rolloff: -12 },
    effects: { reverb: 0.7, delay: 0.3, distortion: 0 }
  },
  {
    id: 'warm-pad',
    name: 'Warm Pad',
    category: 'pad',
    oscillator: { type: 'sine', attack: 0.3, decay: 0.4, sustain: 0.9, release: 1.0 },
    filter: { type: 'lowpass', frequency: 1800, Q: 0.5, rolloff: -12 },
    effects: { reverb: 0.75, delay: 0.4, distortion: 0 }
  },
  {
    id: 'dreamy',
    name: 'Dreamy',
    category: 'pad',
    oscillator: { type: 'triangle', attack: 0.4, decay: 0.5, sustain: 0.85, release: 1.3 },
    filter: { type: 'lowpass', frequency: 2200, Q: 2, rolloff: -12 },
    effects: { reverb: 0.85, delay: 0.55, distortion: 0 }
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    category: 'pad',
    oscillator: { type: 'sawtooth', attack: 0.5, decay: 0.5, sustain: 0.9, release: 1.5 },
    filter: { type: 'lowpass', frequency: 2500, Q: 1, rolloff: -12 },
    effects: { reverb: 0.9, delay: 0.5, distortion: 0.05 }
  },
  {
    id: 'angelic',
    name: 'Angelic',
    category: 'pad',
    oscillator: { type: 'sine', attack: 0.6, decay: 0.4, sustain: 0.95, release: 1.8 },
    filter: { type: 'lowpass', frequency: 3000, Q: 0.5, rolloff: -12 },
    effects: { reverb: 0.95, delay: 0.6, distortion: 0 }
  },

  // FX - 特效
  {
    id: 'impact',
    name: 'Impact',
    category: 'fx',
    oscillator: { type: 'sawtooth', attack: 0.001, decay: 0.5, sustain: 0, release: 0.3 },
    filter: { type: 'lowpass', frequency: 5000, Q: 2, rolloff: -24 },
    effects: { reverb: 0.5, delay: 0.3, distortion: 0.3 }
  },
  {
    id: 'whoosh',
    name: 'Whoosh',
    category: 'fx',
    oscillator: { type: 'noise', attack: 0.3, decay: 0.5, sustain: 0.2, release: 0.5 },
    filter: { type: 'bandpass', frequency: 2000, Q: 3, rolloff: -12 },
    effects: { reverb: 0.7, delay: 0.4, distortion: 0 }
  },
  {
    id: 'riser',
    name: 'Riser',
    category: 'fx',
    oscillator: { type: 'sawtooth', attack: 0.5, decay: 0.5, sustain: 0.8, release: 0.5 },
    filter: { type: 'highpass', frequency: 500, Q: 1, rolloff: -12 },
    effects: { reverb: 0.4, delay: 0.3, distortion: 0.15 }
  },
  {
    id: 'texture',
    name: 'Texture',
    category: 'fx',
    oscillator: { type: 'fmsquare', attack: 0.2, decay: 0.6, sustain: 0.5, release: 0.8 },
    filter: { type: 'bandpass', frequency: 1500, Q: 4, rolloff: -12 },
    effects: { reverb: 0.8, delay: 0.5, distortion: 0.1 }
  },
  {
    id: 'sweep',
    name: 'Sweep',
    category: 'fx',
    oscillator: { type: 'sawtooth', attack: 0.1, decay: 0.4, sustain: 0.6, release: 0.5 },
    filter: { type: 'lowpass', frequency: 4000, Q: 8, rolloff: -24 },
    effects: { reverb: 0.5, delay: 0.3, distortion: 0.1 }
  },
  {
    id: 'dark-fx',
    name: 'Dark FX',
    category: 'fx',
    oscillator: { type: 'square', attack: 0.05, decay: 0.3, sustain: 0.7, release: 0.4 },
    filter: { type: 'lowpass', frequency: 1200, Q: 5, rolloff: -24 },
    effects: { reverb: 0.6, delay: 0.4, distortion: 0.2 }
  },
  {
    id: 'glitch',
    name: 'Glitch',
    category: 'fx',
    oscillator: { type: 'square', attack: 0.001, decay: 0.1, sustain: 0.5, release: 0.05 },
    filter: { type: 'bandpass', frequency: 3000, Q: 6, rolloff: -24 },
    effects: { reverb: 0.3, delay: 0.2, distortion: 0.25 }
  },
  {
    id: 'zap',
    name: 'Zap',
    category: 'fx',
    oscillator: { type: 'sine', attack: 0.001, decay: 0.15, sustain: 0, release: 0.1 },
    filter: { type: 'highpass', frequency: 800, Q: 2, rolloff: -24 },
    effects: { reverb: 0.4, delay: 0.3, distortion: 0.1 }
  },
  {
    id: 'crash',
    name: 'Crash',
    category: 'fx',
    oscillator: { type: 'noise', attack: 0.001, decay: 1.0, sustain: 0, release: 0.5 },
    filter: { type: 'lowpass', frequency: 6000, Q: 1, rolloff: -12 },
    effects: { reverb: 0.8, delay: 0.4, distortion: 0.15 }
  },
  {
    id: 'laser',
    name: 'Laser',
    category: 'fx',
    oscillator: { type: 'sawtooth', attack: 0.001, decay: 0.2, sustain: 0.3, release: 0.1 },
    filter: { type: 'highpass', frequency: 1000, Q: 4, rolloff: -24 },
    effects: { reverb: 0.3, delay: 0.4, distortion: 0.2 }
  },

  // Nature - 自然
  {
    id: 'rain',
    name: 'Rain',
    category: 'nature',
    oscillator: { type: 'noise', attack: 0.5, decay: 0.5, sustain: 0.8, release: 0.5 },
    filter: { type: 'bandpass', frequency: 3000, Q: 0.5, rolloff: -12 },
    effects: { reverb: 0.9, delay: 0.3, distortion: 0 }
  },
  {
    id: 'wind',
    name: 'Wind',
    category: 'nature',
    oscillator: { type: 'noise', attack: 0.8, decay: 0.4, sustain: 0.7, release: 0.8 },
    filter: { type: 'bandpass', frequency: 800, Q: 1, rolloff: -12 },
    effects: { reverb: 0.85, delay: 0.4, distortion: 0 }
  },
  {
    id: 'ocean',
    name: 'Ocean',
    category: 'nature',
    oscillator: { type: 'sine', attack: 0.6, decay: 0.4, sustain: 0.9, release: 1.0 },
    filter: { type: 'lowpass', frequency: 600, Q: 0.5, rolloff: -12 },
    effects: { reverb: 0.9, delay: 0.5, distortion: 0 }
  },
  {
    id: 'fire',
    name: 'Fire',
    category: 'nature',
    oscillator: { type: 'noise', attack: 0.1, decay: 0.3, sustain: 0.6, release: 0.4 },
    filter: { type: 'bandpass', frequency: 1500, Q: 3, rolloff: -12 },
    effects: { reverb: 0.6, delay: 0.2, distortion: 0.2 }
  },
  {
    id: 'forest',
    name: 'Forest',
    category: 'nature',
    oscillator: { type: 'triangle', attack: 0.3, decay: 0.5, sustain: 0.7, release: 0.8 },
    filter: { type: 'bandpass', frequency: 2000, Q: 1, rolloff: -12 },
    effects: { reverb: 0.8, delay: 0.4, distortion: 0 }
  },
  {
    id: 'thunder',
    name: 'Thunder',
    category: 'nature',
    oscillator: { type: 'noise', attack: 0.05, decay: 1.0, sustain: 0.3, release: 1.5 },
    filter: { type: 'lowpass', frequency: 400, Q: 1, rolloff: -12 },
    effects: { reverb: 0.9, delay: 0.5, distortion: 0.1 }
  },

  // Synth - 电子
  {
    id: 'retro',
    name: 'Retro Synth',
    category: 'synth',
    oscillator: { type: 'square', attack: 0.01, decay: 0.2, sustain: 0.6, release: 0.2 },
    filter: { type: 'lowpass', frequency: 2500, Q: 2, rolloff: -12 },
    effects: { reverb: 0.3, delay: 0.2, distortion: 0.1 }
  },
  {
    id: 'modern',
    name: 'Modern',
    category: 'synth',
    oscillator: { type: 'sawtooth', attack: 0.02, decay: 0.15, sustain: 0.8, release: 0.25 },
    filter: { type: 'lowpass', frequency: 3500, Q: 3, rolloff: -24 },
    effects: { reverb: 0.4, delay: 0.3, distortion: 0.15 }
  },
  {
    id: 'fm-synth',
    name: 'FM Synth',
    category: 'synth',
    oscillator: { type: 'fmsquare', attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.4 },
    filter: { type: 'lowpass', frequency: 3000, Q: 2, rolloff: -12 },
    effects: { reverb: 0.5, delay: 0.35, distortion: 0.1 }
  },
  {
    id: 'wavetable',
    name: 'Wavetable',
    category: 'synth',
    oscillator: { type: 'fatsawtooth', attack: 0.03, decay: 0.2, sustain: 0.75, release: 0.35 },
    filter: { type: 'lowpass', frequency: 2800, Q: 2.5, rolloff: -12 },
    effects: { reverb: 0.45, delay: 0.3, distortion: 0.1 }
  },
  {
    id: 'chirp',
    name: 'Chirp',
    category: 'synth',
    oscillator: { type: 'sine', attack: 0.001, decay: 0.2, sustain: 0, release: 0.3 },
    filter: { type: 'bandpass', frequency: 2000, Q: 5, rolloff: -12 },
    effects: { reverb: 0.35, delay: 0.25, distortion: 0 }
  },
  {
    id: 'blip',
    name: 'Blip',
    category: 'synth',
    oscillator: { type: 'square', attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 },
    filter: { type: 'highpass', frequency: 500, Q: 2, rolloff: -12 },
    effects: { reverb: 0.2, delay: 0.15, distortion: 0 }
  },
  {
    id: 'sweep-synth',
    name: 'Sweep Synth',
    category: 'synth',
    oscillator: { type: 'sawtooth', attack: 0.1, decay: 0.4, sustain: 0.7, release: 0.5 },
    filter: { type: 'lowpass', frequency: 4500, Q: 6, rolloff: -24 },
    effects: { reverb: 0.4, delay: 0.25, distortion: 0.1 }
  },
  {
    id: 'digital',
    name: 'Digital',
    category: 'synth',
    oscillator: { type: 'pulse', attack: 0.01, decay: 0.15, sustain: 0.8, release: 0.15 },
    filter: { type: 'lowpass', frequency: 4000, Q: 2, rolloff: -12 },
    effects: { reverb: 0.3, delay: 0.2, distortion: 0.2 }
  }
]

export const useSynthStore = create<SynthState>((set) => ({
  isPlaying: false,
  isRecording: false,
  bpm: 120,
  volume: -6,
  activePreset: defaultPresets[0],
  presets: defaultPresets,
  analyser: null,

  setPlaying: (playing) => set({ isPlaying: playing }),
  setRecording: (recording) => set({ isRecording: recording }),
  setBpm: (bpm) => {
    Tone.getTransport().bpm.value = bpm
    set({ bpm })
  },
  setVolume: (volume) => {
    Tone.getDestination().volume.value = volume
    set({ volume })
  },
  setActivePreset: (preset) => set({ activePreset: preset }),
  
  playNote: (note) => {
    console.log('Play note:', note)
  },
  
  stopNote: (note) => {
    console.log('Stop note:', note)
  }
}))
