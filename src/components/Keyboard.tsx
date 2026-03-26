import { useState, useCallback } from 'react'
import * as Tone from 'tone'
import './Keyboard.css'

interface KeyboardProps {
  onNoteOn: () => void
}

const whiteKeys = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5']
const blackKeys = [
  { note: 'C#4', position: 1 },
  { note: 'D#4', position: 2 },
  { note: 'F#4', position: 4 },
  { note: 'G#4', position: 5 },
  { note: 'A#4', position: 6 }
]

function Keyboard({ onNoteOn }: KeyboardProps) {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set())

  const synthRef = new Tone.Synth({
    oscillator: {
      type: 'sine'
    },
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.8,
      release: 0.5
    }
  }).toDestination()

  const handleNoteOn = useCallback(async (note: string) => {
    await onNoteOn()
    synthRef.triggerAttack(note)
    setActiveKeys(prev => new Set(prev).add(note))
  }, [onNoteOn, synthRef])

  const handleNoteOff = useCallback((note: string) => {
    synthRef.triggerRelease(note)
    setActiveKeys(prev => {
      const next = new Set(prev)
      next.delete(note)
      return next
    })
  }, [synthRef])

  return (
    <div className="keyboard">
      <div className="keyboard-container">
        {/* White keys */}
        {whiteKeys.map((note, index) => (
          <div
            key={note}
            className={`key white-key ${activeKeys.has(note) ? 'active' : ''}`}
            onMouseDown={() => handleNoteOn(note)}
            onMouseUp={() => handleNoteOff(note)}
            onMouseLeave={() => activeKeys.has(note) && handleNoteOff(note)}
            onTouchStart={(e) => { e.preventDefault(); handleNoteOn(note) }}
            onTouchEnd={(e) => { e.preventDefault(); handleNoteOff(note) }}
          >
            <span className="key-label">{note.replace(/[0-9]/g, '')}</span>
            <span className="key-shortcut">{['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K'][index]}</span>
          </div>
        ))}
        
        {/* Black keys */}
        {blackKeys.map(({ note, position }) => (
          <div
            key={note}
            className={`key black-key ${activeKeys.has(note) ? 'active' : ''}`}
            style={{ left: `calc(${(position) * 14.28}% + ${position * 4}px)` }}
            onMouseDown={() => handleNoteOn(note)}
            onMouseUp={() => handleNoteOff(note)}
            onMouseLeave={() => activeKeys.has(note) && handleNoteOff(note)}
            onTouchStart={(e) => { e.preventDefault(); handleNoteOn(note) }}
            onTouchEnd={(e) => { e.preventDefault(); handleNoteOff(note) }}
          >
            <span className="key-shortcut">{['W', 'E', 'T', 'Y', 'U'][position - 1]}</span>
          </div>
        ))}
      </div>
      
      <div className="keyboard-info">
        <span>🎹 Click or use keyboard (A-L)</span>
      </div>
    </div>
  )
}

export default Keyboard
