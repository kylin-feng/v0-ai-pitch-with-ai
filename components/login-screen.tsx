"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Role } from "@/lib/types"
import { Briefcase, Rocket, Loader2 } from "lucide-react"

interface LoginScreenProps {
  onLogin: (role: Role) => void
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSecondMeLogin = () => {
    if (!selectedRole) return

    setIsLoading(true)

    // 保存选择的角色到localStorage，OAuth回调后读取
    localStorage.setItem("pendingRole", selectedRole)

    // 跳转到Second Me OAuth授权页面，通过state参数传递角色
    window.location.href = `/api/auth/authorize?role=${selectedRole}`
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      {/* Glow effect */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />

      <div className="relative z-10 flex w-full max-w-md flex-col items-center gap-8">
        {/* Logo & Tagline */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
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
            <h1 className="font-display text-3xl font-bold tracking-tight">
              AI Pitch
            </h1>
          </div>
          <p className="text-muted-foreground text-balance leading-relaxed">
            {"让创业者的AI和投资人的AI先聊，合适了再让真人见面"}
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex w-full flex-col gap-3">
          <p className="text-center text-sm text-muted-foreground">
            {"选择您的身份"}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole("founder")}
              disabled={isLoading}
              className={`group flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                selectedRole === "founder"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                  selectedRole === "founder"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground group-hover:text-foreground"
                }`}
              >
                <Rocket className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-display font-semibold">{"创业者"}</span>
                <span className="text-xs text-muted-foreground">
                  {"寻找理想的投资人"}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole("investor")}
              disabled={isLoading}
              className={`group flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all ${
                selectedRole === "investor"
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:border-primary/50 hover:bg-card/80"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                  selectedRole === "investor"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground group-hover:text-foreground"
                }`}
              >
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-display font-semibold">{"投资人"}</span>
                <span className="text-xs text-muted-foreground">
                  {"发现优质项目"}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Login Button */}
        <div className="flex w-full flex-col gap-3">
          <Button
            size="lg"
            className="w-full text-base font-semibold"
            disabled={!selectedRole || isLoading}
            onClick={handleSecondMeLogin}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {"正在跳转..."}
              </>
            ) : (
              "Second Me 一键登录"
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            {"使用 Second Me 账号安全登录，您的AI分身将代表您进行初步沟通"}
          </p>
        </div>
      </div>
    </div>
  )
}
