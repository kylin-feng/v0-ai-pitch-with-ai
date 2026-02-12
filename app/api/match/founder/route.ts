import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { chatWithSecondMe } from "@/lib/secondme"
import type { FounderProfile, MatchResult, ChatMessage } from "@/lib/types"

// 生成时间戳
function formatTime(baseTime: Date, minOffset: number): string {
  const d = new Date(baseTime.getTime() + minOffset * 60000)
  return d.toISOString().slice(0, 16).replace("T", " ")
}

// 创业者 AI 发言
async function founderAISay(
  accessToken: string,
  projectOneLiner: string,
  founderName: string,
  existingMessages: ChatMessage[],
  round: number
): Promise<string> {
  const lastInvestorMsg = existingMessages.filter(m => m.role === "investor-ai").pop()?.content || ""

  const context = existingMessages
    .map((m) => `${m.role === "founder-ai" ? "创业者" : "投资人"}：${m.content}`)
    .join("\n")

  const prompts: Record<number, string> = {
    1: `你是创业者${founderName}的AI代表，正在向投资人介绍项目。
你的项目：${projectOneLiner}

请用2-3句话开场，介绍项目核心价值，并询问投资人的投资偏好。`,

    2: `你是创业者${founderName}的AI代表，正在与投资人深入沟通。
你的项目：${projectOneLiner}
之前对话：
${context}
投资人问：${lastInvestorMsg}

请用具体的数据或案例回答，展示项目实力。2-3句话。`,

    3: `你是创业者${founderName}的AI代表，这是最后一轮对话。
你的项目：${projectOneLiner}
之前对话：
${context}
投资人说：${lastInvestorMsg}

请总结项目价值，并表达合作意愿。如果投资人表示有兴趣，请积极回应；如果不太匹配，也礼貌感谢。2-3句话。`,
  }

  const result = await chatWithSecondMe(accessToken, prompts[round] || prompts[1])
  return result || "感谢您的关注，期待有机会进一步交流。"
}

// 投资人 AI 发言
async function investorAISay(
  accessToken: string,
  investorOneLiner: string,
  projectOneLiner: string,
  investorName: string,
  existingMessages: ChatMessage[],
  round: number
): Promise<string> {
  const lastFounderMsg = existingMessages.filter(m => m.role === "founder-ai").pop()?.content || ""

  const context = existingMessages
    .map((m) => `${m.role === "founder-ai" ? "创业者" : "投资人"}：${m.content}`)
    .join("\n")

  const prompts: Record<number, string> = {
    1: `你是投资人${investorName}的AI代表，正在评估一个创业项目。
你的投资偏好：${investorOneLiner}
对方项目：${projectOneLiner}

请用2-3句话开场，表达对项目的初步兴趣，并提出一个关于产品或市场的问题。`,

    2: `你是投资人${investorName}的AI代表，正在与创业者深入沟通。
你的投资偏好：${investorOneLiner}
之前对话：
${context}
创业者说：${lastFounderMsg}

请针对创业者的回答，追问关于数据、商业模式或竞争优势的问题。2句话。`,

    3: `你是投资人${investorName}的AI代表，这是最后一轮对话。
你的投资偏好：${investorOneLiner}
之前对话：
${context}
创业者说：${lastFounderMsg}

请给出你对这个项目的总体评价，并表明是否有兴趣进一步沟通。2-3句话。
如果感兴趣，请说"希望能进一步交流"；如果不太匹配，请委婉表达。`,
  }

  const result = await chatWithSecondMe(accessToken, prompts[round] || prompts[1])
  return result || "感谢分享，我需要再考虑一下。"
}

// 计算项目与投资偏好的相关性分数
function calculateRelevanceScore(projectOneLiner: string, investorOneLiner: string): number {
  const projectKeywords = projectOneLiner.toLowerCase().split(/[\s，,。.！!？?]+/).filter(w => w.length > 1)
  const investorKeywords = investorOneLiner.toLowerCase().split(/[\s，,。.！!？?]+/).filter(w => w.length > 1)

  let matchCount = 0
  for (const pw of projectKeywords) {
    for (const iw of investorKeywords) {
      if (pw.includes(iw) || iw.includes(pw)) {
        matchCount++
      }
    }
  }

  const baseScore = 50
  const keywordBonus = Math.min(matchCount * 10, 40)
  const randomBonus = Math.floor(Math.random() * 10)

  return baseScore + keywordBonus + randomBonus
}

