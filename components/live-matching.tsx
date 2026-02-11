"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle, User, Briefcase } from "lucide-react"
import type { MatchResult, InvestorProfile } from "@/lib/types"

interface LiveMessage {
  id: string
  role: "investor-ai" | "founder-ai"
  content: string
  round: number
}

interface LiveMatchingProps {
  investorProfile: InvestorProfile
  onComplete: (matches: MatchResult[]) => void
  onCancel: () => void
}

export function LiveMatching({ investorProfile, onComplete, onCancel }: LiveMatchingProps) {
  const [status, setStatus] = useState("正在连接...")
  const [currentProject, setCurrentProject] = useState<{
    index: number
    total: number
    name: string
    founderName: string
  } | null>(null)
  const [currentRound, setCurrentRound] = useState(0)
  const [messages, setMessages] = useState<LiveMessage[]>([])
  const [completedProjects, setCompletedProjects] = useState<{
    id: string
    index: number
    matched: boolean
    score: number
  }[]>([])
  const [error, setError] = useState<string | null>(null)
  const hasStarted = useRef(false)
  const messageCounter = useRef(0)

  const startMatching = useCallback(async () => {
    // 防止重复调用
    if (hasStarted.current) return
    hasStarted.current = true
    try {
      const response = await fetch("/api/match/investor/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(investorProfile),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader")

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split("\n")

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))

              switch (data.type) {
                case "status":
                  setStatus(data.message)
                  break

                case "project_start":
                  setCurrentProject({
                    index: data.projectIndex,
                    total: data.totalProjects,
                    name: data.projectName,
                    founderName: data.founderName,
                  })
                  setMessages([])
                  setCurrentRound(0)
                  break

                case "round_start":
                  setCurrentRound(data.round)
                  break

                case "message":
                  messageCounter.current++
                  setMessages((prev) => [
                    ...prev,
                    {
                      id: `msg-${data.projectIndex}-${data.round}-${data.role}-${messageCounter.current}`,
                      role: data.role,
                      content: data.content,
                      round: data.round,
                    },
                  ])
                  break

                case "project_complete":
                  setCompletedProjects((prev) => [
                    ...prev,
                    {
                      id: `project-${data.projectIndex}-${Date.now()}`,
                      index: data.projectIndex,
                      matched: data.matched,
                      score: data.score,
                    },
                  ])
                  break

                case "complete":
                  onComplete(data.matches)
                  break

                case "error":
                  setError(data.message)
                  break
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
    } catch (err) {
      console.error("Matching error:", err)
      setError(err instanceof Error ? err.message : "匹配失败")
    }
  }, [investorProfile, onComplete])

  useEffect(() => {
    startMatching()
  }, [startMatching])

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="text-center">
          <XCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">匹配出错</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button onClick={onCancel}>返回</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <h1 className="text-2xl font-bold">AI 正在为您匹配</h1>
          </div>
          <p className="text-muted-foreground">{status}</p>
        </div>

        {/* Progress */}
        {completedProjects.length > 0 && (
          <div className="flex justify-center gap-2 mb-6">
            {completedProjects.map((p) => (
              <div
                key={p.id}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  p.matched
                    ? "bg-accent/20 text-accent"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {p.matched ? <CheckCircle2 className="h-5 w-5" /> : p.score}
              </div>
            ))}
            {currentProject && (
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/20">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}
          </div>
        )}

        {/* Current Project */}
        {currentProject && (
          <div className="rounded-xl border border-border bg-card p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  项目 {currentProject.index}/{currentProject.total}
                </p>
                <h3 className="font-semibold">{currentProject.name}</h3>
                <p className="text-sm text-muted-foreground">
                  创业者: {currentProject.founderName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">对话轮次</p>
                <p className="text-2xl font-bold text-primary">{currentRound}/3</p>
              </div>
            </div>

            {/* Live Messages */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${
                    msg.role === "investor-ai" ? "" : "flex-row-reverse"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "investor-ai"
                        ? "bg-primary/15 text-primary"
                        : "bg-accent/15 text-accent"
                    }`}
                  >
                    {msg.role === "investor-ai" ? (
                      <Briefcase className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div
                    className={`flex-1 rounded-lg p-3 text-sm ${
                      msg.role === "investor-ai"
                        ? "bg-primary/5 text-left"
                        : "bg-accent/5 text-right"
                    }`}
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      {msg.role === "investor-ai" ? "投资人 AI" : "创业者 AI"} · 第{msg.round}轮
                    </p>
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))}
              {messages.length > 0 && messages.length % 2 === 1 && (
                <div className="flex gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-accent/15 text-accent">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="flex-1 rounded-lg p-3 text-sm bg-accent/5 text-right">
                    <Loader2 className="h-4 w-4 animate-spin inline-block" />
                    <span className="ml-2 text-muted-foreground">创业者 AI 正在回复...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cancel Button */}
        <div className="text-center">
          <Button variant="outline" onClick={onCancel}>
            取消匹配
          </Button>
        </div>
      </div>
    </div>
  )
}
