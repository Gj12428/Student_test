"use client"

import type React from "react"

import { cn } from "@/lib/utils"

interface ChartCardProps {
  title: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}

export function ChartCard({ title, children, className, action }: ChartCardProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )
}
