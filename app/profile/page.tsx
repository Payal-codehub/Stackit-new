"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/components/header"
import { useAppStore } from "@/lib/store"
import { Trophy, Calendar, Edit, MessageSquare, ThumbsUp, Award, TrendingUp, Eye, Bookmark } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

export default function ProfilePage() {
  const router = useRouter()
  const { currentUser, isAuthenticated, questions, getFilteredQuestions } = useAppStore()

  if (!isAuthenticated || !currentUser) {
    router.push("/login")
    return null
  }

  // Get user's questions and answers
  const userQuestions = questions.filter((q) => q.author.id === currentUser.id)
  const userAnswers = questions.flatMap((q) =>
    q.answers
      .filter((a) => a.author.id === currentUser.id)
      .map((a) => ({ ...a, questionTitle: q.title, questionId: q.id })),
  )
  const bookmarkedQuestions = questions.filter((q) => q.isBookmarked)

  const stats = [
    { label: "Reputation", value: currentUser.reputation, icon: Trophy, color: "text-yellow-600" },
    { label: "Questions", value: userQuestions.length, icon: MessageSquare, color: "text-blue-600" },
    { label: "Answers", value: userAnswers.length, icon: ThumbsUp, color: "text-green-600" },
    { label: "Badges", value: currentUser.badges.length, icon: Award, color: "text-purple-600" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.username} />
                  <AvatarFallback className="text-2xl">{currentUser.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>

                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{currentUser.username}</h1>
                  <p className="text-gray-600">{currentUser.email}</p>

                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Member since {new Date(currentUser.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1" />

              <Button className="bg-orange-600 hover:bg-orange-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
                  <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Badges</h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.badges.map((badge) => (
                  <Badge key={badge} className="bg-orange-100 text-orange-800 px-3 py-1">
                    <Award className="h-3 w-3 mr-1" />
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Tabs */}
        <Tabs defaultValue="questions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="questions">Questions ({userQuestions.length})</TabsTrigger>
            <TabsTrigger value="answers">Answers ({userAnswers.length})</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks ({bookmarkedQuestions.length})</TabsTrigger>
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
                  <p className="text-gray-600 mb-4">Start by asking your first question!</p>
                  <Button asChild className="bg-orange-600 hover:bg-orange-700">
                    <Link href="/ask">Ask Question</Link>
                  </Button>
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
                  <p className="text-gray-600">Start helping others by answering questions!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="bookmarks" className="space-y-4">
            {bookmarkedQuestions.length > 0 ? (
              bookmarkedQuestions.map((question) => (
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
                        <div className="flex items-center text-sm text-gray-500">
                          <span>by {question.author.username}</span>
                          <span className="mx-2">•</span>
                          <span>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
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
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No bookmarks yet</h3>
                  <p className="text-gray-600">Bookmark questions to save them for later!</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Posted a new question about React hooks</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm">Answered a question about TypeScript</p>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
