export type Role = "founder" | "investor"

export interface SecondMeUserProfile {
  id: string
  name: string
  email?: string
  avatar?: string
  bio?: string
  selfIntro?: string
  route?: string
}

export interface SecondMeShade {
  tag: string
  confidence: number
  description?: string
  publicVersion?: string
  privateVersion?: string
}

export interface FounderProfile {
  oneLiner: string
}

export interface InvestorProfile {
  oneLiner: string
}

export interface ChatMessage {
  role: "founder-ai" | "investor-ai"
  content: string
  timestamp: string
}

export interface MatchResult {
  id: string
  name: string
  org: string
  avatar: string
  score: number
  highlights: string[]
  risks: string[]
  chatRounds: number
  conversation: ChatMessage[]
  matched: boolean // AI 对话后是否匹配成功
  route?: string // 匹配成功后显示对方的 Second Me route
}
