import { useSynthStore, PresetCategory } from '../store/synthStore'

const categoryLabels: Record<PresetCategory, string> = {
  crystal: '💎 Crystal',
  bass: '🎸 Bass',
  lead: '🎹 Lead',
  pad: '🌊 Pad',
  fx: '⚡ FX',
  nature: '🌿 Nature',
  synth: '🔮 Synth'
}

const categoryColors: Record<PresetCategory, string> = {
  crystal: '#00d4ff',
  bass: '#ff6b35',
  lead: '#ff00aa',
  pad: '#7b2dff',
  fx: '#ffaa00',
  nature: '#00ff88',
  synth: '#ff4466'
}

interface PresetPanelProps {
  className?: string
}

function PresetPanel({ className = '' }: PresetPanelProps) {
  const { presets, activePreset, setActivePreset } = useSynthStore()
  
  const categories = [...new Set(presets.map(p => p.category))]

  return (
    <div className={`preset-panel ${className}`}>
      <div className="preset-header">
        <h2>Presets</h2>
        <span className="preset-count">{presets.length} sounds</span>
      </div>
      
      <div className="preset-categories">
        {categories.map(category => (
          <div key={category} className="preset-category">
            <h3 style={{ color: categoryColors[category] }}>
              {categoryLabels[category]}
            </h3>
            <div className="preset-grid">
              {presets
                .filter(p => p.category === category)
                .map(preset => (
                  <button
                    key={preset.id}
                    className={`preset-button ${activePreset?.id === preset.id ? 'active' : ''}`}
                    onClick={() => setActivePreset(preset)}
                    style={{
                      '--accent': categoryColors[category]
                    } as React.CSSProperties}
                  >
                    <span className="preset-name">{preset.name}</span>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
      
      {activePreset && (
        <div className="preset-info">
          <span className="current-preset">
            Current: <strong>{activePreset.name}</strong>
          </span>
        </div>
      )}
    </div>
  )
}

export default PresetPanel
