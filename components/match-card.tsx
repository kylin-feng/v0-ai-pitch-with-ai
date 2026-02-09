"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScoreRing } from "@/components/score-ring"
import type { MatchResult, Role } from "@/lib/types"
import {
  MessageSquare,
  Calendar,
  Download,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"

interface MatchCardProps {
  match: MatchResult
  role: Role
  onViewChat: (match: MatchResult) => void
}

export function MatchCard({ match, role, onViewChat }: MatchCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/30">
      {/* Header */}
      <div className="flex items-start gap-4 p-5 pb-0">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 font-display font-bold text-primary text-lg">
          {match.avatar}
        </div>
        <div className="flex flex-1 flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-display font-semibold text-base truncate">
              {role === "founder" ? match.org : match.org}
            </h3>
            <Badge
              variant="secondary"
              className="shrink-0 text-xs"
            >
              {`${match.chatRounds}轮对话`}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{match.name}</p>
        </div>
        <ScoreRing score={match.score} size={64} />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-5">
        {/* Highlights */}
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-1.5 text-xs font-medium text-accent">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {role === "founder" ? "为什么匹配" : "项目亮点"}
          </p>
          <ul className="flex flex-col gap-1.5">
            {match.highlights.map((h) => (
              <li
                key={h}
                className="text-sm text-secondary-foreground leading-relaxed pl-5 relative before:absolute before:left-0 before:top-[9px] before:h-1 before:w-1 before:rounded-full before:bg-accent/60"
              >
                {h}
              </li>
            ))}
          </ul>
        </div>

        {/* Risks */}
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-1.5 text-xs font-medium text-destructive">
            <AlertTriangle className="h-3.5 w-3.5" />
            {"需要关注"}
          </p>
          <ul className="flex flex-col gap-1.5">
            {match.risks.map((r) => (
              <li
                key={r}
                className="text-sm text-muted-foreground leading-relaxed pl-5 relative before:absolute before:left-0 before:top-[9px] before:h-1 before:w-1 before:rounded-full before:bg-destructive/60"
              >
                {r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 border-t border-border p-4">
        <Button
          variant="default"
          size="sm"
          className="flex-1"
          onClick={() => onViewChat(match)}
        >
          <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
          {"查看对话"}
        </Button>
        <Button variant="secondary" size="sm" className="flex-1">
          <Calendar className="mr-1.5 h-3.5 w-3.5" />
          {"约见面"}
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-3.5 w-3.5" />
          <span className="sr-only">{"下载PDF"}</span>
        </Button>
      </div>
    </div>
  )
}
