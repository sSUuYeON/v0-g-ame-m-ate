"use client"

import { useState, useEffect } from "react"
import type { GameType, Persona, ConversationMessage, VoiceState, ScreenAnalysisState } from "@/types/game-types"
import { ArrowLeftIcon, CameraIcon, XIcon, SettingsIcon, Volume2Icon, VolumeXIcon } from "lucide-react"
import Image from "next/image"
import { ConversationLog } from "./conversation-log"
import { VoiceControls } from "./voice-controls"
import { ScreenAnalysis } from "./screen-analysis"
import { simulateGPT4oResponse, simulateScreenAnalysis } from "@/lib/backend-simulation"

type GameInterfaceProps = {
  game: GameType
  persona: Persona
  onReset: () => void
}

export function GameInterface({ game, persona, onReset }: GameInterfaceProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [voiceState, setVoiceState] = useState<VoiceState>("idle")
  const [screenAnalysisState, setScreenAnalysisState] = useState<ScreenAnalysisState>("inactive")
  const [isMuted, setIsMuted] = useState(false)

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: ConversationMessage = {
      id: "welcome",
      sender: "ai",
      text: `안녕하세요! ${game.name}에서 당신의 AI 게임 친구 ${persona.name}입니다. 어떻게 도와드릴까요?`,
      timestamp: new Date(),
    }
    setMessages([welcomeMessage])

    // Speak the welcome message
    if (!isMuted && "speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(welcomeMessage.text)
      window.speechSynthesis.speak(utterance)
    }
  }, [game.name, persona.name, isMuted])

  // Handle voice input from the user
  const handleVoiceInput = async (text: string) => {
    // Add user message
    const userMessageId = Date.now().toString()
    const userMessage: ConversationMessage = {
      id: userMessageId,
      sender: "user",
      text: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Add a processing message
    const processingMessageId = `processing-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      {
        id: processingMessageId,
        sender: "ai",
        text: "...",
        timestamp: new Date(),
        isProcessing: true,
      },
    ])

    try {
      // Get conversation history for context
      const conversationHistory = messages
        .filter((msg) => !msg.isProcessing)
        .map((msg) => `${msg.sender === "user" ? "User" : persona.name}: ${msg.text}`)

      // Get AI response
      const response = await simulateGPT4oResponse(text, game, persona, conversationHistory)

      // Replace the processing message with the actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === processingMessageId
            ? {
                id: `ai-${Date.now()}`,
                sender: "ai",
                text: response,
                timestamp: new Date(),
                isProcessing: false,
              }
            : msg,
        ),
      )

      // Speak the response using TTS
      if (!isMuted && "speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(response)
        window.speechSynthesis.speak(utterance)
      }
    } catch (error) {
      // Handle error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === processingMessageId
            ? {
                id: `error-${Date.now()}`,
                sender: "ai",
                text: "죄송합니다, 응답을 생성하는 중에 오류가 발생했습니다. 다시 시도해 주세요.",
                timestamp: new Date(),
                isProcessing: false,
                error: true,
              }
            : msg,
        ),
      )
    }
  }

  // Handle manual text input
  const handleManualInput = (text: string) => {
    if (!text.trim()) return
    handleVoiceInput(text)
  }

  // Toggle screen analysis mode
  const toggleScreenAnalysis = async () => {
    if (screenAnalysisState === "inactive") {
      setScreenAnalysisState("active")

      // Add a message indicating screen analysis is starting
      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          sender: "ai",
          text: "화면 분석을 시작합니다. 게임 화면을 캡처하고 있습니다...",
          timestamp: new Date(),
        },
      ])

      // Simulate screen analysis
      try {
        setScreenAnalysisState("processing")
        const analysisResult = await simulateScreenAnalysis("", game)

        // Add the analysis result as a message
        const analysisMessage: ConversationMessage = {
          id: `analysis-${Date.now()}`,
          sender: "ai",
          text: analysisResult,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, analysisMessage])
        setScreenAnalysisState("active")

        // Speak the analysis
        if (!isMuted && "speechSynthesis" in window) {
          const utterance = new SpeechSynthesisUtterance(analysisResult)
          window.speechSynthesis.speak(utterance)
        }
      } catch (error) {
        // Handle error
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            sender: "ai",
            text: "화면 분석 중 오류가 발생했습니다. 다시 시도해 주세요.",
            timestamp: new Date(),
            error: true,
          },
        ])
        setScreenAnalysisState("inactive")
      }
    } else {
      setScreenAnalysisState("inactive")
      setMessages((prev) => [
        ...prev,
        {
          id: `system-${Date.now()}`,
          sender: "ai",
          text: "화면 분석을 중지했습니다.",
          timestamp: new Date(),
        },
      ])
    }
  }

  // Toggle mute state
  const toggleMute = () => {
    setIsMuted(!isMuted)
    if ("speechSynthesis" in window) {
      if (!isMuted) {
        window.speechSynthesis.cancel() // Cancel any ongoing speech
      }
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onReset} className="flex items-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeftIcon size={16} className="mr-1" />
          게임 선택으로 돌아가기
        </button>

        <div className="flex items-center">
          <div className="mr-4 text-right">
            <div className="font-bold">{game.name}</div>
            <div className="text-sm text-gray-400">with {persona.name}</div>
          </div>
          <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-700">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${
                persona.color === "blue"
                  ? "from-blue-600 to-blue-800"
                  : persona.color === "green"
                    ? "from-green-600 to-green-800"
                    : "from-purple-600 to-purple-800"
              } opacity-60 z-10`}
            ></div>
            <Image src={persona.avatar || "/placeholder.svg"} alt={persona.name} fill className="object-cover" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1">
        <div className="lg:col-span-2 bg-gray-800 rounded-xl overflow-hidden flex flex-col border border-gray-700 shadow-lg">
          <div className="p-4 bg-gray-700 flex justify-between items-center">
            <h2 className="font-bold flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
              게임 화면
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="flex items-center p-2 rounded-lg text-sm hover:bg-gray-600 transition-colors"
                title={isMuted ? "음성 켜기" : "음성 끄기"}
              >
                {isMuted ? <VolumeXIcon size={18} /> : <Volume2Icon size={18} />}
              </button>
              <button
                onClick={toggleScreenAnalysis}
                className={`
                  flex items-center px-3 py-1 rounded-lg text-sm transition-colors
                  ${
                    screenAnalysisState !== "inactive" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
                  }
                `}
              >
                {screenAnalysisState !== "inactive" ? (
                  <>
                    <XIcon size={14} className="mr-1" />
                    분석 중지
                  </>
                ) : (
                  <>
                    <CameraIcon size={14} className="mr-1" />
                    화면 분석
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 bg-black flex items-center justify-center p-4 relative">
            <div className="text-center text-gray-500">
              <div className="mb-4 border-2 border-dashed border-gray-700 rounded-lg p-8 max-w-md">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <p className="mb-2 font-medium">게임 화면이 여기에 표시됩니다</p>
                <p className="text-sm">화면 공유를 시작하거나 게임을 연결하여 AI 분석을 활성화하세요</p>
                <button className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                  화면 공유 시작
                </button>
              </div>
            </div>

            {/* Game HUD overlay */}
            <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm p-2 rounded-lg text-xs text-gray-300 flex items-center">
              <svg
                className="w-4 h-4 mr-1 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
                />
              </svg>
              AI 친구 연결됨
            </div>
          </div>

          {screenAnalysisState !== "inactive" && <ScreenAnalysis state={screenAnalysisState} />}
        </div>

        <div className="bg-gray-800 rounded-xl overflow-hidden flex flex-col border border-gray-700 shadow-lg">
          <div className="p-4 bg-gray-700 flex justify-between items-center">
            <h2 className="font-bold flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              대화
            </h2>
            <button className="p-1 hover:bg-gray-600 rounded transition-colors">
              <SettingsIcon size={16} />
            </button>
          </div>

          <ConversationLog messages={messages} persona={persona} />

          <VoiceControls
            voiceState={voiceState}
            setVoiceState={setVoiceState}
            onVoiceInput={handleVoiceInput}
            onManualInput={handleManualInput}
          />
        </div>
      </div>
    </div>
  )
}
