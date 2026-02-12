"use client"

import { useState, useCallback, useEffect } from "react"
import { LoginScreen } from "@/components/login-screen"
import { FounderForm } from "@/components/founder-form"
import { InvestorForm } from "@/components/investor-form"
import { ProjectList } from "@/components/project-list"
import { InvestorPreferenceList } from "@/components/investor-preference-list"
import { LiveFounderMatching } from "@/components/live-founder-matching"
import { LiveMatching } from "@/components/live-matching"
import { ResultsScreen } from "@/components/results-screen"
import { ChatDetail } from "@/components/chat-detail"
import { ProjectMarketplace } from "@/components/project-marketplace"
import { InvestorMarketplace } from "@/components/investor-marketplace"
import type { Role, MatchResult, FounderProfile, InvestorProfile, SecondMeUserProfile, SecondMeShade } from "@/lib/types"

type AppStep = "login" | "list" | "form" | "matching" | "results" | "chat-detail" | "project-marketplace" | "investor-marketplace"

interface Project {
  id: string
  projectName: string
  oneLiner: string
  industry: string
  fundingAmount: number
  userCount?: string
  revenue?: string
  status: string
  createdAt: string
}

interface InvestorPreferenceData {
  id: string
  oneLiner: string
  industries: string[]
  stages: string[]
  minInvestment: number
  maxInvestment: number
  createdAt: string
}

