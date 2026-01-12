"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Target, BookOpen, Zap } from "lucide-react"

export default function AnalyticsClient({ analytics }: any) {
  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Your Analytics</h1>
        <p className="text-muted-foreground">
          Track your progress and improve
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Metric title="Overall Score" value={`${analytics.overallScore}%`} icon={<Target />} />
        <Metric title="Avg Time / Question" value={`${analytics.avgTimePerQuestion}s`} icon={<Zap />} />
        <Metric title="Current Streak" value={analytics.currentStreak} icon={<TrendingUp />} />
      </div>

      {/* Performance Trend */}
      {analytics.performanceTrend?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="score" stroke="#3b82f6" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Subject Performance */}
      {analytics.subjectPerformance?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subject Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.subjectPerformance}>
                <XAxis dataKey="subject" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="score" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Topic Strength */}
      {analytics.topicStrengths?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Topic Strength</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analytics.topicStrengths.map((t: any) => (
              <div key={t.topic}>
                <div className="flex justify-between text-sm">
                  <span>{t.topic}</span>
                  <span>{t.strength}%</span>
                </div>
                <div className="h-2 bg-muted rounded">
                  <div
                    className="h-2 bg-blue-500 rounded"
                    style={{ width: `${t.strength}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Metric({ title, value, icon }: any) {
  return (
    <div className="border rounded-xl p-4 flex justify-between items-center">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      {icon}
    </div>
  )
}
