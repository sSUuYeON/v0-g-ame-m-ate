"use client"

import type { Persona } from "@/types/game-types"
import Image from "next/image"

type PersonaSelectionProps = {
  selectedPersona: Persona | null
  onSelectPersona: (persona: Persona) => void
}

const AVAILABLE_PERSONAS: Persona[] = [
  {
    id: "luka",
    name: "루카",
    personality: "분석형",
    description: "게임 플레이를 분석하고 전략적인 조언을 제공하는 분석가",
    avatar: "/placeholder.svg?height=150&width=150",
    color: "blue",
  },
  {
    id: "monday",
    name: "먼데이",
    personality: "현실친구형",
    description: "실제 게임 친구처럼 편안하게 대화하고 농담도 주고받는 친구",
    avatar: "/placeholder.svg?height=150&width=150",
    color: "green",
  },
  {
    id: "mint",
    name: "민트",
    personality: "긍정형",
    description: "항상 긍정적이고 격려해주며 게임을 즐길 수 있도록 도와주는 친구",
    avatar: "/placeholder.svg?height=150&width=150",
    color: "purple",
  },
]

export function PersonaSelection({ selectedPersona, onSelectPersona }: PersonaSelectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {AVAILABLE_PERSONAS.map((persona) => {
        const colorMap: Record<string, string> = {
          blue: "border-blue-500 hover:border-blue-400 shadow-blue-500/20 from-blue-600 to-blue-800",
          green: "border-green-500 hover:border-green-400 shadow-green-500/20 from-green-600 to-green-800",
          purple: "border-purple-500 hover:border-purple-400 shadow-purple-500/20 from-purple-600 to-purple-800",
        }

        const isSelected = selectedPersona?.id === persona.id
        const borderColor = colorMap[persona.color]?.split(" ")[0] || "border-blue-500"
        const gradientColor = colorMap[persona.color]?.split(" ").slice(2).join(" ") || "from-blue-600 to-blue-800"

        return (
          <div
            key={persona.id}
            className={`
              rounded-xl overflow-hidden border-2 cursor-pointer transition-all
              ${isSelected ? `${borderColor} shadow-lg scale-[1.02]` : "border-gray-700"}
              ${!isSelected ? "hover:border-gray-500" : ""}
            `}
            onClick={() => onSelectPersona(persona)}
          >
            <div className="p-6 flex flex-col items-center bg-gray-800">
              <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-gray-700">
                <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-60 z-10`}></div>
                <Image src={persona.avatar || "/placeholder.svg"} alt={persona.name} fill className="object-cover" />
              </div>
              <h3 className="text-xl font-bold mb-1">{persona.name}</h3>
              <div
                className={`text-sm px-3 py-1 rounded-full mb-3 ${
                  persona.color === "blue"
                    ? "bg-blue-900 text-blue-200"
                    : persona.color === "green"
                      ? "bg-green-900 text-green-200"
                      : "bg-purple-900 text-purple-200"
                }`}
              >
                {persona.personality}
              </div>
              <p className="text-gray-300 text-sm text-center">{persona.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
