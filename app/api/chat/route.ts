import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import type { ChatMessage } from "@/lib/types"
import { chatWithSecondMe } from "@/lib/secondme"

interface ChatRequest {
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
    focus?: string
  }
  existingMessages?: ChatMessage[]
  generateMore?: boolean
}

// 使用Second Me生成对话
async function generateWithSecondMe(
  accessToken: string,
  founderInfo: ChatRequest["founderInfo"],
  investorInfo: ChatRequest["investorInfo"],
  existingMessages: ChatMessage[],
  isInitial: boolean
): Promise<ChatMessage[] | null> {
  const now = new Date()
  const formatTime = (minOffset: number) => {
    const d = new Date(now.getTime() + minOffset * 60000)
    return d.toISOString().slice(0, 16).replace("T", " ")
  }

  try {
    if (isInitial) {
      // 创业者开场
      const founderPrompt = `你现在扮演项目「${founderInfo?.projectName}」的创业者AI代表，正在向投资人介绍项目。
项目：${founderInfo?.oneLiner}
行业：${founderInfo?.industry}
${founderInfo?.revenue ? `月营收：${founderInfo.revenue}` : ""}
${founderInfo?.userCount ? `用户：${founderInfo.userCount}` : ""}
融资：${founderInfo?.fundingAmount}万

请用2-3句话简洁介绍项目，并询问投资人的投资方向。`

      const founderContent = await chatWithSecondMe(accessToken, founderPrompt)

      // 投资人回复
      const investorPrompt = `你现在扮演${investorInfo?.org || "投资机构"}的投资人AI代表。
关注领域：${investorInfo?.industries?.join("、") || "科技"}
投资偏好：${investorInfo?.focus || "早期项目"}

创业者介绍了${founderInfo?.industry}项目「${founderInfo?.projectName}」：${founderInfo?.oneLiner}

请表达兴趣并提出一个关于产品或数据的问题。2-3句话。`

      const investorContent = await chatWithSecondMe(accessToken, investorPrompt)

      if (founderContent && investorContent) {
        return [
          {
            role: "founder-ai",
            content: founderContent,
            timestamp: formatTime(0),
          },
          {
            role: "investor-ai",
            content: investorContent,
            timestamp: formatTime(2),
          },
        ]
      }
    } else {
      // 后续对话
      const context = existingMessages
        .slice(-4)
        .map((m) => `${m.role === "founder-ai" ? "创业者" : "投资人"}：${m.content}`)
        .join("\n")

      const round = Math.floor(existingMessages.length / 2)
      const topics = ["获客和留存数据", "技术壁垒", "商业模式", "团队和融资计划", "下一步安排"]
      const topic = topics[Math.min(round, topics.length - 1)]

      // 投资人提问
      const investorPrompt = `你是投资人AI，正在与创业者深入沟通。
之前对话：
${context}

请围绕"${topic}"提一个专业问题。1-2句话。`

      const investorContent = await chatWithSecondMe(accessToken, investorPrompt)

      // 创业者回答
      const founderPrompt = `你是「${founderInfo?.projectName}」创业者AI。
项目：${founderInfo?.oneLiner}
${founderInfo?.revenue ? `营收：${founderInfo.revenue}` : ""}
${founderInfo?.userCount ? `用户：${founderInfo.userCount}` : ""}

投资人问：${investorContent || topic}

请专业回答，用数据说话。2-3句话。`

      const founderContent = await chatWithSecondMe(accessToken, founderPrompt)

      if (investorContent && founderContent) {
        const lastTime = existingMessages.length > 0
          ? new Date(existingMessages[existingMessages.length - 1].timestamp).getTime()
          : now.getTime()

        return [
          {
            role: "investor-ai",
            content: investorContent,
            timestamp: new Date(lastTime + 3 * 60000).toISOString().slice(0, 16).replace("T", " "),
          },
          {
            role: "founder-ai",
            content: founderContent,
            timestamp: new Date(lastTime + 6 * 60000).toISOString().slice(0, 16).replace("T", " "),
          },
        ]
      }
    }

    return null
  } catch (error) {
    console.error("Second Me chat error:", error)
    return null
  }
}

