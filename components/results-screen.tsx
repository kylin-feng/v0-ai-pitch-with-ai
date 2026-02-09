"use client"

import { MatchCard } from "@/components/match-card"
import type { MatchResult, Role } from "@/lib/types"
import { Target } from "lucide-react"

interface ResultsScreenProps {
  role: Role
  matches: MatchResult[]
  onViewChat: (match: MatchResult) => void
}

export function ResultsScreen({
  role,
  matches,
  onViewChat,
}: ResultsScreenProps) {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-primary">
            <Target className="h-5 w-5" />
            <h1 className="font-display text-2xl font-bold text-foreground">
              {role === "founder" ? "匹配到的投资人" : "发现的优质项目"}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {role === "founder"
              ? "以下投资人与您的项目高度匹配，AI已完成初步沟通"
              : "以下项目符合您的投资偏好，AI已完成深度评估"}
          </p>
          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              {`${matches.length} 个高质量匹配`}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" />
              {"AI已完成深度对话"}
            </span>
          </div>
        </div>

        {/* Match Cards */}
        <div className="flex flex-col gap-4">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              role={role}
              onViewChat={onViewChat}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