export default function Page() {
  const [step, setStep] = useState<AppStep>("login")
  const [role, setRole] = useState<Role | null>(null)
  const [selectedMatch, setSelectedMatch] = useState<MatchResult | null>(null)
  const [matches, setMatches] = useState<MatchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [founderProfile, setFounderProfile] = useState<FounderProfile | null>(null)
  const [investorProfile, setInvestorProfile] = useState<InvestorProfile | null>(null)
  const [secondMeUser, setSecondMeUser] = useState<SecondMeUserProfile | null>(null)
  const [secondMeShades, setSecondMeShades] = useState<SecondMeShade[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [investorPreferences, setInvestorPreferences] = useState<InvestorPreferenceData[]>([])
  const [dbUser, setDbUser] = useState<{ id: string; name: string } | null>(null)

  // 获取用户的项目列表
  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      const result = await response.json()
      if (result.code === 0 && result.data) {
        setProjects(result.data)
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    }
  }

  // 获取用户的投资偏好
  const fetchInvestorPreferences = async () => {
    try {
      const response = await fetch("/api/investor/preference")
      const result = await response.json()
      if (result.code === 0 && result.data) {
        // 将单个偏好包装成数组（目前每个用户只有一个偏好）
        setInvestorPreferences(result.data ? [result.data] : [])
      }
    } catch (error) {
      console.error("Failed to fetch investor preferences:", error)
    }
  }

  // 获取 SecondMe 用户信息并同步到数据库
  const fetchSecondMeUser = async (userRole: Role) => {
    try {
      console.log("Fetching SecondMe user info...")
      const response = await fetch("/api/secondme/user")
      const result = await response.json()
      console.log("SecondMe user result:", result)

      if (result.code === 0 && result.data) {
        setSecondMeUser(result.data.user)
        setSecondMeShades(result.data.shades || [])

        // 同步用户到数据库
        console.log("Syncing user to database...")
        const syncResponse = await fetch("/api/user/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: userRole }),
        })
        const syncResult = await syncResponse.json()
        console.log("User synced:", syncResult)

        if (syncResult.code === 0 && syncResult.data) {
          setDbUser(syncResult.data)
          // 获取用户已有的项目或投资偏好
          if (userRole === "founder") {
            await fetchProjects()
          } else {
            await fetchInvestorPreferences()
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch SecondMe user:", error)
    }
  }

  // 检查OAuth回调状态
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const authSuccess = urlParams.get("auth_success")
    const authError = urlParams.get("auth_error")

    console.log("=== Page Load ===")
    console.log("URL:", window.location.href)

    if (authSuccess === "true") {
      const urlRole = urlParams.get("role") as Role | null
      const pendingRole = urlRole || localStorage.getItem("pendingRole") as Role | null
      console.log("Final role:", pendingRole)

      if (pendingRole) {
        setRole(pendingRole)
        // 创业者看投资人广场，投资人看项目广场
        setStep(pendingRole === "founder" ? "investor-marketplace" : "project-marketplace")
        localStorage.removeItem("pendingRole")

        // 获取 SecondMe 用户信息并同步到数据库
        fetchSecondMeUser(pendingRole)
      }
      window.history.replaceState({}, "", window.location.pathname)
    } else if (authError) {
      console.error("OAuth error:", authError)
      alert("登录失败: " + authError)
      window.history.replaceState({}, "", window.location.pathname)
    }
  }, [])

  const handleLogin = useCallback((selectedRole: Role) => {
    setRole(selectedRole)
    // 创业者看投资人广场，投资人看项目广场
    setStep(selectedRole === "founder" ? "investor-marketplace" : "project-marketplace")
  }, [])

  // 创业者保存项目
  const handleFounderSave = useCallback(async (profile: FounderProfile) => {
    try {
      console.log("Saving project to database...")
      const saveResponse = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      const saveResult = await saveResponse.json()
      console.log("Project saved:", saveResult)

      // 刷新项目列表并返回列表页
      await fetchProjects()
      setStep("list")
    } catch (error) {
      console.error("Save error:", error)
      alert("保存失败，请重试")
    }
  }, [])

  // 投资人保存偏好
  const handleInvestorSave = useCallback(async (profile: InvestorProfile) => {
    try {
      console.log("Saving investor preference to database...")
      const saveResponse = await fetch("/api/investor/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })
      const saveResult = await saveResponse.json()
      console.log("Investor preference saved:", saveResult)

      // 刷新偏好列表并返回列表页
      await fetchInvestorPreferences()
      setStep("list")
    } catch (error) {
      console.error("Save error:", error)
      alert("保存失败，请重试")
    }
  }, [])

  // 创业者选择项目进行匹配
  const handleSelectProject = useCallback((project: Project) => {
    const profile: FounderProfile = {
      projectName: project.projectName,
      oneLiner: project.oneLiner,
      industry: project.industry,
      fundingAmount: project.fundingAmount,
      userCount: project.userCount,
      revenue: project.revenue,
      name: secondMeUser?.name || dbUser?.name || "创业者",
    }
    setFounderProfile(profile)
    setStep("matching")
  }, [secondMeUser, dbUser])

  // 投资人选择偏好进行匹配
  const handleSelectPreference = useCallback(async (preference: InvestorPreferenceData) => {
    console.log("handleSelectPreference called with:", preference)
    const profile: InvestorProfile = {
      oneLiner: preference.oneLiner,
    }
    setInvestorProfile(profile)
    setStep("matching")
  }, [])

  // 投资人匹配完成
  const handleInvestorMatchComplete = useCallback((matchResults: MatchResult[]) => {
    console.log("Investor match complete:", matchResults)
    setMatches(matchResults)
    setStep("results")
  }, [])

  // 创业者匹配完成
  const handleFounderMatchComplete = useCallback((matchResults: MatchResult[]) => {
    console.log("Founder match complete:", matchResults)
    setMatches(matchResults)
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
    setProjects([])
    setInvestorPreferences([])
  }, [])

  const handleBackToList = useCallback(() => {
    setStep("list")
  }, [])

  const handleBackToResults = useCallback(() => {
    setStep("results")
  }, [])

  // 从投资人广场发起匹配（创业者视角）
  const handleStartMatchFromInvestorMarketplace = useCallback((investorId: string) => {
    // 直接跳转到项目列表，让用户选择项目发起匹配
    setStep("list")
  }, [])

  // 从项目广场发起匹配（投资人视角）
  const handleStartMatchFromProjectMarketplace = useCallback((projectId: string) => {
    // 直接跳转到偏好列表，让用户选择偏好发起匹配
    setStep("list")
  }, [])

  // Debug log
  console.log("Current state - step:", step, "role:", role)

  if (step === "login") {
    return <LoginScreen onLogin={handleLogin} />
  }

  // 显示项目/偏好列表
  if (step === "list" && role === "founder") {
    return (
      <ProjectList
        projects={projects}
        onSelectProject={handleSelectProject}
        onCreateNew={() => setStep("form")}
        onBack={handleBackToLogin}
        onBrowseInvestors={() => setStep("investor-marketplace")}
        userName={secondMeUser?.name || dbUser?.name}
      />
    )
  }

  if (step === "list" && role === "investor") {
    return (
      <InvestorPreferenceList
        preferences={investorPreferences}
        onSelectPreference={handleSelectPreference}
        onCreateNew={() => setStep("form")}
        onBack={handleBackToLogin}
        onBrowseProjects={() => setStep("project-marketplace")}
        userName={secondMeUser?.name || dbUser?.name}
      />
    )
  }

  // 创建新项目/偏好表单
  if (step === "form" && role === "founder") {
    return (
      <FounderForm
        onSubmit={handleFounderSave}
        onBack={handleBackToList}
        user={secondMeUser}
        shades={secondMeShades}
      />
    )
  }

  if (step === "form" && role === "investor") {
    return (
      <InvestorForm
        onSubmit={handleInvestorSave}
        onBack={handleBackToList}
        user={secondMeUser}
        shades={secondMeShades}
      />
    )
  }

  if (step === "matching") {
    // 创业者使用实时匹配展示
    if (role === "founder" && founderProfile) {
      return (
        <LiveFounderMatching
          founderProfile={founderProfile}
          onComplete={handleFounderMatchComplete}
          onCancel={handleBackToList}
        />
      )
    }
    // 投资人使用实时匹配展示
    if (role === "investor" && investorProfile) {
      return (
        <LiveMatching
          investorProfile={investorProfile}
          onComplete={handleInvestorMatchComplete}
          onCancel={handleBackToList}
        />
      )
    }
    // 如果没有 profile，返回列表
    return null
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

  if (step === "project-marketplace") {
    return (
      <ProjectMarketplace
        onBack={handleBackToLogin}
        onMyProjects={() => setStep("list")}
        onStartMatch={handleStartMatchFromProjectMarketplace}
      />
    )
  }

  if (step === "investor-marketplace") {
    return (
      <InvestorMarketplace
        onBack={handleBackToLogin}
        onMyProjects={() => setStep("list")}
        onStartMatch={handleStartMatchFromInvestorMarketplace}
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
