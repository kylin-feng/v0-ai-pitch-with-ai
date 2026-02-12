import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { getUserInfo, getUserShades } from "@/lib/secondme"

// 同步 SecondMe 用户到数据库
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get("secondme_access_token")?.value

    if (!accessToken) {
      return NextResponse.json({ code: 401, error: "Not authenticated" }, { status: 401 })
    }

    const body = await request.json()
    const { role } = body // founder 或 investor

    // 获取 SecondMe 用户信息
    const [userInfo, shades] = await Promise.all([
      getUserInfo(accessToken),
      getUserShades(accessToken),
    ])

    console.log("User info result:", userInfo ? `User ${userInfo.name}` : 'null')
    console.log("User shades count:", shades?.length || 0)
    if (shades && shades.length > 0) {
      console.log("First shade:", JSON.stringify(shades[0]))
    }

    if (!userInfo) {
      return NextResponse.json({ code: 401, error: "Failed to fetch user info" }, { status: 401 })
    }

    // 创建或更新用户
    const user = await prisma.user.upsert({
      where: { secondMeId: userInfo.id },
      update: {
        name: userInfo.name,
        email: userInfo.email,
        avatar: userInfo.avatarUrl || userInfo.avatar,
        bio: userInfo.bio,
        selfIntro: userInfo.selfIntro,
        route: userInfo.route,
        role: role,
      },
      create: {
        secondMeId: userInfo.id,
        name: userInfo.name,
        email: userInfo.email,
        avatar: userInfo.avatarUrl || userInfo.avatar,
        bio: userInfo.bio,
        selfIntro: userInfo.selfIntro,
        route: userInfo.route,
        role: role,
      },
    })

    // 同步用户标签
    if (shades && shades.length > 0) {
      // 过滤掉无效的 shade（tag 为空的记录）
      const validShades = shades.filter(shade => shade.tag && shade.tag.trim() !== '')

      if (validShades.length > 0) {
        // 先删除旧的标签
        await prisma.userShade.deleteMany({ where: { userId: user.id } })
        // 创建新的标签
        await prisma.userShade.createMany({
          data: validShades.map((shade) => ({
            userId: user.id,
            tag: shade.tag,
            confidence: shade.confidence || 0,
            description: shade.description || '',
          })),
        })
      }
    }

    // 获取完整用户信息
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        shades: true,
        projects: true,
      },
    })

    return NextResponse.json({
      code: 0,
      data: fullUser,
    })
  } catch (error) {
    console.error("User sync error:", error)
    return NextResponse.json({ code: 500, error: "Server error" }, { status: 500 })
  }
}
