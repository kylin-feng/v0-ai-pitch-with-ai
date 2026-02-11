import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserInfo, getUserShades } from "@/lib/secondme"

// Get complete user profile from SecondMe
export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("secondme_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({
        code: 401,
        error: "Not authenticated",
      }, { status: 401 })
    }

    // Fetch user info and shades in parallel
    const [userInfo, shades] = await Promise.all([
      getUserInfo(accessToken),
      getUserShades(accessToken),
    ])

    if (!userInfo) {
      return NextResponse.json({
        code: 401,
        error: "Failed to fetch user info",
      }, { status: 401 })
    }

    return NextResponse.json({
      code: 0,
      data: {
        user: {
          id: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          avatar: userInfo.avatarUrl || userInfo.avatar,
          bio: userInfo.bio,
          selfIntro: userInfo.selfIntro,
          route: userInfo.route,
        },
        shades: shades,
      },
    })
  } catch (error) {
    console.error("Get user profile error:", error)
    return NextResponse.json({
      code: 500,
      error: "Server error",
    }, { status: 500 })
  }
}
