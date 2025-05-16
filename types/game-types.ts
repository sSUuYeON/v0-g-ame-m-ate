export type GameType = {
  id: string
  name: string
  description: string
  image: string
  isPremium: boolean
  color?: string
}

export type Persona = {
  id: string
  name: string
  personality: string
  description: string
  avatar: string
  color: string
}

export type ConversationMessage = {
  id: string
  sender: "user" | "ai"
  text: string
  timestamp: Date
  isProcessing?: boolean
  error?: boolean
}

export type VoiceState = "idle" | "listening" | "processing"

export type ScreenAnalysisState = "inactive" | "active" | "processing"
