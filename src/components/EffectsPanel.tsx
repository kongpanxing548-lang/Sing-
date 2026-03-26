import { useState } from 'react'
import './EffectsPanel.css'

interface EffectsPanelProps {
  className?: string
}

function EffectsPanel({ className = '' }: EffectsPanelProps) {
  const [effects, setEffects] = useState({
    reverb: { wet: 0.3, decay: 1.5, preDelay: 0.01 },
    delay: { wet: 0.2, time: '8n', feedback: 0.3 },
    distortion: { wet: 0, amount: 0.4 },
    compressor: { threshold: -24, ratio: 4, attack: 0.003, release: 0.25 },
    eq: { low: 0, mid: 0, high: 0 }
  })

  const [isEnabled, setIsEnabled] = useState(true)

  return (
    <div className={`effects-panel ${className}`}>
      <div className="effects-header">
        <h2>🎛️ Effects Chain</h2>
        <button 
          className={`enable-button ${isEnabled ? 'active' : ''}`}
          onClick={() => setIsEnabled(!isEnabled)}
        >
          {isEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className="effects-chain">
        {/* Reverb */}
        <div className="effect-module">
          <h3>Reverb</h3>
          <div className="effect-controls">
            <label>
              <span>Wet</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={effects.reverb.wet}
                onChange={(e) => setEffects({...effects, reverb: {...effects.reverb, wet: Number(e.target.value)}})}
              />
              <span className="value">{Math.round(effects.reverb.wet * 100)}%</span>
            </label>
            <label>
              <span>Decay</span>
              <input 
                type="range" 
                min="0.1" 
                max="10" 
                step="0.1"
                value={effects.reverb.decay}
                onChange={(e) => setEffects({...effects, reverb: {...effects.reverb, decay: Number(e.target.value)}})}
              />
              <span className="value">{effects.reverb.decay}s</span>
            </label>
          </div>
        </div>

        {/* Delay */}
        <div className="effect-module">
          <h3>Delay</h3>
          <div className="effect-controls">
            <label>
              <span>Wet</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={effects.delay.wet}
                onChange={(e) => setEffects({...effects, delay: {...effects.delay, wet: Number(e.target.value)}})}
              />
              <span className="value">{Math.round(effects.delay.wet * 100)}%</span>
            </label>
            <label>
              <span>Feedback</span>
              <input 
                type="range" 
                min="0" 
                max="0.9" 
                step="0.01"
                value={effects.delay.feedback}
                onChange={(e) => setEffects({...effects, delay: {...effects.delay, feedback: Number(e.target.value)}})}
              />
              <span className="value">{Math.round(effects.delay.feedback * 100)}%</span>
            </label>
          </div>
        </div>

        {/* Distortion */}
        <div className="effect-module">
          <h3>Distortion</h3>
          <div className="effect-controls">
            <label>
              <span>Wet</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={effects.distortion.wet}
                onChange={(e) => setEffects({...effects, distortion: {...effects.distortion, wet: Number(e.target.value)}})}
              />
              <span className="value">{Math.round(effects.distortion.wet * 100)}%</span>
            </label>
            <label>
              <span>Amount</span>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01"
                value={effects.distortion.amount}
                onChange={(e) => setEffects({...effects, distortion: {...effects.distortion, amount: Number(e.target.value)}})}
              />
              <span className="value">{Math.round(effects.distortion.amount * 100)}%</span>
            </label>
          </div>
        </div>

        {/* Compressor */}
        <div className="effect-module">
          <h3>Compressor</h3>
          <div className="effect-controls">
            <label>
              <span>Threshold</span>
              <input 
                type="range" 
                min="-60" 
                max="0" 
                step="1"
                value={effects.compressor.threshold}
                onChange={(e) => setEffects({...effects, compressor: {...effects.compressor, threshold: Number(e.target.value)}})}
              />
              <span className="value">{effects.compressor.threshold} dB</span>
            </label>
            <label>
              <span>Ratio</span>
              <input 
                type="range" 
                min="1" 
                max="20" 
                step="0.5"
                value={effects.compressor.ratio}
                onChange={(e) => setEffects({...effects, compressor: {...effects.compressor, ratio: Number(e.target.value)}})}
              />
              <span className="value">{effects.compressor.ratio}:1</span>
            </label>
          </div>
        </div>

        {/* EQ */}
        <div className="effect-module">
          <h3>EQ</h3>
          <div className="effect-controls">
            <label>
              <span>Low</span>
              <input 
                type="range" 
                min="-12" 
                max="12" 
                step="0.5"
                value={effects.eq.low}
                onChange={(e) => setEffects({...effects, eq: {...effects.eq, low: Number(e.target.value)}})}
              />
              <span className="value">{effects.eq.low > 0 ? '+' : ''}{effects.eq.low} dB</span>
            </label>
            <label>
              <span>Mid</span>
              <input 
                type="range" 
                min="-12" 
                max="12" 
                step="0.5"
                value={effects.eq.mid}
                onChange={(e) => setEffects({...effects, eq: {...effects.eq, mid: Number(e.target.value)}})}
              />
              <span className="value">{effects.eq.mid > 0 ? '+' : ''}{effects.eq.mid} dB</span>
            </label>
            <label>
              <span>High</span>
              <input 
                type="range" 
                min="-12" 
                max="12" 
                step="0.5"
                value={effects.eq.high}
                onChange={(e) => setEffects({...effects, eq: {...effects.eq, high: Number(e.target.value)}})}
              />
              <span className="value">{effects.eq.high > 0 ? '+' : ''}{effects.eq.high} dB</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EffectsPanel
