// Second Me Platform API Client
// 官方文档: https://develop-docs.second.me/zh/docs

const SECONDME_API_BASE = "https://app.mindos.com/gate/lab"
const SECONDME_AUTH_URL = "https://go.second.me"

export interface SecondMeUser {
  id: string
  name: string
  email?: string
  avatar?: string
  avatarUrl?: string
  bio?: string
  selfIntro?: string
  profileCompleteness?: number
  route?: string
}

export interface UserShade {
  tag: string
  confidence: number
  description?: string
  publicVersion?: string
  privateVersion?: string
}

export interface SoftMemoryItem {
  id: string
  content: string
  timestamp: string
  fact?: Record<string, unknown>
}

export interface ChatStreamResponse {
  sessionId?: string
  choices?: Array<{
    delta: {
      content: string
    }
  }>
}

// Get authorization URL for OAuth flow
export function getAuthorizationUrl(role?: string): string {
  // 将角色信息编码到 state 中，格式: random_role
  const random = Math.random().toString(36).substring(7)
  const state = role ? `${random}_${role}` : random
  const params = new URLSearchParams({
    client_id: process.env.SECONDME_CLIENT_ID || "",
    redirect_uri: process.env.SECONDME_REDIRECT_URI || "",
    response_type: "code",
    state,
  })
  return `${SECONDME_AUTH_URL}/oauth/?${params.toString()}`
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string
  refresh_token?: string
  expires_in?: number
} | null> {
  try {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.SECONDME_CLIENT_ID || "",
      client_secret: process.env.SECONDME_CLIENT_SECRET || "",
      code,
      redirect_uri: process.env.SECONDME_REDIRECT_URI || "",
    })

    console.log("Token exchange URL:", `${SECONDME_API_BASE}/api/oauth/token/code`)
    console.log("Token exchange params:", params.toString())

    const response = await fetch(`${SECONDME_API_BASE}/api/oauth/token/code`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    })

    console.log("Token exchange response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Token exchange failed:", response.status, errorText)
      return null
    }

    const result = await response.json()
    console.log("Token exchange result:", result)

    // API 返回格式可能是 { code: 0, data: { access_token, ... } }
    if (result.code === 0 && result.data) {
      return result.data
    }

    return result
  } catch (error) {
    console.error("Error exchanging code for token:", error)
    return null
  }
}

// Fetch user info from Second Me
export async function getUserInfo(accessToken: string): Promise<SecondMeUser | null> {
  try {
    const response = await fetch(`${SECONDME_API_BASE}/api/secondme/user/info`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      console.error("Failed to fetch user info:", response.status)
      return null
    }

    const result = await response.json()
    console.log("User info result:", result)
    if (result.code === 0 && result.data) {
      // API 返回 userId，映射为 id
      const data = result.data
      return {
        id: data.userId,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        selfIntro: data.selfIntroduction || data.selfIntro,
        profileCompleteness: data.profileCompleteness,
        route: data.route,
      }
    }
    return null
  } catch (error) {
    console.error("Error fetching user info:", error)
    return null
  }
}

// Fetch user interest tags/shades
export async function getUserShades(accessToken: string): Promise<UserShade[]> {
  try {
    const response = await fetch(`${SECONDME_API_BASE}/api/secondme/user/shades`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      console.error("Failed to fetch user shades:", response.status)
      return []
    }

    const result = await response.json()
    console.log("User shades result:", result)
    // API 返回 result.data.shades
    if (result.code === 0 && result.data?.shades) {
      return result.data.shades
    }
    return []
  } catch (error) {
    console.error("Error fetching user shades:", error)
    return []
  }
}

// Fetch user soft memory
export async function getUserSoftMemory(
  accessToken: string,
  keyword?: string,
  pageNo = 1,
  pageSize = 20
): Promise<SoftMemoryItem[]> {
  try {
    const params = new URLSearchParams({
      pageNo: pageNo.toString(),
      pageSize: pageSize.toString(),
    })
    if (keyword) {
      params.set("keyword", keyword)
    }

    const response = await fetch(
      `${SECONDME_API_BASE}/api/secondme/user/softmemory?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!response.ok) {
      console.error("Failed to fetch soft memory:", response.status)
      return []
    }

    const result = await response.json()
    console.log("Soft memory result:", result)
    if (result.code === 0 && result.data?.list) {
      return result.data.list
    }
    return []
  } catch (error) {
    console.error("Error fetching soft memory:", error)
    return []
  }
}

// Chat with Second Me AI (streaming)
export async function chatWithSecondMe(
  accessToken: string,
  message: string
): Promise<string> {
  try {
    const response = await fetch(`${SECONDME_API_BASE}/api/secondme/chat/stream`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    })

    if (!response.ok) {
      console.error("Chat request failed:", response.status)
      return ""
    }

    // 处理SSE流式响应
    const reader = response.body?.getReader()
    if (!reader) return ""

    const decoder = new TextDecoder()
    let fullContent = ""

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split("\n")

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6)
          if (data === "[DONE]") continue

          try {
            const parsed = JSON.parse(data)
            if (parsed.choices?.[0]?.delta?.content) {
              fullContent += parsed.choices[0].delta.content
            }
          } catch {
            // 忽略解析错误
          }
        }
      }
    }

    return fullContent
  } catch (error) {
    console.error("Error in chat:", error)
    return ""
  }
}

// Add note to Second Me memory
export async function addNote(
  accessToken: string,
  content: string
): Promise<boolean> {
  try {
    const response = await fetch(`${SECONDME_API_BASE}/api/secondme/note/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    })

    const result = await response.json()
    return result.code === 0
  } catch (error) {
    console.error("Error adding note:", error)
    return false
  }
}
