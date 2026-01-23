"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import { getAvailableTests } from "@/lib/actions/student";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ChevronRight,
  ChevronLeft,
  FileText,
  BookOpen,
  Target,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

// Exam-specific colors
const examColors: Record<string, string> = {
  "haryana-cet": "from-blue-500 to-cyan-500",
  "haryana-police": "from-indigo-500 to-blue-500",
  "haryana-group-d": "from-green-500 to-emerald-500",
  "haryana-clerk": "from-purple-500 to-violet-500",
  default: "from-primary to-primary/70",
};

function ExamCategoryContent() {
  const params = useParams();
  const categorySlug = params?.category as string;

  const [category, setCategory] = useState<any>(null);
  const [exams, setExams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadExams() {
      if (!categorySlug) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getAvailableTests();

        // 🔹 Filter exams by category slug
        const filteredExams = data?.filter(
          (exam: any) => exam.category_slug === categorySlug
        );

        if (!filteredExams || filteredExams.length === 0) {
          setCategory(null);
          setExams([]);
          return;
        }

        // 🔹 Derive category info from first exam
        setCategory({
          name: filteredExams[0].category_name,
          description: filteredExams[0].category_description,
          slug: categorySlug,
        });

        setExams(filteredExams);
      } catch (error) {
        console.error("Error loading exams:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadExams();
  }, [categorySlug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="text-center py-16">
        <GraduationCap className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Category Not Found
        </h3>
        <p className="text-muted-foreground mb-4">
          The exam category you are looking for does not exist.
        </p>
        <Link href="/student/tests">
          <Button variant="outline">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <Link
          href="/student/tests"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Categories
        </Link>

        <h1 className="text-3xl lg:text-4xl font-bold mb-2">
          {category.name}
        </h1>
        <p className="text-muted-foreground">{category.description}</p>
      </div>

      {/* Exam Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => {
          const colorClass = examColors[exam.slug] || examColors.default;

          return (
            <Link
              key={exam.id}
              href={`/student/tests/${categorySlug}/${exam.id}`}
            >
              <Card className="group cursor-pointer overflow-hidden border-2 hover:border-primary/50 hover:shadow-xl hover:-translate-y-2 transition-all h-full">
                <div className={`h-32 bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>

                <CardContent className="p-5">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-primary">
                    {exam.name}
                  </h3>

                  {exam.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {exam.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      {exam.test_count || 0} Tests
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Badge variant="secondary">Full</Badge>
                      <Badge variant="secondary">Subject</Badge>
                      <Badge variant="secondary">Topic</Badge>
                    </div>
                    <ChevronRight className="w-5 h-5 group-hover:text-primary" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {exams.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold mb-2">No Exams Available</h3>
          <p className="text-muted-foreground">
            No exams have been added to this category yet.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ExamCategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <ExamCategoryContent />
    </Suspense>
  );
}
