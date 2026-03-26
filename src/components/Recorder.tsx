import { useState, useRef, useCallback } from 'react'
import './Recorder.css'

interface RecorderProps {
  className?: string
}

function Recorder({ className = '' }: RecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startRecording = useCallback(async () => {
    try {
      // 使用 MediaRecorder API 录制系统音频
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      recorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []
      
      recorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }
      
      recorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        
        // 清理流
        stream.getTracks().forEach(track => track.stop())
      }
      
      recorderRef.current.start()
      startTimeRef.current = Date.now()
      setIsRecording(true)
      
      // 更新时长
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 100)
      
    } catch (err) {
      console.error('Recording failed:', err)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (recorderRef.current && isRecording) {
      recorderRef.current.stop()
      setIsRecording(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

  const downloadRecording = useCallback(() => {
    if (audioUrl) {
      const a = document.createElement('a')
      a.href = audioUrl
      a.download = `novasynth-recording-${Date.now()}.webm`
      a.click()
    }
  }, [audioUrl])

  const clearRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
      setDuration(0)
    }
  }, [audioUrl])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={`recorder ${className}`}>
      <div className="recorder-header">
        <h2>🎤 Recorder</h2>
        <span className={`status ${isRecording ? 'recording' : ''}`}>
          {isRecording ? '● REC' : '○ Ready'}
        </span>
      </div>

      <div className="recorder-display">
        <span className="time">{formatDuration(duration)}</span>
        {audioUrl && !isRecording && (
          <audio src={audioUrl} controls className="audio-player" />
        )}
      </div>

      <div className="recorder-controls">
        {!isRecording ? (
          <button className="record-btn" onClick={startRecording}>
            <span className="icon">●</span>
            Record
          </button>
        ) : (
          <button className="stop-btn" onClick={stopRecording}>
            <span className="icon">■</span>
            Stop
          </button>
        )}
        
        {audioUrl && !isRecording && (
          <>
            <button className="download-btn" onClick={downloadRecording}>
              <span className="icon">↓</span>
              Download
            </button>
            <button className="clear-btn" onClick={clearRecording}>
              <span className="icon">✕</span>
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Recorder
