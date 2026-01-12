"use client"

import { useState, useEffect } from "react"
import { ChartCard } from "@/components/dashboard/chart-card"
import { DataTable } from "@/components/dashboard/data-table"
import { getStudentResults } from "@/lib/actions/student"
import { Button } from "@/components/ui/button"
import { Trophy, Target, Clock, TrendingUp, Eye, CheckCircle, XCircle, MinusCircle, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import Link from "next/link"

const COLORS = ["#10b981", "#ef4444", "#6b7280"]

interface TestResultItem {
  id: string
  test_id: string
  attempt_id: string
  score: number
  percentage: number
  correct_answers: number
  wrong_answers: number
  unanswered: number
  total_questions: number
  time_taken: number
  rank?: number
  created_at: string
  test: {
    title: string
    test_type: string
    duration: number
    subject?: { name: string }
    topic?: { name: string }
  }
}

export default function StudentResultsPage() {
  const [results, setResults] = useState<TestResultItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedResult, setSelectedResult] = useState<TestResultItem | null>(null)

  useEffect(() => {
    async function loadResults() {
      try {
        const data = await getStudentResults()
        setResults(data || [])
      } catch (error) {
        console.error("Error loading results:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadResults()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const avgScore =
    results.length > 0 ? Math.round(results.reduce((acc, r) => acc + (r.correct_answers || 0), 0) / results.length) : 0
  const bestScore = results.length > 0 ? Math.max(...results.map((r) => r.correct_answers || 0)) : 0
  const totalTime = results.reduce((acc, r) => acc + (r.time_taken || 0), 0)

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Results</h1>
        <p className="text-muted-foreground mt-1">Track your test performance</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{results.length}</p>
              <p className="text-sm text-muted-foreground">Tests Taken</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-accent" />
            </div>
            <div>
              <p className="text-3xl font-bold text-accent">{avgScore}</p>
              <p className="text-sm text-muted-foreground">Avg Marks</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-500">{bestScore}</p>
              <p className="text-sm text-muted-foreground">Best Marks</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{Math.floor(totalTime / 60)}m</p>
              <p className="text-sm text-muted-foreground">Total Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <ChartCard title="All Test Results">
        {results.length > 0 ? (
          <DataTable
            data={results.map((r) => ({
              ...r,
              testTitle: r.test?.title || "Unknown Test",
              date: new Date(r.created_at).toLocaleDateString(),
              timeTaken: `${Math.floor((r.time_taken || 0) / 60)}m`,
              percentile: r.rank ? Math.max(0, 100 - r.rank * 10) : 0,
            }))}
            searchKey="testTitle"
            pageSize={10}
            columns={[
              { key: "testTitle", header: "Test Name", sortable: true },
              { key: "date", header: "Date", sortable: true },
              {
                key: "score",
                header: "Score",
                sortable: true,
                render: (result) => (
                  <span
                    className={`font-bold ${
                      (result.correct_answers / result.total_questions) * 100 >= 80
                        ? "text-accent"
                        : (result.correct_answers / result.total_questions) * 100 >= 60
                          ? "text-amber-500"
                          : "text-destructive"
                    }`}
                  >
                    {result.correct_answers}/{result.total_questions}
                  </span>
                ),
              },
              {
                key: "correct_answers",
                header: "Correct",
                render: (result) => (
                  <span className="text-accent">
                    {result.correct_answers}/{result.total_questions}
                  </span>
                ),
              },
              { key: "timeTaken", header: "Time", sortable: true },
              {
                key: "rank",
                header: "Rank",
                sortable: true,
                render: (result) => (
                  <span className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-amber-500" />#{result.rank || "-"}
                  </span>
                ),
              },
              {
                key: "actions",
                header: "Details",
                render: (result) => (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedResult(result)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/student/results/${result.attempt_id}`}>View Full</Link>
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        ) : (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No test results yet. Take a test to see your results!</p>
            <Button className="mt-4" asChild>
              <Link href="/student/tests">Browse Tests</Link>
            </Button>
          </div>
        )}
      </ChartCard>

      {/* Result Detail Modal */}
      <Dialog open={!!selectedResult} onOpenChange={() => setSelectedResult(null)}>
        <DialogContent className="max-w-2xl">
          {selectedResult && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedResult.test?.title}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Score Overview */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-accent/10 rounded-xl text-center">
                    <p className="text-4xl font-bold text-accent">
                      {selectedResult.correct_answers}/{selectedResult.total_questions}
                    </p>
                    <p className="text-sm text-muted-foreground">Score (Marks)</p>
                  </div>
                  <div className="p-4 bg-amber-500/10 rounded-xl text-center">
                    <p className="text-4xl font-bold text-amber-500">#{selectedResult.rank || "-"}</p>
                    <p className="text-sm text-muted-foreground">Rank</p>
                  </div>
                  <div className="p-4 bg-primary/10 rounded-xl text-center">
                    <p className="text-4xl font-bold text-primary">
                      {selectedResult.rank ? Math.max(0, 100 - selectedResult.rank * 10) : 0}%
                    </p>
                    <p className="text-sm text-muted-foreground">Percentile</p>
                  </div>
                </div>

                {/* Question Analysis */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Question Analysis</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-accent" />
                          Correct
                        </span>
                        <span className="font-bold text-accent">{selectedResult.correct_answers}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                        <span className="flex items-center gap-2">
                          <XCircle className="w-5 h-5 text-destructive" />
                          Wrong
                        </span>
                        <span className="font-bold text-destructive">{selectedResult.wrong_answers}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="flex items-center gap-2">
                          <MinusCircle className="w-5 h-5 text-muted-foreground" />
                          Unattempted
                        </span>
                        <span className="font-bold text-muted-foreground">{selectedResult.unanswered}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4">Distribution</h4>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Correct", value: selectedResult.correct_answers },
                            { name: "Wrong", value: selectedResult.wrong_answers },
                            { name: "Unattempted", value: selectedResult.unanswered },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date(selectedResult.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time Taken</p>
                    <p className="font-medium">{Math.floor((selectedResult.time_taken || 0) / 60)}m</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Questions</p>
                    <p className="font-medium">{selectedResult.total_questions}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Accuracy</p>
                    <p className="font-medium">
                      {Math.round(
                        (selectedResult.correct_answers /
                          (selectedResult.total_questions - selectedResult.unanswered)) *
                          100,
                      ) || 0}
                      %
                    </p>
                  </div>
                </div>

                <Button className="w-full" asChild>
                  <Link href={`/student/results/${selectedResult.attempt_id}`}>View Detailed Solutions</Link>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
