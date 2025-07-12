"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/components/header"
import {
  HelpCircle,
  Search,
  MessageSquare,
  ThumbsUp,
  Award,
  Users,
  BookOpen,
  Lightbulb,
  Shield,
  Mail,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const faqItems = [
  {
    question: "How do I ask a good question?",
    answer:
      "Be specific, provide context, show what you've tried, and include relevant code examples. Search for existing questions first.",
    category: "Asking Questions",
  },
  {
    question: "How does the reputation system work?",
    answer:
      "You earn reputation when other users upvote your questions and answers. Reputation reflects your contributions to the community.",
    category: "Reputation",
  },
  {
    question: "What should I do when someone answers my question?",
    answer:
      "Upvote helpful answers and accept the best answer by clicking the checkmark. This helps future visitors find the solution.",
    category: "Answers",
  },
  {
    question: "How do I format code in my posts?",
    answer:
      "Use triple backticks (```) for code blocks or single backticks (`) for inline code. You can also use the code formatting buttons in the editor.",
    category: "Formatting",
  },
  {
    question: "What are badges and how do I earn them?",
    answer:
      "Badges are awarded for various achievements like asking good questions, providing helpful answers, or participating in the community.",
    category: "Badges",
  },
  {
    question: "Can I edit my questions and answers?",
    answer:
      "Yes, you can edit your own posts to improve them. Other users with sufficient reputation can also suggest edits.",
    category: "Editing",
  },
]

const guides = [
  {
    title: "Getting Started Guide",
    description: "Learn the basics of using Stack Echo effectively",
    icon: BookOpen,
    color: "text-blue-600",
  },
  {
    title: "Writing Great Questions",
    description: "Tips for asking questions that get great answers",
    icon: Lightbulb,
    color: "text-yellow-600",
  },
  {
    title: "Community Guidelines",
    description: "Rules and best practices for our community",
    icon: Shield,
    color: "text-green-600",
  },
  {
    title: "Reputation & Badges",
    description: "Understanding our reward system",
    icon: Award,
    color: "text-purple-600",
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFAQ = faqItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <HelpCircle className="h-10 w-10 mr-3 text-orange-600" />
            Help Center
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and learn how to make the most of Stack Echo.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Start Guides */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guides.map((guide) => (
                  <Card key={guide.title} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <guide.icon className={`h-8 w-8 ${guide.color} flex-shrink-0`} />
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">{guide.title}</h3>
                          <p className="text-sm text-gray-600">{guide.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Frequently Asked Questions
                {searchQuery && (
                  <span className="text-lg font-normal text-gray-500 ml-2">({filteredFAQ.length} results)</span>
                )}
              </h2>
              <div className="space-y-4">
                {filteredFAQ.map((item, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{item.question}</CardTitle>
                        <Badge variant="secondary" className="ml-4 flex-shrink-0">
                          {item.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{item.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredFAQ.length === 0 && searchQuery && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">Try different keywords or browse our guides above.</p>
                  </CardContent>
                </Card>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Need More Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <Button className="w-full bg-orange-600 hover:bg-orange-700">Contact Support</Button>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Community Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm">Questions</span>
                  </div>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ThumbsUp className="h-4 w-4 text-green-600 mr-2" />
                    <span className="text-sm">Answers</span>
                  </div>
                  <span className="font-semibold">3,456</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-purple-600 mr-2" />
                    <span className="text-sm">Users</span>
                  </div>
                  <span className="font-semibold">567</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-yellow-600 mr-2" />
                    <span className="text-sm">Badges Earned</span>
                  </div>
                  <span className="font-semibold">890</span>
                </div>
              </CardContent>
            </Card>

            {/* Popular Topics */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Help Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "How to ask questions",
                    "Reputation system",
                    "Formatting posts",
                    "Community guidelines",
                    "Badge requirements",
                  ].map((topic) => (
                    <Link key={topic} href="#" className="block text-sm text-blue-600 hover:text-blue-800 py-1">
                      {topic}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-3 text-orange-800">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/ask">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Ask a Question
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/">
                      <Search className="h-4 w-4 mr-2" />
                      Browse Questions
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/tags">
                      <Award className="h-4 w-4 mr-2" />
                      Explore Tags
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
