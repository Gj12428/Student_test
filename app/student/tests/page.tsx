"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { getExamCategories } from "@/lib/actions/student";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ChevronRight,
  BookOpen,
  GraduationCap,
  Train,
  Mountain,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

// Exam category icons
const categoryIcons: Record<string, React.ReactNode> = {
  haryana: <GraduationCap className="w-8 h-8" />,
  ssc: <BookOpen className="w-8 h-8" />,
  railway: <Train className="w-8 h-8" />,
  uttarakhand: <Mountain className="w-8 h-8" />,
};

// Exam category colors
const categoryColors: Record<string, string> = {
  haryana: "from-blue-500 to-blue-700",
  ssc: "from-green-500 to-green-700",
  railway: "from-red-500 to-red-700",
  uttarakhand: "from-purple-500 to-purple-700",
};

// Default categories to show if database is empty
const defaultCategories = [
  {
    id: "haryana",
    name: "Haryana Exams",
    slug: "haryana",
    description:
      "All Haryana state government competitive exams including CET, Police, Group D, and more",
    exams: [],
  },
  {
    id: "ssc",
    name: "SSC Exams",
    slug: "ssc",
    description:
      "Staff Selection Commission exams including CGL, CHSL, MTS, and more",
    exams: [],
  },
  {
    id: "railway",
    name: "Railway Exams",
    slug: "railway",
    description:
      "Indian Railways recruitment exams including RRB NTPC, Group D, ALP, and more",
    exams: [],
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand Exams",
    slug: "uttarakhand",
    description: "Uttarakhand state government competitive exams",
    exams: [],
  },
];

export default function StudentTestsPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getExamCategories();
        console.log("[v0] Categories loaded:", data);
        if (data && data.length > 0) {
          setCategories(data);
        } else {
          console.log("[v0] No categories from DB, using defaults");
          setCategories(defaultCategories);
        }
      } catch (err) {
        console.error("[v0] Error loading categories:", err);
        setError("Failed to load exam categories");
        setCategories(defaultCategories);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-3">
          Choose Your Exam Category
        </h1>
        <p className="text-muted-foreground">
          Select an exam category to explore available tests and start your
          preparation journey
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}. Showing default categories.</p>
        </div>
      )}

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link key={category.id} href={`/student/tests/${category.slug}`}>
            <Card className="group cursor-pointer overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
              {/* Image/Gradient Header */}
              <div
                className={`relative h-40 bg-gradient-to-br ${
                  categoryColors[category.slug] || "from-gray-500 to-gray-700"
                }`}
              >
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                    {categoryIcons[category.slug] || (
                      <BookOpen className="w-8 h-8" />
                    )}
                  </div>
                </div>
                {/* Exam count badge */}
                <Badge className="absolute top-3 right-3 bg-white/90 text-foreground hover:bg-white">
                  {category.exams?.length || 0} Exams
                </Badge>
              </div>

              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
