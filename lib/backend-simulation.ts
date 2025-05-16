// This file simulates the backend functionality for demo purposes
// In a real implementation, these would be API calls to your Flask backend

import type { GameType, Persona } from "@/types/game-types"

// Simulate Whisper API
export async function simulateWhisperTranscription(audioBlob: Blob): Promise<string> {
  // In a real implementation, you would:
  // 1. Convert the audio blob to the required format
  // 2. Send it to your backend
  // 3. Your backend would call the Whisper API
  // 4. Return the transcription

  // For demo, we'll just return a random phrase after a delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const phrases = [
    "이 레벨을 어떻게 클리어하나요?",
    "여기서 가장 좋은 전략이 뭐예요?",
    "이 게임 정말 어렵네요.",
    "몇 가지 팁을 줄 수 있나요?",
    "이 퍼즐에서 막혔어요.",
    "다음에 뭘 해야 할까요?",
    "단축키가 있나요?",
    "자원을 더 얻으려면 어떻게 해야 하나요?",
    "이 보스가 너무 어려워요!",
    "이 게임 정말 재밌어요.",
  ]

  return phrases[Math.floor(Math.random() * phrases.length)]
}

// Simulate GPT-4o API
export async function simulateGPT4oResponse(
  message: string,
  game: GameType,
  persona: Persona,
  conversationHistory: string[] = [],
): Promise<string> {
  // In a real implementation, you would:
  // 1. Format the conversation history and current message
  // 2. Send it to your backend
  // 3. Your backend would call the GPT-4o API with the appropriate persona prompt
  // 4. Return the response

  // For demo, we'll simulate different persona responses
  await new Promise((resolve) => setTimeout(resolve, 2000))

  let response = ""

  switch (persona.id) {
    case "luka":
      response = `${game.name}에 대한 분석 결과, 다음 전략을 추천합니다: ${generateAnalyticalResponse(message, game.name)}`
      break
    case "monday":
      response = `${generateCasualResponse(message, game.name)}`
      break
    case "mint":
      response = `정말 잘하고 있어요! ${generatePositiveResponse(message, game.name)}`
      break
    default:
      response = `${game.name}에 대해 도움이 필요하신가요? 무엇을 알고 싶으신가요?`
  }

  return response
}

// Helper functions to generate persona-specific responses
function generateAnalyticalResponse(message: string, gameName: string): string {
  const strategies = [
    "먼저 자원 관리에 집중한 다음 영토를 확장하세요",
    "움직이기 전에 패턴을 분석하세요",
    "진행하기 전에 방어 구조를 우선시하세요",
    "도전에 직면하기 전에 기술 업그레이드에 투자하세요",
    "공격과 방어 사이에 균형 잡힌 접근 방식을 만드세요",
  ]

  const analysis = [
    "현재 게임 상태를 기반으로 효율성을 23% 향상시킬 수 있습니다",
    "접근 방식에 최적화되지 않은 패턴이 보입니다",
    "현재 전략을 변경하면 통계적 이점이 있습니다",
    "타이밍을 조정하면 성공 확률이 증가합니다",
    "상위 플레이어의 데이터는 대안적 접근 방식을 제안합니다",
  ]

  return `${analysis[Math.floor(Math.random() * analysis.length)]} ${strategies[Math.floor(Math.random() * strategies.length)]}. 이 접근 방식은 ${gameName}에서 더 높은 성공률을 보입니다.`
}

function generateCasualResponse(message: string, gameName: string): string {
  const intros = ["이봐!", "안녕!", "뭐해?", "그래서 말이야...", "들어봐,"]

  const reactions = [
    "나도 그 어려움 완전 이해해",
    "나도 그런 적 있어, 해봤어",
    "그 부분은 나도 항상 헷갈려",
    "응, 그건 어려운 부분이지",
    "그 마음 완전 이해해",
  ]

  const advice = [
    "그냥 해보고 어떻게 되는지 봐",
    "완전히 다른 걸 시도해볼래?",
    "이런 경우엔 보통 직감을 따라가",
    "가끔은 그냥 도전해봐야 할 때도 있어",
    "솔직히, 내가 너라면 그냥 다시 시작할 것 같아",
  ]

  return `${intros[Math.floor(Math.random() * intros.length)]} ${gameName} 할 때 ${reactions[Math.floor(Math.random() * reactions.length)]}. ${advice[Math.floor(Math.random() * advice.length)]} 어떻게 되는지 알려줘!`
}

