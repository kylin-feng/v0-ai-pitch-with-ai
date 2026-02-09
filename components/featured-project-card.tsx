"use client"

import { Badge } from "@/components/ui/badge"
import type { FeaturedProject } from "@/lib/mock-data"
import { TrendingUp, Users, Sparkles } from "lucide-react"

interface FeaturedProjectCardProps {
  project: FeaturedProject
  index: number
}

export function FeaturedProjectCard({ project, index }: FeaturedProjectCardProps) {
  return (
    <div
      className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:bg-card/80"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* AI Score Badge */}
      <div className="absolute -top-2.5 right-4">
        <div className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/20">
          <Sparkles className="h-3 w-3" />
          {`AI评分 ${project.aiScore}`}
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center gap-2">
          <h3 className="font-display text-lg font-bold text-foreground">{project.name}</h3>
          <Badge variant="secondary" className="text-xs">
            {project.stage}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{project.tagline}</p>
      </div>

      {/* Founder Info */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/15 text-xs font-bold text-accent">
          {project.founder.charAt(0)}
        </div>
        <span className="text-sm text-foreground">{project.founder}</span>
        <span className="text-xs text-accent font-medium">{`${project.founderAge}岁`}</span>
        <span className="text-xs text-muted-foreground">{project.industry}</span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 rounded-lg bg-secondary/50 p-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">{"月营收"}</span>
          <span className="text-sm font-semibold text-foreground">{project.monthlyRevenue}</span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">{"增长率"}</span>
          <span className="flex items-center gap-0.5 text-sm font-semibold text-accent">
            <TrendingUp className="h-3 w-3" />
            {project.growth}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-muted-foreground">{"团队"}</span>
          <span className="flex items-center gap-0.5 text-sm font-semibold text-foreground">
            <Users className="h-3 w-3 text-muted-foreground" />
            {`${project.teamSize}人`}
          </span>
        </div>
      </div>

      {/* Highlights */}
      <ul className="flex flex-col gap-1">
        {project.highlights.map((h) => (
          <li
            key={h}
            className="text-xs text-secondary-foreground leading-relaxed pl-3.5 relative before:absolute before:left-0 before:top-[7px] before:h-1 before:w-1 before:rounded-full before:bg-accent/60"
          >
            {h}
          </li>
        ))}
      </ul>
    </div>
  )
}
