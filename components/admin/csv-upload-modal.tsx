"use client";

import { DialogDescription } from "@/components/ui/dialog";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Download,
  Trash2,
  Edit,
  Save,
  Loader2,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  createTest,
  getExamsSubjectsTopics,
  createExam,
  createSubject,
  createTopic,
} from "@/lib/actions/admin";

interface Question {
  id: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation?: string;
  examSource?: string;
}

interface CSVUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTestCreated: () => void;
}

export function CSVUploadModal({
  open,
  onOpenChange,
  onTestCreated,
}: CSVUploadModalProps) {
  const [step, setStep] = useState<"upload" | "configure" | "preview">(
    "upload"
  );
  const [file, setFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Data from database
  const [categories, setCategories] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);

  // Configuration state
  const [testTitle, setTestTitle] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [testType, setTestType] = useState<"exam" | "subject" | "topic">(
    "subject"
  );
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");
  const [duration, setDuration] = useState("30");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );

  // Preview state
  const [currentPage, setCurrentPage] = useState(1);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const questionsPerPage = 5;

  // States for creating new exam/subject/topic
  const [showAddExam, setShowAddExam] = useState(false);
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [showAddTopic, setShowAddTopic] = useState(false);
  const [newExamName, setNewExamName] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newTopicName, setNewTopicName] = useState("");
  const [isAddingExam, setIsAddingExam] = useState(false);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isAddingTopic, setIsAddingTopic] = useState(false);

  // Load exams, subjects, topics
  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open]);

  async function loadData() {
    try {
      const data = await getExamsSubjectsTopics();
      setCategories(data.categories || []);
      setExams(data.exams);
      setSubjects(data.subjects);
      setTopics(data.topics);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  }

  const resetState = () => {
    setStep("upload");
    setFile(null);
    setQuestions([]);
    setParseError(null);
    setTestTitle("");
    setSelectedCategoryId("");
    setSelectedExamId("");
    setTestType("subject");
    setSelectedSubjectId("");
    setSelectedTopicId("");
    setDuration("30");
    setDifficulty("medium");
    setCurrentPage(1);
  };

  const filteredExams = exams.filter(
    (e) => !selectedCategoryId || e.category_id === selectedCategoryId
  );

  // Filter subjects by exam
  const filteredSubjects = subjects.filter(
    (s) => !selectedExamId || s.exam_id === selectedExamId
  );

  // Filter topics by subject
  const filteredTopics = topics.filter(
    (t) => !selectedSubjectId || t.subject_id === selectedSubjectId
  );

  const parseCSV = (text: string): Question[] => {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length < 2)
      throw new Error("CSV file is empty or has no data rows");

    const headers = lines[0]
      .split(",")
      .map((h) => h.trim().toLowerCase().replace(/['"]/g, ""));

    // Find column indices for your format
    const questionIdx = headers.findIndex(
      (h) => h.includes("question") && h.includes("text")
    );
    const optionsIdx = headers.findIndex(
      (h) => h === "options" || h.includes("option")
    );
    const examDetailsIdx = headers.findIndex(
      (h) => h.includes("exam") && h.includes("detail")
    );
    const answerIdx = headers.findIndex(
      (h) => h.includes("correct") || h.includes("answer")
    );
    const explanationIdx = headers.findIndex((h) => h.includes("explanation"));

    const parsedQuestions: Question[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line.trim()) continue;

      // Parse CSV properly handling quoted fields
      const values: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      // Extract question text
      const questionText =
        questionIdx >= 0 ? values[questionIdx]?.replace(/^"|"$/g, "") : "";
      if (!questionText) continue;

      // Parse options from combined format: (a) opt1 (b) opt2 (c) opt3 (d) opt4
      let optionA = "";
      let optionB = "";
      let optionC = "";
      let optionD = "";

      const optionsText =
        optionsIdx >= 0 ? values[optionsIdx]?.replace(/^"|"$/g, "") : "";

      if (optionsText) {
        // Split by (a), (b), (c), (d), (e) pattern
        const optionSplitRegex = /[(][a-e][)]/gi;
        const parts = optionsText.split(optionSplitRegex);
        const letterMatches = optionsText.match(optionSplitRegex) || [];

        const optionsMap: Record<string, string> = {};
        for (let k = 0; k < letterMatches.length; k++) {
          const letter = letterMatches[k].toLowerCase().replace(/[()]/g, "");
          const text = parts[k + 1]?.trim() || "";
          optionsMap[letter] = text;
        }

        optionA = optionsMap["a"] || "";
        optionB = optionsMap["b"] || "";
        optionC = optionsMap["c"] || "";
        optionD = optionsMap["d"] || "";
      }

      // Parse correct answer from format like "Ans. (c)"
      let correctAnswer = "a"; // default
      const answerText =
        answerIdx >= 0 ? values[answerIdx]?.replace(/^"|"$/g, "").trim() : "";
      if (answerText) {
        // Look for letter inside parentheses: (a), (b), (c), (d)
        const answerWithParenRegex = /[(]([a-d])[)]/i;
        const answerMatch = answerText.match(answerWithParenRegex);
        if (answerMatch && answerMatch[1]) {
          correctAnswer = answerMatch[1].toLowerCase();
        } else {
          // Fallback: look for standalone letter
          const letterMatch =
            answerText.match(/[^a-z]([a-d])$/i) ||
            answerText.match(/^([a-d])$/i);
          if (letterMatch && letterMatch[1]) {
            correctAnswer = letterMatch[1].toLowerCase();
          }
        }
      }

      // Extract explanation
      const explanation =
        explanationIdx >= 0
          ? values[explanationIdx]?.replace(/^"|"$/g, "")
          : "";

      // Extract exam source
      const examSource =
        examDetailsIdx >= 0
          ? values[examDetailsIdx]?.replace(/^"|"$/g, "")
          : "";

      parsedQuestions.push({
        id: `q-${i}`,
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        correctAnswer,
        explanation,
        examSource,
      });
    }

    if (parsedQuestions.length === 0) {
      throw new Error("No valid questions found in CSV");
    }

    return parsedQuestions;
  };

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setParseError(null);
    setIsProcessing(true);

    try {
      const text = await selectedFile.text();
      const parsed = parseCSV(text);
      setQuestions(parsed);
      setStep("configure");
    } catch (error) {
      setParseError(
        error instanceof Error ? error.message : "Failed to parse CSV"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileChange(droppedFile);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileChange(selectedFile);
    }
  };

  const handleCreateTest = async () => {
    if (!testTitle || questions.length === 0) return;

    setIsCreating(true);
    try {
      const testTypeMap: Record<string, "full" | "subject" | "topic"> = {
        exam: "full",
        subject: "subject",
        topic: "topic",
      };

      const result = await createTest({
        title: testTitle,
        test_type: testTypeMap[testType],
        exam_id: selectedExamId || undefined,
        subject_id: selectedSubjectId || undefined,
        topic_id: selectedTopicId || undefined,
        duration: Number.parseInt(duration),
        difficulty,
        questions: questions.map((q) => ({
          question_text: q.questionText,
          option_a: q.optionA,
          option_b: q.optionB,
          option_c: q.optionC,
          option_d: q.optionD,
          correct_answer: q.correctAnswer.toLowerCase(),
          explanation: q.explanation,
          exam_source: q.examSource,
        })),
      });

      if (result.success) {
        onTestCreated();
        onOpenChange(false);
        resetState();
      } else {
        setParseError(result.error || "Failed to create test");
      }
    } catch (error) {
      setParseError("Failed to create test");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingQuestion) return;
    setQuestions((prev) =>
      prev.map((q) => (q.id === editingQuestion.id ? editingQuestion : q))
    );
    setShowEditModal(false);
    setEditingQuestion(null);
  };

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const paginatedQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  const downloadSampleCSV = () => {
    const sample = `"Q. No.","Question Text","Options","Exam Details","Correct Answer","Explanation Summary"
"1","भारत की राजधानी क्या है?","(a) मुंबई (b) दिल्ली (c) कोलकाता (d) चेन्नई","HSSC CET 2023","Ans. (b)","दिल्ली भारत की राजधानी है"
"2","What is 2+2?","(a) 3 (b) 4 (c) 5 (d) 6","Sample","Ans. (b)","Basic addition"`;
    const blob = new Blob([sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_questions.csv";
    a.click();
  };

  // Handlers for creating exam/subject/topic
  const handleAddExam = async () => {
    if (!newExamName.trim()) return;
    setIsAddingExam(true);
    try {
      const result = await createExam(
        newExamName.trim(),
        selectedCategoryId || undefined
      );
      if (result.success && result.data) {
        setExams([...exams, result.data]);
        setSelectedExamId(result.data.id);
        setNewExamName("");
        setShowAddExam(false);
      }
    } catch (error) {
      console.error("Error adding exam:", error);
    } finally {
      setIsAddingExam(false);
    }
  };

  const handleAddSubject = async () => {
    if (!newSubjectName.trim() || !selectedExamId) return;
    setIsAddingSubject(true);
    try {
      const result = await createSubject(newSubjectName.trim(), selectedExamId);
      if (result.success && result.data) {
        setSubjects([...subjects, result.data]);
        setSelectedSubjectId(result.data.id);
        setNewSubjectName("");
        setShowAddSubject(false);
      }
    } catch (error) {
      console.error("Error adding subject:", error);
    } finally {
      setIsAddingSubject(false);
    }
  };

  const handleAddTopic = async () => {
    if (!newTopicName.trim() || !selectedSubjectId) return;
    setIsAddingTopic(true);
    try {
      const result = await createTopic(newTopicName.trim(), selectedSubjectId);
      if (result.success && result.data) {
        setTopics([...topics, result.data]);
        setSelectedTopicId(result.data.id);
        setNewTopicName("");
        setShowAddTopic(false);
      }
    } catch (error) {
      console.error("Error adding topic:", error);
    } finally {
      setIsAddingTopic(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    setSelectedExamId("");
    setSelectedSubjectId("");
    setSelectedTopicId("");
  };

  const handleExamChange = (value: string) => {
    setSelectedExamId(value);
    setSelectedSubjectId("");
    setSelectedTopicId("");
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) resetState();
          onOpenChange(isOpen);
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Upload className="w-5 h-5 text-primary" />
              Upload Questions CSV
            </DialogTitle>
            <DialogDescription>
              {step === "upload" &&
                "Upload a CSV file with questions to create a new test"}
              {step === "configure" &&
                "Configure test settings and categorization"}
              {step === "preview" &&
                "Review and edit questions before creating the test"}
            </DialogDescription>
          </DialogHeader>

          {/* Steps Indicator */}
          <div className="flex items-center justify-center gap-2 py-4">
            {["upload", "configure", "preview"].map((s, idx) => (
              <div key={s} className="flex items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step === s
                      ? "bg-primary text-primary-foreground"
                      : ["upload", "configure", "preview"].indexOf(step) > idx
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {idx + 1}
                </div>
                {idx < 2 && <div className="w-12 h-0.5 bg-muted mx-1" />}
              </div>
            ))}
          </div>

          {/* Step 1: Upload */}
          {step === "upload" && (
            <div className="space-y-4">
              <div
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center transition-colors",
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50",
                  parseError && "border-destructive"
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv,application/csv,text/plain,*/*"
                  className="hidden"
                  onChange={handleInputChange}
                />
                {isProcessing ? (
                  <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
                ) : (
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                )}
                <p className="text-foreground font-medium mb-1">
                  {isProcessing ? "Processing..." : "Drop CSV file here"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports your CSV format with Question, Options, Answer
                </p>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFileInputClick}
                  disabled={isProcessing}
                >
                  Browse Files
                </Button>
              </div>

              {parseError && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{parseError}</p>
                </div>
              )}

              <Button
                variant="outline"
                onClick={downloadSampleCSV}
                className="w-full gap-2 bg-transparent"
              >
                <Download className="w-4 h-4" />
                Download Sample CSV
              </Button>
            </div>
          )}

          {/* Step 2: Configure */}
          {step === "configure" && (
            <div className="space-y-6">
              <div className="p-4 bg-accent/10 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-accent" />
                <div>
                  <p className="font-medium text-foreground">
                    {questions.length} questions parsed successfully
                  </p>
                  <p className="text-sm text-muted-foreground">
                    From {file?.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Test Title *</Label>
                  <Input
                    placeholder="e.g., HSSC CET Mock Test 1"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Exam Category *</Label>
                  <Select
                    value={selectedCategoryId}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select category (e.g., Haryana, SSC)" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Exam Type with Add Button */}
                <div>
                  <Label>Exam Name</Label>
                  <div className="flex gap-2 mt-1">
                    <Select
                      value={selectedExamId}
                      onValueChange={handleExamChange}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select exam" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredExams.map((exam) => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {exam.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setShowAddExam(true)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {showAddExam && (
                    <div className="flex gap-2 mt-2">
                      <Input
                        placeholder="New exam name"
                        value={newExamName}
                        onChange={(e) => setNewExamName(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddExam}
                        disabled={isAddingExam}
                      >
                        {isAddingExam ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Add"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAddExam(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div>
                  <Label>Test Category *</Label>
                  <Select
                    value={testType}
                    onValueChange={(v: "exam" | "subject" | "topic") =>
                      setTestType(v)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exam">Full Exam Test</SelectItem>
                      <SelectItem value="subject">Subject-wise Test</SelectItem>
                      <SelectItem value="topic">Topic-wise Test</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Difficulty</Label>
                  <Select
                    value={difficulty}
                    onValueChange={(v: "easy" | "medium" | "hard") =>
                      setDifficulty(v)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(testType === "subject" || testType === "topic") && (
                  <div>
                    <Label>Subject</Label>
                    <div className="flex gap-2 mt-1">
                      <Select
                        value={selectedSubjectId}
                        onValueChange={setSelectedSubjectId}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredSubjects.map((subject) => (
                            <SelectItem key={subject.id} value={subject.id}>
                              {subject.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setShowAddSubject(true)}
                        disabled={!selectedExamId}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {showAddSubject && (
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="New subject name"
                          value={newSubjectName}
                          onChange={(e) => setNewSubjectName(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddSubject}
                          disabled={isAddingSubject}
                        >
                          {isAddingSubject ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Add"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAddSubject(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {testType === "topic" && (
                  <div>
                    <Label>Topic</Label>
                    <div className="flex gap-2 mt-1">
                      <Select
                        value={selectedTopicId}
                        onValueChange={setSelectedTopicId}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select topic" />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredTopics.map((topic) => (
                            <SelectItem key={topic.id} value={topic.id}>
                              {topic.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setShowAddTopic(true)}
                        disabled={!selectedSubjectId}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {showAddTopic && (
                      <div className="flex gap-2 mt-2">
                        <Input
                          placeholder="New topic name"
                          value={newTopicName}
                          onChange={(e) => setNewTopicName(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleAddTopic}
                          disabled={isAddingTopic}
                        >
                          {isAddingTopic ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Add"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAddTopic(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <Label>Duration (minutes)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep("upload")}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep("preview")}
                  disabled={!testTitle || !selectedCategoryId}
                >
                  Preview Questions
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === "preview" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  {questions.length} Questions - {testTitle}
                </h3>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
              </div>

              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {paginatedQuestions.map((q, idx) => (
                  <div key={q.id} className="p-4 border rounded-lg bg-card">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium text-primary">
                        Q{(currentPage - 1) * questionsPerPage + idx + 1}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleEditQuestion(q)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => handleDeleteQuestion(q.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-foreground mb-2">
                      {q.questionText}
                    </p>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <span
                        className={cn(
                          "p-1 rounded",
                          q.correctAnswer === "a" && "bg-accent/20 text-accent"
                        )}
                      >
                        A: {q.optionA}
                      </span>
                      <span
                        className={cn(
                          "p-1 rounded",
                          q.correctAnswer === "b" && "bg-accent/20 text-accent"
                        )}
                      >
                        B: {q.optionB}
                      </span>
                      <span
                        className={cn(
                          "p-1 rounded",
                          q.correctAnswer === "c" && "bg-accent/20 text-accent"
                        )}
                      >
                        C: {q.optionC}
                      </span>
                      <span
                        className={cn(
                          "p-1 rounded",
                          q.correctAnswer === "d" && "bg-accent/20 text-accent"
                        )}
                      >
                        D: {q.optionD}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 5) {
                    if (currentPage > 3) pageNum = currentPage - 2 + i;
                    if (currentPage > totalPages - 2)
                      pageNum = totalPages - 4 + i;
                  }
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {parseError && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{parseError}</p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => setStep("configure")}>
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
                <Button
                  onClick={handleCreateTest}
                  disabled={isCreating || questions.length === 0}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Create Test ({questions.length} questions)
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Question Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
          </DialogHeader>
          {editingQuestion && (
            <div className="space-y-4">
              <div>
                <Label>Question</Label>
                <Textarea
                  value={editingQuestion.questionText}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      questionText: e.target.value,
                    })
                  }
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Option A</Label>
                  <Input
                    value={editingQuestion.optionA}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        optionA: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Option B</Label>
                  <Input
                    value={editingQuestion.optionB}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        optionB: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Option C</Label>
                  <Input
                    value={editingQuestion.optionC}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        optionC: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Option D</Label>
                  <Input
                    value={editingQuestion.optionD}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        optionD: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Correct Answer</Label>
                <Select
                  value={editingQuestion.correctAnswer}
                  onValueChange={(v) =>
                    setEditingQuestion({ ...editingQuestion, correctAnswer: v })
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a">A</SelectItem>
                    <SelectItem value="b">B</SelectItem>
                    <SelectItem value="c">C</SelectItem>
                    <SelectItem value="d">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Explanation (Optional)</Label>
                <Textarea
                  value={editingQuestion.explanation || ""}
                  onChange={(e) =>
                    setEditingQuestion({
                      ...editingQuestion,
                      explanation: e.target.value,
                    })
                  }
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
