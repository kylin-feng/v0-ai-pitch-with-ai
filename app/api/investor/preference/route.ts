import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { getUserInfo } from "@/lib/secondme"
import type { InvestorProfile } from "@/lib/types"

// 保存投资人偏好
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("secondme_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ code: 401, error: "Not authenticated" }, { status: 401 })
    }

    const userInfo = await getUserInfo(accessToken)
    if (!userInfo) {
      return NextResponse.json({ code: 401, error: "Invalid token" }, { status: 401 })
    }

    // 查找用户
    let user = await prisma.user.findUnique({
      where: { secondMeId: userInfo.id },
    })

    // 如果用户不存在，先创建用户
    if (!user) {
      user = await prisma.user.create({
        data: {
          secondMeId: userInfo.id,
          name: userInfo.name,
          email: userInfo.email,
          avatar: userInfo.avatarUrl || userInfo.avatar,
          bio: userInfo.bio,
          selfIntro: userInfo.selfIntro,
          route: userInfo.route,
          role: "investor",
        },
      })
    }

    const body = await request.json()
    const { oneLiner } = body as InvestorProfile

    // 验证必填字段
    if (!oneLiner) {
      return NextResponse.json({ code: 400, error: "Missing required fields" }, { status: 400 })
    }

    // 创建或更新投资人偏好（每个用户只能有一个）
    const preference = await prisma.investorPreference.upsert({
      where: { userId: user.id },
      update: {
        oneLiner: oneLiner,
      },
      create: {
        userId: user.id,
        oneLiner: oneLiner,
      },
    })

    return NextResponse.json({
      code: 0,
      data: preference,
    })
  } catch (error) {
    console.error("Save investor preference error:", error)
    // 返回更详细的错误信息用于调试
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ code: 500, error: "Server error", detail: errorMessage }, { status: 500 })
  }
}

// 获取投资人偏好
export async function GET() {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("secondme_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ code: 401, error: "Not authenticated" }, { status: 401 })
    }

    const userInfo = await getUserInfo(accessToken)
    if (!userInfo) {
      return NextResponse.json({ code: 401, error: "Invalid token" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { secondMeId: userInfo.id },
      include: {
        investorProfile: true,
      },
    })

    if (!user || !user.investorProfile) {
      // 返回空数据而不是404
      return NextResponse.json({
        code: 0,
        data: null,
      })
    }

    return NextResponse.json({
      code: 0,
      data: {
        id: user.investorProfile.id,
        oneLiner: user.investorProfile.oneLiner,
        createdAt: user.investorProfile.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Get investor preference error:", error)
    return NextResponse.json({ code: 500, error: "Server error" }, { status: 500 })
  }
}
