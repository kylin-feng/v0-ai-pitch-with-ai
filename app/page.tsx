"use client"

import { useState, useCallback, useEffect } from "react"
import { LoginScreen } from "@/components/login-screen"
import { FounderForm } from "@/components/founder-form"
import { InvestorForm } from "@/components/investor-form"
import { MatchingAnimation } from "@/components/matching-animation"
import { ResultsScreen } from "@/components/results-screen"
import { ChatDetail } from "@/components/chat-detail"
import { matchFounderToInvestors, matchInvestorToFounders } from "@/lib/api"
import { founderMatches, investorMatches } from "@/lib/mock-data"
import type { Role, MatchResult, FounderProfile, InvestorProfile } from "@/lib/types"

type AppStep = "login" | "profile" | "matching" | "results" | "chat-detail"

export default function Page() {
  const [step, setStep] = useState<AppStep>("login")
  const [role, setRole] = useState<Role | null>(null)
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null)
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [founderProfile, setFounderProfile] = useState<FounderProfile | null>(null)
  const [investorProfile, setInvestorProfile] = useState<InvestorProfile | null>(null)

  // 检查OAuth回调状态
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const authSuccess = urlParams.get("auth_success")
    const authError = urlParams.get("auth_error")

    console.log("=== Page Load ===")
    console.log("URL:", window.location.href)
    console.log("auth_success:", authSuccess)
    console.log("auth_error:", authError)

    if (authSuccess === "true") {
      // OAuth成功，读取之前保存的角色
      const pendingRole = localStorage.getItem("pendingRole") as Role | null
      console.log("pendingRole from localStorage:", pendingRole)

      if (pendingRole) {
        setRole(pendingRole)
        setStep("profile")
        localStorage.removeItem("pendingRole")
        console.log("Set role to:", pendingRole, "step to: profile")
      } else {
        console.log("No pendingRole found, staying on login")
      }
      // 清除URL参数
      window.history.replaceState({}, "", window.location.pathname)
    } else if (authError) {
      console.error("OAuth error:", authError)
      alert("登录失败: " + authError)
      // 清除URL参数
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [])

  const handleLogin = useCallback((selectedRole: Role) => {
    setRole(selectedRole)
    setStep("profile")
  }, [])

  const handleFounderSubmit = useCallback(async (profile: FounderProfile) => {
    setFounderProfile(profile)
    setStep("matching")
    setIsLoading(true)

    try {
      const response = await matchFounderToInvestors(profile)
      if (response.success && response.matches.length > 0) {
        setMatches(response.matches)
      } else {
        setMatches(founderMatches)
      }
    } catch (error) {
      console.error("Match error:", error)
      setMatches(founderMatches)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleInvestorSubmit = useCallback(async (profile: InvestorProfile) => {
    setInvestorProfile(profile)
    setStep("matching")
    setIsLoading(true)

    try {
      const response = await matchInvestorToFounders(profile)
      if (response.success && response.matches.length > 0) {
        setMatches(response.matches)
      } else {
        setMatches(investorMatches)
      }
    } catch (error) {
      console.error("Match error:", error)
      setMatches(investorMatches)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleMatchingComplete = useCallback(() => {
    setStep("results")
  }, [])

  const handleViewChat = useCallback((match: MatchResult) => {
    setSelectedMatch(match)
    setStep("chat-detail")
  }, [])

  const handleBackToLogin = useCallback(() => {
    setRole(null)
    setStep("login")
    setMatches([])
    setFounderProfile(null)
    setInvestorProfile(null)
  }, [])

  const handleBackToResults = useCallback(() => {
    setStep("results")
  }, [])

  // Debug log
  console.log("Current state - step:", step, "role:", role)

  if (step === "login") {
    return <LoginScreen onLogin={handleLogin} />
  }

  if (step === "profile" && role === "founder") {
    return (
      <FounderForm
        onSubmit={handleFounderSubmit}
        onBack={handleBackToLogin}
      />
    )
  }

  if (step === "profile" && role === "investor") {
    return (
      <InvestorForm
        onSubmit={handleInvestorSubmit}
        onBack={handleBackToLogin}
      />
    )
  }

  if (step === "matching") {
    return <MatchingAnimation onComplete={handleMatchingComplete} />
  }

  if (step === "chat-detail" && selectedMatch) {
    return <ChatDetail match={selectedMatch} onBack={handleBackToResults} />
  }

  if (step === "results" && role) {
    return (
      <ResultsScreen
        role={role}
        matches={matches}
        onViewChat={handleViewChat}
      />
    )
  }

  // 如果没有匹配的条件，显示加载状态
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Loading... (step: {step}, role: {role || "null"})</p>
    </div>
  )
}
