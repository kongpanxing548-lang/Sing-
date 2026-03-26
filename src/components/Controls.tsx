import { useSynthStore } from '../store/synthStore'
import './Controls.css'

function Controls() {
  const { bpm, setBpm, volume, setVolume, isRecording, setRecording } = useSynthStore()

  return (
    <div className="controls">
      <div className="control-group">
        <label>
          <span className="control-icon">🎚️</span>
          Volume
        </label>
        <div className="control-slider">
          <input
            type="range"
            min={-60}
            max={0}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
          <span className="control-value">{volume} dB</span>
        </div>
      </div>

      <div className="control-group">
        <label>
          <span className="control-icon">⏱️</span>
          BPM
        </label>
        <div className="control-slider">
          <input
            type="range"
            min={60}
            max={200}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
          />
          <span className="control-value">{bpm}</span>
        </div>
      </div>

      <div className="control-buttons">
        <button 
          className={`record-button ${isRecording ? 'recording' : ''}`}
          onClick={() => setRecording(!isRecording)}
        >
          <span className="record-icon">●</span>
          {isRecording ? 'Recording' : 'REC'}
        </button>
      </div>
    </div>
  )
}

export default Controls
