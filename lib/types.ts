export type Role = "founder" | "investor"

export interface FounderProfile {
  projectName: string
  oneLiner: string
  industry: string
  fundingAmount: number
  userCount: string
  revenue: string
}

export interface InvestorProfile {
  industries: string[]
  stage: string[]
  investmentRange: [number, number]
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
}
