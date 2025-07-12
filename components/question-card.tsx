"use client"

import type React from "react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ArrowUp, ArrowDown, MessageSquare, Bookmark, BookmarkCheck } from "lucide-react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import type { Question } from "@/lib/store"
import { formatDistanceToNow } from "date-fns"

interface QuestionCardProps {
  question: Question
}

export function QuestionCard({ question }: QuestionCardProps) {
  const { voteQuestion, bookmarkQuestion, isAuthenticated, incrementViews } = useAppStore()

  const handleVote = (e: React.MouseEvent, voteType: "up" | "down") => {
    e.preventDefault()
    e.stopPropagation()
    if (isAuthenticated) {
      voteQuestion(question.id, voteType)
    }
  }

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isAuthenticated) {
      bookmarkQuestion(question.id)
    }
  }

  const handleQuestionClick = () => {
    incrementViews(question.id)
  }

  const hasAcceptedAnswer = question.answers.some((answer) => answer.isAccepted)

  return (
    <Card className="hover:shadow-md transition-shadow border-l-4 border-l-transparent hover:border-l-orange-500">
      <CardContent className="p-6">
        <div className="flex space-x-4">
          {/* Vote and Stats Section */}
          <div className="flex flex-col items-center space-y-3 text-gray-500 min-w-[80px]">
            {/* Voting */}
            <div className="flex flex-col items-center space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className={`p-1 h-8 w-8 transition-all ${
                  question.userVote === "up"
                    ? "text-orange-600 bg-orange-100 hover:bg-orange-200"
                    : "hover:bg-gray-100 hover:text-orange-600"
                }`}
                onClick={(e) => handleVote(e, "up")}
                disabled={!isAuthenticated}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
              <span
                className={`font-bold text-lg ${question.votes > 0 ? "text-green-600" : question.votes < 0 ? "text-red-600" : "text-gray-600"}`}
              >
                {question.votes}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className={`p-1 h-8 w-8 transition-all ${
                  question.userVote === "down"
                    ? "text-red-600 bg-red-100 hover:bg-red-200"
                    : "hover:bg-gray-100 hover:text-red-600"
                }`}
                onClick={(e) => handleVote(e, "down")}
                disabled={!isAuthenticated}
              >
                <ArrowDown className="h-5 w-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-col items-center space-y-2 text-sm">
              <div
                className={`flex items-center space-x-1 px-2 py-1 rounded ${hasAcceptedAnswer ? "bg-green-100 text-green-700" : question.answers.length > 0 ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}
              >
                <MessageSquare className="h-3 w-3" />
                <span className="font-semibold">{question.answers.length}</span>
              </div>
              <div className="text-center">
                <div className="font-semibold">{question.views}</div>
                <div className="text-xs">views</div>
              </div>
            </div>

            {/* Bookmark */}
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 h-8 w-8 ${question.isBookmarked ? "text-orange-600" : ""}`}
              onClick={handleBookmark}
              disabled={!isAuthenticated}
            >
              {question.isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </Button>
          </div>

          {/* Question Content */}
          <div className="flex-1">
            <Link href={`/questions/${question.id}`} onClick={handleQuestionClick} className="block">
              <h3 className="text-lg font-semibold text-blue-600 hover:text-blue-800 mb-2 line-clamp-2">
                {question.title}
              </h3>
            </Link>

            <p className="text-gray-600 mb-3 line-clamp-3 text-sm leading-relaxed">
              {question.content.replace(/```[\s\S]*?```/g, "[code]").substring(0, 200)}
              {question.content.length > 200 ? "..." : ""}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {question.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Author and Time */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={question.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{question.author.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <Link
                  href={`/users/${question.author.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {question.author.username}
                </Link>
                <span className="text-xs text-gray-500">{question.author.reputation} rep</span>
              </div>
              <div className="text-sm text-gray-500">
                asked {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
