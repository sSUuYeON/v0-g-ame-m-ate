import type { ScreenAnalysisState } from "@/types/game-types"

type ScreenAnalysisProps = {
  state: ScreenAnalysisState
}

export function ScreenAnalysis({ state }: ScreenAnalysisProps) {
  return (
    <div className="p-3 bg-blue-900/70 border-t border-blue-700 backdrop-blur-sm">
      <div className="flex items-center">
        <div className="mr-2">
          {state === "processing" ? (
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
          ) : (
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          )}
        </div>

        <div className="text-sm">
          {state === "processing" ? (
            <div className="flex items-center">
              <span>게임 화면 분석 중</span>
              <svg
                className="animate-spin ml-2 h-4 w-4 text-white"
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
            </div>
          ) : (
            <span>화면 분석 활성화 - 1초마다 캡처 중</span>
          )}
        </div>
      </div>
    </div>
  )
}
