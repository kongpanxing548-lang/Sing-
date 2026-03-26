import { useState, useCallback } from 'react'
import * as Tone from 'tone'
import './TouchKeyboard.css'

interface TouchKeyboardProps {
  onNoteOn: () => void
}

const whiteKeys = [
  { note: 'C4', shortcut: 'A' },
  { note: 'D4', shortcut: 'S' },
  { note: 'E4', shortcut: 'D' },
  { note: 'F4', shortcut: 'F' },
  { note: 'G4', shortcut: 'G' },
  { note: 'A4', shortcut: 'H' },
  { note: 'B4', shortcut: 'J' },
  { note: 'C5', shortcut: 'K' }
]

const blackKeys = [
  { note: 'C#4', shortcut: 'W' },
  { note: 'D#4', shortcut: 'E' },
  { note: 'F#4', shortcut: 'T' },
  { note: 'G#4', shortcut: 'Y' },
  { note: 'A#4', shortcut: 'U' }
]

function TouchKeyboard({ onNoteOn }: TouchKeyboardProps) {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set())

  const synthRef = new Tone.Synth({
    oscillator: { type: 'sine' },
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

  // 计算黑键位置
  const getBlackKeyPosition = (index: number) => {
    const positions = [0, 1, 3, 4, 5] // 白键索引
    return positions[index] * (100 / 7) + 6.5
  }

  return (
    <div className="touch-keyboard">
      <div className="touch-keyboard-header">
        <span>🎹 Touch Keyboard</span>
        <span className="touch-hint">Touch to play</span>
      </div>
      
      <div className="touch-keys-container">
        {/* 白键 */}
        <div className="touch-white-keys">
          {whiteKeys.map(({ note }) => (
            <div
              key={note}
              className={`touch-key white-key ${activeKeys.has(note) ? 'active' : ''}`}
              onPointerDown={(e) => {
                e.preventDefault()
                handleNoteOn(note)
              }}
              onPointerUp={(e) => {
                e.preventDefault()
                handleNoteOff(note)
              }}
              onPointerLeave={() => activeKeys.has(note) && handleNoteOff(note)}
              onPointerCancel={() => handleNoteOff(note)}
            >
              <span className="key-label">{note.replace(/[0-9]/g, '')}</span>
            </div>
          ))}
        </div>
        
        {/* 黑键 */}
        <div className="touch-black-keys">
          {blackKeys.map(({ note, shortcut: sc }, index) => (
            <div
              key={note}
              className={`touch-key black-key ${activeKeys.has(note) ? 'active' : ''}`}
              style={{ left: `${getBlackKeyPosition(index)}%` }}
              onPointerDown={(e) => {
                e.preventDefault()
                handleNoteOn(note)
              }}
              onPointerUp={(e) => {
                e.preventDefault()
                handleNoteOff(note)
              }}
              onPointerLeave={() => activeKeys.has(note) && handleNoteOff(note)}
              onPointerCancel={() => handleNoteOff(note)}
            >
              <span className="key-shortcut">{sc}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="touch-keyboard-footer">
        <span>1.5 octave</span>
        <span>Support multi-touch</span>
      </div>
    </div>
  )
}

export default TouchKeyboard
