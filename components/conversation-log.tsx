"use client"

import type { ConversationMessage, Persona } from "@/types/game-types"
import Image from "next/image"
import { useEffect, useRef } from "react"

type ConversationLogProps = {
  messages: ConversationMessage[]
  persona: Persona
}

export function ConversationLog({ messages, persona }: ConversationLogProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-850">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-gray-500 text-center p-4">
          <div>
            <svg
              className="w-12 h-12 mx-auto mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p>AI 친구와의 대화가 여기에 표시됩니다</p>
          </div>
        </div>
      ) : (
        messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`
                max-w-[85%] rounded-lg p-3 shadow-md
                ${
                  message.sender === "user"
                    ? "bg-purple-700 text-white"
                    : message.isProcessing
                      ? "bg-gray-700 text-gray-300"
                      : message.error
                        ? "bg-red-900/60 text-white border border-red-700"
                        : "bg-gray-700 text-white"
                }
              `}
            >
              {message.sender === "ai" && (
                <div className="flex items-center mb-2">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2 border border-gray-600">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        persona.color === "blue"
                          ? "from-blue-600 to-blue-800"
                          : persona.color === "green"
                            ? "from-green-600 to-green-800"
                            : "from-purple-600 to-purple-800"
                      } opacity-60 z-10`}
                    ></div>
                    <Image
                      src={persona.avatar || "/placeholder.svg"}
                      alt={persona.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="font-bold text-sm">{persona.name}</span>
                </div>
              )}

              <div className={message.isProcessing ? "animate-pulse" : ""}>
                {message.text}
                {message.isProcessing && (
                  <span className="inline-block animate-pulse">
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                    <span className="dot">.</span>
                  </span>
                )}
              </div>

              <div className="text-xs text-gray-400 mt-1 text-right">
                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
