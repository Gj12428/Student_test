"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface StatsCardProps {
  title: string
  value: string | number
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  color?: "primary" | "accent" | "warning" | "destructive"
  animate?: boolean
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  color = "primary",
  animate = true,
}: StatsCardProps) {
  const [displayValue, setDisplayValue] = useState(animate ? 0 : value)
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

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

  useEffect(() => {
    if (!animate || !isVisible) return

    const numericValue = typeof value === "string" ? Number.parseFloat(value.replace(/[^0-9.-]/g, "")) : value

    if (isNaN(numericValue)) {
      setDisplayValue(value)
      return
    }

    const duration = 1500
    const steps = 60
    const increment = numericValue / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= numericValue) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        if (typeof value === "string" && value.includes("%")) {
          setDisplayValue(`${Math.floor(current)}%`)
        } else if (typeof value === "string" && value.includes("₹")) {
          setDisplayValue(`₹${Math.floor(current).toLocaleString()}`)
        } else {
          setDisplayValue(Math.floor(current).toLocaleString())
        }
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value, animate, isVisible])

  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/10 text-accent",
    warning: "bg-amber-500/10 text-amber-500",
    destructive: "bg-destructive/10 text-destructive",
  }

  return (
    <div
      ref={ref}
      className="bg-card border border-border rounded-xl p-4 lg:p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs lg:text-sm text-muted-foreground mb-1 truncate">{title}</p>
          <p className="text-xl lg:text-3xl font-bold text-foreground">{displayValue}</p>
          {change && (
            <p
              className={cn(
                "text-xs lg:text-sm mt-1 lg:mt-2 font-medium line-clamp-1",
                changeType === "positive" && "text-accent",
                changeType === "negative" && "text-destructive",
                changeType === "neutral" && "text-muted-foreground",
              )}
            >
              {change}
            </p>
          )}
        </div>
        <div
          className={cn(
            "w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 flex-shrink-0",
            colorClasses[color],
          )}
        >
          <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
        </div>
      </div>
    </div>
  )
}

export default StatsCard