// 模板对话（备用）
function generateTemplateMessages(
  founderInfo: ChatRequest["founderInfo"],
  investorInfo: ChatRequest["investorInfo"],
  existingMessages: ChatMessage[],
  isInitial: boolean
): ChatMessage[] {
  const now = new Date()
  const formatTime = (minOffset: number) => {
    const d = new Date(now.getTime() + minOffset * 60000)
    return d.toISOString().slice(0, 16).replace("T", " ")
  }

  if (isInitial) {
    return [
      {
        role: "founder-ai",
        content: `您好！我是「${founderInfo?.projectName || "创业项目"}」的AI代表。${founderInfo?.oneLiner || "我们正在打造创新产品"}。请问贵基金近期的投资方向是？`,
        timestamp: formatTime(0),
      },
      {
        role: "investor-ai",
        content: `你好！${investorInfo?.org || "我们"}在关注${founderInfo?.industry || "相关"}赛道。能介绍下产品和核心数据吗？`,
        timestamp: formatTime(2),
      },
    ]
  }

  const lastTime = existingMessages.length > 0
    ? new Date(existingMessages[existingMessages.length - 1].timestamp).getTime()
    : now.getTime()

  const round = Math.floor(existingMessages.length / 2)
  const templates = [
    [
      { role: "investor-ai" as const, content: "获客成本和LTV比值如何？" },
      { role: "founder-ai" as const, content: `CAC约800元，LTV约12000元，比值15:1。付费转化率22%。` },
    ],
    [
      { role: "investor-ai" as const, content: "技术上有什么独特壁垒？" },
      { role: "founder-ai" as const, content: `自研${founderInfo?.industry || ""}专用模型，准确率比通用方案高30%。有5项专利。` },
    ],
    [
      { role: "investor-ai" as const, content: "定价和续约情况如何？" },
      { role: "founder-ai" as const, content: "SaaS订阅制，年费3.6-12万。大客户续约率92%。" },
    ],
    [
      { role: "investor-ai" as const, content: "团队和融资计划？" },
      { role: "founder-ai" as const, content: `核心团队12人。本轮融资${founderInfo?.fundingAmount || 1000}万，50%研发、30%市场、20%运营。` },
    ],
    [
      { role: "investor-ai" as const, content: "整体不错，建议安排合伙人详谈。请准备BP。" },
      { role: "founder-ai" as const, content: "感谢！材料会尽快准备，期待合作。" },
    ],
  ]

  const template = templates[Math.min(round, templates.length - 1)]
  return template.map((msg, idx) => ({
    ...msg,
    timestamp: new Date(lastTime + (idx + 1) * 3 * 60000).toISOString().slice(0, 16).replace("T", " "),
  }))
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { founderInfo, investorInfo, existingMessages = [], generateMore } = body

    const isInitial = !generateMore
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("secondme_access_token")?.value

    // 尝试使用Second Me生成
    if (accessToken) {
      const aiMessages = await generateWithSecondMe(
        accessToken,
        founderInfo,
        investorInfo,
        existingMessages,
        isInitial
      )

      if (aiMessages) {
        const totalRounds = Math.floor((existingMessages.length + aiMessages.length) / 2)
        return NextResponse.json({
          success: true,
          messages: aiMessages,
          canContinue: totalRounds < 5,
          totalRounds,
          source: "secondme",
        })
      }
    }

    // 回退到模板
    const messages = generateTemplateMessages(founderInfo, investorInfo, existingMessages, isInitial)
    const totalRounds = Math.floor((existingMessages.length + messages.length) / 2)

    return NextResponse.json({
      success: true,
      messages,
      canContinue: totalRounds < 5,
      totalRounds,
      source: "template",
    })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
