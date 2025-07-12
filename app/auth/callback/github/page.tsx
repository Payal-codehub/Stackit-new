"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { authService } from "@/lib/auth"
import { useAppStore } from "@/lib/store"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function GitHubCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAppStore()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get("code")
        const state = searchParams.get("state")
        const error = searchParams.get("error")

        if (error) {
          throw new Error(`GitHub OAuth error: ${error}`)
        }

        if (!code) {
          throw new Error("No authorization code received")
        }

        // Handle OAuth callback
        const userData = await authService.handleOAuthCallback("github", code)

        // Login user
        login({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          avatar: userData.avatar,
          reputation: 1000,
          joinDate: new Date().toISOString(),
          badges: ["New Member", "GitHub Login"],
        })

        setStatus("success")

        // Redirect after success
        setTimeout(() => {
          router.push("/")
        }, 2000)
      } catch (err) {
        console.error("GitHub OAuth callback error:", err)
        setError(err instanceof Error ? err.message : "Authentication failed")
        setStatus("error")

        // Redirect to login after error
        setTimeout(() => {
          router.push("/login")
        }, 3000)
      }
    }

    handleCallback()
  }, [searchParams, login, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Connecting to GitHub...</h2>
              <p className="text-gray-600">Please wait while we complete your authentication.</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Successfully Connected!</h2>
              <p className="text-gray-600">Redirecting you to Stack Echo...</p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Authentication Failed</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-sm text-gray-500">Redirecting to login page...</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
