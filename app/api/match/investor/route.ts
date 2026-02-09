import { NextRequest, NextResponse } from "next/server"
import type { InvestorProfile, MatchResult, ChatMessage } from "@/lib/types"

// 模拟创业者项目数据库
const founderDatabase = [
  {
    id: "fnd-1",
    name: "陈思远",
    org: "AI招聘助手",
    avatar: "CS",
    projectName: "AI招聘助手",
    oneLiner: "用AI重新定义企业招聘流程",
    industry: "人工智能",
    fundingAmount: 1500,
    userCount: "200+企业客户",
    revenue: "50万",
    stage: "Pre-A轮",
    teamBackground: "团队核心成员来自字节跳动和阿里巴巴",
    metrics: { mrr: 50, growth: 40, retention: 78 },
  },
  {
    id: "fnd-2",
    name: "王思琪",
    org: "智能客服大脑",
    avatar: "WS",
    projectName: "智能客服大脑",
    oneLiner: "AI驱动的金融行业智能客服解决方案",
    industry: "金融科技",
    fundingAmount: 2000,
    userCount: "2家头部银行PoC",
    revenue: "15万",
    stage: "Pre-A轮",
    teamBackground: "团队有两位来自银保监体系的合规专家",
    metrics: { mrr: 15, growth: 60, retention: 85 },
  },
  {
    id: "fnd-3",
    name: "李明辉",
    org: "医学影像AI",
    avatar: "LM",
    projectName: "医学影像AI",
    oneLiner: "用深度学习提升医学影像诊断效率",
    industry: "医疗健康",
    fundingAmount: 3000,
    userCount: "15家三甲医院",
    revenue: "80万",
    stage: "A轮",
    teamBackground: "CEO为斯坦福博士，CTO来自谷歌健康",
    metrics: { mrr: 80, growth: 35, retention: 92 },
  },
  {
    id: "fnd-4",
    name: "张雅琳",
    org: "跨境电商SaaS",
    avatar: "ZY",
    projectName: "跨境电商SaaS",
    oneLiner: "一站式跨境电商运营管理平台",
    industry: "电子商务",
    fundingAmount: 1000,
    userCount: "500+卖家",
    revenue: "30万",
    stage: "天使轮",
    teamBackground: "团队有10年跨境电商运营经验",
    metrics: { mrr: 30, growth: 50, retention: 70 },
  },
  {
    id: "fnd-5",
    name: "刘浩然",
    org: "新能源电池回收",
    avatar: "LH",
    projectName: "新能源电池回收",
    oneLiner: "动力电池梯次利用和回收解决方案",
    industry: "新能源",
    fundingAmount: 5000,
    userCount: "3家车企合作",
    revenue: "200万",
    stage: "A轮",
    teamBackground: "团队来自宁德时代和比亚迪",
    metrics: { mrr: 200, growth: 25, retention: 95 },
  },
  {
    id: "fnd-6",
    name: "周小峰",
    org: "智能财务机器人",
    avatar: "ZX",
    projectName: "智能财务机器人",
    oneLiner: "AI自动化企业财务流程",
    industry: "企业服务",
    fundingAmount: 800,
    userCount: "100+中小企业",
    revenue: "20万",
    stage: "天使轮",
    teamBackground: "团队来自四大会计师事务所",
    metrics: { mrr: 20, growth: 45, retention: 75 },
  },
]

// 计算匹配分数
function calculateMatchScore(
  investor: InvestorProfile,
  founder: typeof founderDatabase[0]
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
      "医疗健康": ["人工智能"],
    }
    if (relatedIndustries[founder.industry]?.some(i => investor.industries.includes(i))) {
      score += 20
    }
  }

  // 阶段匹配 (30分)
  if (investor.stage.includes(founder.stage)) {
    score += 30
  } else {
    // 相邻阶段也给分
    const stageOrder = ["天使轮", "Pre-A轮", "A轮", "B轮", "C轮及以上"]
    const founderIdx = stageOrder.indexOf(founder.stage)
    const hasAdjacent = investor.stage.some(s => {
      const idx = stageOrder.indexOf(s)
      return Math.abs(idx - founderIdx) === 1
    })
    if (hasAdjacent) score += 15
  }

  // 投资金额匹配 (20分)
  const [minInvest, maxInvest] = investor.investmentRange
  if (founder.fundingAmount >= minInvest && founder.fundingAmount <= maxInvest) {
    score += 20
  } else if (founder.fundingAmount >= minInvest * 0.5 && founder.fundingAmount <= maxInvest * 1.5) {
    score += 10
  }

  // 数据质量加分 (10分)
  if (founder.metrics.mrr >= 50) score += 5
  if (founder.metrics.growth >= 30) score += 3
  if (founder.metrics.retention >= 80) score += 2

  // 添加一些随机性
  score += Math.floor(Math.random() * 10) - 5

  return Math.min(100, Math.max(0, score))
}

