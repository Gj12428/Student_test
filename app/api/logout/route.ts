import { NextResponse } from "next/server"
import { logger } from "@/lib/logger"

export async function POST() {
  logger.info("Logout API hit")

  const res = NextResponse.json({ success: true })
  res.cookies.set("userId", "", { maxAge: 0, path: "/" })

  logger.info("User logged out")
  return res
}
