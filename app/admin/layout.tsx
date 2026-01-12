import type React from "react"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth-server"
import { AdminLayoutClient } from "@/components/admin-layout-client"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "admin") {
    redirect("/student")
  }

  return <AdminLayoutClient user={user}>{children}</AdminLayoutClient>
}
