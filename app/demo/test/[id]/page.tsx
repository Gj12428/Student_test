"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Timer,
  Target,
} from "lucide-react";
import { getDemoTest, type DemoQuestion } from "@/lib/demo-questions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Test {
  id: string;
  title: string;
  duration: number;
  questions: DemoQuestion[];
}

export default function DemoTestPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.id as string;

  const [test, setTest] = useState<Test | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [testStarted, setTestStarted] = useState(false);

  useEffect(() => {
    const data = getDemoTest(testId);
    if (data) {
      setTest(data);
      setTimeLeft(data.duration * 60);
    }
  }, [testId]);

  useEffect(() => {
    if (!testStarted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const toggleFlag = (questionId: string) => {
    setFlagged((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    if (!test) return;
    setIsSubmitting(true);

    // Calculate results
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    const questionResults: Record<
      string,
      { selected: string | null; correct: string; isCorrect: boolean }
    > = {};

    test.questions.forEach((q) => {
      const selected = answers[q.id] || null;
      const isCorrect = selected === q.correct_answer;

      questionResults[q.id] = {
        selected,
        correct: q.correct_answer,
        isCorrect,
      };

      if (!selected) {
        unanswered++;
      } else if (isCorrect) {
        correct++;
      } else {
        wrong++;
      }
    });

    // Store results in sessionStorage
    const results = {
      testId,
      testTitle: test.title,
      totalQuestions: test.questions.length,
      correct,
      wrong,
      unanswered,
      score: correct,
      percentage: Math.round((correct / test.questions.length) * 100),
      timeTaken: test.duration * 60 - timeLeft,
      questionResults,
      questions: test.questions,
    };

    sessionStorage.setItem("demoResults", JSON.stringify(results));
    router.push(`/demo/results/${testId}`);
  };

  if (!test) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Test Not Found
          </h2>
          <p className="text-muted-foreground mb-4">
            The demo test you are looking for does not exist.
          </p>
          <Button onClick={() => router.push("/demo")}>
            Back to Demo Tests
          </Button>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {test.title}
            </h1>
            <p className="text-muted-foreground">
              Read the instructions carefully before starting
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Target className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {test.questions.length}
              </p>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <Timer className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">
                {test.duration}
              </p>
              <p className="text-sm text-muted-foreground">Minutes</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-foreground">+1 / 0</p>
              <p className="text-sm text-muted-foreground">Marking</p>
            </div>
          </div>

          <div className="space-y-3 bg-muted/30 rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-4">
              Instructions:
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                Each correct answer carries 1 mark
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                No negative marking for wrong answers
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                This is a demo test - no account required
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                Detailed analysis will be shown after submission
              </li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => router.push("/demo")}
            >
              Go Back
            </Button>
            <Button className="flex-1" onClick={() => setTestStarted(true)}>
              Start Test
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const question = test.questions[currentQuestion];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / test.questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border px-2 lg:px-4 py-2 lg:py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-sm lg:text-lg font-semibold text-foreground truncate">
              {test.title}
            </h1>
            <p className="text-xs lg:text-sm text-muted-foreground">
              Q {currentQuestion + 1} of {test.questions.length}
            </p>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div
              className={`flex items-center gap-1 lg:gap-2 px-2 lg:px-4 py-1 lg:py-2 rounded-lg ${
                timeLeft < 60
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <Clock className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="font-mono font-bold text-sm lg:text-lg">
                {formatTime(timeLeft)}
              </span>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowSubmitDialog(true)}
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-2 lg:p-4 grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Question Area */}
        <div className="lg:col-span-3 space-y-4 lg:space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs lg:text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-foreground font-medium">
                {answeredCount}/{test.questions.length} answered
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="p-4 lg:p-6">
            <div className="flex items-start justify-between mb-4 lg:mb-6">
              <span className="px-2 lg:px-3 py-1 bg-primary/10 text-primary rounded-full text-xs lg:text-sm font-medium">
                Question {currentQuestion + 1}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFlag(question.id)}
                className={
                  flagged.has(question.id)
                    ? "text-amber-500"
                    : "text-muted-foreground"
                }
              >
                <Flag className="w-4 h-4 mr-1" />
                {flagged.has(question.id) ? "Flagged" : "Flag"}
              </Button>
            </div>

            <p className="text-base lg:text-lg text-foreground mb-6 leading-relaxed">
              {question.question_text}
            </p>

            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={(value) => handleAnswer(question.id, value)}
              className="space-y-3"
            >
              {[
                { key: "a", value: question.option_a },
                { key: "b", value: question.option_b },
                { key: "c", value: question.option_c },
                { key: "d", value: question.option_d },
              ].map((option) => (
                <Label
                  key={option.key}
                  htmlFor={`${question.id}-${option.key}`}
                  className={`flex items-center gap-3 p-3 lg:p-4 rounded-lg border cursor-pointer transition-all ${
                    answers[question.id] === option.key
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  }`}
                >
                  <RadioGroupItem
                    value={option.key}
                    id={`${question.id}-${option.key}`}
                  />
                  <span className="font-medium text-muted-foreground uppercase mr-2">
                    {option.key}.
                  </span>
                  <span className="text-foreground text-sm lg:text-base">
                    {option.value}
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() =>
                setCurrentQuestion((prev) => Math.max(0, prev - 1))
              }
              disabled={currentQuestion === 0}
              className="bg-transparent"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={() =>
                setCurrentQuestion((prev) =>
                  Math.min(test.questions.length - 1, prev + 1)
                )
              }
              disabled={currentQuestion === test.questions.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="lg:col-span-1">
          <Card className="p-4 sticky top-20">
            <h3 className="font-semibold text-foreground mb-4">
              Question Navigator
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {test.questions.map((q, idx) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-full aspect-square rounded-lg text-sm font-medium transition-all ${
                    currentQuestion === idx
                      ? "bg-primary text-primary-foreground"
                      : answers[q.id]
                      ? "bg-accent text-accent-foreground"
                      : flagged.has(q.id)
                      ? "bg-amber-500/20 text-amber-600 border border-amber-500"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-accent" />
                <span className="text-muted-foreground">
                  Answered ({answeredCount})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted" />
                <span className="text-muted-foreground">
                  Not Answered ({test.questions.length - answeredCount})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-500/20 border border-amber-500" />
                <span className="text-muted-foreground">
                  Flagged ({flagged.size})
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Submit Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} out of {test.questions.length}{" "}
              questions.
              {test.questions.length - answeredCount > 0 && (
                <span className="text-amber-500 block mt-2">
                  {test.questions.length - answeredCount} questions are
                  unanswered.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Test</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Test"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
