import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserInfo } from "@/lib/secondme"

// Check current session status
export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("secondme_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      })
    }

    // Fetch user info from Second Me
    const userInfo = await getUserInfo(accessToken)

    if (!userInfo) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      })
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: userInfo.id,
        name: userInfo.name,
        avatar: userInfo.avatar,
      },
    })
  } catch (error) {
    console.error("Session check error:", error)
    return NextResponse.json({
      authenticated: false,
      user: null,
      error: "Session check failed",
    })
  }
}

// Logout - clear session
export async function DELETE() {
  try {
    const cookieStore = await cookies()

    cookieStore.delete("secondme_access_token")
    cookieStore.delete("secondme_refresh_token")

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({
      success: false,
      error: "Logout failed",
    })
  }
}
