"use client"

import type React from "react"
import type { User } from "@/lib/auth"
import { Sidebar } from "@/components/dashboard/sidebar"

interface AdminLayoutClientProps {
  user: User
  children: React.ReactNode
}

export function AdminLayoutClient({ user, children }: AdminLayoutClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar type="admin" user={user} />
      <main className="lg:pl-64 min-h-screen transition-all duration-300">
        <div className="p-4 pt-20 lg:p-8 lg:pt-8">{children}</div>
      </main>
    </div>
  )
}
