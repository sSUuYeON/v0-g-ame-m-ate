"use client"

import { useState, useRef, useEffect } from "react"

type UseVoiceDetectionProps = {
  onSpeechStart?: () => void
  onSpeechEnd?: () => void
  onError?: (error: Error) => void
  autoStart?: boolean
  silenceThreshold?: number // in dB
  silenceTimeout?: number // in ms
}

export function useVoiceDetection({
  onSpeechStart,
  onSpeechEnd,
  onError,
  autoStart = false,
  silenceThreshold = -50,
  silenceTimeout = 1500,
}: UseVoiceDetectionProps = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isAvailable, setIsAvailable] = useState(false)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneStreamRef = useRef<MediaStream | null>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isSpeakingRef = useRef(false)

  // Check if audio is available
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.mediaDevices) {
      setIsAvailable(true)

      if (autoStart) {
        startListening()
      }
    }

    return () => {
      stopListening()
    }
  }, [autoStart])

  const calculateVolume = (dataArray: Uint8Array) => {
    const values = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length
    // Convert to dB
    const volume = values === 0 ? -100 : 20 * Math.log10(values / 255)
    return volume
  }

  const detectSpeech = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    const volume = calculateVolume(dataArray)

    if (volume > silenceThreshold) {
      // Speech detected
      if (!isSpeakingRef.current) {
        isSpeakingRef.current = true
        onSpeechStart?.()
      }

      // Reset silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }
    } else if (isSpeakingRef.current) {
      // Potential silence after speech
      if (!silenceTimerRef.current) {
        silenceTimerRef.current = setTimeout(() => {
          isSpeakingRef.current = false
          onSpeechEnd?.()
          silenceTimerRef.current = null
        }, silenceTimeout)
      }
    }

    if (isListening) {
      requestAnimationFrame(detectSpeech)
    }
  }

  const startListening = async () => {
    if (!isAvailable || isListening) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      microphoneStreamRef.current = stream

      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 256

      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      setIsListening(true)
      requestAnimationFrame(detectSpeech)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      onError?.(error instanceof Error ? error : new Error(String(error)))
    }
  }

  const stopListening = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }

    if (microphoneStreamRef.current) {
      microphoneStreamRef.current.getTracks().forEach((track) => track.stop())
      microphoneStreamRef.current = null
    }

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.error)
      audioContextRef.current = null
    }

    analyserRef.current = null
    isSpeakingRef.current = false
    setIsListening(false)
  }

  return {
    isListening,
    isAvailable,
    startListening,
    stopListening,
  }
}
