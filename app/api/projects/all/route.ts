import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// 获取所有活跃项目（公开接口）
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: "active",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true,
            route: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      code: 0,
      data: projects,
    })
  } catch (error) {
    console.error("Failed to fetch all projects:", error)
    return NextResponse.json(
      { code: 500, error: "Server error" },
      { status: 500 }
    )
  }
}
