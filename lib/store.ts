"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  username: string
  email: string
  avatar: string
  reputation: number
  joinDate: string
  badges: string[]
}

export interface Question {
  id: string
  title: string
  content: string
  author: User
  votes: number
  answers: Answer[]
  views: number
  tags: string[]
  createdAt: string
  updatedAt: string
  isBookmarked?: boolean
  userVote?: "up" | "down" | null
}

export interface Answer {
  id: string
  content: string
  author: User
  votes: number
  createdAt: string
  isAccepted: boolean
  userVote?: "up" | "down" | null
}

interface AppState {
  // User state
  currentUser: User | null
  isAuthenticated: boolean

  // Questions state
  questions: Question[]
  currentQuestion: Question | null

  // UI state
  searchQuery: string
  selectedTags: string[]
  sortBy: "newest" | "active" | "votes" | "unanswered"

  // Actions
  login: (user: User) => void
  logout: () => void
  register: (userData: Omit<User, "id" | "reputation" | "joinDate" | "badges">) => void

  // Question actions
  addQuestion: (
    question: Omit<Question, "id" | "votes" | "answers" | "views" | "createdAt" | "updatedAt" | "userVote">,
  ) => void
  voteQuestion: (questionId: string, voteType: "up" | "down") => void
  bookmarkQuestion: (questionId: string) => void
  incrementViews: (questionId: string) => void

  // Answer actions
  addAnswer: (questionId: string, content: string) => void
  voteAnswer: (questionId: string, answerId: string, voteType: "up" | "down") => void
  acceptAnswer: (questionId: string, answerId: string) => void

  // Search and filter
  setSearchQuery: (query: string) => void
  setSelectedTags: (tags: string[]) => void
  setSortBy: (sort: "newest" | "active" | "votes" | "unanswered") => void

  // Getters
  getFilteredQuestions: () => Question[]
  getQuestionById: (id: string) => Question | undefined
}

// Mock users
const mockUsers: User[] = [
  {
    id: "1",
    username: "john_doe",
    email: "john@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 1250,
    joinDate: "2023-01-15",
    badges: ["Contributor", "Helper"],
  },
  {
    id: "2",
    username: "alice_dev",
    email: "alice@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 2847,
    joinDate: "2022-08-20",
    badges: ["Expert", "Top Contributor", "Mentor"],
  },
  {
    id: "3",
    username: "bob_coder",
    email: "bob@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    reputation: 1923,
    joinDate: "2023-03-10",
    badges: ["Problem Solver", "Helper"],
  },
]

