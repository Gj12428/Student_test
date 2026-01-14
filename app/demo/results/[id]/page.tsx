"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BookOpen,
  BarChart3,
  UserPlus,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import type { DemoQuestion } from "@/lib/demo-questions";

interface QuestionResult {
  selected: string | null;
  correct: string;
  isCorrect: boolean;
}

interface DemoResults {
  testId: string;
  testTitle: string;
  totalQuestions: number;
  correct: number;
  wrong: number;
  unanswered: number;
  score: number;
  percentage: number;
  timeTaken: number;
  questionResults: Record<string, QuestionResult>;
  questions: DemoQuestion[];
}

export default function DemoResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<DemoResults | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("demoResults");
    if (stored) {
      setResults(JSON.parse(stored));
    } else {
      router.push("/demo");
    }
  }, [router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90)
      return {
        grade: "A+",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
      };
    if (percentage >= 80)
      return { grade: "A", color: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (percentage >= 70)
      return { grade: "B+", color: "text-blue-500", bg: "bg-blue-500/10" };
    if (percentage >= 60)
      return { grade: "B", color: "text-blue-500", bg: "bg-blue-500/10" };
    if (percentage >= 50)
      return { grade: "C", color: "text-amber-500", bg: "bg-amber-500/10" };
    return { grade: "D", color: "text-red-500", bg: "bg-red-500/10" };
  };

  if (!results) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Loading results...
        </div>
      </div>
    );
  }

  const gradeInfo = getGrade(results.percentage);

  // Calculate subject-wise performance
  const subjectPerformance: Record<string, { correct: number; total: number }> =
    {};
  results.questions.forEach((q) => {
    if (!subjectPerformance[q.subject]) {
      subjectPerformance[q.subject] = { correct: 0, total: 0 };
    }
    subjectPerformance[q.subject].total++;
    if (results.questionResults[q.id]?.isCorrect) {
      subjectPerformance[q.subject].correct++;
    }
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div
              className={`w-24 h-24 rounded-full ${gradeInfo.bg} flex items-center justify-center mx-auto mb-6`}
            >
              <Trophy className={`w-12 h-12 ${gradeInfo.color}`} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Test Completed!
            </h1>
            <p className="text-lg text-muted-foreground">{results.testTitle}</p>
          </div>

          {/* Score Card */}
          <Card className="p-6 md:p-8 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div
                  className={`w-16 h-16 rounded-full ${gradeInfo.bg} flex items-center justify-center mx-auto mb-3`}
                >
                  <span className={`text-2xl font-bold ${gradeInfo.color}`}>
                    {gradeInfo.grade}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Grade</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-primary">
                    {results.percentage}%
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Score</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-accent">
                    {results.correct}/{results.totalQuestions}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-lg font-bold text-foreground">
                  {formatTime(results.timeTaken)}
                </p>
                <p className="text-sm text-muted-foreground">Time Taken</p>
              </div>
            </div>

            {/* Stats Bars */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-accent">
                    <CheckCircle2 className="w-4 h-4" />
                    Correct
                  </span>
                  <span className="font-medium">{results.correct}</span>
                </div>
                <Progress
                  value={(results.correct / results.totalQuestions) * 100}
                  className="h-2 bg-accent/20"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-destructive">
                    <XCircle className="w-4 h-4" />
                    Wrong
                  </span>
                  <span className="font-medium">{results.wrong}</span>
                </div>
                <Progress
                  value={(results.wrong / results.totalQuestions) * 100}
                  className="h-2 bg-destructive/20"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <MinusCircle className="w-4 h-4" />
                    Skipped
                  </span>
                  <span className="font-medium">{results.unanswered}</span>
                </div>
                <Progress
                  value={(results.unanswered / results.totalQuestions) * 100}
                  className="h-2 bg-muted"
                />
              </div>
            </div>
          </Card>

          {/* Subject-wise Performance */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Subject-wise Performance
            </h2>
            <div className="space-y-4">
              {Object.entries(subjectPerformance).map(([subject, data]) => {
                const perc = Math.round((data.correct / data.total) * 100);
                return (
                  <div key={subject} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground font-medium">
                        {subject}
                      </span>
                      <span className="text-muted-foreground">
                        {data.correct}/{data.total} ({perc}%)
                      </span>
                    </div>
                    <Progress value={perc} className="h-2" />
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Question Review */}
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Question Review
            </h2>
            <div className="space-y-3">
              {results.questions.map((q, idx) => {
                const result = results.questionResults[q.id];
                const isExpanded = expandedQuestion === q.id;

                return (
                  <div
                    key={q.id}
                    className="border border-border rounded-lg overflow-hidden"
                  >
                    <button
                      className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                      onClick={() =>
                        setExpandedQuestion(isExpanded ? null : q.id)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            result.isCorrect
                              ? "bg-accent/10 text-accent"
                              : result.selected === null
                              ? "bg-muted text-muted-foreground"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="text-sm text-foreground text-left line-clamp-1">
                          {q.question_text.substring(0, 60)}...
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            result.isCorrect
                              ? "default"
                              : result.selected === null
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {result.isCorrect
                            ? "Correct"
                            : result.selected === null
                            ? "Skipped"
                            : "Wrong"}
                        </Badge>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 border-t border-border bg-muted/30 space-y-4">
                        <p className="text-foreground">{q.question_text}</p>
                        <div className="space-y-2">
                          {[
                            { key: "a", value: q.option_a },
                            { key: "b", value: q.option_b },
                            { key: "c", value: q.option_c },
                            { key: "d", value: q.option_d },
                          ].map((opt) => (
                            <div
                              key={opt.key}
                              className={`p-3 rounded-lg border ${
                                opt.key === result.correct
                                  ? "border-accent bg-accent/10"
                                  : opt.key === result.selected &&
                                    !result.isCorrect
                                  ? "border-destructive bg-destructive/10"
                                  : "border-border"
                              }`}
                            >
                              <span className="font-medium uppercase mr-2">
                                {opt.key}.
                              </span>
                              {opt.value}
                              {opt.key === result.correct && (
                                <CheckCircle2 className="w-4 h-4 text-accent inline ml-2" />
                              )}
                              {opt.key === result.selected &&
                                !result.isCorrect && (
                                  <XCircle className="w-4 h-4 text-destructive inline ml-2" />
                                )}
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-sm font-medium text-primary mb-1">
                              Explanation:
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Signup CTA */}
          <Card className="p-8 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 border-primary/20">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Enjoyed This Demo?
                </h2>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Sign up now to access 10,000+ practice questions, full-length
                  mock tests, detailed analytics, and personalized study
                  recommendations to crack your HSSC CET exam!
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 group"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Free Account
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent"
                  >
                    Try Another Demo
                  </Button>
                </Link>
              </div>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  Free Forever Plan
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  No Credit Card Required
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  Instant Access
                </span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
}