// 生成亮点
function generateHighlights(
  investor: InvestorProfile,
  founder: typeof founderDatabase[0],
  score: number
): string[] {
  const highlights: string[] = []

  if (founder.metrics.mrr >= 30) {
    highlights.push(`月营收${founder.revenue}，${founder.metrics.growth > 30 ? "增长势头强劲" : "稳步增长中"}`)
  }

  highlights.push(founder.teamBackground)

  if (founder.metrics.retention >= 80) {
    highlights.push(`用户留存率${founder.metrics.retention}%，产品粘性强`)
  }

  if (score >= 80) {
    highlights.push("AI对话中回答专业且数据详实")
  }

  if (founder.userCount) {
    highlights.push(`已服务${founder.userCount}`)
  }

  return highlights.slice(0, 4)
}

// 生成风险点
function generateRisks(
  investor: InvestorProfile,
  founder: typeof founderDatabase[0]
): string[] {
  const risks: string[] = []

  if (founder.metrics.mrr < 30) {
    risks.push("当前营收规模较小，需要持续验证")
  }

  if (founder.metrics.growth < 30) {
    risks.push("增长速度可能需要进一步提升")
  }

  if (!investor.stage.includes(founder.stage)) {
    risks.push("融资阶段与您的偏好略有差异")
  }

  risks.push("赛道竞争需要持续关注")

  return risks.slice(0, 2)
}

// 生成模拟对话
function generateConversation(
  investor: InvestorProfile,
  founder: typeof founderDatabase[0]
): ChatMessage[] {
  const now = new Date()
  const formatTime = (minOffset: number) => {
    const d = new Date(now.getTime() + minOffset * 60000)
    return d.toISOString().slice(0, 16).replace("T", " ")
  }

  return [
    {
      role: "investor-ai",
      content: `你好，我们了解到你们在做${founder.industry}方向。这个赛道我们一直在关注，能介绍一下你们的差异化优势吗？`,
      timestamp: formatTime(0),
    },
    {
      role: "founder-ai",
      content: `您好！${founder.oneLiner}。我们的核心壁垒在于${founder.teamBackground}，目前已经${founder.userCount}验证，这是后来者很难复制的优势。`,
      timestamp: formatTime(3),
    },
    {
      role: "investor-ai",
      content: "技术壁垒听起来不错。能分享下关键业务指标吗？月营收、增长率、留存这些。",
      timestamp: formatTime(6),
    },
    {
      role: "founder-ai",
      content: `目前月营收${founder.revenue}，连续多月保持${founder.metrics.growth}%+增长。客户留存率${founder.metrics.retention}%，复购意愿强烈。`,
      timestamp: formatTime(9),
    },
    {
      role: "investor-ai",
      content: `数据表现${founder.metrics.mrr >= 50 ? "非常扎实" : "有潜力"}。你们怎么看竞争格局？`,
      timestamp: formatTime(12),
    },
    {
      role: "founder-ai",
      content: `我们的优势在于垂直领域的深度积累。通用解决方案在专业场景的效果远不如我们的垂直方案。而且我们已经在建立数据和客户网络效应。`,
      timestamp: formatTime(15),
    },
    {
      role: "investor-ai",
      content: `方向不错，${founder.metrics.mrr >= 50 ? "建议安排详细的产品演示和团队沟通" : "建议后续持续关注业务进展"}。`,
      timestamp: formatTime(18),
    },
  ]
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const investorProfile = body as InvestorProfile

    // 验证必填字段
    if (!investorProfile.industries?.length || !investorProfile.stage?.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // 计算每个创业者的匹配分数
    const matchResults: MatchResult[] = founderDatabase
      .map((founder) => {
        const score = calculateMatchScore(investorProfile, founder)
        const chatRounds = Math.floor(score / 15) + 3

        return {
          id: founder.id,
          name: founder.name,
          org: founder.org,
          avatar: founder.avatar,
          score,
          highlights: generateHighlights(investorProfile, founder, score),
          risks: generateRisks(investorProfile, founder),
          chatRounds,
          conversation: generateConversation(investorProfile, founder),
        }
      })
      .filter((match) => match.score >= 50)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

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
