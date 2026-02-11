"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Briefcase, ChevronRight } from "lucide-react"

interface InvestorPreferenceData {
  id: string
  oneLiner: string
  createdAt: string
}

interface InvestorPreferenceListProps {
  preferences: InvestorPreferenceData[]
  onSelectPreference: (preference: InvestorPreferenceData) => void
  onCreateNew: () => void
  onBack: () => void
  userName?: string
}

export function InvestorPreferenceList({
  preferences,
  onSelectPreference,
  onCreateNew,
  onBack,
  userName,
}: InvestorPreferenceListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("zh-CN")
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
          <h1 className="font-display text-2xl font-bold">
            {userName ? `${userName}，欢迎回来` : "我的投资偏好"}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {"选择一个投资偏好进行AI匹配，或创建新偏好"}
          </p>
        </div>

        {/* Preference List */}
        <div className="flex flex-col gap-3 mb-6">
          {preferences.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-border">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">还没有投资偏好</p>
              <p className="text-sm text-muted-foreground/70">点击下方按钮设置您的投资偏好</p>
            </div>
          ) : (
            preferences.map((pref) => (
              <div
                key={pref.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId(pref.id === selectedId ? null : pref.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setSelectedId(pref.id === selectedId ? null : pref.id)
                  }
                }}
                className={`flex flex-col gap-2 rounded-xl border p-4 text-left transition-all cursor-pointer ${
                  selectedId === pref.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-foreground line-clamp-2">
                      {pref.oneLiner}
                    </p>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      selectedId === pref.id ? "rotate-90" : ""
                    }`}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(pref.createdAt)}
                  </span>
                </div>
                {selectedId === pref.id && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log("Matching with preference:", pref)
                        onSelectPreference(pref)
                      }}
                    >
                      {"使用此偏好匹配"}
                    </Button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Create New Button */}
        <Button
          variant="outline"
          size="lg"
          className="w-full text-base"
          onClick={onCreateNew}
        >
          <Plus className="mr-2 h-4 w-4" />
          {"设置新投资偏好"}
        </Button>
      </div>
    </div>
  )
}
