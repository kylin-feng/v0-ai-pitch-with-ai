import { NextResponse } from "next/server"
import { getAuthorizationUrl } from "@/lib/secondme"

// Redirect to Second Me OAuth authorization page
export async function GET() {
  const authUrl = getAuthorizationUrl()
  console.log("=== OAuth Authorize ===")
  console.log("Redirecting to:", authUrl)
  console.log("CLIENT_ID:", process.env.SECONDME_CLIENT_ID)
  console.log("REDIRECT_URI:", process.env.SECONDME_REDIRECT_URI)
  return NextResponse.redirect(authUrl)
}
