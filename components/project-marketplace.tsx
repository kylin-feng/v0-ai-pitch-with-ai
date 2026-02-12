"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Building2, TrendingUp, Users, MapPin, Calendar, ExternalLink, Grid, FolderOpen } from "lucide-react"

interface Project {
  id: string
  projectName: string
  oneLiner: string
  industry: string
  fundingAmount: number
  userCount?: string
  revenue?: string
  createdAt: string
  user: {
    id: string
    name: string
    avatar: string | null
    bio: string | null
    route: string | null
  }
}

interface ProjectMarketplaceProps {
  onBack: () => void
  onMyProjects?: () => void
  onStartMatch?: (projectId: string) => void
}

export function ProjectMarketplace({ onBack, onMyProjects, onStartMatch }: ProjectMarketplaceProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects/all")
      const result = await response.json()
      if (result.code === 0) {
        setProjects(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatFunding = (amount: number | undefined | null) => {
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Decorative Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 -left-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-lg bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    项目广场
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    发现优质创业项目，连接创新机会
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
                我的偏好
              </Button>
            )}
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{projects.length}</div>
              <div className="text-xs text-muted-foreground">活跃项目</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
              <p className="text-sm text-muted-foreground">加载中...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center max-w-md">
              <div className="mx-auto mb-6 h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <Building2 className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">暂无项目</h3>
              <p className="text-muted-foreground">当前还没有创业项目，请稍后再来</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 hover:border-primary/50 overflow-hidden"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: "fadeInUp 0.5s ease-out forwards",
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* New Badge */}
                {formatDate(project.createdAt).includes("天前") && (
                  <div className="absolute top-4 right-4 px-2 py-1 bg-accent rounded-full text-xs font-medium text-accent-foreground">
                    新项目
                  </div>
                )}

                <div className="relative z-10">
                  {/* Founder Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <button
                        onClick={() => openSecondMe(project.user.route)}
                        disabled={!project.user.route}
                        className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-lg font-semibold overflow-hidden ring-2 ring-background hover:ring-primary transition-all disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {project.user.avatar ? (
                          <img
                            src={project.user.avatar}
                            alt={project.user.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                            {project.user.name.slice(0, 2)}
                          </span>
                        )}
                      </button>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-accent border-2 border-background" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{project.user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {project.user.bio || "创业者"}
                      </p>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {project.projectName}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {project.oneLiner}
                    </p>
                  </div>

                  {/* Tags & Metrics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      <MapPin className="h-3 w-3" />
                      {project.industry}
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium">
                      <TrendingUp className="h-3 w-3" />
                      {formatFunding(project.fundingAmount)}
                    </div>
                    {project.userCount && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                        <Users className="h-3 w-3" />
                        {project.userCount}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {formatDate(project.createdAt)}
                    </div>
                    <Button
                      size="sm"
                      variant="default"
                      className="gap-1.5"
                      onClick={() => onStartMatch?.(project.id)}
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
