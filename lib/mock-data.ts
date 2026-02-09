import type { MatchResult } from "./types"

export const founderMatches: MatchResult[] = [
  {
    id: "1",
    name: "张明远",
    org: "红杉中国",
    avatar: "ZM",
    score: 92,
    highlights: [
      "重点关注AI赛道，近半年投资3个AI项目",
      "您的用户增长数据超出其投资标准",
      "AI对话8轮深度交流，对技术方案高度认可",
      "团队背景与其偏好高度吻合",
    ],
    risks: ["估值预期可能需要进一步沟通", "对商业化时间线有严格要求"],
    chatRounds: 8,
    conversation: [
      {
        role: "founder-ai",
        content:
          "您好！我是来自「智能招聘助手」项目的AI代表。我们正在用大语言模型重新定义企业招聘流程，目前已服务200+企业客户。请问贵基金近期的投资方向是？",
        timestamp: "2025-02-10 14:23",
      },
      {
        role: "investor-ai",
        content:
          "你好！我们红杉中国确实在重点关注AI+企业服务赛道。能详细介绍一下你们的产品差异化和核心数据吗？",
        timestamp: "2025-02-10 14:25",
      },
      {
        role: "founder-ai",
        content:
          "当然。我们的核心优势在于自研的简历语义匹配引擎，准确率达到95%以上。目前月营收50万，MoM增长40%，用户留存率达到78%。团队核心成员来自字节跳动和阿里巴巴。",
        timestamp: "2025-02-10 14:27",
      },
      {
        role: "investor-ai",
        content:
          "数据表现不错。40%的月增长率很亮眼。能说说你们的获客策略和单位经济模型吗？CAC和LTV分别是多少？",
        timestamp: "2025-02-10 14:30",
      },
      {
        role: "founder-ai",
        content:
          "目前CAC约800元，LTV约12000元，LTV/CAC比值15:1。获客主要通过行业口碑和HR社群运营，付费转化率22%。我们还在开发API版本，预计将开放给猎头公司使用。",
        timestamp: "2025-02-10 14:33",
      },
      {
        role: "investor-ai",
        content:
          "LTV/CAC比值非常健康。你们目前的融资计划是怎样的？期望的估值和资金用途？",
        timestamp: "2025-02-10 14:36",
      },
      {
        role: "founder-ai",
        content:
          "本轮计划融资1500万人民币，Pre-A轮，预期估值8000万。资金主要用于：50%研发投入（扩大AI团队），30%市场拓展，20%运营储备。",
        timestamp: "2025-02-10 14:39",
      },
      {
        role: "investor-ai",
        content:
          "整体方案比较合理。我们对这个项目有较高兴趣，建议安排创始人与我们的合伙人进行深度沟通。可以重点准备技术架构和未来12个月的增长路径规划。",
        timestamp: "2025-02-10 14:42",
      },
    ],
  },
  {
    id: "2",
    name: "李文婷",
    org: "经纬创投",
    avatar: "LW",
    score: 78,
    highlights: [
      "专注企业服务SaaS领域投资",
      "AI对话6轮，对产品方向表示认可",
      "有多个同赛道被投企业可以产生协同",
    ],
    risks: ["对当前估值有不同看法", "希望看到更长期的财务预测"],
    chatRounds: 6,
    conversation: [
      {
        role: "founder-ai",
        content:
          "您好！我们是一个AI驱动的招聘SaaS平台，目前处于快速增长期。了解到经纬在企业服务领域有很深的布局，想了解一下合作可能性。",
        timestamp: "2025-02-10 15:00",
      },
      {
        role: "investor-ai",
        content:
          "你好，经纬确实在企业服务领域投了不少项目。说说你们和传统招聘SaaS的区别在哪？",
        timestamp: "2025-02-10 15:03",
      },
      {
        role: "founder-ai",
        content:
          "传统招聘SaaS主要是流程管理工具，我们的核心是AI匹配引擎。简历筛选效率提升10倍，客户平均招聘周期缩短60%。",
        timestamp: "2025-02-10 15:06",
      },
      {
        role: "investor-ai",
        content: "效率提升数据不错。你们的定价策略和客户画像是怎样的？",
        timestamp: "2025-02-10 15:09",
      },
      {
        role: "founder-ai",
        content:
          "主要面向100-1000人规模的科技公司，年费3.6万-12万不等。目前大客户续约率92%。",
        timestamp: "2025-02-10 15:12",
      },
      {
        role: "investor-ai",
        content:
          "续约率不错，说明产品有价值。我们有兴趣进一步了解，但估值方面可能需要深入讨论。建议准备详细的财务模型。",
        timestamp: "2025-02-10 15:15",
      },
    ],
  },
]

