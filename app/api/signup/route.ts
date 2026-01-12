import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { full_name, email, password, role } = body;

    if (!full_name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const db = getDB();
    if (!db) throw new Error("DB not initialized");

    // 🔍 Check if user already exists
    const [existing]: any = await db.query(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existing.length) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // ✅ Insert new user
    const [result]: any = await db.query(
      `INSERT INTO users (full_name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [full_name, email, password, role || "student"]
    );

    logger.info("✅ User signed up", {
      userId: result.insertId,
      role: role || "student",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: result.insertId,
        full_name,
        email,
        role: role || "student",
      },
    });
  } catch (error: any) {
    logger.error("❌ Signup error", {
      message: error.message,
      stack: error.stack,
    });

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
