import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-server"
import { StudentLayoutClient } from "@/components/student-layout-client"

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "student") {
    redirect("/admin")
  }

  return <StudentLayoutClient user={user}>{children}</StudentLayoutClient>
}
