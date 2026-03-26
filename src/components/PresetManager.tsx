import { useState, useEffect } from 'react'
import { useSynthStore, Preset } from '../store/synthStore'
import './PresetManager.css'

interface PresetManagerProps {
  className?: string
}

function PresetManager({ className = '' }: PresetManagerProps) {
  const { activePreset, setActivePreset } = useSynthStore()
  const [savedPresets, setSavedPresets] = useState<Preset[]>([])
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [newPresetName, setNewPresetName] = useState('')

  const handleSavePreset = () => {
    if (!activePreset || !newPresetName.trim()) return
    
    const newPreset: Preset = {
      ...activePreset,
      id: `user-${Date.now()}`,
      name: newPresetName.trim()
    }
    
    setSavedPresets([...savedPresets, newPreset])
    setNewPresetName('')
    setShowSaveDialog(false)
    
    // 保存到 localStorage
    const updated = [...savedPresets, newPreset]
    localStorage.setItem('novasynth-presets', JSON.stringify(updated))
  }

  const handleDeletePreset = (id: string) => {
    const updated = savedPresets.filter(p => p.id !== id)
    setSavedPresets(updated)
    localStorage.setItem('novasynth-presets', JSON.stringify(updated))
  }

  const handleExportPreset = (preset: Preset) => {
    const data = JSON.stringify(preset, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${preset.name}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportPreset = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const preset = JSON.parse(event.target?.result as string) as Preset
            preset.id = `user-${Date.now()}`
            setSavedPresets([...savedPresets, preset])
          } catch (err) {
            console.error('Invalid preset file')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const generateShareLink = (preset: Preset) => {
    const data = btoa(JSON.stringify(preset))
    const url = `${window.location.origin}?preset=${data}`
    navigator.clipboard.writeText(url)
    alert('Share link copied to clipboard!')
  }

  // 加载保存的预设
  useEffect(() => {
    const saved = localStorage.getItem('novasynth-presets')
    if (saved) {
      try {
        setSavedPresets(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load presets')
      }
    }
  }, [])

  return (
    <div className={`preset-manager ${className}`}>
      <div className="pm-header">
        <h2>💾 Preset Manager</h2>
        <button className="import-btn" onClick={handleImportPreset}>
          Import
        </button>
      </div>

      <div className="pm-actions">
        <button 
          className="save-btn"
          onClick={() => setShowSaveDialog(true)}
        >
          + Save Current
        </button>
      </div>

      {showSaveDialog && (
        <div className="save-dialog">
          <input
            type="text"
            placeholder="Preset name..."
            value={newPresetName}
            onChange={(e) => setNewPresetName(e.target.value)}
            autoFocus
          />
          <div className="dialog-buttons">
            <button onClick={handleSavePreset}>Save</button>
            <button onClick={() => setShowSaveDialog(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="saved-presets">
        <h3>Saved Presets ({savedPresets.length})</h3>
        {savedPresets.length === 0 ? (
          <p className="empty">No saved presets yet.</p>
        ) : (
          <div className="preset-list">
            {savedPresets.map(preset => (
              <div key={preset.id} className="preset-item">
                <span 
                  className="preset-name"
                  onClick={() => setActivePreset(preset)}
                >
                  {preset.name}
                </span>
                <div className="preset-actions">
                  <button onClick={() => generateShareLink(preset)} title="Share">
                    🔗
                  </button>
                  <button onClick={() => handleExportPreset(preset)} title="Export">
                    ↓
                  </button>
                  <button onClick={() => handleDeletePreset(preset.id)} title="Delete">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pm-info">
        <span>💾 Local Storage</span>
        <span>{savedPresets.length} preset(s)</span>
      </div>
    </div>
  )
}

export default PresetManager
