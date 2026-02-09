import { NextRequest, NextResponse } from "next/server"
import type { FounderProfile, MatchResult, ChatMessage } from "@/lib/types"

// 模拟投资人数据库
const investorDatabase = [
  {
    id: "inv-1",
    name: "张明远",
    org: "红杉中国",
    avatar: "ZM",
    industries: ["人工智能", "企业服务", "金融科技"],
    stages: ["Pre-A轮", "A轮", "B轮"],
    investmentRange: [500, 5000] as [number, number],
    focus: "AI+企业服务，关注技术壁垒和增长数据",
  },
  {
    id: "inv-2",
    name: "李文婷",
    org: "经纬创投",
    avatar: "LW",
    industries: ["企业服务", "金融科技", "医疗健康"],
    stages: ["天使轮", "Pre-A轮", "A轮"],
    investmentRange: [200, 3000] as [number, number],
    focus: "SaaS和企业服务，注重商业模式验证",
  },
  {
    id: "inv-3",
    name: "王建华",
    org: "IDG资本",
    avatar: "WJ",
    industries: ["人工智能", "硬件/IoT", "新能源"],
    stages: ["A轮", "B轮", "C轮及以上"],
    investmentRange: [1000, 10000] as [number, number],
    focus: "硬科技和AI基础设施，偏好技术驱动型团队",
  },
  {
    id: "inv-4",
    name: "陈晓敏",
    org: "GGV纪源资本",
    avatar: "CX",
    industries: ["电子商务", "消费品牌", "企业服务"],
    stages: ["Pre-A轮", "A轮", "B轮"],
    investmentRange: [500, 8000] as [number, number],
    focus: "消费和企业服务，关注用户增长和留存",
  },
  {
    id: "inv-5",
    name: "刘思齐",
    org: "高瓴创投",
    avatar: "LS",
    industries: ["医疗健康", "人工智能", "教育科技"],
    stages: ["A轮", "B轮", "C轮及以上"],
    investmentRange: [2000, 20000] as [number, number],
    focus: "AI+医疗，关注长期价值和社会影响力",
  },
]

// 计算匹配分数
function calculateMatchScore(
  founder: FounderProfile,
  investor: typeof investorDatabase[0]
): number {
  let score = 0

  // 行业匹配 (40分)
  if (investor.industries.includes(founder.industry)) {
    score += 40
  } else {
    // 部分相关行业
    const relatedIndustries: Record<string, string[]> = {
      "人工智能": ["企业服务", "金融科技", "医疗健康"],
      "企业服务": ["人工智能", "金融科技"],
      "金融科技": ["人工智能", "企业服务"],
    }
    if (relatedIndustries[founder.industry]?.some(i => investor.industries.includes(i))) {
      score += 20
    }
  }

  // 融资金额匹配 (30分)
  const [minInvest, maxInvest] = investor.investmentRange
  if (founder.fundingAmount >= minInvest && founder.fundingAmount <= maxInvest) {
    score += 30
  } else if (founder.fundingAmount >= minInvest * 0.5 && founder.fundingAmount <= maxInvest * 1.5) {
    score += 15
  }

  // 数据质量加分 (30分)
  if (founder.revenue) {
    const revenueNum = parseFloat(founder.revenue.replace(/[^0-9.]/g, "")) || 0
    if (revenueNum >= 50) score += 15
    else if (revenueNum >= 10) score += 10
    else if (revenueNum > 0) score += 5
  }

  if (founder.userCount) {
    const userNum = parseFloat(founder.userCount.replace(/[^0-9.]/g, "")) || 0
    if (userNum >= 10) score += 15
    else if (userNum >= 1) score += 10
    else if (userNum > 0) score += 5
  }

  // 添加一些随机性使结果更真实
  score += Math.floor(Math.random() * 10) - 5

  return Math.min(100, Math.max(0, score))
}

