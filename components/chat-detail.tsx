"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScoreRing } from "@/components/score-ring"
import type { MatchResult } from "@/lib/types"
import { ArrowLeft, Download, Bot, Briefcase } from "lucide-react"

interface ChatDetailProps {
  match: MatchResult
  onBack: () => void
}

export function ChatDetail({ match, onBack }: ChatDetailProps) {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            {"返回匹配结果"}
          </button>

          <div className="flex items-center justify-between rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 font-display font-bold text-primary text-lg">
                {match.avatar}
              </div>
              <div>
                <h1 className="font-display text-lg font-bold">
                  {"AI对话记录"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {match.org} - {match.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{`共${match.chatRounds}轮对话`}</Badge>
              <ScoreRing score={match.score} size={52} />
            </div>
          </div>
        </div>

        {/* Conversation */}
        <div className="flex flex-col gap-3">
          {match.conversation.map((msg, i) => (
            <div
              key={`${msg.timestamp}-${i}`}
              className={`flex gap-3 rounded-xl border p-4 transition-all ${
                msg.role === "founder-ai"
                  ? "border-border bg-card"
                  : "border-primary/15 bg-primary/5"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  msg.role === "founder-ai"
                    ? "bg-accent/15 text-accent"
                    : "bg-primary/15 text-primary"
                }`}
              >
                {msg.role === "founder-ai" ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <Briefcase className="h-4 w-4" />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-foreground">
                    {msg.role === "founder-ai" ? "创业者AI" : "投资人AI"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-secondary-foreground">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Download */}
        <div className="mt-6 flex justify-center">
          <Button variant="outline" size="lg">
            <Download className="mr-2 h-4 w-4" />
            {"下载完整对话PDF"}
          </Button>
        </div>
      </div>
    </div>
  )
}
