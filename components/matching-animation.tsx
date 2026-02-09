"use client"

import { useEffect, useState } from "react"
import { Spinner } from "@/components/ui/spinner"

const steps = [
  "正在初始化AI分身...",
  "正在扫描匹配池...",
  "AI正在与候选方进行深度对话...",
  "正在分析对话质量...",
  "正在计算匹配度得分...",
  "匹配完成！正在生成报告...",
]

interface MatchingAnimationProps {
  onComplete: () => void
}

export function MatchingAnimation({ onComplete }: MatchingAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval)
          setTimeout(onComplete, 800)
          return prev
        }
        return prev + 1
      })
    }, 1200)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 1.5
      })
    }, 100)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [onComplete])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] animate-pulse" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Pulsing circles */}
        <div className="relative flex items-center justify-center">
          <div className="absolute h-32 w-32 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute h-24 w-24 rounded-full border border-primary/30 animate-ping" style={{ animationDuration: "1.5s" }} />
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
            <Spinner className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Status text */}
        <div className="flex flex-col items-center gap-4">
          <p className="font-display text-lg font-semibold text-foreground">
            {"AI匹配进行中"}
          </p>
          <p className="text-sm text-muted-foreground transition-all duration-300">
            {steps[currentStep]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64">
          <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {`${Math.min(Math.round(progress), 100)}%`}
          </p>
        </div>

        {/* Step indicators */}
        <div className="flex flex-col gap-2 mt-4">
          {steps.map((step, i) => (
            <div
              key={step}
              className={`flex items-center gap-2 text-xs transition-all duration-300 ${
                i <= currentStep
                  ? "text-foreground opacity-100"
                  : "text-muted-foreground opacity-40"
              }`}
            >
              <div
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i < currentStep
                    ? "bg-accent"
                    : i === currentStep
                      ? "bg-primary animate-pulse"
                      : "bg-muted-foreground"
                }`}
              />
              {step}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
