"use client"

// OAuth configuration
const OAUTH_CONFIG = {
  github: {
    clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "demo_github_client_id",
    redirectUri: typeof window !== "undefined" ? `${window.location.origin}/auth/callback/github` : "",
    scope: "user:email",
    authUrl: "https://github.com/login/oauth/authorize",
  },
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "demo_google_client_id",
    redirectUri: typeof window !== "undefined" ? `${window.location.origin}/auth/callback/google` : "",
    scope: "openid email profile",
    authUrl: "https://accounts.google.com/oauth2/auth",
  },
}

export interface AuthUser {
  id: string
  username: string
  email: string
  avatar: string
  provider?: "github" | "google" | "email"
}

class AuthService {
  // GitHub OAuth
  async loginWithGitHub(): Promise<void> {
    if (typeof window === "undefined") return

    // For demo purposes, we'll simulate the OAuth flow
    // In production, you would redirect to GitHub's OAuth URL
    const isDemoMode =
      !process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID === "demo_github_client_id"

    if (isDemoMode) {
      // Simulate OAuth flow for demo
      return this.simulateOAuthFlow("github")
    }

    // Real OAuth flow
    const params = new URLSearchParams({
      client_id: OAUTH_CONFIG.github.clientId,
      redirect_uri: OAUTH_CONFIG.github.redirectUri,
      scope: OAUTH_CONFIG.github.scope,
      response_type: "code",
      state: this.generateState(),
    })

    const authUrl = `${OAUTH_CONFIG.github.authUrl}?${params.toString()}`
    window.location.href = authUrl
  }

  // Google OAuth
  async loginWithGoogle(): Promise<void> {
    if (typeof window === "undefined") return

    const isDemoMode =
      !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === "demo_google_client_id"

    if (isDemoMode) {
      // Simulate OAuth flow for demo
      return this.simulateOAuthFlow("google")
    }

    // Real OAuth flow
    const params = new URLSearchParams({
      client_id: OAUTH_CONFIG.google.clientId,
      redirect_uri: OAUTH_CONFIG.google.redirectUri,
      scope: OAUTH_CONFIG.google.scope,
      response_type: "code",
      state: this.generateState(),
    })

    const authUrl = `${OAUTH_CONFIG.google.authUrl}?${params.toString()}`
    window.location.href = authUrl
  }

  // Simulate OAuth flow for demo
  private async simulateOAuthFlow(provider: "github" | "google"): Promise<void> {
    return new Promise((resolve, reject) => {
      // Show loading state
      const loadingToast = this.showLoadingToast(`Connecting to ${provider}...`)

      setTimeout(() => {
        try {
          // Simulate successful OAuth response
          const mockUser: AuthUser = {
            id: `${provider}_${Date.now()}`,
            username: provider === "github" ? "github_user_demo" : "google_user_demo",
            email: provider === "github" ? "demo@github.com" : "demo@gmail.com",
            avatar: `/placeholder.svg?height=40&width=40`,
            provider,
          }

          // Store user data
          this.handleOAuthSuccess(mockUser)
          this.hideLoadingToast(loadingToast)
          resolve()
        } catch (error) {
          this.hideLoadingToast(loadingToast)
          reject(error)
        }
      }, 2000) // Simulate network delay
    })
  }

  // Handle OAuth callback
  async handleOAuthCallback(provider: "github" | "google", code: string): Promise<AuthUser> {
    try {
      // In a real app, you would exchange the code for an access token
      // and then fetch user data from the provider's API

      const response = await fetch(`/api/auth/${provider}/callback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })

      if (!response.ok) {
        throw new Error(`OAuth callback failed: ${response.statusText}`)
      }

      const userData = await response.json()
      return userData
    } catch (error) {
      console.error(`${provider} OAuth callback error:`, error)
      throw error
    }
  }

  // Handle successful OAuth
  private handleOAuthSuccess(user: AuthUser): void {
    // Import store dynamically to avoid SSR issues
    import("./store").then(({ useAppStore }) => {
      const { login } = useAppStore.getState()
      login({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        reputation: 1000,
        joinDate: new Date().toISOString(),
        badges: ["New Member", `${user.provider} Login`],
      })

      // Redirect to home page
      if (typeof window !== "undefined") {
        window.location.href = "/"
      }
    })
  }

  // Generate random state for OAuth security
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }

  // Show loading toast (simple implementation)
  private showLoadingToast(message: string): HTMLElement {
    if (typeof window === "undefined") return document.createElement("div")

    const toast = document.createElement("div")
    toast.className =
      "fixed top-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2"
    toast.innerHTML = `
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      <span>${message}</span>
    `
    document.body.appendChild(toast)
    return toast
  }

  // Hide loading toast
  private hideLoadingToast(toast: HTMLElement): void {
    if (toast && toast.parentNode) {
      toast.parentNode.removeChild(toast)
    }
  }

  // Email/Password login
  async loginWithEmail(email: string, password: string): Promise<AuthUser> {
    // Mock users for demo
    const mockUsers = [
      {
        email: "john@example.com",
        password: "password123",
        userData: {
          id: "1",
          username: "john_doe",
          email: "john@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          provider: "email" as const,
        },
      },
      {
        email: "alice@example.com",
        password: "password123",
        userData: {
          id: "2",
          username: "alice_dev",
          email: "alice@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          provider: "email" as const,
        },
      },
      {
        email: "demo@example.com",
        password: "demo",
        userData: {
          id: "3",
          username: "demo_user",
          email: "demo@example.com",
          avatar: "/placeholder.svg?height=40&width=40",
          provider: "email" as const,
        },
      },
    ]

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      throw new Error("Invalid email or password")
    }

    return user.userData
  }

  // Register with email
  async registerWithEmail(userData: { username: string; email: string; password: string }): Promise<AuthUser> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      avatar: "/placeholder.svg?height=40&width=40",
      provider: "email",
    }
  }
}

export const authService = new AuthService()
