"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { ChartCard } from "@/components/dashboard/chart-card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Zap,
  BookOpen,
  Clock,
  Play,
  Shuffle,
  Target,
  Brain,
  Loader2,
} from "lucide-react"
import { getSubjectsAndTopics } from "@/lib/actions/student"

/* =====================
   TYPES
===================== */
interface Topic {
  id: string
  name: string
  questionCount: number
}

interface Subject {
  id: string
  name: string
  topics?: Topic[]
  questionCount: number
}

/* =====================
   ICON MAP
===================== */
const subjectIcons: Record<string, any> = {
  "General Studies": BookOpen,
  Reasoning: Brain,
  Mathematics: Target,
  English: BookOpen,
  Hindi: BookOpen,
  "Current Affairs": Zap,
}

/* =====================
   PAGE
===================== */
export default function StudentPracticePage() {
  const router = useRouter()

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [questionCount, setQuestionCount] = useState([20])
  const [difficulty, setDifficulty] = useState("medium")
  const [timeLimit, setTimeLimit] = useState("timed")
  const [isStarting, setIsStarting] = useState(false)

  /* =====================
     LOAD SUBJECTS (SAFE)
  ===================== */
  useEffect(() => {
    async function loadSubjects() {
      try {
        const data = await getSubjectsAndTopics()

        // 🔐 SAFETY: API shape guard
        setSubjects(Array.isArray(data?.subjects) ? data.subjects : [])
      } catch (error) {
        console.error("Error loading subjects:", error)
        setSubjects([])
      } finally {
        setIsLoading(false)
      }
    }

    loadSubjects()
  }, [])

  /* =====================
     DERIVED SUBJECT (SAFE)
  ===================== */
  const selectedSubjectData = useMemo(() => {
    const subject = subjects.find(
      (s) => String(s.id) === String(selectedSubjectId)
    )

    if (!subject) return null

    return {
      ...subject,
      topics: Array.isArray(subject.topics) ? subject.topics : [],
    }
  }, [subjects, selectedSubjectId])

  /* =====================
     HANDLERS
  ===================== */
  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topicId)
        ? prev.filter((t) => t !== topicId)
        : [...prev, topicId]
    )
  }

  const startPractice = async () => {
    if (!selectedSubjectId) return

    setIsStarting(true)
    try {
      sessionStorage.setItem(
        "practiceSettings",
        JSON.stringify({
          subjectId: selectedSubjectId,
          topicIds: selectedTopics,
          questionCount: questionCount[0],
          difficulty,
          timeLimit,
        })
      )

      router.push("/student/practice/start")
    } finally {
      setIsStarting(false)
    }
  }

  /* =====================
     LOADING
  ===================== */
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  /* =====================
     UI (DESIGN PRESERVED)
  ===================== */
  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Practice Zone
        </h1>
        <p className="text-sm lg:text-base text-muted-foreground mt-1">
          Customize your practice session
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* SUBJECT SELECTION */}
        <ChartCard title="1. Select Subject" className="lg:col-span-2">
          {subjects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No subjects available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.map((subject) => {
                const Icon = subjectIcons[subject.name] || BookOpen
                return (
                  <button
                    key={subject.id}
                    onClick={() => {
                      setSelectedSubjectId(subject.id)
                      setSelectedTopics([])
                    }}
                    className={`p-4 lg:p-6 rounded-xl border-2 transition-all ${
                      selectedSubjectId === subject.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 lg:w-8 lg:h-8 mb-3 ${
                        selectedSubjectId === subject.id
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {subject.questionCount} questions
                      {subject.topics && subject.topics.length > 0
                        ? ` • ${subject.topics.length} topics`
                        : ""}
                    </p>
                  </button>
                )
              })}
            </div>
          )}
        </ChartCard>

        {/* QUICK START (DESIGN SAME) */}
        <ChartCard title="Quick Start">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-primary/20 flex gap-3">
              <Shuffle className="w-6 h-6 text-primary" />
              <div>
                <p className="font-medium">Random Practice</p>
                <p className="text-xs text-muted-foreground">
                  Mixed questions
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-accent/20 flex gap-3">
              <Zap className="w-6 h-6 text-accent" />
              <div>
                <p className="font-medium">Speed Test</p>
                <p className="text-xs text-muted-foreground">
                  30 Qs in 15 min
                </p>
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* TOPICS */}
      {selectedSubjectData && (
        <ChartCard title="2. Select Topics (Optional)">
          {selectedSubjectData.topics.length === 0 ? (
            <p className="text-muted-foreground">
              No topics available. Questions will be mixed.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {selectedSubjectData.topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`px-4 py-2 rounded-full border text-sm ${
                    selectedTopics.includes(topic.id)
                      ? "bg-primary text-primary-foreground"
                      : "border-border"
                  }`}
                >
                  {topic.name} ({topic.questionCount})
                </button>
              ))}
            </div>
          )}
        </ChartCard>
      )}

      {/* SETTINGS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ChartCard title="3. Number of Questions">
          <div className="space-y-4">
            <div className="text-3xl font-bold text-primary">
              {questionCount[0]}
            </div>
            <Slider
              value={questionCount}
              onValueChange={setQuestionCount}
              min={10}
              max={100}
              step={10}
            />
          </div>
        </ChartCard>

        <ChartCard title="4. Difficulty Level">
          <RadioGroup value={difficulty} onValueChange={setDifficulty}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="easy" id="easy" />
              <Label htmlFor="easy">Easy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Medium</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hard" id="hard" />
              <Label htmlFor="hard">Hard</Label>
            </div>
          </RadioGroup>
        </ChartCard>

        <ChartCard title="5. Time Setting">
          <RadioGroup value={timeLimit} onValueChange={setTimeLimit}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="timed" id="timed" />
              <Label htmlFor="timed">Timed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="untimed" id="untimed" />
              <Label htmlFor="untimed">Untimed</Label>
            </div>
          </RadioGroup>
        </ChartCard>
      </div>

      {/* START */}
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={startPractice}
          disabled={!selectedSubjectId || isStarting}
          className="gap-2 px-10"
        >
          {isStarting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          Start Practice
        </Button>
      </div>
    </div>
  )
}
