import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// 获取所有投资人（公开接口）
export async function GET() {
  try {
    const investors = await prisma.user.findMany({
      where: {
        role: "investor",
        investorProfile: {
          isNot: null,
        },
      },
      include: {
        investorProfile: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      code: 0,
      data: investors,
    })
  } catch (error) {
    console.error("Failed to fetch all investors:", error)
    return NextResponse.json(
      { code: 500, error: "Server error" },
      { status: 500 }
    )
  }
}
