"use client"

import { useEffect, useState } from "react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ChartCard } from "@/components/dashboard/chart-card"
import { getStudentDashboard, getAvailableTests } from "@/lib/actions/student"
import { FileText, Trophy, Clock, Target, BookOpen, Zap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [tests, setTests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setIsLoading(true)
      try {
        const [dashboard, availableTests] = await Promise.all([getStudentDashboard(), getAvailableTests()])
        setDashboardData(dashboard)
        setTests(availableTests)
      } catch (error) {
        console.error("Error loading dashboard:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const stats = dashboardData?.stats || {
    testsAttempted: 0,
    averageScore: 0,
    bestScore: 0,
    totalTime: "0h",
  }

  const performanceTrend =
    dashboardData?.performanceTrend?.length > 0
      ? dashboardData.performanceTrend
      : [
          { test: "Test 1", score: 0 },
          { test: "Test 2", score: 0 },
        ]

  const subjectPerformance =
    dashboardData?.subjectPerformance?.length > 0
      ? dashboardData.subjectPerformance
      : [
          { subject: "General", score: 0 },
          { subject: "Reasoning", score: 0 },
        ]

  const recentResults = dashboardData?.recentResults || []
  const recommendedTests = tests.slice(0, 3)

  const fullTests = tests.filter((t) => t.test_type === "full")
  const subjectTests = tests.filter((t) => t.test_type === "subject")
  const topicTests = tests.filter((t) => t.test_type === "topic")

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Welcome, Student!</h1>
          <p className="text-sm lg:text-base text-muted-foreground mt-1">Continue your preparation journey</p>
        </div>
        <Link href="/student/tests">
          <Button className="gap-2 w-full sm:w-auto">
            <Zap className="w-4 h-4" />
            Start Test
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <StatsCard
          title="Tests Attempted"
          value={stats.testsAttempted}
          change="Keep practicing!"
          changeType="positive"
          icon={FileText}
          color="primary"
        />
        {/* Removed average score stat card */}
        <StatsCard
          title="Best Score"
          value={`${Math.min(stats.bestScore, 100)}%`}
          change="Personal best"
          changeType="neutral"
          icon={Trophy}
          color="warning"
        />
        <StatsCard
          title="Study Time"
          value={stats.totalTime}
          change="This month"
          changeType="neutral"
          icon={Clock}
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <ChartCard title="Performance Trend">
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={performanceTrend}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="test" stroke="#888" fontSize={11} />
              <YAxis stroke="#888" domain={[0, 100]} fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }} />
              <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2} fill="url(#colorScore)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Subject-wise Performance">
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={subjectPerformance}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis dataKey="subject" stroke="#888" fontSize={10} />
              <PolarRadiusAxis stroke="#888" domain={[0, 100]} fontSize={10} />
              <Radar name="Score" dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "8px" }} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Tests & Recommended */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <ChartCard title="Recent Test Results">
          <div className="space-y-3">
            {recentResults.length > 0 ? (
              recentResults.map((result: any, idx: number) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-3 lg:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 animate-in fade-in slide-in-from-left-4"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center ${
                        result.percentage >= 80
                          ? "bg-accent/20 text-accent"
                          : result.percentage >= 60
                            ? "bg-amber-500/20 text-amber-500"
                            : "bg-destructive/20 text-destructive"
                      }`}
                    >
                      <Trophy className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm lg:text-base line-clamp-1">
                        {result.test?.title || "Test"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(result.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-xl lg:text-2xl font-bold ${
                        result.percentage >= 80
                          ? "text-accent"
                          : result.percentage >= 60
                            ? "text-amber-500"
                            : "text-destructive"
                      }`}
                    >
                      {result.marks}/{result.total_questions}
                    </p>
                    <p className="text-xs text-muted-foreground">Rank #{result.rank || "-"}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No tests attempted yet</p>
              </div>
            )}
            <Link href="/student/results">
              <Button variant="outline" className="w-full bg-transparent">
                View All Results
              </Button>
            </Link>
          </div>
        </ChartCard>

        <ChartCard title="Recommended Tests">
          <div className="space-y-3">
            {recommendedTests.length > 0 ? (
              recommendedTests.map((test: any, idx: number) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-3 lg:p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-all duration-300 animate-in fade-in slide-in-from-right-4"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm lg:text-base line-clamp-1">{test.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {test.questions_count} Qs | {test.duration} min
                      </p>
                    </div>
                  </div>
                  <Link href={`/student/test/${test.id}`}>
                    <Button size="sm">Start</Button>
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No tests available</p>
              </div>
            )}
            <Link href="/student/tests">
              <Button variant="outline" className="w-full bg-transparent">
                Browse All Tests
              </Button>
            </Link>
          </div>
        </ChartCard>
      </div>

      <ChartCard title="Quick Actions">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <Link href="/student/tests?tab=full">
            <div className="p-4 lg:p-6 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all duration-300 text-center group cursor-pointer">
              <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-primary mx-auto mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-foreground text-sm lg:text-base">Full Mock Tests</p>
              <p className="text-xs text-muted-foreground">{fullTests.length} Available</p>
            </div>
          </Link>
          <Link href="/student/tests?tab=subject">
            <div className="p-4 lg:p-6 rounded-xl bg-accent/10 hover:bg-accent/20 transition-all duration-300 text-center group cursor-pointer">
              <BookOpen className="w-6 h-6 lg:w-8 lg:h-8 text-accent mx-auto mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-foreground text-sm lg:text-base">Subject Tests</p>
              <p className="text-xs text-muted-foreground">{subjectTests.length} Available</p>
            </div>
          </Link>
          <Link href="/student/tests?tab=topic">
            <div className="p-4 lg:p-6 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 transition-all duration-300 text-center group cursor-pointer">
              <Target className="w-6 h-6 lg:w-8 lg:h-8 text-amber-500 mx-auto mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-foreground text-sm lg:text-base">Topic Tests</p>
              <p className="text-xs text-muted-foreground">{topicTests.length} Available</p>
            </div>
          </Link>
          <Link href="/student/practice">
            <div className="p-4 lg:p-6 rounded-xl bg-destructive/10 hover:bg-destructive/20 transition-all duration-300 text-center group cursor-pointer">
              <Zap className="w-6 h-6 lg:w-8 lg:h-8 text-destructive mx-auto mb-2 lg:mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-medium text-foreground text-sm lg:text-base">Quick Practice</p>
              <p className="text-xs text-muted-foreground">Unlimited</p>
            </div>
          </Link>
        </div>
      </ChartCard>
    </div>
  )
}
