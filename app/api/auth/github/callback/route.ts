import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "No authorization code provided" }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Exchange the code for an access token
    // 2. Use the access token to fetch user data from GitHub API
    // 3. Create or update user in your database

    // For demo purposes, return mock user data
    const mockUserData = {
      id: `github_${Date.now()}`,
      username: "github_user",
      email: "user@github.com",
      avatar: "/placeholder.svg?height=40&width=40",
      provider: "github",
    }

    return NextResponse.json(mockUserData)
  } catch (error) {
    console.error("GitHub OAuth callback error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
