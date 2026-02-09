import type { FounderProfile, InvestorProfile, MatchResult } from "./types"

const API_BASE = "/api"

export interface MatchResponse {
  success: boolean
  matches: MatchResult[]
  totalMatched: number
  error?: string
}

// 创业者匹配投资人
export async function matchFounderToInvestors(
  profile: FounderProfile
): Promise<MatchResponse> {
  try {
    const response = await fetch(`${API_BASE}/match/founder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Match founder error:", error)
    return {
      success: false,
      matches: [],
      totalMatched: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// 投资人匹配创业者
export async function matchInvestorToFounders(
  profile: InvestorProfile
): Promise<MatchResponse> {
  try {
    const response = await fetch(`${API_BASE}/match/investor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Match investor error:", error)
    return {
      success: false,
      matches: [],
      totalMatched: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// 生成更多对话
export async function generateMoreChat(params: {
  matchId: string
  founderInfo?: {
    projectName: string
    oneLiner: string
    industry: string
    revenue?: string
    userCount?: string
    fundingAmount: number
  }
  investorInfo?: {
    name: string
    org: string
    industries: string[]
  }
  existingMessages?: Array<{
    role: "founder-ai" | "investor-ai"
    content: string
    timestamp: string
  }>
  generateMore?: boolean
}) {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Chat error:", error)
    return {
      success: false,
      messages: [],
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
