"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { VoiceState } from "@/types/game-types"
import { MicIcon, StopCircleIcon, SendIcon } from "lucide-react"

type VoiceControlsProps = {
  voiceState: VoiceState
  setVoiceState: (state: VoiceState) => void
  onVoiceInput: (text: string) => void
  onManualInput: (text: string) => void
}

export function VoiceControls({ voiceState, setVoiceState, onVoiceInput, onManualInput }: VoiceControlsProps) {
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  const [recordingDuration, setRecordingDuration] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneStreamRef = useRef<MediaStream | null>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate VAD with audio visualization
  const visualizeAudio = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Calculate average level
    const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length
    setAudioLevel(average / 255) // Normalize to 0-1

    // Simulate VAD detection
    if (average > 30 && voiceState === "idle" && !isListening) {
      startRecording()
    } else if (average < 10 && voiceState === "listening" && audioChunksRef.current.length > 0) {
      // Detect silence for auto-stop (simplified)
      const silenceDetectionTimeout = setTimeout(() => {
        if (voiceState === "listening") {
          stopRecording()
        }
      }, 1500) // Wait 1.5s of silence before stopping

      return () => clearTimeout(silenceDetectionTimeout)
    }

    animationFrameRef.current = requestAnimationFrame(visualizeAudio)
  }

  const setupAudioContext = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      microphoneStreamRef.current = stream

      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256

      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      animationFrameRef.current = requestAnimationFrame(visualizeAudio)

      return true
    } catch (error) {
      console.error("Error accessing microphone:", error)
      return false
    }
  }

  const startRecording = async () => {
    if (!microphoneStreamRef.current) {
      const success = await setupAudioContext()
      if (!success) return
    }

    setIsListening(true)
    setVoiceState("listening")
    setRecordingDuration(0)
    audioChunksRef.current = []

    // Start a timer to track recording duration
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
    }

    recordingTimerRef.current = setInterval(() => {
      setRecordingDuration((prev) => prev + 100)
    }, 100)

    try {
      const mediaRecorder = new MediaRecorder(microphoneStreamRef.current!)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        // Clear recording timer
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current)
          recordingTimerRef.current = null
        }

        // Simulate sending audio to backend for processing
        setVoiceState("processing")

        // Simulate Whisper processing
        setTimeout(() => {
          // Simulate transcription result
          const transcribedText = simulateTranscription()
          onVoiceInput(transcribedText)
          setVoiceState("idle")
        }, 1500)
      }

      mediaRecorder.start()
    } catch (error) {
      console.error("Error starting recording:", error)
      setIsListening(false)
      setVoiceState("idle")

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    setIsListening(false)
  }

  const simulateTranscription = () => {
    // Simulate Whisper transcription with predefined responses
    const possibleTranscriptions = [
      "이 레벨에서 가장 좋은 전략이 뭐예요?",
      "이 퍼즐을 어떻게 풀어야 할까요?",
      "몇 가지 팁을 줄 수 있나요?",
      "막혔어요, 다음에 뭘 해야 할까요?",
      "이 게임 정말 재밌네요!",
      "여기서 어떻게 진행해야 하는지 모르겠어요.",
    ]

    return possibleTranscriptions[Math.floor(Math.random() * possibleTranscriptions.length)]
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputText.trim()) {
      onManualInput(inputText)
      setInputText("")
    }
  }

  // Format recording duration
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const tenths = Math.floor((ms % 1000) / 100)
    return `${seconds}.${tenths}s`
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (audioContextRef.current) {
        audioContextRef.current.close()
      }

      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach((track) => track.stop())
      }

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="p-4 bg-gray-700 border-t border-gray-600">
      <form onSubmit={handleManualSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          disabled={voiceState === "processing"}
        />

        <button
          type="submit"
          disabled={!inputText.trim() || voiceState === "processing"}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:opacity-50 rounded-lg p-2 transition-colors"
        >
          <SendIcon size={20} />
        </button>

        <button
          type="button"
          onClick={isListening ? stopRecording : startRecording}
          disabled={voiceState === "processing"}
          className={`
            relative rounded-lg p-2 transition-colors
            ${isListening ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}
            disabled:bg-gray-600 disabled:opacity-50
          `}
        >
          {isListening ? <StopCircleIcon size={20} /> : <MicIcon size={20} />}

          {isListening && (
            <>
              <span
                className="absolute inset-0 rounded-lg border-2 border-red-400 animate-ping"
                style={{
                  transform: `scale(${1 + audioLevel * 0.5})`,
                  opacity: 0.7 * audioLevel,
                }}
              />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1 min-w-[20px] text-center">
                {formatDuration(recordingDuration)}
              </span>
            </>
          )}
        </button>
      </form>

      {voiceState === "processing" && (
        <div className="mt-2 text-sm text-center text-gray-400 flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          음성 입력 처리 중...
        </div>
      )}
    </div>
  )
}
