"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/components/header"
import { QuestionCard } from "@/components/question-card"
import { useAppStore } from "@/lib/store"
import { TrendingUp, Users, MessageSquare, Filter, X } from "lucide-react"
import Link from "next/link"

const popularTags = [
  "javascript",
  "react",
  "nextjs",
  "typescript",
  "nodejs",
  "python",
  "css",
  "html",
  "vue",
  "angular",
  "express",
  "mongodb",
]

export default function HomePage() {
  const { getFilteredQuestions, sortBy, setSortBy, selectedTags, setSelectedTags, searchQuery, questions } =
    useAppStore()

  const [filteredQuestions, setFilteredQuestions] = useState(getFilteredQuestions())

  useEffect(() => {
    setFilteredQuestions(getFilteredQuestions())
  }, [getFilteredQuestions, sortBy, selectedTags, searchQuery, questions])

  const stats = [
    { label: "Questions", value: questions.length.toLocaleString(), icon: MessageSquare, color: "text-blue-600" },
    {
      label: "Answers",
      value: questions.reduce((acc, q) => acc + q.answers.length, 0).toLocaleString(),
      icon: TrendingUp,
      color: "text-green-600",
    },
    { label: "Users", value: "1,234", icon: Users, color: "text-purple-600" },
  ]

  const handleTagFilter = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const clearFilters = () => {
    setSelectedTags([])
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {stats.map((stat) => (
                <Card key={stat.label} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Filters and Search */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Search results for "${searchQuery}"` : "All Questions"}
                  <span className="text-lg font-normal text-gray-500 ml-2">({filteredQuestions.length})</span>
                </h1>

                <div className="flex items-center space-x-4">
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="votes">Most Votes</SelectItem>
                      <SelectItem value="unanswered">Unanswered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Active Filters */}
              {selectedTags.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Filtered by:</span>
                  {selectedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-orange-100 text-orange-800 cursor-pointer"
                      onClick={() => handleTagFilter(tag)}
                    >
                      {tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear all
                  </Button>
                </div>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => <QuestionCard key={question.id} question={question} />)
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchQuery || selectedTags.length > 0
                        ? "Try adjusting your search or filters"
                        : "Be the first to ask a question!"}
                    </p>
                    <Button asChild className="bg-orange-600 hover:bg-orange-700">
                      <Link href="/ask">Ask Question</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Popular Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <span className="w-4 h-4 bg-orange-500 rounded mr-2"></span>
                  Popular Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedTags.includes(tag)
                          ? "bg-orange-600 hover:bg-orange-700"
                          : "hover:bg-orange-50 hover:border-orange-300"
                      }`}
                      onClick={() => handleTagFilter(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <span className="w-4 h-4 bg-green-500 rounded mr-2"></span>
                  Top Contributors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "alice_dev", reputation: 2847, avatar: "/placeholder.svg?height=32&width=32" },
                    { name: "bob_coder", reputation: 1923, avatar: "/placeholder.svg?height=32&width=32" },
                    { name: "charlie_js", reputation: 1456, avatar: "/placeholder.svg?height=32&width=32" },
                  ].map((user, index) => (
                    <div key={user.name} className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 bg-orange-100 text-orange-600 rounded-full text-xs font-bold">
                        {index + 1}
                      </div>
                      <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.reputation.toLocaleString()} reputation</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <span className="w-4 h-4 bg-blue-500 rounded mr-2"></span>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-gray-600">New answer posted on "React hooks best practices"</p>
                      <p className="text-xs text-gray-500">5 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-gray-600">Question upvoted: "TypeScript generics explained"</p>
                      <p className="text-xs text-gray-500">12 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-gray-600">New user joined: developer_123</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help Section */}
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 text-orange-800">New to Stack Echo?</h3>
                <ul className="text-xs text-orange-700 space-y-1">
                  <li>• Ask clear, specific questions</li>
                  <li>• Search before posting</li>
                  <li>• Vote on helpful content</li>
                  <li>• Accept the best answers</li>
                </ul>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full border-orange-300 text-orange-700 hover:bg-orange-100 bg-transparent"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