// Mock questions with answers
const mockQuestions: Question[] = [
  {
    id: "1",
    title: "How to implement authentication in Next.js 14?",
    content: `I'm trying to implement authentication in my Next.js 14 application using the app router. I've looked at several approaches but I'm not sure which one is the best practice.

Here's what I've tried so far:

\`\`\`javascript
// app/api/auth/route.js
export async function POST(request) {
  const { email, password } = await request.json()
  // Authentication logic here
}
\`\`\`

I'm specifically looking for:
1. Best practices for session management
2. How to protect routes in the app router
3. Integration with external auth providers

Any help would be appreciated!`,
    author: mockUsers[0],
    votes: 15,
    views: 127,
    tags: ["nextjs", "authentication", "react", "app-router"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    answers: [
      {
        id: "a1",
        content: `For Next.js 14 with the app router, I recommend using NextAuth.js (now Auth.js). Here's a complete setup:

First, install the required packages:
\`\`\`bash
npm install next-auth
\`\`\`

Then create your auth configuration:
\`\`\`javascript
// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      return session
    }
  }
})

export { GET }
\`\`\`

This approach handles session management automatically and integrates well with the app router.`,
        author: mockUsers[1],
        votes: 23,
        createdAt: "2024-01-15T11:15:00Z",
        isAccepted: true,
      },
    ],
  },
  {
    id: "2",
    title: "React useState not updating immediately",
    content: `I'm having trouble with useState not updating the state immediately after calling the setter function. Here's my code:

\`\`\`javascript
const [count, setCount] = useState(0);

const handleClick = () => {
  setCount(count + 1);
  console.log(count); // This still shows the old value
};
\`\`\`

Why is this happening and how can I fix it?`,
    author: mockUsers[2],
    votes: 8,
    views: 89,
    tags: ["react", "hooks", "state", "javascript"],
    createdAt: "2024-01-15T08:20:00Z",
    updatedAt: "2024-01-15T08:20:00Z",
    answers: [
      {
        id: "a2",
        content: `This is expected behavior in React. State updates are asynchronous and batched for performance reasons.

Here are a few solutions:

1. **Use useEffect to watch for state changes:**
\`\`\`javascript
useEffect(() => {
  console.log(count); // This will log the updated value
}, [count]);
\`\`\`

2. **Use the functional update pattern:**
\`\`\`javascript
const handleClick = () => {
  setCount(prevCount => {
    const newCount = prevCount + 1;
    console.log(newCount); // This shows the new value
    return newCount;
  });
};
\`\`\`

3. **Store the new value in a variable:**
\`\`\`javascript
const handleClick = () => {
  const newCount = count + 1;
  setCount(newCount);
  console.log(newCount); // This shows the new value
};
\`\`\``,
        author: mockUsers[1],
        votes: 12,
        createdAt: "2024-01-15T09:45:00Z",
        isAccepted: false,
      },
    ],
  },
  {
    id: "3",
    title: "Best practices for TypeScript with Node.js",
    content: `What are the recommended best practices when using TypeScript in a Node.js backend application? I'm particularly interested in:

- Project structure
- Configuration setup
- Type definitions for external libraries
- Error handling patterns
- Testing strategies

Any comprehensive guide or examples would be helpful!`,
    author: mockUsers[0],
    votes: 23,
    views: 234,
    tags: ["typescript", "nodejs", "backend", "best-practices"],
    createdAt: "2024-01-14T15:30:00Z",
    updatedAt: "2024-01-14T15:30:00Z",
    answers: [],
  },
]

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      isAuthenticated: false,
      questions: mockQuestions,
      currentQuestion: null,
      searchQuery: "",
      selectedTags: [],
      sortBy: "newest",

      // Auth actions
      login: (user) => set({ currentUser: user, isAuthenticated: true }),
      logout: () => set({ currentUser: null, isAuthenticated: false }),
      register: (userData) => {
        const newUser: User = {
          ...userData,
          id: Date.now().toString(),
          reputation: 1,
          joinDate: new Date().toISOString(),
          badges: ["New Member"],
        }
        set({ currentUser: newUser, isAuthenticated: true })
      },

      // Question actions
      addQuestion: (questionData) => {
        const { currentUser } = get()
        if (!currentUser) return

        const newQuestion: Question = {
          ...questionData,
          id: Date.now().toString(),
          author: currentUser,
          votes: 0,
          answers: [],
          views: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userVote: null,
        }

        set((state) => ({
          questions: [newQuestion, ...state.questions],
        }))
      },

      voteQuestion: (questionId, voteType) => {
        const { currentUser } = get()
        if (!currentUser) return

        set((state) => ({
          questions: state.questions.map((q) => {
            if (q.id === questionId) {
              const currentVote = q.userVote
              let newVotes = q.votes
              let newUserVote: "up" | "down" | null = null

              // Handle vote logic
              if (currentVote === voteType) {
                // Remove vote (clicking same arrow)
                newVotes += voteType === "up" ? -1 : 1
                newUserVote = null
              } else if (currentVote) {
                // Change vote (clicking opposite arrow)
                newVotes += voteType === "up" ? 2 : -2
                newUserVote = voteType
              } else {
                // New vote (no previous vote)
                newVotes += voteType === "up" ? 1 : -1
                newUserVote = voteType
              }

              return { ...q, votes: newVotes, userVote: newUserVote }
            }
            return q
          }),
        }))
      },

      bookmarkQuestion: (questionId) => {
        set((state) => ({
          questions: state.questions.map((q) => (q.id === questionId ? { ...q, isBookmarked: !q.isBookmarked } : q)),
        }))
      },

      incrementViews: (questionId) => {
        set((state) => ({
          questions: state.questions.map((q) => (q.id === questionId ? { ...q, views: q.views + 1 } : q)),
        }))
      },

      // Answer actions
      addAnswer: (questionId, content) => {
        const { currentUser } = get()
        if (!currentUser) return

        const newAnswer: Answer = {
          id: Date.now().toString(),
          content,
          author: currentUser,
          votes: 0,
          createdAt: new Date().toISOString(),
          isAccepted: false,
          userVote: null,
        }

        set((state) => ({
          questions: state.questions.map((q) =>
            q.id === questionId ? { ...q, answers: [...q.answers, newAnswer], updatedAt: new Date().toISOString() } : q,
          ),
        }))
      },

      voteAnswer: (questionId, answerId, voteType) => {
        const { currentUser } = get()
        if (!currentUser) return

        set((state) => ({
          questions: state.questions.map((q) => {
            if (q.id === questionId) {
              return {
                ...q,
                answers: q.answers.map((a) => {
                  if (a.id === answerId) {
                    const currentVote = a.userVote
                    let newVotes = a.votes
                    let newUserVote: "up" | "down" | null = null

                    if (currentVote === voteType) {
                      newVotes += voteType === "up" ? -1 : 1
                      newUserVote = null
                    } else if (currentVote) {
                      newVotes += voteType === "up" ? 2 : -2
                      newUserVote = voteType
                    } else {
                      newVotes += voteType === "up" ? 1 : -1
                      newUserVote = voteType
                    }

                    return { ...a, votes: newVotes, userVote: newUserVote }
                  }
                  return a
                }),
              }
            }
            return q
          }),
        }))
      },

      acceptAnswer: (questionId, answerId) => {
        set((state) => ({
          questions: state.questions.map((q) => {
            if (q.id === questionId) {
              return {
                ...q,
                answers: q.answers.map((a) => ({
                  ...a,
                  isAccepted: a.id === answerId ? !a.isAccepted : false,
                })),
              }
            }
            return q
          }),
        }))
      },

      // Search and filter
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedTags: (tags) => set({ selectedTags: tags }),
      setSortBy: (sort) => set({ sortBy: sort }),

      // Getters
      getFilteredQuestions: () => {
        const { questions, searchQuery, selectedTags, sortBy } = get()

        let filtered = questions.filter((q) => {
          const matchesSearch =
            !searchQuery ||
            q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

          const matchesTags = selectedTags.length === 0 || selectedTags.some((tag) => q.tags.includes(tag))

          return matchesSearch && matchesTags
        })

        // Sort questions
        switch (sortBy) {
          case "newest":
            filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            break
          case "active":
            filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            break
          case "votes":
            filtered.sort((a, b) => b.votes - a.votes)
            break
          case "unanswered":
            filtered = filtered.filter((q) => q.answers.length === 0)
            break
        }

        return filtered
      },

      getQuestionById: (id) => {
        return get().questions.find((q) => q.id === id)
      },
    }),
    {
      name: "stack-echo-storage",
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        questions: state.questions,
      }),
    },
  ),
)
