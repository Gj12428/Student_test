"use client"

import { useEffect, useState, useRef } from "react"
import { Users, FileText, Award, TrendingUp } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: 50000,
    suffix: "+",
    label: "Active Students",
  },
  {
    icon: FileText,
    value: 10000,
    suffix: "+",
    label: "Practice Questions",
  },
  {
    icon: Award,
    value: 98,
    suffix: "%",
    label: "Success Rate",
  },
  {
    icon: TrendingUp,
    value: 500,
    suffix: "+",
    label: "Selections",
  },
]

function useCountUp(target: number, duration = 2000, startCounting: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!startCounting) return

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * target))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [target, duration, startCounting])

  return count
}

function StatCard({ stat, index }: { stat: (typeof stats)[0]; index: number }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const count = useCountUp(stat.value, 2000, isVisible)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
        isVisible ? "animate-count-up" : "opacity-0"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
        <stat.icon className="w-7 h-7 text-primary" />
      </div>
      <p className="text-3xl md:text-4xl font-bold text-foreground mb-1">
        {count.toLocaleString()}
        {stat.suffix}
      </p>
      <p className="text-muted-foreground">{stat.label}</p>
    </div>
  )
}

export default function StatsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
