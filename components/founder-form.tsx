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
import type { FounderProfile, SecondMeUserProfile, SecondMeShade } from "@/lib/types"
import { ArrowLeft, ArrowRight, User } from "lucide-react"

interface FounderFormProps {
  onSubmit: (profile: FounderProfile) => void
  onBack: () => void
  user?: SecondMeUserProfile | null
  shades?: SecondMeShade[]
}

export function FounderForm({ onSubmit, onBack, user, shades = [] }: FounderFormProps) {
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
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
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
                  className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {shade.tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-5 rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="oneLiner">{"一句话介绍"}</Label>
            <Input
              id="oneLiner"
              placeholder="例如：用AI重新定义企业招聘流程"
              value={oneLiner}
              onChange={(e) => setOneLiner(e.target.value)}
              className="h-12"
            />
          </div>
        </div>

        {/* Submit */}
        <Button
          size="lg"
          className="mt-6 w-full text-base font-semibold"
          disabled={!isValid}
          onClick={handleSubmit}
        >
          {"保存项目"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
