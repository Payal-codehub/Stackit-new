"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "@/components/header"
import { Search, Users, Trophy, Calendar, MapPin } from "lucide-react"
import Link from "next/link"

const mockUsers = [
  {
    id: "1",
    username: "alice_dev",
    email: "alice@example.com",
    avatar: "/placeholder.svg?height=60&width=60",
    reputation: 2847,
    joinDate: "2022-08-20",
    location: "San Francisco, CA",
    badges: ["Expert", "Top Contributor", "Mentor"],
    questionsCount: 45,
    answersCount: 123,
    bio: "Full-stack developer with 8+ years of experience in React and Node.js",
  },
  {
    id: "2",
    username: "bob_coder",
    email: "bob@example.com",
    avatar: "/placeholder.svg?height=60&width=60",
    reputation: 1923,
    joinDate: "2023-03-10",
    location: "New York, NY",
    badges: ["Problem Solver", "Helper"],
    questionsCount: 23,
    answersCount: 67,
    bio: "Backend engineer specializing in Python and microservices",
  },
  {
    id: "3",
    username: "charlie_js",
    email: "charlie@example.com",
    avatar: "/placeholder.svg?height=60&width=60",
    reputation: 1456,
    joinDate: "2023-01-15",
    location: "London, UK",
    badges: ["JavaScript Expert", "React Specialist"],
    questionsCount: 34,
    answersCount: 89,
    bio: "Frontend developer passionate about modern JavaScript frameworks",
  },
  {
    id: "4",
    username: "diana_py",
    email: "diana@example.com",
    avatar: "/placeholder.svg?height=60&width=60",
    reputation: 1234,
    joinDate: "2023-05-22",
    location: "Toronto, Canada",
    badges: ["Python Expert", "Data Science"],
    questionsCount: 18,
    answersCount: 45,
    bio: "Data scientist and Python developer with ML expertise",
  },
  {
    id: "5",
    username: "evan_mobile",
    email: "evan@example.com",
    avatar: "/placeholder.svg?height=60&width=60",
    reputation: 987,
    joinDate: "2023-07-08",
    location: "Austin, TX",
    badges: ["Mobile Dev", "React Native"],
    questionsCount: 12,
    answersCount: 28,
    bio: "Mobile app developer focusing on React Native and Flutter",
  },
  {
    id: "6",
    username: "fiona_ui",
    email: "fiona@example.com",
    avatar: "/placeholder.svg?height=60&width=60",
    reputation: 876,
    joinDate: "2023-09-14",
    location: "Berlin, Germany",
    badges: ["UI/UX", "CSS Expert"],
    questionsCount: 15,
    answersCount: 32,
    bio: "UI/UX designer and frontend developer with a passion for great design",
  },
]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"reputation" | "newest" | "oldest">("reputation")

  const filteredUsers = mockUsers
    .filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.location.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "reputation":
          return b.reputation - a.reputation
        case "newest":
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
        case "oldest":
          return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
          <p className="text-gray-600">Connect with developers from around the world and learn from their expertise.</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "reputation" ? "default" : "outline"}
              onClick={() => setSortBy("reputation")}
              className={sortBy === "reputation" ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              Reputation
            </Button>
            <Button
              variant={sortBy === "newest" ? "default" : "outline"}
              onClick={() => setSortBy("newest")}
              className={sortBy === "newest" ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              Newest
            </Button>
            <Button
              variant={sortBy === "oldest" ? "default" : "outline"}
              onClick={() => setSortBy("oldest")}
              className={sortBy === "oldest" ? "bg-orange-600 hover:bg-orange-700" : ""}
            >
              Oldest
            </Button>
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                    <AvatarFallback className="text-lg">{user.username[0].toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/users/${user.id}`}
                      className="text-lg font-semibold text-blue-600 hover:text-blue-800 block truncate"
                    >
                      {user.username}
                    </Link>

                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Trophy className="h-4 w-4 mr-1" />
                      <span className="font-medium">{user.reputation.toLocaleString()}</span>
                      <span className="ml-1">reputation</span>
                    </div>

                    {user.location && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{user.location}</span>
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-4 line-clamp-2">{user.bio}</p>

                {/* Badges */}
                <div className="flex flex-wrap gap-1 mt-4">
                  {user.badges.map((badge) => (
                    <Badge key={badge} variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                      {badge}
                    </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{user.questionsCount}</div>
                    <div className="text-xs text-gray-500">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{user.answersCount}</div>
                    <div className="text-xs text-gray-500">Answers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{Math.floor(user.answersCount * 0.3)}</div>
                    <div className="text-xs text-gray-500">Accepted</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-600">Try adjusting your search query.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
