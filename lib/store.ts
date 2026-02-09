import type { Role, FounderProfile, InvestorProfile, MatchResult } from "./types"

// Simple client-side state management for the demo
let currentState: {
  step: "login" | "profile" | "matching" | "results"
  role: Role | null
  founderProfile: FounderProfile | null
  investorProfile: InvestorProfile | null
  matches: MatchResult[]
} = {
  step: "login",
  role: null,
  founderProfile: null,
  investorProfile: null,
  matches: [],
}

const listeners = new Set<() => void>()

export function getState() {
  return currentState
}

export function setState(partial: Partial<typeof currentState>) {
  currentState = { ...currentState, ...partial }
  listeners.forEach((l) => l())
}

export function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
