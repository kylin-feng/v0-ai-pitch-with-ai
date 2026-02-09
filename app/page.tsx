"use client"

import { useState, useCallback } from "react"
import { LoginScreen } from "@/components/login-screen"
import { FounderForm } from "@/components/founder-form"
import { InvestorForm } from "@/components/investor-form"
import { MatchingAnimation } from "@/components/matching-animation"
import { ResultsScreen } from "@/components/results-screen"
import { ChatDetail } from "@/components/chat-detail"
import { founderMatches, investorMatches } from "@/lib/mock-data"
import type { Role, MatchResult } from "@/lib/types"

type AppStep = "login" | "profile" | "matching" | "results" | "chat-detail"

export default function Page() {
  const [step, setStep] = useState<AppStep>("login")
  const [role, setRole] = useState<Role | null>(null)
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null)

  const handleLogin = useCallback((selectedRole: Role) => {
    setRole(selectedRole)
    setStep("profile")
  }, [])

  const handleProfileSubmit = useCallback(() => {
    setStep("matching")
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
  }, [])

  const handleBackToResults = useCallback(() => {
    setStep("results")
  }, [])

  const matches = role === "founder" ? founderMatches : investorMatches

  if (step === "login") {
    return <LoginScreen onLogin={handleLogin} />
  }

  if (step === "profile" && role === "founder") {
    return (
      <FounderForm
        onSubmit={handleProfileSubmit}
        onBack={handleBackToLogin}
      />
    )
  }

  if (step === "profile" && role === "investor") {
    return (
      <InvestorForm
        onSubmit={handleProfileSubmit}
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

  return null
}