// 生成亮点
function generateHighlights(
  founder: FounderProfile,
  investor: typeof investorDatabase[0],
  score: number
): string[] {
  const highlights: string[] = []

  if (investor.industries.includes(founder.industry)) {
    highlights.push(`重点关注${founder.industry}赛道，与您的方向高度契合`)
  }

  if (founder.revenue) {
    highlights.push(`您的营收数据表现良好，符合其投资标准`)
  }

  if (founder.userCount) {
    highlights.push(`用户增长数据亮眼，展现了产品市场匹配度`)
  }

  if (score >= 80) {
    highlights.push(`AI对话深度交流，对项目表现出高度兴趣`)
  }

  highlights.push(`${investor.org}在该领域有丰富投资经验`)

  return highlights.slice(0, 4)
}

// 生成风险点
function generateRisks(
  founder: FounderProfile,
  investor: typeof investorDatabase[0]
): string[] {
  const risks: string[] = []

  const [minInvest, maxInvest] = investor.investmentRange
  if (founder.fundingAmount > maxInvest) {
    risks.push("融资金额超出其常规投资范围")
  }

  if (!founder.revenue || parseFloat(founder.revenue.replace(/[^0-9.]/g, "")) < 10) {
    risks.push("可能需要更多商业化数据支撑")
  }

  risks.push("估值预期可能需要进一步沟通")

  return risks.slice(0, 2)
}

// 生成模拟对话
function generateConversation(
  founder: FounderProfile,
  investor: typeof investorDatabase[0]
): ChatMessage[] {
  const now = new Date()
  const formatTime = (minOffset: number) => {
    const d = new Date(now.getTime() + minOffset * 60000)
    return d.toISOString().slice(0, 16).replace("T", " ")
  }

  return [
    {
      role: "founder-ai",
      content: `您好！我是来自「${founder.projectName}」项目的AI代表。${founder.oneLiner}。目前${founder.userCount ? `已有${founder.userCount}用户` : "正在快速增长中"}。请问贵基金近期的投资方向是？`,
      timestamp: formatTime(0),
    },
    {
      role: "investor-ai",
      content: `你好！${investor.org}确实在重点关注${founder.industry}赛道。能详细介绍一下你们的产品差异化和核心数据吗？`,
      timestamp: formatTime(2),
    },
    {
      role: "founder-ai",
      content: `当然。我们的核心优势在于${founder.oneLiner}。${founder.revenue ? `目前月营收${founder.revenue}，` : ""}${founder.userCount ? `用户数${founder.userCount}。` : ""}团队核心成员来自一线互联网公司。`,
      timestamp: formatTime(5),
    },
    {
      role: "investor-ai",
      content: `数据表现${founder.revenue ? "不错" : "需要进一步了解"}。能说说你们的获客策略和商业模式吗？`,
      timestamp: formatTime(8),
    },
    {
      role: "founder-ai",
      content: `我们主要通过行业口碑和精准营销获客。本轮计划融资${founder.fundingAmount >= 10000 ? `${(founder.fundingAmount / 10000).toFixed(1)}亿` : `${founder.fundingAmount}万`}，主要用于产品研发和市场拓展。`,
      timestamp: formatTime(11),
    },
    {
      role: "investor-ai",
      content: `整体方向比较符合我们的投资偏好。建议安排创始人与我们的投资团队进行深度沟通，可以重点准备技术架构和未来增长规划。`,
      timestamp: formatTime(14),
    },
  ]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const founderProfile = body as FounderProfile

    // 验证必填字段
    if (!founderProfile.projectName || !founderProfile.oneLiner || !founderProfile.industry) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // 计算每个投资人的匹配分数
    const matchResults: MatchResult[] = investorDatabase
      .map((investor) => {
        const score = calculateMatchScore(founderProfile, investor)
        const chatRounds = Math.floor(score / 15) + 3

        return {
          id: investor.id,
          name: investor.name,
          org: investor.org,
          avatar: investor.avatar,
          score,
          highlights: generateHighlights(founderProfile, investor, score),
          risks: generateRisks(founderProfile, investor),
          chatRounds,
          conversation: generateConversation(founderProfile, investor),
        }
      })
      .filter((match) => match.score >= 50) // 只返回分数>=50的匹配
      .sort((a, b) => b.score - a.score) // 按分数降序
      .slice(0, 5) // 最多返回5个

    return NextResponse.json({
      success: true,
      matches: matchResults,
      totalMatched: matchResults.length,
    })
  } catch (error) {
    console.error("Match error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
