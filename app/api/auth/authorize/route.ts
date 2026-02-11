import { NextRequest, NextResponse } from "next/server"
import { getAuthorizationUrl } from "@/lib/secondme"

// Redirect to Second Me OAuth authorization page
export async function GET(request: NextRequest) {
  const role = request.nextUrl.searchParams.get("role") || ""
  const authUrl = getAuthorizationUrl(role)
  console.log("=== OAuth Authorize ===")
  console.log("Role:", role)
  console.log("Redirecting to:", authUrl)
  console.log("CLIENT_ID:", process.env.SECONDME_CLIENT_ID)
  console.log("REDIRECT_URI:", process.env.SECONDME_REDIRECT_URI)
  return NextResponse.redirect(authUrl)
}
