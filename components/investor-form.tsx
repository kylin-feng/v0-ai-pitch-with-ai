"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { industries, stages } from "@/lib/mock-data"
import type { InvestorProfile, SecondMeUserProfile, SecondMeShade } from "@/lib/types"
import { ArrowLeft, ArrowRight, User } from "lucide-react"

interface InvestorFormProps {
  onSubmit: (profile: InvestorProfile) => void
  onBack: () => void
  user?: SecondMeUserProfile | null
  shades?: SecondMeShade[]
}

export function InvestorForm({ onSubmit, onBack, user, shades = [] }: InvestorFormProps) {
  const [oneLiner, setOneLiner] = useState("")

  const isValid = oneLiner



  function handleSubmit() {
    if (!isValid) return
    onSubmit({
      oneLiner,
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

        {/* User Info Card */}
        {user && (
          <div className="mb-6 flex items-center gap-4 rounded-xl border border-border bg-card/50 p-4">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <User className="h-6 w-6 text-accent" />
              </div>
            )}
            <div className="flex-1">
              <p className="font-semibold">{user.name}</p>
              {user.bio && (
                <p className="text-sm text-muted-foreground line-clamp-1">{user.bio}</p>
              )}
            </div>
          </div>
        )}

        {/* User Shades/Tags */}
        {shades.length > 0 && (
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">{"您的兴趣标签"}</p>
            <div className="flex flex-wrap gap-2">
              {shades.slice(0, 6).map((shade, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                >
                  {shade.tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-6">
          {/* One Liner */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="oneLiner">{"一句话描述"}</Label>
            <Input
              id="oneLiner"
              placeholder="例如：我想投资具有创新技术的早期AI项目"
              value={oneLiner}
              onChange={(e) => setOneLiner(e.target.value)}
              className="h-12"
            />
            <p className="text-xs text-muted-foreground">
              {"简短描述您想投资的项目类型"}
            </p>
          </div>
        </div>

        {/* Submit */}
        <Button
          size="lg"
          className="mt-6 w-full text-base font-semibold"
          disabled={!isValid}
          onClick={handleSubmit}
        >
          {"保存偏好"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
