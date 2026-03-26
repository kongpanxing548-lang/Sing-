import { useEffect, useState, useCallback } from 'react'
import * as Tone from 'tone'
import { useSynthStore } from './store/synthStore'
import PresetPanel from './components/PresetPanel'
import EffectsPanel from './components/EffectsPanel'
import Arpeggiator from './components/Arpeggiator'
import Recorder from './components/Recorder'
import Keyboard from './components/Keyboard'
import Visualizer from './components/AudioVisualizer'
import Controls from './components/Controls'
import './components/PresetPanel.css'
import './components/AudioVisualizer.css'
import './components/Arpeggiator.css'
import './components/Recorder.css'
import './components/EffectsPanel.css'
import './components/Keyboard.css'
import './components/Visualizer.css'
import './components/Controls.css'
import './App.css'

function App() {
  const [isStarted, setIsStarted] = useState(false)
  const { setPlaying, volume, bpm, playNote, stopNote } = useSynthStore()
  
  // 初始化 Tone.js
  const initAudio = useCallback(async () => {
    if (isStarted) return
    
    await Tone.start()
    Tone.getDestination().volume.value = volume
    Tone.getTransport().bpm.value = bpm
    setIsStarted(true)
    setPlaying(true)
    console.log('Audio initialized')
  }, [isStarted, volume, bpm, setPlaying])

  // 键盘事件
  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.repeat) return
      
      await initAudio()
      
      const keyMap: Record<string, string> = {
        'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4',
        'd': 'E4', 'f': 'F4', 't': 'F#4', 'g': 'G4',
        'y': 'G#4', 'h': 'A4', 'u': 'A#4', 'j': 'B4',
        'k': 'C5', 'o': 'C#5', 'l': 'D5', 'p': 'D#5',
        ';': 'E5'
      }
      
      const note = keyMap[e.key.toLowerCase()]
      if (note) {
        playNote(note)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyMap: Record<string, string> = {
        'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4',
        'd': 'E4', 'f': 'F4', 't': 'F#4', 'g': 'G4',
        'y': 'G#4', 'h': 'A4', 'u': 'A#4', 'j': 'B4',
        'k': 'C5', 'o': 'C#5', 'l': 'D5', 'p': 'D#5',
        ';': 'E5'
      }
      
      const note = keyMap[e.key.toLowerCase()]
      if (note) {
        stopNote(note)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [initAudio, playNote, stopNote])

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">NovaSynth</span>
        </div>
        <div className="header-info">
          <span className="version">v1.0</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Visualizer */}
        <Visualizer />

        {/* Controls */}
        <Controls />

        {/* Preset Panel */}
        <PresetPanel />

        {/* Effects Panel */}
        <EffectsPanel />

        {/* Arpeggiator */}
        <Arpeggiator />

        {/* Recorder */}
        <Recorder />

        {/* Keyboard */}
        <Keyboard onNoteOn={initAudio} />
      </main>

      {/* Footer */}
      <footer className="footer">
        <span>Click keys or use keyboard (A-L) to play</span>
        <span>◈ NovaSynth - Web Audio Synthesizer</span>
      </footer>
    </div>
  )
}

export default App
