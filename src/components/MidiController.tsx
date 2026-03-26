import { useState, useEffect, useCallback, useRef } from 'react'
import './MidiController.css'

interface MidiControllerProps {
  className?: string
}

interface MidiDevice {
  id: string
  name: string
  manufacturer: string
}

function MidiController({ className = '' }: MidiControllerProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [devices, setDevices] = useState<MidiDevice[]>([])
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null)
  const [lastNote, setLastNote] = useState<string>('')
  const [midiActivity, setMidiActivity] = useState(false)
  const midiAccessRef = useRef<MIDIAccess | null>(null)

  useEffect(() => {
    // 检查 MIDI 支持
    if (navigator.requestMIDIAccess) {
      setIsSupported(true)
      
      navigator.requestMIDIAccess().then((access) => {
        midiAccessRef.current = access
        
        // 获取设备列表
        const updateDevices = () => {
          const deviceList: MidiDevice[] = []
          const inputs = access.inputs.values()
          for (const input of inputs) {
            deviceList.push({
              id: input.id,
              name: input.name || 'Unknown',
              manufacturer: input.manufacturer || 'Unknown'
            })
          }
          setDevices(deviceList)
        }
        
        updateDevices()
        
        // 监听设备连接
        access.onstatechange = () => {
          updateDevices()
        }
      }).catch((err) => {
        console.log('MIDI access denied:', err)
      })
    }
    
    return () => {
      // 清理
      if (midiAccessRef.current) {
        const inputs = midiAccessRef.current.inputs.values()
        for (const input of inputs) {
          input.onmidimessage = null
        }
      }
    }
  }, [])

  const handleDeviceSelect = useCallback((deviceId: string) => {
    if (!midiAccessRef.current) return
    
    // 移除之前的监听
    midiAccessRef.current.inputs.forEach((input) => {
      input.onmidimessage = null
    })
    
    // 添加新的监听
    const input = midiAccessRef.current.inputs.get(deviceId)
    if (input) {
      input.onmidimessage = (event: MIDIMessageEvent) => {
        if (!event.data) return
        const [status, note, velocity] = event.data
        const command = status & 0xf0
        
        // Note On
        if (command === 0x90 && velocity > 0) {
          const noteName = midiNoteToName(note)
          setLastNote(noteName)
          setMidiActivity(true)
          setTimeout(() => setMidiActivity(false), 100)
          
          // 触发键盘事件
          window.dispatchEvent(new CustomEvent('midi-note-on', { 
            detail: { note: noteName, velocity } 
          }))
        }
        // Note Off
        else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
          const noteName = midiNoteToName(note)
          window.dispatchEvent(new CustomEvent('midi-note-off', { 
            detail: { note: noteName } 
          }))
        }
      }
      setSelectedDevice(deviceId)
    }
  }, [])

  const midiNoteToName = (midiNote: number): string => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const octave = Math.floor(midiNote / 12) - 1
    const note = notes[midiNote % 12]
    return `${note}${octave}`
  }

  if (!isSupported) {
    return (
      <div className={`midi-controller ${className}`}>
        <div className="midi-header">
          <h2>🎹 MIDI</h2>
          <span className="status unsupported">Not Supported</span>
        </div>
        <div className="midi-content">
          <p>Web MIDI not supported in this browser.</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`midi-controller ${className}`}>
      <div className="midi-header">
        <h2>🎹 MIDI</h2>
        <span className={`status ${selectedDevice ? 'connected' : ''}`}>
          {selectedDevice ? 'Connected' : 'No Device'}
        </span>
      </div>

      <div className="midi-content">
        {devices.length === 0 ? (
          <div className="no-devices">
            <p>No MIDI devices found.</p>
            <p className="hint">Connect a MIDI keyboard and refresh.</p>
          </div>
        ) : (
          <>
            <div className="device-list">
              <label>Select Device:</label>
              <select 
                value={selectedDevice || ''} 
                onChange={(e) => handleDeviceSelect(e.target.value)}
              >
                <option value="">-- Select --</option>
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className={`midi-activity ${midiActivity ? 'active' : ''}`}>
              <span className="label">Last Note:</span>
              <span className="note">{lastNote || '--'}</span>
            </div>
          </>
        )}
      </div>

      <div className="midi-info">
        <span>🔌 Web MIDI API</span>
        <span>{devices.length} device(s) found</span>
      </div>
    </div>
  )
}

export default MidiController
