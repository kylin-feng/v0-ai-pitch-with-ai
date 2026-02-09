"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FeaturedProjectCard } from "@/components/featured-project-card"
import type { Role } from "@/lib/types"
import { featuredProjects, successStories } from "@/lib/mock-data"
import {
  Briefcase,
  Rocket,
  ArrowRight,
  Zap,
  TrendingUp,
  ChevronDown,
} from "lucide-react"

interface LoginScreenProps {
  onLogin: (role: Role) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [currentStory, setCurrentStory] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % successStories.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const scrollToProjects = () => {
    document.getElementById("featured-projects")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* ===== HERO SECTION ===== */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background glow effects */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[700px] rounded-full bg-primary/8 blur-[150px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-accent/5 blur-[120px]" />

        <div className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/25">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6 text-primary-foreground"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">AI Pitch</span>
          </div>

          {/* Core messaging */}
          <div className="flex flex-col items-center gap-5 text-center">
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-balance md:text-5xl lg:text-6xl">
              {"不要错过下一个"}
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                  {"改变世界的年轻人"}
                </span>
              </span>
            </h1>

            <p className="max-w-xl text-lg text-muted-foreground leading-relaxed text-balance">
              {"每一代伟大公司都源于一次被看见的机会。让AI帮你发现那些尚未被定义的未来独角兽。"}
            </p>
          </div>

          {/* Rotating success stories ticker */}
          <div className="flex items-center gap-3 rounded-full border border-border bg-card/60 px-5 py-2.5 backdrop-blur-sm">
            <Zap className="h-4 w-4 shrink-0 text-accent" />
            <div className="overflow-hidden h-5">
              <div
                className="transition-transform duration-500 ease-in-out"
                style={{ transform: `translateY(-${currentStory * 20}px)` }}
              >
                {successStories.map((story) => (
                  <p key={story.company} className="h-5 text-sm text-secondary-foreground whitespace-nowrap">
                    <span className="font-semibold text-foreground">{story.name}</span>
                    {" "}
                    <span className="text-muted-foreground">{story.year}</span>
                    {" "}
                    {story.note}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Vision statement */}
          <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card/40 px-8 py-5 backdrop-blur-sm text-center max-w-lg">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {"1999年，所有人拒绝马云。2006年，没人相信宿舍里能做出无人机。2015年，没人看好下沉市场电商。"}
            </p>
            <p className="text-sm font-semibold text-foreground">
              {"现在，AI让发现下一个他们变得更快、更准。"}
            </p>
          </div>

          {/* Role selection + Login */}
          <div className="flex w-full max-w-md flex-col gap-5">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("founder")}
                className={`group flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all ${
                  selectedRole === "founder"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                    selectedRole === "founder"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  <Rocket className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-display font-semibold">{"我是创业者"}</span>
                  <span className="text-xs text-muted-foreground">{"让AI帮你找到伯乐"}</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("investor")}
                className={`group flex flex-col items-center gap-3 rounded-xl border-2 p-5 transition-all ${
                  selectedRole === "investor"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
                }`}
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                    selectedRole === "investor"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="font-display font-semibold">{"我是投资人"}</span>
                  <span className="text-xs text-muted-foreground">{"不要错过下一个独角兽"}</span>
                </div>
              </button>
            </div>

            <Button
              size="lg"
              className="w-full text-base font-semibold"
              disabled={!selectedRole}
              onClick={() => selectedRole && onLogin(selectedRole)}
            >
              {"Second Me 一键登录"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              {"使用 Second Me 账号登录，您的AI分身将代表您完成初步沟通"}
            </p>
          </div>

          {/* Scroll hint */}
          <button
            type="button"
            onClick={scrollToProjects}
            className="mt-4 flex flex-col items-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="text-xs">{"查看明星项目推荐"}</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </button>
        </div>
      </section>

      {/* ===== BELIEF SECTION ===== */}
      <section className="relative border-t border-border bg-card/30 px-4 py-20">
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col items-center gap-8 text-center">
            <Badge variant="secondary" className="text-xs px-3 py-1">
              {"为什么选择 AI Pitch"}
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">
              {"相信年轻人的力量"}
            </h2>
            <p className="max-w-xl text-muted-foreground leading-relaxed text-balance">
              {"马云35岁创立阿里巴巴时被拒绝了30多次，黄峥创立拼多多时所有人都不看好下沉市场，汪滔在大学宿舍里做出了全球第一台消费级无人机。每一个伟大的公司，都曾经是一个「看起来不靠谱」的想法。"}
            </p>

            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold">{"AI 深度尽调"}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {"你的AI分身会替你完成8轮以上的深度对话，从数据到团队全方位评估"}
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <Zap className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display font-semibold">{"10分钟出结果"}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {"不用等3个月的漫长融资流程，AI帮你在10分钟内完成初步匹配与评估"}
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold">{"只见最合适的人"}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {"AI聊完了觉得匹配，你们再见面。把时间花在真正值得的对话上"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROJECTS SECTION ===== */}
      <section id="featured-projects" className="relative border-t border-border px-4 py-20">
        <div className="pointer-events-none absolute top-0 left-1/4 h-[400px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mb-10 flex flex-col items-center gap-3 text-center">
            <Badge variant="secondary" className="text-xs px-3 py-1">
              <Sparkles className="mr-1 h-3 w-3" />
              {"Demo - 项目展示示例"}
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance md:text-4xl">
              {"想象一下，这些项目出现在你面前"}
            </h2>
            <p className="max-w-lg text-muted-foreground leading-relaxed text-balance">
              {"以下是AI Pitch平台的项目展示示例。未来，真正的年轻创业者们将在这里等待你的发现。"}
            </p>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, i) => (
              <FeaturedProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 flex flex-col items-center gap-4">
            <p className="text-center text-sm text-muted-foreground text-balance">
              {"成为第一批用户，用AI发现那些还没被看见的下一个马云、下一个拼多多、下一个大疆。"}
            </p>
            <Button
              size="lg"
              className="font-semibold"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" })
              }}
            >
              {"立即开始匹配"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border bg-card/30 px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-4 w-4 text-primary-foreground"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-display text-sm font-bold">AI Pitch</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {"让每一个好想法都有被看见的机会"}
          </p>
        </div>
      </footer>
    </div>
  )
}

function Sparkles(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  )
}