function generatePositiveResponse(message: string, gameName: string): string {
  const encouragement = [
    "정말 잘하고 있어요!",
    "당신을 믿어요!",
    "할 수 있어요!",
    "계속 잘하고 있어요!",
    "정말 좋은 진전을 보이고 있어요!",
  ]

  const positivity = [
    "모든 도전은 성장할 기회일 뿐이에요",
    "여정은 목적지만큼 중요해요",
    "당신의 끈기는 반드시 결실을 맺을 거예요",
    "매 시도마다 실력이 향상되고 있어요",
    "최고의 플레이어들도 당신이 있는 곳에서 시작했어요",
  ]

  const tips = [
    "결과에만 집중하기보다 과정을 즐겨보세요",
    "작은 승리도 축하하세요",
    "이 게임을 왜 좋아하는지 기억하세요",
    "좌절감을 느끼면 잠시 휴식을 취한 후 다시 돌아오세요",
    "다음 움직임을 하기 전에 성공을 상상해보세요",
  ]

  return `${encouragement[Math.floor(Math.random() * encouragement.length)]} ${positivity[Math.floor(Math.random() * positivity.length)]} ${gameName}을(를) 플레이할 때, ${tips[Math.floor(Math.random() * tips.length)]}.`
}

// Simulate screen analysis with Vision API
export async function simulateScreenAnalysis(imageData: string, game: GameType): Promise<string> {
  // In a real implementation, you would:
  // 1. Send the screen capture to your backend
  // 2. Your backend would call the GPT-4o Vision API
  // 3. Return the analysis

  // For demo, we'll return game-specific analyses
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const analyses = {
    minesweeper: [
      "오른쪽 상단 모서리에 패턴이 보입니다. '2'는 인접한 두 개의 지뢰가 있음을 나타냅니다.",
      "왼쪽 하단의 '1'을 보세요 - 그 옆에 열리지 않은 사각형이 하나만 있으므로 그곳에 지뢰가 있어야 합니다.",
      "지금까지 8개의 지뢰를 표시했고, 카운터에 따르면 이 게임에는 총 10개의 지뢰가 있습니다.",
      "중앙 영역은 완전히 깨끗합니다. 더 많은 숫자가 있는 가장자리에 집중하세요.",
      "왼쪽 상단에 50/50 추측 상황이 있습니다. 안타깝게도 어떤 사각형이 안전한지 논리적으로 결정할 방법이 없습니다.",
    ],
    tft: [
      "팀 구성에 전방 유닛이 부족합니다. 탱크 챔피언을 추가하는 것을 고려해보세요.",
      "라바돈의 죽음모자를 위한 좋은 아이템이 있습니다. 케넨에게 주세요.",
    ],
    lol: [
      "미니언을 막타하세요. 초반 골드를 얻는 데 매우 중요합니다.",
      "정글러가 갱킹을 위해 봇으로 오고 있습니다. 와딩을 통해 시야를 확보하세요.",
      "상대 미드 라이너가 사라졌습니다. 로밍을 가거나 정글러를 도울 수 있습니다.",
      "드래곤이 곧 생성됩니다. 팀원들과 함께 드래곤을 확보할 준비를 하세요.",
      "타워를 너무 깊숙이 푸쉬하지 마세요. 갱킹에 취약해질 수 있습니다.",
    ],
    valorant: [
      "스파이크를 심을 때 연막탄을 사용하세요. 적의 시야를 차단할 수 있습니다.",
      "코너를 확인할 때 항상 프리 에임을 하세요. 적을 더 빨리 발견할 수 있습니다.",
      "팀원들과 함께 움직이세요. 혼자서는 여러 명의 적을 상대하기 어렵습니다.",
      "경제 상황을 관리하세요. 다음 라운드에 필요한 장비를 구매할 수 있도록 돈을 아끼세요.",
      "상대의 플레이 스타일을 파악하세요. 그들의 약점을 공략할 수 있습니다.",
    ],
  }

  const analysis = analyses[game.id as keyof typeof analyses] || [
    "화면에 보이는 내용에 대한 분석을 제공할 수 없습니다.",
  ]
  return analysis[Math.floor(Math.random() * analysis.length)]
}

// Simulate AI Game Friend Service
export async function simulateAIGameFriendService(): Promise<string> {
  // In a real implementation, you would:
  // 1. Implement the UI for game selection, persona selection, and game interface
  // 2. Connect the UI to the backend API for voice recognition, GPT-4o response generation, and screen analysis

  // For demo, we'll simulate the frontend implementation only
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return `
AI Game Friend 서비스의 UI를 구현했습니다. 이 구현에는 다음과 같은 주요 기능이 포함되어 있습니다:

1. **게임 선택 화면**: 사용자가 플레이하고 싶은 게임을 선택할 수 있습니다.
2. **AI 페르소나 선택**: 사용자가 원하는 AI 친구의 성격을 선택할 수 있습니다.
3. **게임 인터페이스**:
   - 게임 화면 영역 (현재는 플레이스홀더)
   - 화면 분석 기능
   - 대화 로그
   - 음성 및 텍스트 입력 컨트롤

이 구현은 실제 API 연동 없이 프론트엔드 시뮬레이션만 포함하고 있습니다. 실제 서비스에서는 백엔드 API와 연동하여 음성 인식, GPT-4o 응답 생성, 화면 분석 등의 기능을 구현해야 합니다.
`
}
