"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { industries, stages } from "@/lib/mock-data"
import type { InvestorProfile } from "@/lib/types"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface InvestorFormProps {
  onSubmit: (profile: InvestorProfile) => void
  onBack: () => void
}

export function InvestorForm({ onSubmit, onBack }: InvestorFormProps) {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [selectedStages, setSelectedStages] = useState<string[]>([])
  const [investRange, setInvestRange] = useState([500, 5000])

  const isValid = selectedIndustries.length > 0 && selectedStages.length > 0

  function toggleIndustry(ind: string) {
    setSelectedIndustries((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]
    )
  }

  function toggleStage(stage: string) {
    setSelectedStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
    )
  }

  function handleSubmit() {
    if (!isValid) return
    onSubmit({
      industries: selectedIndustries,
      stage: selectedStages,
      investmentRange: [investRange[0], investRange[1]],
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[500px] rounded-full bg-accent/8 blur-[100px]" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2 w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            {"返回"}
          </button>
          <h1 className="font-display text-2xl font-bold">{"设置投资偏好"}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {"您的AI分身将基于这些偏好筛选并评估创业项目"}
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6">
          {/* Industries */}
          <div className="flex flex-col gap-3">
            <Label>{"关注行业（可多选）"}</Label>
            <div className="flex flex-wrap gap-2">
              {industries.map((ind) => (
                <button
                  key={ind}
                  type="button"
                  onClick={() => toggleIndustry(ind)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                    selectedIndustries.includes(ind)
                      ? "border-primary bg-primary/15 text-primary"
                      : "border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          </div>

          {/* Stages */}
          <div className="flex flex-col gap-3">
            <Label>{"投资阶段（可多选）"}</Label>
            <div className="flex flex-wrap gap-2">
              {stages.map((stage) => (
                <button
                  key={stage}
                  type="button"
                  onClick={() => toggleStage(stage)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                    selectedStages.includes(stage)
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-accent/40"
                  }`}
                >
                  {stage}
                </button>
              ))}
            </div>
          </div>

          {/* Investment Range */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>{"单笔投资范围"}</Label>
              <span className="text-sm font-medium text-primary">
                {investRange[0] >= 10000
                  ? `${(investRange[0] / 10000).toFixed(1)}亿`
                  : `${investRange[0]}万`}
                {" - "}
                {investRange[1] >= 10000
                  ? `${(investRange[1] / 10000).toFixed(1)}亿`
                  : `${investRange[1]}万`}
              </span>
            </div>
            <Slider
              value={investRange}
              onValueChange={setInvestRange}
              min={100}
              max={50000}
              step={100}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{"100万"}</span>
              <span>{"5亿"}</span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <Button
          size="lg"
          className="mt-6 w-full text-base font-semibold"
          disabled={!isValid}
          onClick={handleSubmit}
        >
          {"开始AI匹配"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
