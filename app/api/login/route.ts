import { NextResponse } from "next/server"
import { getDB } from "@/lib/db"
import { logger } from "@/lib/logger"

export const runtime = "nodejs"

export async function POST(req: Request) {
  logger.info("Login API hit")

  try {
    const body = await req.json()
    logger.info("Login payload received", body)

    const { email, password } = body

    if (!email || !password) {
      logger.warn("Missing email or password")
      return NextResponse.json(
        { success: false, message: "Email & password required" },
        { status: 400 }
      )
    }

    const db = getDB()
    if (!db) {
      logger.error("DB not initialized")
      return NextResponse.json(
        { success: false, message: "Database not available" },
        { status: 500 }
      )
    }

    const [rows]: any = await db.query(
      "SELECT id, email, role FROM users WHERE email = ? AND password = ? LIMIT 1",
      [email, password]
    )

    logger.info("DB response", { count: rows.length })

    if (!rows.length) {
      logger.warn("Invalid credentials", { email })
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      )
    }

    const user = rows[0]

    const res = NextResponse.json({
      success: true,
      user,
    })

    res.cookies.set("userId", String(user.id), {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    })

    logger.info("User logged in", { userId: user.id })

    return res
  } catch (error: any) {
    logger.error("Login API error", {
      message: error.message,
      stack: error.stack,
    })

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    )
  }
}
