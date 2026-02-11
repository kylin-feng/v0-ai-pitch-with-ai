import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { getUserInfo } from "@/lib/secondme"

// 获取当前用户的项目列表
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
        projects: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ code: 404, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      code: 0,
      data: user.projects,
    })
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json({ code: 500, error: "Server error" }, { status: 500 })
  }
}

// 创建新项目
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
          role: "founder",
        },
      })
    }

    const body = await request.json()
    const { oneLiner } = body

    // 验证必填字段
    if (!oneLiner) {
      return NextResponse.json({ code: 400, error: "Missing required fields" }, { status: 400 })
    }

    // 创建项目
    const project = await prisma.project.create({
      data: {
        userId: user.id,
        oneLiner: oneLiner,
        status: 'active',
      },
    })

    return NextResponse.json({
      code: 0,
      data: project,
    })
  } catch (error) {
    console.error("Create project error:", error)
    return NextResponse.json({ code: 500, error: "Server error" }, { status: 500 })
  }
}
