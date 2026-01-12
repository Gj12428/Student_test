"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  Loader2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowLeft,
} from "lucide-react"
import { getPracticeQuestions } from "@/lib/actions/student"

interface Question {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  explanation: string
}

interface PracticeSettings {
  subjectId: string
  topicIds: string[]
  questionCount: number
  difficulty: string
  timeLimit: string
}

export default function PracticeStartPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [flagged, setFlagged] = useState<Set<string>>(new Set())
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<PracticeSettings | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(() => {
    const savedSettings = sessionStorage.getItem("practiceSettings")
    if (!savedSettings) {
      router.push("/student/practice")
      return
    }

    const parsedSettings: PracticeSettings = JSON.parse(savedSettings)
    setSettings(parsedSettings)

    if (parsedSettings.timeLimit === "timed") {
      setTimeRemaining(parsedSettings.questionCount * 60)
    }

    async function loadQuestions() {
      try {
        const qs = await getPracticeQuestions(
          parsedSettings.subjectId,
          parsedSettings.topicIds,
          parsedSettings.questionCount,
          parsedSettings.difficulty,
        )
        if (qs.length === 0) {
          alert("No questions available for selected criteria")
          router.push("/student/practice")
          return
        }
        setQuestions(qs)
      } catch (error) {
        console.error("Error loading questions:", error)
        router.push("/student/practice")
      } finally {
        setIsLoading(false)
      }
    }

    loadQuestions()
  }, [router])

  // Timer
  useEffect(() => {
    if (settings?.timeLimit !== "timed" || timeRemaining <= 0 || showResults) return

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setShowResults(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [settings, timeRemaining, showResults])

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }, [])

  const currentQuestion = questions[currentIndex]

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }))
    setShowAnswer(false)
  }

  const toggleFlag = () => {
    setFlagged((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id)
      } else {
        newSet.add(currentQuestion.id)
      }
      return newSet
    })
  }

  const goToQuestion = (index: number) => {
    setCurrentIndex(index)
    setShowAnswer(false)
  }

  const calculateResults = () => {
    let correct = 0
    let incorrect = 0

    questions.forEach((q) => {
      const userAnswer = answers[q.id]
      if (userAnswer) {
        if (userAnswer.toLowerCase() === q.correct_answer.toLowerCase()) {
          correct++
        } else {
          incorrect++
        }
      }
    })

    const unattempted = questions.length - correct - incorrect
    const score = correct
    const percentage = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0

    return { correct, incorrect, unattempted, score, percentage }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading practice questions...</p>
        </div>
      </div>
    )
  }

  if (showResults) {
    const results = calculateResults()
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Practice Complete!</h1>
          <p className="text-muted-foreground">Here's how you performed</p>
        </div>

        <Card className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center p-4 bg-primary/10 rounded-xl">
              <p className="text-4xl font-bold text-primary">{results.percentage}%</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </div>
            <div className="text-center p-4 bg-green-500/10 rounded-xl">
              <p className="text-4xl font-bold text-green-500">{results.correct}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="text-center p-4 bg-red-500/10 rounded-xl">
              <p className="text-4xl font-bold text-red-500">{results.incorrect}</p>
              <p className="text-sm text-muted-foreground">Incorrect</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-xl">
              <p className="text-4xl font-bold text-muted-foreground">{results.unattempted}</p>
              <p className="text-sm text-muted-foreground">Skipped</p>
            </div>
          </div>

          <Progress value={results.percentage} className="h-3 mb-8" />

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Question Review</h3>
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id]
              const isCorrect = userAnswer?.toLowerCase() === q.correct_answer.toLowerCase()
              const wasAttempted = !!userAnswer

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-lg border ${isCorrect ? "border-green-500 bg-green-500/5" : wasAttempted ? "border-red-500 bg-red-500/5" : "border-muted bg-muted/20"}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium text-foreground mb-2">{q.question_text}</p>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                        {[
                          { key: "a", value: q.option_a },
                          { key: "b", value: q.option_b },
                          { key: "c", value: q.option_c },
                          { key: "d", value: q.option_d },
                        ].map((opt) => (
                          <div
                            key={opt.key}
                            className={`p-2 rounded ${
                              opt.key === q.correct_answer.toLowerCase()
                                ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                : userAnswer?.toLowerCase() === opt.key
                                  ? "bg-red-500/20 text-red-700 dark:text-red-400"
                                  : "bg-muted/50"
                            }`}
                          >
                            ({opt.key}) {opt.value}
                          </div>
                        ))}
                      </div>
                      {q.explanation && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : wasAttempted ? (
                        <XCircle className="w-6 h-6 text-red-500" />
                      ) : (
                        <HelpCircle className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => router.push("/student/practice")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Practice
          </Button>
          <Button onClick={() => window.location.reload()}>Practice Again</Button>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-muted-foreground">No questions available</p>
          <Button onClick={() => router.push("/student/practice")} className="mt-4">
            Back to Practice
          </Button>
        </div>
      </div>
    )
  }

  const options = [
    { key: "a", value: currentQuestion.option_a },
    { key: "b", value: currentQuestion.option_b },
    { key: "c", value: currentQuestion.option_c },
    { key: "d", value: currentQuestion.option_d },
  ]

  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => setShowExitDialog(true)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Exit Practice
        </Button>
        {settings?.timeLimit === "timed" && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeRemaining < 60 ? "bg-red-500/20 text-red-500" : "bg-muted"}`}
          >
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
          </div>
        )}
        <Button variant="outline" onClick={() => setShowResults(true)}>
          Finish Practice
        </Button>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            Question {currentIndex + 1} of {questions.length}
          </span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card className="p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
              {currentIndex + 1}
            </span>
            <span className="text-sm text-muted-foreground">Practice Question</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFlag}
            className={flagged.has(currentQuestion.id) ? "text-amber-500" : ""}
          >
            <Flag className={`w-4 h-4 ${flagged.has(currentQuestion.id) ? "fill-amber-500" : ""}`} />
          </Button>
        </div>

        <h2 className="text-xl font-medium text-foreground mb-8">{currentQuestion.question_text}</h2>

        <div className="space-y-4">
          {options.map((option) => {
            const isSelected = answers[currentQuestion.id] === option.key
            const isCorrect = option.key === currentQuestion.correct_answer.toLowerCase()
            const showCorrectness = showAnswer && answers[currentQuestion.id]

            return (
              <button
                key={option.key}
                onClick={() => handleAnswer(option.key)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                  showCorrectness
                    ? isCorrect
                      ? "border-green-500 bg-green-500/10"
                      : isSelected
                        ? "border-red-500 bg-red-500/10"
                        : "border-border bg-card"
                    : isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50 bg-card"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      showCorrectness
                        ? isCorrect
                          ? "bg-green-500 text-white"
                          : isSelected
                            ? "bg-red-500 text-white"
                            : "bg-muted"
                        : isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                    }`}
                  >
                    {option.key.toUpperCase()}
                  </span>
                  <span className="flex-1">{option.value}</span>
                  {showCorrectness && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {showCorrectness && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                </div>
              </button>
            )
          })}
        </div>

        {answers[currentQuestion.id] && !showAnswer && (
          <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setShowAnswer(true)}>
            Show Answer
          </Button>
        )}

        {showAnswer && currentQuestion.explanation && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-1">Explanation:</p>
            <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
          </div>
        )}
      </Card>

      {/* Question Navigator */}
      <Card className="p-4">
        <p className="text-sm font-medium text-muted-foreground mb-3">Question Navigator</p>
        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const isAnswered = !!answers[q.id]
            const isFlagged = flagged.has(q.id)
            const isCurrent = idx === currentIndex

            return (
              <button
                key={q.id}
                onClick={() => goToQuestion(idx)}
                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isAnswered
                      ? "bg-green-500/20 text-green-700 dark:text-green-400"
                      : "bg-muted hover:bg-muted/80"
                } ${isFlagged ? "ring-2 ring-amber-500" : ""}`}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => goToQuestion(currentIndex - 1)} disabled={currentIndex === 0}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={() => goToQuestion(currentIndex + 1)} disabled={currentIndex === questions.length - 1}>
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Practice?</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to exit? Your progress will be lost.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Practice</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/student/practice")}>Exit</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
