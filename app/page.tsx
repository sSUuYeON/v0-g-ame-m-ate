"use client"

import { useState } from "react"
import { GameSelection } from "@/components/game-selection"
import { PersonaSelection } from "@/components/persona-selection"
import { GameInterface } from "@/components/game-interface"
import type { GameType, Persona } from "@/types/game-types"
import { Logo } from "@/components/logo"

export default function Home() {
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null)
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null)
  const [gameStarted, setGameStarted] = useState(false)

  const handleGameSelect = (game: GameType) => {
    setSelectedGame(game)
  }

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona)
  }

  const startGame = () => {
    if (selectedGame && selectedPersona) {
      setGameStarted(true)
    }
  }

  const resetSelections = () => {
    setSelectedGame(null)
    setSelectedPersona(null)
    setGameStarted(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {!gameStarted ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                  1
                </span>
                게임 선택
              </h2>
              <p className="text-gray-400 mb-6">플레이하고 싶은 게임을 선택하세요</p>
              <GameSelection selectedGame={selectedGame} onSelectGame={handleGameSelect} />
            </div>

            {selectedGame && (
              <div className="mb-12 animate-fadeIn">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    2
                  </span>
                  AI 친구 선택
                </h2>
                <p className="text-gray-400 mb-6">함께할 AI 친구의 성격을 선택하세요</p>
                <PersonaSelection selectedPersona={selectedPersona} onSelectPersona={handlePersonaSelect} />
              </div>
            )}

            {selectedGame && selectedPersona && (
              <div className="flex justify-center mt-12 animate-fadeIn">
                <button
                  onClick={startGame}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg text-xl font-bold transition-all shadow-lg hover:shadow-purple-500/20 flex items-center"
                >
                  <span>게임 시작하기</span>
                  <svg
                    className="w-6 h-6 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        ) : (
          <GameInterface game={selectedGame!} persona={selectedPersona!} onReset={resetSelections} />
        )}
      </div>
    </main>
  )
}
