"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  Users,
  GraduationCap,
  ArrowRight,
  Clock,
  Target,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const demoTests = [
  {
    id: "haryana-police",
    title: "Haryana Police Constable",
    description:
      "Practice test based on Haryana Police recruitment exam pattern",
    icon: Shield,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-500",
    questions: 10,
    duration: 10,
    difficulty: "Moderate",
    topics: ["General Knowledge", "Reasoning", "Math", "Hindi"],
  },
  {
    id: "haryana-group-d",
    title: "Haryana Group D",
    description: "Mock test for HSSC Group D recruitment examination",
    icon: Users,
    color: "from-emerald-500 to-emerald-600",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-500",
    questions: 10,
    duration: 10,
    difficulty: "Easy",
    topics: ["General Awareness", "Haryana GK", "Basic Math", "Reasoning"],
  },
  {
    id: "haryana-cet",
    title: "Haryana CET",
    description: "Common Eligibility Test for various Group C posts in Haryana",
    icon: GraduationCap,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-500",
    questions: 10,
    duration: 10,
    difficulty: "Moderate",
    topics: [
      "Haryana GK",
      "Reasoning",
      "Quantitative Aptitude",
      "English/Hindi",
    ],
  },
];

export default function DemoPage() {
  const router = useRouter();
  const [selectedTest, setSelectedTest] = useState<string | null>(null);

  const handleStartTest = (testId: string) => {
    router.push(`/demo/test/${testId}`);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Try Before You Sign Up
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Experience Our Demo Tests
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Take a free demo test to experience our platform. Choose from
              three popular Haryana government exam patterns.
            </p>
          </div>

          {/* Test Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {demoTests.map((test) => {
              const Icon = test.icon;
              return (
                <Card
                  key={test.id}
                  className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group ${
                    selectedTest === test.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedTest(test.id)}
                >
                  {/* Gradient Top Border */}
                  <div className={`h-1.5 bg-gradient-to-r ${test.color}`} />

                  <div className="p-6 space-y-4">
                    {/* Icon & Title */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl ${test.bgColor} flex items-center justify-center`}
                      >
                        <Icon className={`w-7 h-7 ${test.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground mb-1">
                          {test.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {test.difficulty}
                        </Badge>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground text-sm">
                      {test.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <Target className="w-5 h-5 text-primary mx-auto mb-1" />
                        <p className="text-lg font-bold text-foreground">
                          {test.questions}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Questions
                        </p>
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3 text-center">
                        <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
                        <p className="text-lg font-bold text-foreground">
                          {test.duration}
                        </p>
                        <p className="text-xs text-muted-foreground">Minutes</p>
                      </div>
                    </div>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-1.5">
                      {test.topics.map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <Button
                      className={`w-full bg-gradient-to-r ${test.color} hover:opacity-90 text-white group-hover:shadow-lg transition-all`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartTest(test.id);
                      }}
                    >
                      Start Demo Test
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Features */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  No Sign Up Required
                </h4>
                <p className="text-sm text-muted-foreground">
                  Try our demo tests without creating an account
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Real Exam Pattern
                </h4>
                <p className="text-sm text-muted-foreground">
                  Questions based on actual exam patterns
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-1">
                  Detailed Analysis
                </h4>
                <p className="text-sm text-muted-foreground">
                  Get comprehensive results after completion
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
