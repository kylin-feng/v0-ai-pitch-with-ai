import { NextRequest } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { chatWithSecondMe } from "@/lib/secondme"
import type { InvestorProfile, ChatMessage } from "@/lib/types"

// 生成时间戳
function formatTime(baseTime: Date, minOffset: number): string {
  const d = new Date(baseTime.getTime() + minOffset * 60000)
  return d.toISOString().slice(0, 16).replace("T", " ")
}

// 投资人 AI 发言
async function investorAISay(
  accessToken: string,
  investorOneLiner: string,
  projectOneLiner: string,
  existingMessages: ChatMessage[],
  round: number
): Promise<string> {
  const context = existingMessages
    .map((m) => `${m.role === "founder-ai" ? "创业者" : "投资人"}：${m.content}`)
    .join("\n")

  const prompts: Record<number, string> = {
    1: `你是一位投资人AI，正在评估一个创业项目。
你的投资偏好：${investorOneLiner}
对方项目：${projectOneLiner}

请用2-3句话开场，表达对项目的初步兴趣，并提出一个关于产品或市场的问题。`,

    2: `你是一位投资人AI，正在与创业者深入沟通。
你的投资偏好：${investorOneLiner}
之前对话：
${context}

请针对创业者的回答，追问关于数据、商业模式或竞争优势的问题。2句话。`,

    3: `你是一位投资人AI，这是最后一轮对话。
你的投资偏好：${investorOneLiner}
之前对话：
${context}

请给出你对这个项目的总体评价，并表明是否有兴趣进一步沟通。2-3句话。
如果感兴趣，请说"希望能进一步交流"；如果不太匹配，请委婉表达。`,
  }

  const result = await chatWithSecondMe(accessToken, prompts[round] || prompts[1])
  return result || "感谢分享，我需要再考虑一下。"
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
投资人问：${lastInvestorMsg}

请专业地回答投资人的问题，突出项目优势。2-3句话。`,

    2: `你是创业者${founderName}的AI代表。
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

// 计算投资偏好与项目的初始相关性分数
function calculateRelevanceScore(investorOneLiner: string, projectOneLiner: string): number {
  const investorKeywords = investorOneLiner.toLowerCase().split(/[\s，,。.！!？?]+/).filter(w => w.length > 1)
  const projectKeywords = projectOneLiner.toLowerCase().split(/[\s，,。.！!？?]+/).filter(w => w.length > 1)

  // 计算关键词重叠
  let matchCount = 0
  for (const iw of investorKeywords) {
    for (const pw of projectKeywords) {
      if (iw.includes(pw) || pw.includes(iw)) {
        matchCount++
      }
    }
  }

  // 基础分数 + 关键词匹配加分
  const baseScore = 50
  const keywordBonus = Math.min(matchCount * 10, 40)

  // 添加一些随机性，模拟更复杂的匹配
  const randomBonus = Math.floor(Math.random() * 10)

  return baseScore + keywordBonus + randomBonus
}

// 评估对话结果
function evaluateMatch(conversation: ChatMessage[]): { matched: boolean; score: number; highlights: string[]; risks: string[] } {
  const lastInvestorMsg = conversation.filter(m => m.role === "investor-ai").pop()?.content || ""
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
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("secondme_access_token")?.value

  if (!accessToken) {
    return new Response(JSON.stringify({ error: "Not authenticated" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    })
  }

  const body = await request.json()
  const investorProfile = body as InvestorProfile

  if (!investorProfile.oneLiner) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  // 创建 SSE 流
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      try {
        // 获取项目
        send({ type: "status", message: "正在查找创业项目..." })

        const projects = await prisma.project.findMany({
          where: { status: "active" },
          include: { user: true },
        })

        if (projects.length === 0) {
          send({ type: "complete", matches: [], totalMatched: 0, message: "暂无匹配的创业项目" })
          controller.close()
          return
        }

        send({ type: "status", message: `找到 ${projects.length} 个项目，正在分析相关性...` })

        // 计算每个项目与投资偏好的相关性分数
        const projectsWithScore = projects.map(project => ({
          project,
          relevanceScore: calculateRelevanceScore(investorProfile.oneLiner, project.oneLiner)
        }))

        // 按相关性分数排序，选择最相关的3个
        projectsWithScore.sort((a, b) => b.relevanceScore - a.relevanceScore)
        const projectsToMatch = projectsWithScore.slice(0, 3).map(p => p.project)

        send({ type: "status", message: `已筛选出 ${projectsToMatch.length} 个最相关项目，开始 AI 对话匹配...` })
        const matches: any[] = []

        for (let i = 0; i < projectsToMatch.length; i++) {
          const project = projectsToMatch[i]
          const conversation: ChatMessage[] = []
          const baseTime = new Date()

          send({
            type: "project_start",
            projectIndex: i + 1,
            totalProjects: projectsToMatch.length,
            projectName: project.oneLiner.slice(0, 30) + "...",
            founderName: project.user.name,
          })

          // 3 轮对话
          for (let round = 1; round <= 3; round++) {
            send({ type: "round_start", round, projectIndex: i + 1 })

            // 投资人 AI
            const investorMsg = await investorAISay(
              accessToken,
              investorProfile.oneLiner,
              project.oneLiner,
              conversation,
              round
            )
            conversation.push({
              role: "investor-ai",
              content: investorMsg,
              timestamp: formatTime(baseTime, (round - 1) * 6),
            })
            send({
              type: "message",
              role: "investor-ai",
              content: investorMsg,
              round,
              projectIndex: i + 1,
            })

            // 创业者 AI
            const founderMsg = await founderAISay(
              accessToken,
              project.oneLiner,
              project.user.name,
              conversation,
              round
            )
            conversation.push({
              role: "founder-ai",
              content: founderMsg,
              timestamp: formatTime(baseTime, (round - 1) * 6 + 3),
            })
            send({
              type: "message",
              role: "founder-ai",
              content: founderMsg,
              round,
              projectIndex: i + 1,
            })
          }

          // 评估
          const evaluation = evaluateMatch(conversation)
          const matchResult = {
            id: project.id,
            name: project.user.name,
            org: project.oneLiner.slice(0, 30) + "...",
            avatar: project.user.avatar || project.user.name.slice(0, 2),
            score: evaluation.score,
            highlights: evaluation.highlights,
            risks: evaluation.risks,
            chatRounds: 3,
            conversation,
            matched: evaluation.matched,
            route: evaluation.matched ? project.user.route || undefined : undefined,
          }
          matches.push(matchResult)

          send({
            type: "project_complete",
            projectIndex: i + 1,
            matched: evaluation.matched,
            score: evaluation.score,
          })
        }

        // 排序
        matches.sort((a, b) => {
          if (a.matched !== b.matched) return b.matched ? 1 : -1
          return b.score - a.score
        })

        send({
          type: "complete",
          matches,
          totalMatched: matches.filter((m: any) => m.matched).length,
        })
      } catch (error) {
        console.error("Stream error:", error)
        send({ type: "error", message: "匹配过程出错" })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
