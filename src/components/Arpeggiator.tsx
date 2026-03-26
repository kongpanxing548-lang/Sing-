import { useState, useEffect, useCallback, useRef } from 'react'
import * as Tone from 'tone'
import './Arpeggiator.css'

interface ArpeggiatorProps {
  className?: string
}

const SCALES: Record<string, string[]> = {
  chromatic: ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'],
  major: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
  minor: ['C4', 'D4', 'D#4', 'F4', 'G4', 'G#4', 'A#4', 'C5'],
  pentatonic: ['C4', 'D4', 'E4', 'G4', 'A4', 'C5'],
  dorian: ['C4', 'D4', 'D#4', 'E4', 'F4', 'G4', 'A4', 'A#4', 'C5']
}

const ARP_PATTERNS: Record<string, number[] | string> = {
  up: [0, 1, 2, 3, 2, 1],
  down: [3, 2, 1, 0, 1, 2],
  'up-down': [0, 1, 2, 3, 4, 5, 4, 3, 2, 1],
  'down-up': [5, 4, 3, 2, 1, 0, 1, 2, 3, 4],
  random: 'random',
  zigzag: [0, 3, 1, 4, 2, 5, 2, 4, 1, 3]
}

function Arpeggiator({ className = '' }: ArpeggiatorProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [bpm, setBpm] = useState(120)
  const [pattern, setPattern] = useState<string>('up')
  const [scale, setScale] = useState<string>('major')
  const [rootNote, setRootNote] = useState('C')
  const [gate, setGate] = useState(0.7)
  
  const synthRef = useRef<Tone.Synth | null>(null)
  const sequenceRef = useRef<Tone.Sequence | null>(null)

  useEffect(() => {
    synthRef.current = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.01,
        decay: 0.2,
        sustain: 0.5,
        release: 0.3
      }
    }).toDestination()

    return () => {
      if (sequenceRef.current) {
        sequenceRef.current.dispose()
      }
      if (synthRef.current) {
        synthRef.current.dispose()
      }
    }
  }, [])

  const getNoteFromScale = useCallback((index: number, scaleNotes: string[], root: string) => {
    const rootIndex = scaleNotes.findIndex(n => n.startsWith(root))
    const octaveOffset = Math.floor(index / scaleNotes.length)
    const noteIndex = (rootIndex + (index % scaleNotes.length) + scaleNotes.length) % scaleNotes.length
    const note = scaleNotes[noteIndex]
    const noteOctave = parseInt(note.slice(-1)) + octaveOffset
    return note.slice(0, -1) + noteOctave
  }, [])

  const toggleArpeggiator = useCallback(async () => {
    if (isPlaying) {
      Tone.getTransport().stop()
      if (sequenceRef.current) {
        sequenceRef.current.stop()
      }
      setIsPlaying(false)
    } else {
      await Tone.start()
      
      Tone.getTransport().bpm.value = bpm
      Tone.getTransport().start()
      
      const scaleNotes = SCALES[scale]
      const notes: (string | string[])[] = []
      
      if (pattern === 'random') {
        // 随机模式 - 生成随机音符序列
        for (let i = 0; i < 16; i++) {
          const randomIndex = Math.floor(Math.random() * scaleNotes.length)
          notes.push(getNoteFromScale(randomIndex, scaleNotes, rootNote))
        }
      } else {
        const patternIndices = ARP_PATTERNS[pattern] as number[]
        for (let i = 0; i < 16; i++) {
          const patternIndex = patternIndices[i % patternIndices.length]
          const note = getNoteFromScale(patternIndex + (Math.floor(i / 6) * 4), scaleNotes, rootNote)
          notes.push(note)
        }
      }

      sequenceRef.current = new Tone.Sequence(
        (time, note) => {
          if (synthRef.current) {
            synthRef.current.triggerAttackRelease(note, gate * Tone.Time('16n').toSeconds(), time)
          }
        },
        notes,
        '16n'
      )

      sequenceRef.current.start(0)
      setIsPlaying(true)
    }
  }, [isPlaying, bpm, pattern, scale, rootNote, gate, getNoteFromScale])

  useEffect(() => {
    Tone.getTransport().bpm.value = bpm
  }, [bpm])

  return (
    <div className={`arpeggiator ${className}`}>
      <div className="arp-header">
        <h2>🎹 Arpeggiator</h2>
        <button 
          className={`play-button ${isPlaying ? 'active' : ''}`}
          onClick={toggleArpeggiator}
        >
          {isPlaying ? '■ Stop' : '▶ Play'}
        </button>
      </div>

      <div className="arp-controls">
        <div className="control-group">
          <label>BPM</label>
          <div className="control-slider">
            <input 
              type="range" 
              min="60" 
              max="200" 
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
            />
            <span className="value">{bpm}</span>
          </div>
        </div>

        <div className="control-group">
          <label>Root</label>
          <select value={rootNote} onChange={(e) => setRootNote(e.target.value)}>
            {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Scale</label>
          <select value={scale} onChange={(e) => setScale(e.target.value as keyof typeof SCALES)}>
            {Object.keys(SCALES).map(s => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Pattern</label>
          <select value={pattern} onChange={(e) => setPattern(e.target.value as keyof typeof ARP_PATTERNS)}>
            {Object.keys(ARP_PATTERNS).map(p => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1).replace('-', '-')}</option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Gate</label>
          <div className="control-slider">
            <input 
              type="range" 
              min="0.1" 
              max="1" 
              step="0.05"
              value={gate}
              onChange={(e) => setGate(Number(e.target.value))}
            />
            <span className="value">{Math.round(gate * 100)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Arpeggiator
