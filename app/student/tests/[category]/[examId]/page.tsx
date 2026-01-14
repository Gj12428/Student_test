"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useParams } from "next/navigation";
import { getTestsByExam } from "@/lib/actions/student";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  ChevronLeft,
  FileText,
  BookOpen,
  Target,
  Clock,
  Users,
  Search,
  Play,
} from "lucide-react";
import Link from "next/link";

// Test Card Component
function TestCard({ test }: { test: any }) {
  return (
    <Card className="group hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              test.test_type === "full"
                ? "bg-primary/20 text-primary"
                : test.test_type === "subject"
                ? "bg-green-500/20 text-green-500"
                : "bg-amber-500/20 text-amber-500"
            }`}
          >
            {test.test_type === "full" ? (
              <FileText className="w-6 h-6" />
            ) : test.test_type === "subject" ? (
              <BookOpen className="w-6 h-6" />
            ) : (
              <Target className="w-6 h-6" />
            )}
          </div>
          <Badge
            variant="secondary"
            className={`${
              test.difficulty === "hard"
                ? "bg-red-500/20 text-red-500"
                : test.difficulty === "medium"
                ? "bg-amber-500/20 text-amber-500"
                : "bg-green-500/20 text-green-500"
            }`}
          >
            {test.difficulty
              ? test.difficulty.charAt(0).toUpperCase() +
                test.difficulty.slice(1)
              : "Medium"}
          </Badge>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {test.title}
        </h3>

        {test.subject && (
          <p className="text-sm text-muted-foreground mb-1">
            <BookOpen className="w-3 h-3 inline mr-1" />
            {test.subject.name}
          </p>
        )}
        {test.topic && (
          <p className="text-sm text-muted-foreground mb-3">
            <Target className="w-3 h-3 inline mr-1" />
            {test.topic.name}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            {test.questions_count} Qs
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {test.duration} min
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {(test.attempts_count || 0).toLocaleString()}
          </span>
        </div>

        <Link href={`/student/test/${test.id}`}>
          <Button className="w-full gap-2 group-hover:bg-primary">
            <Play className="w-4 h-4" />
            Start Test
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

// Filter Buttons Component
function FilterButtons({
  items,
  selected,
  onSelect,
  label,
}: {
  items: { id: string; name: string }[];
  selected: string;
  onSelect: (id: string) => void;
  label: string;
}) {
  return (
    <div className="mb-6">
      <p className="text-sm text-muted-foreground mb-3">Filter by {label}:</p>
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selected === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect("all")}
        >
          All {label}s
        </Button>
        {items.map((item) => (
          <Button
            key={item.id}
            variant={selected === item.id ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(item.id)}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  );
}

function ExamTestsContent() {
  const params = useParams();
  const categorySlug = params.category as string;
  const examId = params.examId as string;

  const [tests, setTests] = useState<any[]>([]);
  const [examName, setExamName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedTopic, setSelectedTopic] = useState<string>("all");

  useEffect(() => {
    async function loadTests() {
      if (!examId || examId === "undefined") {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getTestsByExam(examId);
        setTests(data);
        if (data.length > 0 && data[0].exam) {
          setExamName(data[0].exam.name);
        }
      } catch (error) {
        console.error("Error loading tests:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadTests();
  }, [examId]);

  // Filter tests by type
  const fullTests = tests.filter((t) => t.test_type === "full");
  const subjectTests = tests.filter((t) => t.test_type === "subject");
  const topicTests = tests.filter((t) => t.test_type === "topic");

  // Get unique subjects and topics
  const uniqueSubjects = useMemo(() => {
    const subjects = subjectTests
      .filter((t) => t.subject?.name)
      .map((t) => ({ id: t.subject.id, name: t.subject.name }));
    return Array.from(new Map(subjects.map((s) => [s.id, s])).values());
  }, [subjectTests]);

  const uniqueTopics = useMemo(() => {
    const topics = topicTests
      .filter((t) => t.topic?.name)
      .map((t) => ({ id: t.topic.id, name: t.topic.name }));
    return Array.from(new Map(topics.map((t) => [t.id, t])).values());
  }, [topicTests]);

  // Filter functions
  const filterBySearch = (testList: typeof tests) =>
    testList.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );

  const filteredSubjectTests = useMemo(() => {
    let filtered = subjectTests;
    if (selectedSubject !== "all") {
      filtered = filtered.filter((t) => t.subject?.id === selectedSubject);
    }
    return filterBySearch(filtered);
  }, [subjectTests, selectedSubject, search]);

  const filteredTopicTests = useMemo(() => {
    let filtered = topicTests;
    if (selectedTopic !== "all") {
      filtered = filtered.filter((t) => t.topic?.id === selectedTopic);
    }
    return filterBySearch(filtered);
  }, [topicTests, selectedTopic, search]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumb & Header */}
      <div>
        <Link
          href={`/student/tests/${categorySlug}`}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Exams
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {examName || "Exam Tests"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {tests.length} tests available
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {fullTests.length}
              </p>
              <p className="text-sm text-muted-foreground">Full Tests</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/10 border-green-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {subjectTests.length}
              </p>
              <p className="text-sm text-muted-foreground">Subject Tests</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/10 border-amber-500/20">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {topicTests.length}
              </p>
              <p className="text-sm text-muted-foreground">Topic Tests</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for test types */}
      <Tabs defaultValue="full" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="full" className="gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Full Exams</span>
            <span className="sm:hidden">Full</span>
            <Badge variant="secondary" className="ml-1">
              {fullTests.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="subject" className="gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Subject-wise</span>
            <span className="sm:hidden">Subject</span>
            <Badge variant="secondary" className="ml-1">
              {subjectTests.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="topic" className="gap-2">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Topic-wise</span>
            <span className="sm:hidden">Topic</span>
            <Badge variant="secondary" className="ml-1">
              {topicTests.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* Full Exams Tab */}
        <TabsContent value="full">
          {filterBySearch(fullTests).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterBySearch(fullTests).map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Full Exam Tests
              </h3>
              <p className="text-muted-foreground">
                No full exam tests available for this exam.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Subject-wise Tab */}
        <TabsContent value="subject">
          {uniqueSubjects.length > 0 && (
            <FilterButtons
              items={uniqueSubjects}
              selected={selectedSubject}
              onSelect={setSelectedSubject}
              label="Subject"
            />
          )}
          {filteredSubjectTests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjectTests.map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Subject Tests
              </h3>
              <p className="text-muted-foreground">
                No subject-wise tests available for this exam.
              </p>
            </div>
          )}
        </TabsContent>

        {/* Topic-wise Tab */}
        <TabsContent value="topic">
          {uniqueTopics.length > 0 && (
            <FilterButtons
              items={uniqueTopics}
              selected={selectedTopic}
              onSelect={setSelectedTopic}
              label="Topic"
            />
          )}
          {filteredTopicTests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTopicTests.map((test) => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No Topic Tests
              </h3>
              <p className="text-muted-foreground">
                No topic-wise tests available for this exam.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function ExamTestsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <ExamTestsContent />
    </Suspense>
  );
}
