"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChartCard } from "@/components/dashboard/chart-card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Zap, BookOpen, Clock, Play, Shuffle, Target, Brain, Loader2 } from "lucide-react"
import { getSubjectsAndTopics } from "@/lib/actions/student"

interface Topic {
  id: string
  name: string
  questionCount: number
}

interface Subject {
  id: string
  name: string
  topics: Topic[]
  questionCount: number
}

const subjectIcons: Record<string, any> = {
  "General Studies": BookOpen,
  Reasoning: Brain,
  Mathematics: Target,
  English: BookOpen,
  Hindi: BookOpen,
  "Current Affairs": Zap,
}

export default function StudentPracticePage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [questionCount, setQuestionCount] = useState([20])
  const [difficulty, setDifficulty] = useState("medium")
  const [timeLimit, setTimeLimit] = useState("timed")
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    async function loadSubjects() {
      try {
        const data = await getSubjectsAndTopics()
        setSubjects(data)
      } catch (error) {
        console.error("Error loading subjects:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadSubjects()
  }, [])

  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) => (prev.includes(topicId) ? prev.filter((t) => t !== topicId) : [...prev, topicId]))
  }

  const selectedSubjectData = subjects.find((s) => s.id === selectedSubject)

  const startPractice = async () => {
    if (!selectedSubject) return

    setIsStarting(true)
    try {
      const practiceSettings = {
        subjectId: selectedSubject,
        topicIds: selectedTopics,
        questionCount: questionCount[0],
        difficulty,
        timeLimit,
      }
      sessionStorage.setItem("practiceSettings", JSON.stringify(practiceSettings))
      router.push("/student/practice/start")
    } catch (error) {
      console.error("Error starting practice:", error)
    } finally {
      setIsStarting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Practice Zone</h1>
        <p className="text-sm lg:text-base text-muted-foreground mt-1">Customize your practice session</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Subject Selection */}
        <ChartCard title="1. Select Subject" className="lg:col-span-2">
          {subjects.length === 0 ? (
            <div className="text-center py-6 lg:py-8 text-muted-foreground">
              <BookOpen className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-3 lg:mb-4 opacity-50" />
              <p className="text-sm lg:text-base">No subjects available yet.</p>
              <p className="text-xs lg:text-sm">Ask admin to create tests with subjects.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              {subjects.map((subject) => {
                const IconComponent = subjectIcons[subject.name] || BookOpen
                return (
                  <button
                    key={subject.id}
                    onClick={() => {
                      setSelectedSubject(subject.id)
                      setSelectedTopics([])
                    }}
                    className={`p-4 lg:p-6 rounded-xl border-2 transition-all duration-300 text-left ${
                      selectedSubject === subject.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                  >
                    <IconComponent
                      className={`w-6 h-6 lg:w-8 lg:h-8 mb-2 lg:mb-3 ${
                        selectedSubject === subject.id ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <p className="font-medium text-foreground text-sm lg:text-base">{subject.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {subject.questionCount} questions
                      {subject.topics?.length > 0 && ` • ${subject.topics.length} topics`}
                    </p>
                  </button>
                )
              })}
            </div>
          )}
        </ChartCard>

        {/* Quick Practice */}
        <ChartCard title="Quick Start">
          <div className="space-y-3 lg:space-y-4">
            <button className="w-full p-3 lg:p-4 rounded-xl bg-primary/20 hover:bg-primary/30 transition-colors flex items-center gap-3">
              <Shuffle className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
              <div className="text-left">
                <p className="font-medium text-foreground text-sm lg:text-base">Random Practice</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Mixed questions</p>
              </div>
            </button>
            <button className="w-full p-3 lg:p-4 rounded-xl bg-accent/20 hover:bg-accent/30 transition-colors flex items-center gap-3">
              <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-accent" />
              <div className="text-left">
                <p className="font-medium text-foreground text-sm lg:text-base">Speed Test</p>
                <p className="text-xs lg:text-sm text-muted-foreground">30 Qs in 15 min</p>
              </div>
            </button>
            <button className="w-full p-3 lg:p-4 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 transition-colors flex items-center gap-3">
              <Target className="w-5 h-5 lg:w-6 lg:h-6 text-amber-500" />
              <div className="text-left">
                <p className="font-medium text-foreground text-sm lg:text-base">Weak Areas</p>
                <p className="text-xs lg:text-sm text-muted-foreground">Focus on improvement</p>
              </div>
            </button>
          </div>
        </ChartCard>
      </div>

      {/* Topic Selection */}
      {selectedSubject && selectedSubjectData && (
        <ChartCard title="2. Select Topics (Optional)">
          {selectedSubjectData.topics?.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm lg:text-base">
                No specific topics available. Questions will be drawn from all {selectedSubjectData.name} tests.
              </p>
              <Button
                variant="outline"
                className="mt-3 bg-transparent"
                onClick={() => {
                  const practiceSettings = {
                    subjectId: selectedSubject,
                    topicIds: [],
                    questionCount: questionCount[0],
                    difficulty,
                    timeLimit,
                  }
                  sessionStorage.setItem("practiceSettings", JSON.stringify(practiceSettings))
                  router.push("/student/practice/start")
                }}
              >
                Practice All {selectedSubjectData.name} Questions
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 lg:gap-3">
              {selectedSubjectData.topics?.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border transition-all duration-300 text-sm ${
                    selectedTopics.includes(topic.id)
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary bg-card text-foreground"
                  }`}
                >
                  {topic.name} ({topic.questionCount})
                </button>
              ))}
              <button
                onClick={() => setSelectedTopics(selectedSubjectData.topics?.map((t) => t.id) || [])}
                className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-full border border-dashed border-primary text-primary hover:bg-primary/10 transition-colors text-sm"
              >
                Select All
              </button>
            </div>
          )}
        </ChartCard>
      )}

      {/* Settings - Made responsive */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        <ChartCard title="3. Number of Questions">
          <div className="space-y-4 lg:space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-3xl lg:text-4xl font-bold text-primary">{questionCount[0]}</span>
              <span className="text-muted-foreground text-sm">questions</span>
            </div>
            <Slider
              value={questionCount}
              onValueChange={setQuestionCount}
              min={10}
              max={100}
              step={10}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>10</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="4. Difficulty Level">
          <RadioGroup value={difficulty} onValueChange={setDifficulty} className="space-y-3 lg:space-y-4">
            <div className="flex items-center space-x-3 p-2 lg:p-3 rounded-lg hover:bg-muted/30 transition-colors">
              <RadioGroupItem value="easy" id="easy" />
              <Label htmlFor="easy" className="flex-1 cursor-pointer">
                <span className="font-medium text-accent text-sm lg:text-base">Easy</span>
                <p className="text-xs text-muted-foreground">Basic concepts</p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-2 lg:p-3 rounded-lg hover:bg-muted/30 transition-colors">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="flex-1 cursor-pointer">
                <span className="font-medium text-amber-500 text-sm lg:text-base">Medium</span>
                <p className="text-xs text-muted-foreground">Moderate difficulty</p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-2 lg:p-3 rounded-lg hover:bg-muted/30 transition-colors">
              <RadioGroupItem value="hard" id="hard" />
              <Label htmlFor="hard" className="flex-1 cursor-pointer">
                <span className="font-medium text-destructive text-sm lg:text-base">Hard</span>
                <p className="text-xs text-muted-foreground">Advanced questions</p>
              </Label>
            </div>
          </RadioGroup>
        </ChartCard>

        <ChartCard title="5. Time Setting">
          <RadioGroup value={timeLimit} onValueChange={setTimeLimit} className="space-y-3 lg:space-y-4">
            <div className="flex items-center space-x-3 p-2 lg:p-3 rounded-lg hover:bg-muted/30 transition-colors">
              <RadioGroupItem value="timed" id="timed" />
              <Label htmlFor="timed" className="flex-1 cursor-pointer">
                <span className="font-medium text-foreground flex items-center gap-2 text-sm lg:text-base">
                  <Clock className="w-4 h-4" />
                  Timed
                </span>
                <p className="text-xs text-muted-foreground">1 min per question</p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-2 lg:p-3 rounded-lg hover:bg-muted/30 transition-colors">
              <RadioGroupItem value="untimed" id="untimed" />
              <Label htmlFor="untimed" className="flex-1 cursor-pointer">
                <span className="font-medium text-foreground text-sm lg:text-base">Untimed</span>
                <p className="text-xs text-muted-foreground">No time limit</p>
              </Label>
            </div>
          </RadioGroup>
        </ChartCard>
      </div>

      {/* Start Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          className="gap-2 px-8 lg:px-12 py-5 lg:py-6 text-base lg:text-lg w-full sm:w-auto"
          onClick={startPractice}
          disabled={!selectedSubject || isStarting}
        >
          {isStarting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
          Start Practice
        </Button>
      </div>
    </div>
  )
}
