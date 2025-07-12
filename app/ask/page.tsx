"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { useAppStore } from "@/lib/store"
import { X, Plus, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

const popularTags = ["javascript", "react", "nextjs", "typescript", "nodejs", "python", "css", "html", "vue", "angular"]

export default function AskQuestionPage() {
  const router = useRouter()
  const { addQuestion, isAuthenticated } = useAppStore()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: [] as string[],
  })
  const [currentTag, setCurrentTag] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
              <p className="text-gray-600 mb-6">You need to be logged in to ask a question.</p>
              <div className="space-x-4">
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    } else if (formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters"
    }

    if (!formData.content.trim()) {
      newErrors.content = "Question body is required"
    } else if (formData.content.length < 30) {
      newErrors.content = "Question body must be at least 30 characters"
    }

    if (formData.tags.length === 0) {
      newErrors.tags = "At least one tag is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const addTag = () => {
    const tag = currentTag.trim().toLowerCase()
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
      setCurrentTag("")
      if (errors.tags) {
        setErrors((prev) => ({ ...prev, tags: "" }))
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      addQuestion({
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: formData.tags,
      })

      // Redirect to home page
      router.push("/")
    } catch (error) {
      console.error("Error submitting question:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ask a Question</h1>
          <p className="text-gray-600">Get help from the community by asking a clear, detailed question.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <Card>
                <CardHeader>
                  <CardTitle>Title</CardTitle>
                  <CardDescription>Be specific and imagine you're asking a question to another person.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="e.g., How to implement authentication in Next.js?"
                    className={errors.title ? "border-red-500" : ""}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  <p className="text-sm text-gray-500 mt-2">{formData.title.length}/150 characters</p>
                </CardContent>
              </Card>

              {/* Content */}
              <Card>
                <CardHeader>
                  <CardTitle>What are the details of your problem?</CardTitle>
                  <CardDescription>
                    Introduce the problem and expand on what you put in the title. Minimum 30 characters.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    placeholder="Describe your problem in detail. Include what you've tried and what you expected to happen."
                    className={`min-h-[200px] ${errors.content ? "border-red-500" : ""}`}
                  />
                  {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                  <p className="text-sm text-gray-500 mt-2">{formData.content.length} characters</p>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle>Tags</CardTitle>
                  <CardDescription>
                    Add up to 5 tags to describe what your question is about. Start typing to see suggestions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        placeholder="Add a tag (e.g., javascript, react)"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            addTag()
                          }
                        }}
                        disabled={formData.tags.length >= 5}
                        className={errors.tags ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        disabled={formData.tags.length >= 5 || !currentTag.trim()}
                        variant="outline"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Popular Tags */}
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Popular tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {popularTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-orange-50 hover:border-orange-300"
                            onClick={() => {
                              if (!formData.tags.includes(tag) && formData.tags.length < 5) {
                                setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }))
                                if (errors.tags) {
                                  setErrors((prev) => ({ ...prev, tags: "" }))
                                }
                              }
                            }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Selected Tags */}
                    {formData.tags.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Selected tags:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag) => (
                            <Badge key={tag} className="bg-orange-100 text-orange-800 flex items-center gap-1">
                              {tag}
                              <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600">
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex space-x-4">
                <Button type="submit" disabled={isSubmitting} className="bg-orange-600 hover:bg-orange-700">
                  {isSubmitting ? "Posting..." : "Post Your Question"}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/">Cancel</Link>
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar Tips */}
          <div className="space-y-6">
            {/* Writing Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  Writing Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Good Question Title</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Be specific and clear</li>
                    <li>• Include relevant technologies</li>
                    <li>• Avoid vague terms like "doesn't work"</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Question Body</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Explain the problem clearly</li>
                    <li>• Show what you've tried</li>
                    <li>• Include relevant code snippets</li>
                    <li>• Describe expected vs actual results</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Tags</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Use existing popular tags</li>
                    <li>• Be specific (react vs frontend)</li>
                    <li>• Maximum 5 tags</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Guidelines */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 text-blue-800">Community Guidelines</h3>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• Search for existing questions first</li>
                  <li>• Be respectful and constructive</li>
                  <li>• Provide minimal reproducible examples</li>
                  <li>• Accept helpful answers</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
