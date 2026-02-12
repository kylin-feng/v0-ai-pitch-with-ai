"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Briefcase, TrendingUp, Target, Calendar, ExternalLink, FolderOpen, Sparkles } from "lucide-react"

interface Investor {
  id: string
  name: string
  avatar: string | null
  bio: string | null
  route: string | null
  createdAt: string
  investorProfile: {
    id: string
    oneLiner: string
    industries: string[]
    stages: string[]
    minInvestment: number
    maxInvestment: number
  }
}

interface InvestorMarketplaceProps {
  onBack: () => void
  onMyProjects?: () => void
  onStartMatch?: (investorId: string) => void
}

export function InvestorMarketplace({ onBack, onMyProjects, onStartMatch }: InvestorMarketplaceProps) {
  const [investors, setInvestors] = useState<Investor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInvestors()
  }, [])

  const fetchInvestors = async () => {
    try {
      const response = await fetch("/api/investors/all")
      const result = await response.json()
      if (result.code === 0) {
        setInvestors(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch investors:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatInvestment = (amount: number | undefined | null) => {
    if (!amount || amount === 0) return "面议"
    if (amount >= 10000) return `${(amount / 10000).toFixed(0)}万`
    return `${amount}万`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "今天"
    if (diffDays === 1) return "昨天"
    if (diffDays < 7) return `${diffDays}天前`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
    return date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })
  }

  const openSecondMe = (route: string | null) => {
    if (route) {
      window.open(`https://secondme.ai/${route}`, "_blank")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-accent/5">
      {/* Decorative Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute bottom-0 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-accent/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    投资人广场
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    寻找志同道合的投资人，助力项目起飞
                  </p>
                </div>
              </div>
            </div>
            {onMyProjects && (
              <Button
                variant="outline"
                onClick={onMyProjects}
                className="gap-2"
              >
                <FolderOpen className="h-4 w-4" />
                我的项目
              </Button>
            )}
            <div className="text-right">
              <div className="text-2xl font-bold text-accent">{investors.length}</div>
              <div className="text-xs text-muted-foreground">活跃投资人</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full border-4 border-accent/30 border-t-accent animate-spin" />
              <p className="text-sm text-muted-foreground">加载中...</p>
            </div>
          </div>
        ) : investors.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <Briefcase className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">暂无投资人</h3>
              <p className="text-muted-foreground">当前还没有投资人，请稍后再来</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investors.map((investor, index) => (
              <div
                key={investor.id}
                className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1 hover:border-accent/50 overflow-hidden"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: "fadeInUp 0.5s ease-out forwards",
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Active Badge */}
                {formatDate(investor.createdAt).includes("天前") && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-accent rounded-full text-xs font-medium text-accent-foreground flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    活跃
                  </div>
                )}

                <div className="relative z-10">
                  {/* Investor Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <button
                        onClick={() => openSecondMe(investor.route)}
                        disabled={!investor.route}
                        className="h-12 w-12 rounded-full bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center text-lg font-semibold overflow-hidden ring-2 ring-background hover:ring-accent transition-all disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {investor.avatar ? (
                          <img
                            src={investor.avatar}
                            alt={investor.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="bg-gradient-to-br from-accent to-primary bg-clip-text text-transparent">
                            {investor.name.slice(0, 2)}
                          </span>
                        )}
                      </button>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-accent border-2 border-background" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{investor.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {investor.bio || "投资人"}
                      </p>
                    </div>
                  </div>

                  {/* Investment Preference */}
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {investor.investorProfile.oneLiner}
                    </p>
                  </div>

                  {/* Investment Range */}
                  <div className="mb-4 p-3 rounded-lg bg-accent/5 border border-accent/20">
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-accent" />
                      <span className="font-medium">
                        {formatInvestment(investor.investorProfile.minInvestment)} -{" "}
                        {formatInvestment(investor.investorProfile.maxInvestment)}
                      </span>
                    </div>
                  </div>

                  {/* Stages */}
                  {investor.investorProfile.stages && investor.investorProfile.stages.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                        <Target className="h-3 w-3" />
                        投资阶段
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {investor.investorProfile.stages.map((stage) => (
                          <span
                            key={stage}
                            className="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                          >
                            {stage}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Industries */}
                  {investor.investorProfile.industries && investor.investorProfile.industries.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                        <Briefcase className="h-3 w-3" />
                        关注行业
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {investor.investorProfile.industries.slice(0, 3).map((industry) => (
                          <span
                            key={industry}
                            className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full"
                          >
                            {industry}
                          </span>
                        ))}
                        {investor.investorProfile.industries.length > 3 && (
                          <span className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                            +{investor.investorProfile.industries.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(investor.createdAt)}
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-1.5"
                      onClick={() => onStartMatch?.(investor.id)}
                    >
                      发起匹配
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
