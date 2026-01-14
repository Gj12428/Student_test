"use client";

import { useState, useEffect } from "react";
import { ChartCard } from "@/components/dashboard/chart-card";
import { DataTable } from "@/components/dashboard/data-table";
import {
  getAllTests,
  deleteTest,
  getTestWithQuestions,
} from "@/lib/actions/admin";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Users,
  Clock,
  Upload,
  CheckCircle2,
  Eye,
  Trash2,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CSVUploadModal } from "@/components/admin/csv-upload-modal";
import { CustomMockTestModal } from "@/components/admin/custom-mock-test-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function AdminTestsPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCustomMockModal, setShowCustomMockModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [newTestTitle, setNewTestTitle] = useState("");

  const [selectedTest, setSelectedTest] = useState<any | null>(null);
  const [selectedTestQuestions, setSelectedTestQuestions] = useState<any[]>([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testToDelete, setTestToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadTests();
  }, []);

  async function loadTests() {
    setIsLoading(true);
    try {
      const data = await getAllTests();
      setTests(data);
    } catch (error) {
      console.error("Error loading tests:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const examTests = tests.filter((t) => t.test_type === "full");
  const subjectTests = tests.filter((t) => t.test_type === "subject");
  const topicTests = tests.filter((t) => t.test_type === "topic");

  const handleTestCreated = async () => {
    await loadTests();
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 5000);
  };

  const handleDeleteTest = async () => {
    if (!testToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deleteTest(testToDelete.id);
      if (result.success) {
        setTests((prev) => prev.filter((t) => t.id !== testToDelete.id));
      }
    } catch (error) {
      console.error("Error deleting test:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setTestToDelete(null);
    }
  };

  const handleViewTest = async (test: any) => {
    setSelectedTest(test);
    setShowViewModal(true);

    // Load questions
    const fullTest = await getTestWithQuestions(test.id);
    if (fullTest) {
      setSelectedTestQuestions(fullTest.questions || []);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const testColumns = [
    { key: "title", header: "Test Name", sortable: true },
    {
      key: "difficulty",
      header: "Difficulty",
      render: (test: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            test.difficulty === "hard"
              ? "bg-destructive/20 text-destructive"
              : test.difficulty === "medium"
              ? "bg-amber-500/20 text-amber-500"
              : "bg-accent/20 text-accent"
          }`}
        >
          {test.difficulty.charAt(0).toUpperCase() + test.difficulty.slice(1)}
        </span>
      ),
    },
    {
      key: "questions_count",
      header: "Questions",
      sortable: true,
      render: (test: any) => (
        <span className="flex items-center gap-1">
          <FileText className="w-4 h-4 text-muted-foreground" />
          {test.questions_count}
        </span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      render: (test: any) => (
        <span className="flex items-center gap-1">
          <Clock className="w-4 h-4 text-muted-foreground" />
          {test.duration} min
        </span>
      ),
    },
    {
      key: "attempts_count",
      header: "Attempts",
      sortable: true,
      render: (test: any) => (
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4 text-muted-foreground" />
          {(test.attempts_count || 0).toLocaleString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (test: any) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary"
            onClick={(e) => {
              e.stopPropagation();
              handleViewTest(test);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              setTestToDelete(test);
              setShowDeleteModal(true);
            }}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div className="bg-accent text-accent-foreground px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <p className="font-medium">Test Created Successfully!</p>
              <p className="text-sm opacity-90">{newTestTitle}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Tests Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and manage all test series
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={() => setShowCustomMockModal(true)}
          >
            <FileText className="w-4 h-4" />
            Create Mock Test
          </Button>
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={() => setShowUploadModal(true)}
          >
            <Upload className="w-4 h-4" />
            Upload CSV
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
            <FileText className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">
              {examTests.length}
            </p>
            <p className="text-sm text-muted-foreground">Full Length Exams</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center">
            <FileText className="w-7 h-7 text-accent" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">
              {subjectTests.length}
            </p>
            <p className="text-sm text-muted-foreground">Subject Tests</p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4 hover:shadow-lg transition-shadow">
          <div className="w-14 h-14 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <FileText className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">
              {topicTests.length}
            </p>
            <p className="text-sm text-muted-foreground">Topic Tests</p>
          </div>
        </div>
      </div>

      {/* Tests Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Tests ({tests.length})</TabsTrigger>
          <TabsTrigger value="exam">
            Full Exams ({examTests.length})
          </TabsTrigger>
          <TabsTrigger value="subject">
            Subject ({subjectTests.length})
          </TabsTrigger>
          <TabsTrigger value="topic">Topic ({topicTests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ChartCard title="All Tests">
            <DataTable
              data={tests}
              searchKey="title"
              pageSize={10}
              columns={testColumns}
            />
          </ChartCard>
        </TabsContent>

        <TabsContent value="exam">
          <ChartCard title="Full Length Exams">
            <DataTable
              data={examTests}
              searchKey="title"
              pageSize={10}
              columns={testColumns}
            />
          </ChartCard>
        </TabsContent>

        <TabsContent value="subject">
          <ChartCard title="Subject-wise Tests">
            <DataTable
              data={subjectTests}
              searchKey="title"
              pageSize={10}
              columns={[
                ...testColumns.slice(0, 1),
                {
                  key: "subject",
                  header: "Subject",
                  sortable: true,
                  render: (test: any) => test.subject?.name || "-",
                },
                ...testColumns.slice(2),
              ]}
            />
          </ChartCard>
        </TabsContent>

        <TabsContent value="topic">
          <ChartCard title="Topic-wise Tests">
            <DataTable
              data={topicTests}
              searchKey="title"
              pageSize={10}
              columns={[
                ...testColumns.slice(0, 1),
                {
                  key: "subject",
                  header: "Subject",
                  sortable: true,
                  render: (test: any) => test.subject?.name || "-",
                },
                {
                  key: "topic",
                  header: "Topic",
                  sortable: true,
                  render: (test: any) => test.topic?.name || "-",
                },
                ...testColumns.slice(2),
              ]}
            />
          </ChartCard>
        </TabsContent>
      </Tabs>

      <CSVUploadModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        onTestCreated={handleTestCreated}
      />
      <CustomMockTestModal
        isOpen={showCustomMockModal}
        onClose={() => {
          setShowCustomMockModal(false);
          loadTests();
        }}
      />

      {/* View Test Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Eye className="w-5 h-5 text-primary" />
              {selectedTest?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedTest?.questions_count} questions |{" "}
              {selectedTest?.duration} min | {selectedTest?.difficulty}{" "}
              difficulty
            </DialogDescription>
          </DialogHeader>

          {selectedTest && (
            <div className="space-y-4 mt-4 overflow-y-auto flex-1 pr-4">
              {/* Test Info */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-xl">
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="font-medium capitalize">
                    {selectedTest.test_type === "full"
                      ? "Full Exam"
                      : selectedTest.test_type}
                  </p>
                </div>
                {selectedTest.subject && (
                  <div>
                    <p className="text-xs text-muted-foreground">Subject</p>
                    <p className="font-medium">{selectedTest.subject.name}</p>
                  </div>
                )}
                {selectedTest.topic && (
                  <div>
                    <p className="text-xs text-muted-foreground">Topic</p>
                    <p className="font-medium">{selectedTest.topic.name}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Attempts</p>
                  <p className="font-medium">
                    {selectedTest.attempts_count || 0}
                  </p>
                </div>
              </div>

              {/* Questions List */}
              {selectedTestQuestions.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Questions</h3>
                  {selectedTestQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="bg-card border border-border rounded-xl p-4"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-foreground font-medium">
                          {q.question_text}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-10">
                        {["a", "b", "c", "d"].map((opt) => {
                          const optionKey = `option_${opt}` as keyof typeof q;
                          const optionValue = q[optionKey] as string;
                          if (!optionValue) return null;
                          const isCorrect = q.correct_answer === opt;
                          return (
                            <div
                              key={opt}
                              className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                                isCorrect
                                  ? "bg-accent/20 text-accent border border-accent/30"
                                  : "bg-muted/50 text-muted-foreground"
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                                  isCorrect
                                    ? "bg-accent text-accent-foreground"
                                    : "bg-muted-foreground/20"
                                }`}
                              >
                                {opt.toUpperCase()}
                              </span>
                              <span className="flex-1">{optionValue}</span>
                              {isCorrect && (
                                <CheckCircle2 className="w-4 h-4" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                      {q.explanation && (
                        <div className="mt-2 ml-10 p-2 bg-amber-500/10 rounded-lg">
                          <p className="text-xs text-amber-700 dark:text-amber-400">
                            {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No questions found for this test</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Delete Test
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{testToDelete?.title}&quot;?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTest}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              Delete Test
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
