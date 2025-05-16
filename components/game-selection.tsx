"use client"

import type { GameType } from "@/types/game-types"
import Image from "next/image"
import { LockIcon } from "lucide-react"

type GameSelectionProps = {
  selectedGame: GameType | null
  onSelectGame: (game: GameType) => void
}

const AVAILABLE_GAMES: GameType[] = [
  {
    id: "minesweeper",
    name: "지뢰찾기",
    description: "지뢰를 피해 모든 칸을 여는 클래식 퍼즐 게임",
    image: "/placeholder.svg?height=200&width=300",
    isPremium: false,
    color: "blue",
  },
  {
    id: "tft",
    name: "전략적 팀 전투 (TFT)",
    description: "챔피언과 시너지를 활용한 자동 전투 전략 게임",
    image: "/placeholder.svg?height=200&width=300",
    isPremium: false,
    color: "purple",
  },
  {
    id: "stardew",
    name: "스타듀 밸리",
    description: "농장 경영과 인간관계를 발전시키는 시뮬레이션 RPG",
    image: "/placeholder.svg?height=200&width=300",
    isPremium: true,
    color: "green",
  },
  {
    id: "minecraft",
    name: "마인크래프트",
    description: "건축과 탐험이 가능한 오픈 월드 샌드박스 게임",
    image: "/placeholder.svg?height=200&width=300",
    isPremium: true,
    color: "red",
  },
]

export function GameSelection({ selectedGame, onSelectGame }: GameSelectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {AVAILABLE_GAMES.map((game) => {
        const colorMap: Record<string, string> = {
          blue: "from-blue-600 to-blue-800 shadow-blue-500/20",
          purple: "from-purple-600 to-purple-800 shadow-purple-500/20",
          green: "from-green-600 to-green-800 shadow-green-500/20",
          red: "from-red-600 to-red-800 shadow-red-500/20",
        }

        const gradientColor = colorMap[game.color || "blue"]

        return (
          <div
            key={game.id}
            className={`
              relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all
              ${
                selectedGame?.id === game.id
                  ? "border-purple-500 shadow-lg shadow-purple-500/20 scale-[1.02]"
                  : "border-gray-700 hover:border-gray-500"
              }
              ${game.isPremium ? "opacity-80" : ""}
            `}
            onClick={() => !game.isPremium && onSelectGame(game)}
          >
            <div className="relative h-48">
              <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-60 z-10`}></div>
              <Image src={game.image || "/placeholder.svg"} alt={game.name} fill className="object-cover" />
            </div>
            <div className="p-4 bg-gray-800">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold">{game.name}</h3>
                {game.isPremium && (
                  <div className="flex items-center text-yellow-400">
                    <LockIcon size={16} className="mr-1" />
                    <span className="text-sm">프리미엄</span>
                  </div>
                )}
              </div>
              <p className="text-gray-300 text-sm">{game.description}</p>
            </div>

            {game.isPremium && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                <div className="bg-yellow-600 px-4 py-2 rounded-full font-bold text-sm animate-pulse">출시 예정</div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
