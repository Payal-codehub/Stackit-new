"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { useAppStore } from "@/lib/store"
import { Search, TrendingUp, Hash } from "lucide-react"
import Link from "next/link"

const allTags = [
  { name: "javascript", count: 1234, description: "For questions about JavaScript programming language" },
  { name: "react", count: 987, description: "A JavaScript library for building user interfaces" },
  { name: "nextjs", count: 654, description: "The React framework for production applications" },
  { name: "typescript", count: 543, description: "A typed superset of JavaScript" },
  { name: "nodejs", count: 432, description: "JavaScript runtime built on Chrome's V8 engine" },
  { name: "python", count: 876, description: "A high-level programming language" },
  { name: "css", count: 321, description: "Cascading Style Sheets for styling web pages" },
  { name: "html", count: 298, description: "The standard markup language for web pages" },
  { name: "vue", count: 234, description: "The Progressive JavaScript Framework" },
  { name: "angular", count: 198, description: "Platform for building mobile and desktop web applications" },
  { name: "express", count: 167, description: "Fast, unopinionated web framework for Node.js" },
  { name: "mongodb", count: 145, description: "Document-oriented NoSQL database" },
  { name: "sql", count: 289, description: "Structured Query Language for databases" },
  { name: "git", count: 156, description: "Distributed version control system" },
  { name: "docker", count: 134, description: "Platform for developing, shipping, and running applications" },
]

export default function TagsPage() {
  const { setSelectedTags, selectedTags } = useAppStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"popular" | "name" | "new">("popular")

  const filteredTags = allTags
    .filter(
      (tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.count - a.count
        case "name":
          return a.name.localeCompare(b.name)
        case "new":
          return Math.random() - 0.5 // Random for demo
        default:
          return 0
      }
    })

  const handleTagClick = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagName))
    } else {
      setSelectedTags([...selectedTags, tagName])
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tags</h1>
          <p className="text-gray-600">
            A tag is a keyword or label that categorizes your question with other, similar questions.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "popular" ? "default" : "outline"}
              onClick={() => setSortBy("popular")}
              className={sortBy === "popular" ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              Popular
            </Button>
            <Button
              variant={sortBy === "name" ? "default" : "outline"}
              onClick={() => setSortBy("name")}
              className={sortBy === "name" ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              Name
            </Button>
            <Button
              variant={sortBy === "new" ? "default" : "outline"}
              onClick={() => setSortBy("new")}
              className={sortBy === "new" ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              New
            </Button>
          </div>
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Selected Tags ({selectedTags.length})</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  className="bg-orange-100 text-orange-800 cursor-pointer"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
              <Button variant="outline" size="sm" onClick={() => setSelectedTags([])}>
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* Tags Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTags.map((tag) => (
            <Card
              key={tag.name}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTags.includes(tag.name) ? "border-orange-500 bg-orange-50" : "hover:border-orange-300"
              }`}
              onClick={() => handleTagClick(tag.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge
                    variant="secondary"
                    className={`text-sm ${
                      selectedTags.includes(tag.name) ? "bg-orange-600 text-white" : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {tag.name}
                  </Badge>
                  <div className="flex items-center text-sm text-gray-500">
                    <Hash className="h-3 w-3 mr-1" />
                    {tag.count}
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{tag.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <Link
                    href={`/?tags=${tag.name}`}
                    className="text-xs text-orange-600 hover:text-orange-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View questions →
                  </Link>
                  <div className="flex items-center text-xs text-gray-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Popular
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTags.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Hash className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tags found</h3>
              <p className="text-gray-600">Try adjusting your search query.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
