"use client";

import { Suspense, useEffect, useState } from "react";
import { getAllTestResults } from "@/lib/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Trophy,
  Clock,
  User,
  FileText,
  Filter,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TestResult {
  id: string;
  studentName: string;
  studentEmail: string;
  studentId: string;
  testTitle: string;
  testType: string;
  subject: string;
  topic: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number;
  completedAt: string;
}

function ResultsContent() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [testTypeFilter, setTestTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    loadResults();
  }, []);

  useEffect(() => {
    filterAndSortResults();
  }, [results, searchTerm, testTypeFilter, sortBy]);

  const loadResults = async () => {
    setLoading(true);
    const data = await getAllTestResults();
    setResults(data);
    setLoading(false);
  };

  const filterAndSortResults = () => {
    let filtered = [...results];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.studentName.toLowerCase().includes(term) ||
          r.studentEmail.toLowerCase().includes(term) ||
          r.testTitle.toLowerCase().includes(term) ||
          r.subject.toLowerCase().includes(term)
      );
    }

    if (testTypeFilter !== "all") {
      filtered = filtered.filter((r) => r.testType === testTypeFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.completedAt).getTime() -
            new Date(a.completedAt).getTime()
          );
        case "score":
          return b.percentage - a.percentage;
        case "student":
          return a.studentName.localeCompare(b.studentName);
        case "test":
          return a.testTitle.localeCompare(b.testTitle);
        default:
          return 0;
      }
    });

    setFilteredResults(filtered);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreBadge = (percentage: number) => {
    if (percentage >= 80)
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
          Excellent
        </Badge>
      );
    if (percentage >= 60)
      return (
        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
          Good
        </Badge>
      );
    if (percentage >= 40)
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
          Average
        </Badge>
      );
    return (
      <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
        Needs Improvement
      </Badge>
    );
  };

  const exportToCSV = () => {
    const headers = [
      "Student Name",
      "Email",
      "Test Title",
      "Type",
      "Subject",
      "Topic",
      "Score",
      "Total",
      "Percentage",
      "Time Taken",
      "Completed At",
    ];
    const csvData = filteredResults.map((r) => [
      r.studentName,
      r.studentEmail,
      r.testTitle,
      r.testType,
      r.subject,
      r.topic,
      r.score,
      r.totalQuestions,
      `${r.percentage}%`,
      formatTime(r.timeTaken),
      formatDate(r.completedAt),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `test-results-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const totalAttempts = filteredResults.length;
  const avgPercentage =
    totalAttempts > 0
      ? Math.round(
          filteredResults.reduce((sum, r) => sum + r.percentage, 0) /
            totalAttempts
        )
      : 0;
  const passCount = filteredResults.filter((r) => r.percentage >= 60).length;
  const passRate =
    totalAttempts > 0 ? Math.round((passCount / totalAttempts) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Student Test Results
        </h1>
        <p className="text-muted-foreground">
          View all test attempts and scores by students
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Attempts</p>
                <p className="text-2xl font-bold text-foreground">
                  {totalAttempts}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Trophy className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Score</p>
                <p className="text-2xl font-bold text-foreground">
                  {avgPercentage}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <User className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {passRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Passed</p>
                <p className="text-2xl font-bold text-foreground">
                  {passCount}/{totalAttempts}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by student name, email, or test..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              <Select value={testTypeFilter} onValueChange={setTestTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Test Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="full">Full Exam</SelectItem>
                  <SelectItem value="subject">Subject Test</SelectItem>
                  <SelectItem value="topic">Topic Test</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (Latest)</SelectItem>
                  <SelectItem value="score">Score (Highest)</SelectItem>
                  <SelectItem value="student">Student Name</SelectItem>
                  <SelectItem value="test">Test Name</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={exportToCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Test Results ({filteredResults.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredResults.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No test results found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Student
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Test
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Subject/Topic
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                      Score
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                      Percentage
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                      Time
                    </th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                      Completed
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result) => (
                    <tr
                      key={result.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {result.studentName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {result.studentEmail}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {result.testTitle}
                          </p>
                          <Badge
                            variant="outline"
                            className="mt-1 text-xs capitalize"
                          >
                            {result.testType}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="text-sm text-foreground">
                            {result.subject}
                          </p>
                          {result.topic !== "-" && (
                            <p className="text-xs text-muted-foreground">
                              {result.topic}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="font-bold text-foreground">
                          {result.score}/{result.totalQuestions}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span
                          className={`font-bold ${
                            result.percentage >= 60
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {result.percentage}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center text-muted-foreground">
                        {formatTime(result.timeTaken)}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {getScoreBadge(result.percentage)}
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {formatDate(result.completedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

export default function AdminResultsPage() {
  return (
    <div className="p-6 lg:p-8 lg:ml-64 pt-20 lg:pt-8">
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        <ResultsContent />
      </Suspense>
    </div>
  );
}