// 评估对话结果，判断是否匹配
function evaluateMatch(conversation: ChatMessage[]): { matched: boolean; score: number; highlights: string[]; risks: string[] } {
  const lastInvestorMsg = conversation.filter(m => m.role === "investor-ai").pop()?.content || ""

  // 基于最后一轮投资人的回复判断是否匹配
  const positiveKeywords = ["兴趣", "交流", "沟通", "合作", "不错", "看好", "有潜力", "期待", "安排", "详谈"]
  const negativeKeywords = ["不太", "暂时", "考虑", "再看", "不匹配", "方向不同"]

  let positiveScore = 0
  let negativeScore = 0

  positiveKeywords.forEach(keyword => {
    if (lastInvestorMsg.includes(keyword)) positiveScore++
  })

  negativeKeywords.forEach(keyword => {
    if (lastInvestorMsg.includes(keyword)) negativeScore++
  })

  const matched = positiveScore > negativeScore
  const score = Math.min(95, Math.max(50, 70 + (positiveScore - negativeScore) * 5))

  const highlights: string[] = []
  const risks: string[] = []

  if (matched) {
    highlights.push("AI对话顺利，双方意向匹配")
    if (positiveScore >= 2) highlights.push("投资人表现出强烈兴趣")
  } else {
    risks.push("投资方向可能存在差异")
  }

  return { matched, score, highlights, risks }
}

export async function POST(request: NextRequest) {
  console.log("=== Match Founder API Called ===")
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("secondme_access_token")?.value
    console.log("Access token exists:", !!accessToken)

    if (!accessToken) {
      console.log("No access token, returning 401")
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const founderProfile = body as FounderProfile
    console.log("Founder profile:", founderProfile)

    // 验证必填字段
    if (!founderProfile.oneLiner) {
      console.log("Missing oneLiner, returning 400")
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // 从数据库获取所有投资人及其偏好
    console.log("Fetching active investors...")
    const investors = await prisma.user.findMany({
      where: {
        role: "investor",
        investorProfile: { isNot: null },
      },
      include: {
        investorProfile: true,
      },
    })
    console.log("Found investors:", investors.length)

    if (investors.length === 0) {
      console.log("No investors found, returning empty matches")
      return NextResponse.json({
        success: true,
        matches: [],
        totalMatched: 0,
        message: "暂无匹配的投资人，请等待更多投资人加入平台",
      })
    }

    // 计算每个投资人与项目的相关性分数
    const investorsWithScore = investors
      .filter(inv => inv.investorProfile)
      .map(investor => ({
        investor,
        relevanceScore: calculateRelevanceScore(
          founderProfile.oneLiner,
          investor.investorProfile!.oneLiner
        )
      }))

    // 按相关性分数排序，选择最相关的1个
    investorsWithScore.sort((a, b) => b.relevanceScore - a.relevanceScore)
    const investorsToMatch = investorsWithScore.slice(0, 1).map(i => i.investor)
    console.log("Matching with", investorsToMatch.length, "most relevant investors")

    // 对每个投资人进行 AI 对话匹配
    const matchResults: MatchResult[] = []

    for (const investor of investorsToMatch) {
      if (!investor.investorProfile) continue

      console.log("Processing investor:", investor.id, investor.investorProfile.oneLiner.slice(0, 30))
      const conversation: ChatMessage[] = []
      const baseTime = new Date()

      // 进行 3 轮对话
      for (let round = 1; round <= 3; round++) {
        console.log(`  Round ${round} starting...`)
        // 创业者 AI 发言
        const founderMsg = await founderAISay(
          accessToken,
          founderProfile.oneLiner,
          founderProfile.name || "创业者",
          conversation,
          round
        )
        console.log(`  Founder AI said: ${founderMsg.slice(0, 50)}...`)
        conversation.push({
          role: "founder-ai",
          content: founderMsg,
          timestamp: formatTime(baseTime, (round - 1) * 6),
        })

        // 投资人 AI 发言
        const investorMsg = await investorAISay(
          accessToken,
          investor.investorProfile.oneLiner,
          founderProfile.oneLiner,
          investor.name,
          conversation,
          round
        )
        console.log(`  Investor AI said: ${investorMsg.slice(0, 50)}...`)
        conversation.push({
          role: "investor-ai",
          content: investorMsg,
          timestamp: formatTime(baseTime, (round - 1) * 6 + 3),
        })
      }

      console.log(`  Investor ${investor.id} done, ${conversation.length} messages`)
      // 评估对话结果
      const evaluation = evaluateMatch(conversation)

      matchResults.push({
        id: investor.id,
        name: investor.name,
        org: investor.bio || "投资人",
        avatar: investor.avatar || investor.name.slice(0, 2),
        score: evaluation.score,
        highlights: evaluation.highlights,
        risks: evaluation.risks,
        chatRounds: 3,
        conversation,
        matched: evaluation.matched,
        route: evaluation.matched ? investor.route || undefined : undefined,
      })
    }

    // 按匹配成功优先，然后按分数排序
    matchResults.sort((a, b) => {
      if (a.matched !== b.matched) return b.matched ? 1 : -1
      return b.score - a.score
    })

    return NextResponse.json({
      success: true,
      matches: matchResults.slice(0, 10),
      totalMatched: matchResults.filter(m => m.matched).length,
    })
  } catch (error) {
    console.error("Match error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