export const investorMatches: MatchResult[] = [
  {
    id: "3",
    name: "陈思远",
    org: "AI招聘助手",
    avatar: "CS",
    score: 92,
    highlights: [
      "月营收50万，环比增长40%",
      "团队核心成员来自BAT大厂",
      "AI对话中回答专业且数据详实",
      "LTV/CAC比值15:1，商业模型健康",
    ],
    risks: ["赛道竞争趋于激烈", "需要关注大厂入场风险"],
    chatRounds: 8,
    conversation: [
      {
        role: "investor-ai",
        content:
          "你好，我们了解到你们在做AI招聘方向。这个赛道我们一直在关注，能介绍一下你们的差异化优势吗？",
        timestamp: "2025-02-10 14:23",
      },
      {
        role: "founder-ai",
        content:
          "您好！我们的核心壁垒在于自研的语义匹配算法，经过200+企业客户验证，简历匹配准确率95%+。同时我们积累了大量行业数据，这是后来者很难复制的。",
        timestamp: "2025-02-10 14:25",
      },
      {
        role: "investor-ai",
        content:
          "技术壁垒听起来不错。能分享下关键业务指标吗？月营收、增长率、留存这些。",
        timestamp: "2025-02-10 14:28",
      },
      {
        role: "founder-ai",
        content:
          "目前月营收50万，连续6个月MoM增长40%。付费客户200+，月留存率78%，大客户年续约率92%。CAC约800元，LTV约12000元。",
        timestamp: "2025-02-10 14:31",
      },
      {
        role: "investor-ai",
        content:
          "数据非常扎实。你们怎么看大厂可能切入这个赛道？比如飞书、钉钉做AI招聘。",
        timestamp: "2025-02-10 14:34",
      },
      {
        role: "founder-ai",
        content:
          "好问题。大厂的优势在流量，但招聘是个需要深度行业know-how的领域。我们的客户反馈显示，通用AI工具在招聘场景的效果远不如我们的垂直方案。而且我们已经在建立数据网络效应。",
        timestamp: "2025-02-10 14:37",
      },
      {
        role: "investor-ai",
        content: "理解。团队情况怎么样？核心团队背景？",
        timestamp: "2025-02-10 14:40",
      },
      {
        role: "founder-ai",
        content:
          "CEO前字节跳动AI Lab负责人，CTO前阿里云算法专家，COO前猎聘华北区总经理。核心技术团队8人，全部来自一线互联网公司。",
        timestamp: "2025-02-10 14:43",
      },
    ],
  },
  {
    id: "4",
    name: "王思琪",
    org: "智能客服大脑",
    avatar: "WS",
    score: 75,
    highlights: [
      "AI客服替代率达80%以上",
      "获得两家头部银行的PoC合同",
      "技术架构清晰，可扩展性强",
    ],
    risks: [
      "当前营收规模较小",
      "金融行业合规要求需要持续投入",
    ],
    chatRounds: 5,
    conversation: [
      {
        role: "investor-ai",
        content: "你好，你们的AI客服产品目前主要服务哪些行业？",
        timestamp: "2025-02-11 10:00",
      },
      {
        role: "founder-ai",
        content:
          "我们主要聚焦金融行业，目前已经与两家头部股份制银行签订了PoC合同，AI客服替代率达到80%+，客户满意度反而提升了15%。",
        timestamp: "2025-02-11 10:03",
      },
      {
        role: "investor-ai",
        content: "金融行业对合规要求很高，你们是怎么处理的？",
        timestamp: "2025-02-11 10:06",
      },
      {
        role: "founder-ai",
        content:
          "我们在模型层面做了专门的合规微调，所有输出都经过实时风控审核。团队有两位来自银保监体系的合规专家。",
        timestamp: "2025-02-11 10:09",
      },
      {
        role: "investor-ai",
        content:
          "方向不错，但目前营收规模还需要继续验证。建议后续安排详细的产品演示和财务讨论。",
        timestamp: "2025-02-11 10:12",
      },
    ],
  },
]

export const industries = [
  "人工智能",
  "企业服务",
  "金融科技",
  "医疗健康",
  "电子商务",
  "教育科技",
  "硬件/IoT",
  "新能源",
  "Web3/区块链",
  "消费品牌",
  "物流供应链",
  "文娱传媒",
]

export const stages = ["天使轮", "Pre-A轮", "A轮", "B轮", "C轮及以上"]
