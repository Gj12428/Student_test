"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Trophy,
  Target,
  Clock,
  BarChart3,
  ArrowLeft,
  Loader2,
  ChevronDown,
  ChevronUp,
  Users,
} from "lucide-react"
import { getTestResult } from "@/lib/actions/student"
import Link from "next/link"

interface ResultData {
  test: {
    id: string
    title: string
    duration: number
  }
  score: number
  total_marks: number
  correct: number
  incorrect: number
  unattempted: number
  total_questions: number
  percentage: number
  time_taken: number
  rank: number
  total_participants: number
  questions: Array<{
    id: string
    question_text: string
    option_a: string
    option_b: string
    option_c: string
    option_d: string
    correct_answer: string
    user_answer: string | null
    explanation?: string
  }>
}

export default function ResultPage() {
  const params = useParams()
  const router = useRouter()
  const attemptId = params?.id as string | undefined

  const [result, setResult] = useState<ResultData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function loadResult() {
      if (!attemptId) {
        setError("No attempt ID provided")
        setIsLoading(false)
        return
      }

      try {
        const data = await getTestResult(attemptId)
        if (data) {
          setResult(data)
        } else {
          setError("Result not found")
        }
      } catch (err) {
        console.error("Error loading result:", err)
        setError("Failed to load result")
      } finally {
        setIsLoading(false)
      }
    }
    loadResult()
  }, [attemptId])

  const toggleQuestion = (id: string) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">{error || "Result Not Found"}</h2>
          <p className="text-muted-foreground mb-4">The result you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => router.push("/student/results")}>Back to Results</Button>
        </div>
      </div>
    )
  }

  const getScoreColor = () => {
    if (result.percentage >= 80) return "text-accent"
    if (result.percentage >= 60) return "text-amber-500"
    return "text-destructive"
  }

  const getRankColor = () => {
    if (result.rank === 1) return "text-amber-400"
    if (result.rank === 2) return "text-slate-400"
    if (result.rank === 3) return "text-amber-600"
    return "text-primary"
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/student/results">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{result.test.title}</h1>
            <p className="text-muted-foreground">Test Result Analysis</p>
          </div>
        </div>

        {/* Score Card */}
        <Card className="p-8 bg-gradient-to-br from-primary/10 via-background to-accent/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className={`text-6xl font-bold ${getScoreColor()} mb-2`}>{result.percentage.toFixed(1)}%</div>
              <p className="text-muted-foreground">Overall Score</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <Trophy className={`w-5 h-5 ${getScoreColor()}`} />
                <span className="font-medium text-foreground">
                  {result.score} / {result.total_marks} marks
                </span>
              </div>
            </div>

            <div className="text-center">
              <div className={`text-6xl font-bold ${getRankColor()} mb-2`}>#{result.rank}</div>
              <p className="text-muted-foreground">Your Rank</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <Users className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">of {result.total_participants} students</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-accent">
                  <CheckCircle2 className="w-5 h-5" />
                  Correct
                </span>
                <span className="font-bold text-foreground">{result.correct}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-destructive">
                  <XCircle className="w-5 h-5" />
                  Incorrect
                </span>
                <span className="font-bold text-foreground">{result.incorrect}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <MinusCircle className="w-5 h-5" />
                  Unattempted
                </span>
                <span className="font-bold text-foreground">{result.unattempted}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Questions</p>
                  <p className="font-bold text-foreground">{result.total_questions}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time Taken</p>
                  <p className="font-bold text-foreground">{Math.floor(result.time_taken / 60)} min</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-accent">Correct</span>
                <span>{((result.correct / result.total_questions) * 100).toFixed(0)}%</span>
              </div>
              <Progress
                value={(result.correct / result.total_questions) * 100}
                className="h-2 bg-muted [&>div]:bg-accent"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-destructive">Incorrect</span>
                <span>{((result.incorrect / result.total_questions) * 100).toFixed(0)}%</span>
              </div>
              <Progress
                value={(result.incorrect / result.total_questions) * 100}
                className="h-2 bg-muted [&>div]:bg-destructive"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Unattempted</span>
                <span>{((result.unattempted / result.total_questions) * 100).toFixed(0)}%</span>
              </div>
              <Progress value={(result.unattempted / result.total_questions) * 100} className="h-2" />
            </div>
          </div>
        </Card>

        {/* Questions Review */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Question-wise Analysis
          </h2>

          <div className="space-y-4">
            {result.questions.map((q, index) => {
              const isCorrect = q.user_answer === q.correct_answer
              const isUnattempted = !q.user_answer
              const isExpanded = expandedQuestions.has(q.id)

              return (
                <Card key={q.id} className="overflow-hidden">
                  <button
                    onClick={() => toggleQuestion(q.id)}
                    className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isUnattempted
                          ? "bg-muted text-muted-foreground"
                          : isCorrect
                            ? "bg-accent/20 text-accent"
                            : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      {isUnattempted ? (
                        <MinusCircle className="w-5 h-5" />
                      ) : isCorrect ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">Question {index + 1}</p>
                      <p className="text-sm text-muted-foreground truncate">{q.question_text}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          isUnattempted
                            ? "bg-muted text-muted-foreground"
                            : isCorrect
                              ? "bg-accent/20 text-accent"
                              : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        {isUnattempted ? "0" : isCorrect ? "+1" : "0"}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0 border-t border-border">
                      <p className="text-foreground mb-4 mt-4">{q.question_text}</p>

                      <div className="space-y-2">
                        {[
                          { key: "a", value: q.option_a },
                          { key: "b", value: q.option_b },
                          { key: "c", value: q.option_c },
                          { key: "d", value: q.option_d },
                        ].map((option) => {
                          const isUserAnswer = q.user_answer === option.key
                          const isCorrectAnswer = q.correct_answer === option.key

                          return (
                            <div
                              key={option.key}
                              className={`p-3 rounded-lg border ${
                                isCorrectAnswer
                                  ? "border-accent bg-accent/10"
                                  : isUserAnswer && !isCorrectAnswer
                                    ? "border-destructive bg-destructive/10"
                                    : "border-border"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-medium">({option.key.toUpperCase()})</span>
                                <span className="flex-1">{option.value}</span>
                                {isCorrectAnswer && <CheckCircle2 className="w-5 h-5 text-accent" />}
                                {isUserAnswer && !isCorrectAnswer && <XCircle className="w-5 h-5 text-destructive" />}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {q.explanation && (
                        <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <p className="text-sm font-medium text-primary mb-1">Explanation:</p>
                          <p className="text-sm text-muted-foreground">{q.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Button variant="outline" asChild className="flex-1 bg-transparent">
            <Link href="/student/tests">Take Another Test</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/student/results">View All Results</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
