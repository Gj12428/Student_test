"use client";

import { useState, useEffect } from "react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { getAdminAnalytics } from "@/lib/actions/admin";
import {
  TrendingUp,
  Target,
  Award,
  CheckCircle,
  Loader2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

interface AnalyticsData {
  averageScore: number;
  passRate: number;
  completionRate: number;
  totalAttempts: number;
  weeklyActivity: Array<{ day: string; attempts: number; users: number }>;
  scoreDistribution: Array<{ range: string; count: number }>;
  subjectPerformance: Array<{ subject: string; avgScore: number }>;
  monthlySignups: Array<{ month: string; count: number }>;
  testAttemptsByCategory: Array<{ category: string; attempts: number }>;
}

const DEFAULT_ANALYTICS: AnalyticsData = {
  averageScore: 0,
  passRate: 0,
  completionRate: 0,
  totalAttempts: 0,
  weeklyActivity: [],
  scoreDistribution: [],
  subjectPerformance: [],
  monthlySignups: [],
  testAttemptsByCategory: [],
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>(DEFAULT_ANALYTICS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const analytics = await getAdminAnalytics();

        // Backend abhi sirf monthly signup data de raha hai
        setData({
          ...DEFAULT_ANALYTICS,
          monthlySignups: Array.isArray(analytics)
            ? analytics.map((row: any) => ({
                month: row.month,
                count: row.student_count ?? 0,
              }))
            : [],
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load analytics"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive text-lg font-semibold mb-2">
            Error loading analytics
          </p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Analytics Dashboard
        </h1>
        <p className="text-sm lg:text-base text-muted-foreground mt-1">
          Detailed insights into platform performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <StatsCard
          title="Average Score"
          value={`${data.averageScore}%`}
          change="Based on all attempts"
          changeType="neutral"
          icon={Target}
          color="primary"
        />
        <StatsCard
          title="Pass Rate"
          value={`${data.passRate}%`}
          change="Score ≥ 60%"
          changeType="positive"
          icon={CheckCircle}
          color="accent"
        />
        <StatsCard
          title="Completion Rate"
          value={`${data.completionRate}%`}
          change="Tests completed"
          changeType="positive"
          icon={Award}
          color="warning"
        />
        <StatsCard
          title="Total Attempts"
          value={(data.totalAttempts ?? 0).toLocaleString()}
          change="All time"
          changeType="neutral"
          icon={TrendingUp}
          color="primary"
        />
      </div>

      {/* Weekly Activity */}
      <ChartCard title="Weekly Activity">
        {data.weeklyActivity.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#888" fontSize={11} />
              <YAxis stroke="#888" fontSize={11} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="attempts"
                stroke="#10b981"
                fill="#10b98133"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
            No weekly activity data
          </div>
        )}
      </ChartCard>

      {/* Monthly Signups */}
      <ChartCard title="Monthly Signups">
        {data.monthlySignups.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data.monthlySignups}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="month" stroke="#888" fontSize={11} />
              <YAxis stroke="#888" fontSize={11} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[280px] text-muted-foreground text-sm">
            No signup data available
          </div>
        )}
      </ChartCard>

      {/* Attempts by Category */}
      <ChartCard title="Test Attempts by Category">
        {data.testAttemptsByCategory.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {data.testAttemptsByCategory.map((item, idx) => (
              <div
                key={item.category}
                className="p-4 rounded-xl border bg-muted/20"
              >
                <h4 className="font-semibold">{item.category}</h4>
                <p
                  className="text-2xl font-bold"
                  style={{ color: COLORS[idx % COLORS.length] }}
                >
                  {(item.attempts ?? 0).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
            No category data available
          </div>
        )}
      </ChartCard>
    </div>
  );
}
