"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  BarChart3,
  Clock,
  Shield,
  Smartphone,
  Zap,
  Target,
  Users,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Comprehensive Test Bank",
    description:
      "Access 10,000+ questions covering all CET subjects with detailed solutions.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Track your progress with detailed performance reports and identify weak areas.",
  },
  {
    icon: Clock,
    title: "Real Exam Environment",
    description:
      "Practice in conditions that mirror the actual CET exam pattern.",
  },
  {
    icon: Target,
    title: "Topic-wise Practice",
    description:
      "Focus on specific topics with targeted practice tests and instant feedback.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description:
      "Study anywhere with our responsive platform optimized for all devices.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description:
      "Get immediate feedback with detailed explanations for every question.",
  },
  {
    icon: Shield,
    title: "Updated Content",
    description:
      "Stay ahead with regularly updated questions based on latest exam patterns.",
  },
  {
    icon: Users,
    title: "Live Rankings",
    description:
      "Compare your performance with thousands of aspirants on our leaderboard.",
  },
];

export default function FeaturesSection() {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setVisibleItems((prev) => [...prev, index]);
          }
        });
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    const items = sectionRef.current?.querySelectorAll("[data-index]");
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={sectionRef}>
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Everything You Need to Succeed
          </h2>
          <p className="text-lg text-muted-foreground">
            Our platform is designed with one goal in mind - to help you crack
            CET on your first attempt.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              data-index={index}
              className={`group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${
                visibleItems.includes(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all">
                <feature.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
