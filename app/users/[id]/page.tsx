"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { useAppStore } from "@/lib/store"
import { Trophy, Calendar, MapPin, MessageSquare, ThumbsUp, Award, Eye, Mail, Globe, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

// Mock user data for demo
const mockUserData = {
  "1": {
    id: "1",
    username: "alice_dev",
    email: "alice@example.com",
    avatar: "/placeholder.svg?height=80&width=80",
    reputation: 2847,
    joinDate: "2022-08-20",
    location: "San Francisco, CA",
    website: "https://alice-dev.com",
    bio: "Full-stack developer with 8+ years of experience in React and Node.js. Passionate about clean code and helping others learn.",
    badges: ["Expert", "Top Contributor", "Mentor", "JavaScript Guru"],
    questionsCount: 45,
    answersCount: 123,
    acceptedAnswers: 89,
    views: 15420,
  },
  "2": {
    id: "2",
    username: "bob_coder",
    email: "bob@example.com",
    avatar: "/placeholder.svg?height=80&width=80",
    reputation: 1923,
    joinDate: "2023-03-10",
    location: "New York, NY",
    website: "https://bobcodes.dev",
    bio: "Backend engineer specializing in Python and microservices. Love solving complex problems and optimizing performance.",
    badges: ["Problem Solver", "Helper", "Python Expert"],
    questionsCount: 23,
    answersCount: 67,
    acceptedAnswers: 45,
    views: 8930,
  },
}

export default function UserProfilePage() {
  const params = useParams()
  const userId = params.id as string
  const { questions } = useAppStore()

  const user = mockUserData[userId as keyof typeof mockUserData]

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h2>
              <p className="text-gray-600 mb-6">The user you're looking for doesn't exist.</p>
              <Button asChild>
                <Link href="/users">Back to Users</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Get user's questions and answers from the store
  const userQuestions = questions.filter((q) => q.author.username === user.username)
  const userAnswers = questions.flatMap((q) =>
    q.answers
      .filter((a) => a.author.username === user.username)
      .map((a) => ({
        ...a,
        questionTitle: q.title,
        questionId: q.id,
      })),
  )

  const stats = [
    { label: "Reputation", value: user.reputation, icon: Trophy, color: "text-yellow-600" },
    { label: "Questions", value: userQuestions.length, icon: MessageSquare, color: "text-blue-600" },
    { label: "Answers", value: userAnswers.length, icon: ThumbsUp, color: "text-green-600" },
    { label: "Profile Views", value: user.views, icon: Eye, color: "text-purple-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/users" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Users
        </Link>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-8">
              <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.username} />
                  <AvatarFallback className="text-3xl">{user.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>

                <Button className="bg-orange-600 hover:bg-orange-700">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{user.username}</h1>

                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  {user.location && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.website && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700"
                      >
                        {user.website.replace("https://", "")}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Member since {new Date(user.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>

                {user.bio && <p className="text-gray-700 mb-6 leading-relaxed">{user.bio}</p>}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {stats.map((stat) => (
                    <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
                      <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                      <div className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Badges */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Badges ({user.badges.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.badges.map((badge) => (
                      <Badge key={badge} className="bg-orange-100 text-orange-800 px-3 py-1">
                        <Award className="h-3 w-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Tabs */}
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="questions">Questions ({userQuestions.length})</TabsTrigger>
            <TabsTrigger value="answers">Answers ({userAnswers.length})</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-4">
            {userQuestions.length > 0 ? (
              userQuestions.map((question) => (
                <Card key={question.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link
                          href={`/questions/${question.id}`}
                          className="text-lg font-semibold text-blue-600 hover:text-blue-800 block mb-2"
                        >
                          {question.title}
                        </Link>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {question.content.substring(0, 200)}...
                        </p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {question.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500 ml-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {question.votes}
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {question.answers.length}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {question.views}
                          </div>
                        </div>
                        <div className="mt-2">
                          {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions yet</h3>
                  <p className="text-gray-600">{user.username} hasn't asked any questions.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="answers" className="space-y-4">
            {userAnswers.length > 0 ? (
              userAnswers.map((answer) => (
                <Card key={answer.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <Link
                          href={`/questions/${answer.questionId}`}
                          className="text-lg font-semibold text-blue-600 hover:text-blue-800 block mb-2"
                        >
                          {answer.questionTitle}
                        </Link>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">{answer.content.substring(0, 300)}...</p>
                        {answer.isAccepted && <Badge className="bg-green-600 text-white mb-2">✓ Accepted Answer</Badge>}
                      </div>
                      <div className="text-right text-sm text-gray-500 ml-4">
                        <div className="flex items-center">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          {answer.votes}
                        </div>
                        <div className="mt-2">
                          {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <ThumbsUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No answers yet</h3>
                  <p className="text-gray-600">{user.username} hasn't posted any answers.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Answered a question about React hooks</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Asked a question about TypeScript generics</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Earned the "Helper" badge</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Upvoted 5 helpful answers</p>
                      <p className="text-xs text-gray-500">1 week ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
