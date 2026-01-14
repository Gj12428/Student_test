"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, ArrowRight, Star } from "lucide-react";

const testSeries = [
  {
    title: "CET Full Length Tests",
    description: "Complete mock tests based on actual exam pattern",
    tests: 50,
    questions: 5000,
    duration: "90 mins each",
    difficulty: "Medium-Hard",
    popular: true,
    color: "bg-primary",
  },
  {
    title: "Topic-wise Practice Tests",
    description: "Focused practice on individual subjects",
    tests: 200,
    questions: 3000,
    duration: "30 mins each",
    difficulty: "Easy-Medium",
    popular: false,
    color: "bg-accent",
  },
  {
    title: "Previous Year Papers",
    description: "Actual questions from past CET exams",
    tests: 25,
    questions: 2000,
    duration: "90 mins each",
    difficulty: "As per exam",
    popular: true,
    color: "bg-chart-3",
  },
];

export default function TestSeriesSection() {
  return (
    <section id="test-series" className="py-20 bg-muted/30 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Test Series
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Choose Your Practice Path
          </h2>
          <p className="text-lg text-muted-foreground">
            Multiple test series designed for comprehensive preparation
          </p>
        </div>

        {/* Test Series Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {testSeries.map((series, index) => (
            <div
              key={series.title}
              className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Card Header */}
              <div className={`p-6 ${series.color}`}>
                <div className="flex items-start justify-between">
                  <div>
                    {series.popular && (
                      <Badge className="bg-background/20 text-primary-foreground border-0 mb-2">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Popular
                      </Badge>
                    )}
                    <h3 className="text-xl font-bold text-primary-foreground">
                      {series.title}
                    </h3>
                  </div>
                </div>
                <p className="text-primary-foreground/80 text-sm mt-2">
                  {series.description}
                </p>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {series.tests}
                      </span>{" "}
                      Tests
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {series.questions}
                      </span>{" "}
                      Qs
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {series.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {series.difficulty}
                    </Badge>
                  </div>
                </div>

                <Link href="/signup" className="block">
                  <Button className="w-full group/btn bg-primary hover:bg-primary/90">
                    Start Practicing
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
