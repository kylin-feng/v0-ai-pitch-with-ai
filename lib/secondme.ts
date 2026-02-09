// Second Me Platform API Client
// 官方文档: https://app.mindos.com

const SECONDME_API_BASE = process.env.SECONDME_API_BASE || "https://app.mindos.com/gate/lab"
const SECONDME_AUTH_URL = process.env.SECONDME_AUTH_URL || "https://app.mindos.com"

export interface SecondMeUser {
  name: string
  bio?: string
  avatar?: string
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
export function getAuthorizationUrl(): string {
  const params = new URLSearchParams({
    client_id: process.env.SECONDME_CLIENT_ID || "",
    redirect_uri: process.env.SECONDME_REDIRECT_URI || "",
    response_type: "code",
    scope: "user.info user.info.shades user.info.softmemory chat note.add voice",
  })
  return `${SECONDME_AUTH_URL}/oauth/authorize?${params.toString()}`
}

// Exchange authorization code for access token
export async function exchangeCodeForToken(code: string): Promise<{
  access_token: string
  refresh_token?: string
  expires_in?: number
} | null> {
  try {
    const response = await fetch(`${SECONDME_AUTH_URL}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: process.env.SECONDME_CLIENT_ID,
        client_secret: process.env.SECONDME_CLIENT_SECRET,
        code,
        redirect_uri: process.env.SECONDME_REDIRECT_URI,
      }),
    })

    if (!response.ok) {
      console.error("Token exchange failed:", response.status)
      return null
    }

    return await response.json()
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
    // API返回格式: { code: 0, message: "success", data: {...} }
    if (result.code === 0 && result.data) {
      return result.data
    }
    return null
  } catch (error) {
    console.error("Error fetching user info:", error)
    return null
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
