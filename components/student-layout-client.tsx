"use client"

import type React from "react"
import type { User } from "@/lib/auth"
import { Sidebar } from "@/components/dashboard/sidebar"

interface StudentLayoutClientProps {
  user: User
  children: React.ReactNode
}

export function StudentLayoutClient({ user, children }: StudentLayoutClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar type="student" user={user} />
      <main className="lg:pl-64 min-h-screen transition-all duration-300">
        <div className="p-4 pt-20 lg:p-8 lg:pt-8">{children}</div>
      </main>
    </div>
  )
}
