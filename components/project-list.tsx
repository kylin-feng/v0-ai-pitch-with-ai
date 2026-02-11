"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, Rocket, ChevronRight } from "lucide-react"

interface Project {
  id: string
  oneLiner: string
  status: string
  createdAt: string
}

interface ProjectListProps {
  projects: Project[]
  onSelectProject: (project: Project) => void
  onCreateNew: () => void
  onBack: () => void
  userName?: string
}

export function ProjectList({
  projects,
  onSelectProject,
  onCreateNew,
  onBack,
  userName,
}: ProjectListProps) {
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
            {userName ? `${userName}，欢迎回来` : "我的项目"}
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {"选择一个项目进行AI匹配，或创建新项目"}
          </p>
        </div>

        {/* Project List */}
        <div className="flex flex-col gap-3 mb-6">
          {projects.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-dashed border-border">
              <Rocket className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">还没有项目</p>
              <p className="text-sm text-muted-foreground/70">点击下方按钮创建您的第一个项目</p>
            </div>
          ) : (
            projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => setSelectedId(project.id === selectedId ? null : project.id)}
                className={`flex flex-col gap-2 rounded-xl border p-4 text-left transition-all ${
                  selectedId === project.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-foreground line-clamp-2">
                      {project.oneLiner}
                    </p>
                  </div>
                  <ChevronRight
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      selectedId === project.id ? "rotate-90" : ""
                    }`}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
                {selectedId === project.id && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <Button
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectProject(project)
                      }}
                    >
                      {"使用此项目匹配"}
                    </Button>
                  </div>
                )}
              </button>
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
          {"创建新项目"}
        </Button>
      </div>
    </div>
  )
}
