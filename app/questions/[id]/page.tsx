"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Header } from "@/components/header"
import { useAppStore } from "@/lib/store"
import {
  ArrowUp,
  ArrowDown,
  Share,
  Bookmark,
  BookmarkCheck,
  Flag,
  Check,
  MessageSquare,
  Eye,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

export default function QuestionPage() {
  const params = useParams()
  const router = useRouter()
  const questionId = params.id as string

  const {
    getQuestionById,
    voteQuestion,
    voteAnswer,
    bookmarkQuestion,
    addAnswer,
    acceptAnswer,
    incrementViews,
    isAuthenticated,
    currentUser,
  } = useAppStore()

  const [question, setQuestion] = useState(getQuestionById(questionId))
  const [newAnswer, setNewAnswer] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const foundQuestion = getQuestionById(questionId)
    if (foundQuestion) {
      setQuestion(foundQuestion)
      incrementViews(questionId)
    }
  }, [questionId, getQuestionById, incrementViews])

  // Refresh question data when store updates
  useEffect(() => {
    setQuestion(getQuestionById(questionId))
  }, [questionId, getQuestionById])

  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Question Not Found</h2>
              <p className="text-gray-600 mb-6">The question you're looking for doesn't exist or has been removed.</p>
              <Button asChild>
                <Link href="/">Back to Questions</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const handleVoteQuestion = (voteType: "up" | "down") => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    voteQuestion(questionId, voteType)
  }

  const handleVoteAnswer = (answerId: string, voteType: "up" | "down") => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    voteAnswer(questionId, answerId, voteType)
  }

  const handleBookmark = () => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }
    bookmarkQuestion(questionId)
  }

  const handleAcceptAnswer = (answerId: string) => {
    if (!isAuthenticated || currentUser?.id !== question.author.id) {
      return
    }
    acceptAnswer(questionId, answerId)
  }

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (!newAnswer.trim()) {
      setError("Answer cannot be empty")
      return
    }

    if (newAnswer.length < 30) {
      setError("Answer must be at least 30 characters long")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      addAnswer(questionId, newAnswer.trim())
      setNewAnswer("")
    } catch (err) {
      setError("Failed to submit answer. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasAcceptedAnswer = question.answers.some((answer) => answer.isAccepted)
  const isQuestionAuthor = currentUser?.id === question.author.id

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/" className="text-orange-600 hover:text-orange-700 text-sm">
            ← Back to Questions
          </Link>
        </nav>

        {/* Question */}
        <Card className="mb-8 border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex space-x-6">
              {/* Vote Section */}
              <div className="flex flex-col items-center space-y-3 min-w-[80px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 h-10 w-10 transition-all ${
                    question.userVote === "up"
                      ? "text-orange-600 bg-orange-100 hover:bg-orange-200"
                      : "hover:bg-gray-100 hover:text-orange-600"
                  }`}
                  onClick={() => handleVoteQuestion("up")}
                >
                  <ArrowUp className="h-6 w-6" />
                </Button>
                <span
                  className={`font-bold text-2xl ${question.votes > 0 ? "text-green-600" : question.votes < 0 ? "text-red-600" : "text-gray-600"}`}
                >
                  {question.votes}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 h-10 w-10 transition-all ${
                    question.userVote === "down"
                      ? "text-red-600 bg-red-100 hover:bg-red-200"
                      : "hover:bg-gray-100 hover:text-red-600"
                  }`}
                  onClick={() => handleVoteQuestion("down")}
                >
                  <ArrowDown className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className={`p-2 h-10 w-10 ${question.isBookmarked ? "text-orange-600" : "hover:bg-gray-100"}`}
                  onClick={handleBookmark}
                >
                  {question.isBookmarked ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                </Button>
              </div>

              {/* Question Content */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{question.title}</h1>

                <div className="flex items-center space-x-4 mb-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{question.views} views</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>{question.answers.length} answers</span>
                  </div>
                  <span>Asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</span>
                </div>

                <div className="prose max-w-none mb-6">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{question.content}</div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {question.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Question Actions */}
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm">
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Flag className="h-4 w-4 mr-2" />
                      Flag
                    </Button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={question.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{question.author.username[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link
                        href={`/users/${question.author.id}`}
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        {question.author.username}
                      </Link>
                      <div className="text-sm text-gray-500">{question.author.reputation} reputation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Answers Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {question.answers.length} Answer{question.answers.length !== 1 ? "s" : ""}
          </h2>
          {hasAcceptedAnswer && <p className="text-sm text-green-600 mt-1">✓ This question has an accepted answer</p>}
        </div>

        {/* Answers */}
        <div className="space-y-6 mb-8">
          {question.answers.map((answer) => (
            <Card
              key={answer.id}
              className={`${answer.isAccepted ? "border-green-200 bg-green-50" : ""} border-l-4 ${answer.isAccepted ? "border-l-green-500" : "border-l-transparent"}`}
            >
              <CardContent className="p-6">
                <div className="flex space-x-6">
                  {/* Vote Section */}
                  <div className="flex flex-col items-center space-y-3 min-w-[80px]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-2 h-10 w-10 transition-all ${
                        answer.userVote === "up"
                          ? "text-orange-600 bg-orange-100 hover:bg-orange-200"
                          : "hover:bg-gray-100 hover:text-orange-600"
                      }`}
                      onClick={() => handleVoteAnswer(answer.id, "up")}
                    >
                      <ArrowUp className="h-6 w-6" />
                    </Button>
                    <span
                      className={`font-bold text-2xl ${answer.votes > 0 ? "text-green-600" : answer.votes < 0 ? "text-red-600" : "text-gray-600"}`}
                    >
                      {answer.votes}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-2 h-10 w-10 transition-all ${
                        answer.userVote === "down"
                          ? "text-red-600 bg-red-100 hover:bg-red-200"
                          : "hover:bg-gray-100 hover:text-red-600"
                      }`}
                      onClick={() => handleVoteAnswer(answer.id, "down")}
                    >
                      <ArrowDown className="h-6 w-6" />
                    </Button>

                    {isQuestionAuthor && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`p-2 h-10 w-10 ${answer.isAccepted ? "text-green-600 bg-green-50" : "hover:bg-gray-100"}`}
                        onClick={() => handleAcceptAnswer(answer.id)}
                        title={answer.isAccepted ? "Unaccept answer" : "Accept answer"}
                      >
                        <Check className="h-6 w-6" />
                      </Button>
                    )}

                    {answer.isAccepted && !isQuestionAuthor && (
                      <div className="text-green-600 p-2">
                        <Check className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  {/* Answer Content */}
                  <div className="flex-1">
                    {answer.isAccepted && (
                      <div className="mb-4">
                        <Badge className="bg-green-600 text-white">
                          <Check className="h-3 w-3 mr-1" />
                          Accepted Answer
                        </Badge>
                      </div>
                    )}

                    <div className="prose max-w-none mb-6">
                      <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">{answer.content}</div>
                    </div>

                    {/* Answer Actions */}
                    <div className="flex items-center justify-between border-t pt-4">
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm">
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Flag className="h-4 w-4 mr-2" />
                          Flag
                        </Button>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-sm text-gray-500">
                          answered {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={answer.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{answer.author.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link
                            href={`/users/${answer.author.id}`}
                            className="font-medium text-blue-600 hover:text-blue-800 text-sm"
                          >
                            {answer.author.username}
                          </Link>
                          <div className="text-xs text-gray-500">{answer.author.reputation} reputation</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Answer Form */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold mb-4">Your Answer</h3>

            {!isAuthenticated ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You must be{" "}
                  <Link href="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                    logged in
                  </Link>{" "}
                  to post an answer.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <Textarea
                  value={newAnswer}
                  onChange={(e) => {
                    setNewAnswer(e.target.value)
                    setError("")
                  }}
                  placeholder="Write your answer here... Be sure to answer the question. Provide details and share your research!"
                  className="min-h-[200px]"
                  disabled={isSubmitting}
                />

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">Thanks for contributing an answer to Stack Echo!</p>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !newAnswer.trim()}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isSubmitting ? "Posting..." : "Post Your Answer"}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
