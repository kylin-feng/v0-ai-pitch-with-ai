"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { industries } from "@/lib/mock-data"
import type { FounderProfile } from "@/lib/types"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface FounderFormProps {
  onSubmit: (profile: FounderProfile) => void
  onBack: () => void
}

export function FounderForm({ onSubmit, onBack }: FounderFormProps) {
  const [projectName, setProjectName] = useState("")
  const [oneLiner, setOneLiner] = useState("")
  const [industry, setIndustry] = useState("")
  const [fundingAmount, setFundingAmount] = useState([1000])
  const [userCount, setUserCount] = useState("")
  const [revenue, setRevenue] = useState("")

  const isValid = projectName && oneLiner && industry

  function handleSubmit() {
    if (!isValid) return
    onSubmit({
      projectName,
      oneLiner,
      industry,
      fundingAmount: fundingAmount[0],
      userCount,
      revenue,
    })
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[500px] rounded-full bg-primary/8 blur-[100px]" />

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
          <h1 className="font-display text-2xl font-bold">{"填写项目信息"}</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {"您的AI分身将基于这些信息与投资人AI进行深度沟通"}
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="projectName">{"项目名称"}</Label>
            <Input
              id="projectName"
              placeholder="例如：智能招聘助手"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="oneLiner">{"一句话介绍"}</Label>
            <Input
              id="oneLiner"
              placeholder="例如：用AI重新定义企业招聘流程"
              value={oneLiner}
              onChange={(e) => setOneLiner(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{"所属行业"}</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="选择行业" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>{"融资金额"}</Label>
              <span className="text-sm font-medium text-primary">
                {fundingAmount[0] >= 10000
                  ? `${(fundingAmount[0] / 10000).toFixed(1)}亿`
                  : `${fundingAmount[0]}万`}
              </span>
            </div>
            <Slider
              value={fundingAmount}
              onValueChange={setFundingAmount}
              min={100}
              max={50000}
              step={100}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{"100万"}</span>
              <span>{"5亿"}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="userCount">{"用户数"}</Label>
              <Input
                id="userCount"
                placeholder="例如：10万+"
                value={userCount}
                onChange={(e) => setUserCount(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="revenue">{"月营收"}</Label>
              <Input
                id="revenue"
                placeholder="例如：50万"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
              />
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
