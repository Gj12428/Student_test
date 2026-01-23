"use client";

import { useEffect, useState } from "react";
//import { getStudentAnalytics } from "@/lib/actions/student";
import { getStudentResults } from "@/lib/actions/student";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
} from "recharts";
import { TrendingUp, Target, BookOpen, Zap } from "lucide-react";

export default function StudentAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getStudentResults();
        if (data) {
          setAnalytics(data);
        } else {
          setError("No analytics data available");
        }
      } catch (err) {
        console.error("Analytics error:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load analytics"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
          <p className="text-sm text-muted-foreground">
            Loading your analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">
          No analytics data available yet. Take some tests to see your
          performance!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 lg:p-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Your Analytics
        </h1>
        <p className="text-muted-foreground">
          Track your progress and identify areas for improvement
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Overall Score Card */}
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-200/20 p-6 hover:border-blue-300/40 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Overall Score
              </h3>
              <Target className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">
              {Math.min(100, analytics.overallScore || 0)}%
            </p>
            <p className="text-xs text-muted-foreground">
              Average across all tests
            </p>
          </div>
        </div>

        {/* Time Per Question Card */}
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-200/20 p-6 hover:border-amber-300/40 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Avg Time/Question
              </h3>
              <Zap className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-3xl font-bold">
              {analytics.avgTimePerQuestion || 0}s
            </p>
            <p className="text-xs text-muted-foreground">
              Seconds per question
            </p>
          </div>
        </div>

        {/* Current Streak Card */}
        <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-200/20 p-6 hover:border-green-300/40 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">
                Current Streak
              </h3>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-3xl font-bold">{analytics.currentStreak || 0}</p>
            <p className="text-xs text-muted-foreground">
              days • Best: {analytics.bestStreak || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Performance Trend Chart */}
      {analytics.performanceTrend && analytics.performanceTrend.length > 0 && (
        <Card className="border-blue-200/20 overflow-hidden">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Your test scores over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={analytics.performanceTrend}>
                <defs>
                  <linearGradient
                    id="scoreGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--chart-1))"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
                <XAxis dataKey="week" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Score %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Subject Performance & Topic Strengths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Subject Performance */}
        {analytics.subjectPerformance &&
          analytics.subjectPerformance.length > 0 && (
            <Card className="border-blue-200/20 overflow-hidden">
              <CardHeader>
                <CardTitle>Subject-wise Performance</CardTitle>
                <CardDescription>Your strength in each subject</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.subjectPerformance}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-20"
                    />
                    <XAxis dataKey="subject" className="text-xs" />
                    <YAxis className="text-xs" domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                      }}
                    />
                    <Bar
                      dataKey="score"
                      fill="hsl(var(--chart-2))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

        {/* Topic Strengths */}
        {analytics.topicStrengths && analytics.topicStrengths.length > 0 && (
          <Card className="border-blue-200/20 overflow-hidden">
            <CardHeader>
              <CardTitle>Topic-wise Strength</CardTitle>
              <CardDescription>Performance breakdown by topic</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analytics.topicStrengths.map((topic, idx) => {
                const strength = Math.min(100, topic.strength);
                const isStrong = strength >= 70;
                return (
                  <div key={topic.topic} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium truncate">
                        {topic.topic}
                      </p>
                      <p
                        className={`text-sm font-bold ${
                          isStrong ? "text-green-600" : "text-amber-600"
                        }`}
                      >
                        {strength}%
                      </p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-500 ${
                          isStrong
                            ? "bg-gradient-to-r from-green-400 to-green-600"
                            : "bg-gradient-to-r from-amber-400 to-amber-600"
                        }`}
                        style={{ width: `${strength}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Personalized Recommendations */}
      <Card className="border-blue-200/20 overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>
            Focus areas based on your performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {analytics.topicStrengths && analytics.topicStrengths.length > 0 ? (
              <>
                {/* Weakest Areas */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Areas to Improve</h4>
                  {[...analytics.topicStrengths]
                    .reverse()
                    .slice(0, 3)
                    .map((topic) => (
                      <div
                        key={topic.topic}
                        className="p-3 rounded-lg bg-amber-500/10 border border-amber-200/20 hover:border-amber-300/40 transition-colors"
                      >
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                          {topic.topic}
                        </p>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                          Current: {Math.min(100, topic.strength)}% — Needs
                          practice
                        </p>
                      </div>
                    ))}
                </div>

                {/* Strongest Areas */}
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold">Your Strengths</h4>
                  {analytics.topicStrengths.slice(0, 3).map((topic) => (
                    <div
                      key={topic.topic}
                      className="p-3 rounded-lg bg-green-500/10 border border-green-200/20 hover:border-green-300/40 transition-colors"
                    >
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        {topic.topic}
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                        Mastered: {Math.min(100, topic.strength)}% — Keep it up!
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                <p className="text-sm text-muted-foreground">
                  Take more tests to receive personalized recommendations
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
