import { NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
const userId = cookie
  .split("; ")
  .find(c => c.startsWith("userId="))
  ?.split("=")[1];

if (!userId) {
  return NextResponse.json({ user: null }, { status: 401 });
}

    const db = getDB();
    if (!db) throw new Error("DB not ready");

    const [rows]: any = await db.query(
      "SELECT id, email, role FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    return NextResponse.json({ user: rows[0] || null });
  } catch (err) {
    logger.error("ME API ERROR", err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}


// import { NextResponse } from "next/server"
// import { getDB } from "@/lib/db"
// import { logger } from "@/lib/logger"

// export async function GET(req: Request) {
//   logger.info("Me API hit")

//   try {
//     const cookie = req.headers.get("cookie") || ""
//     const userId = cookie
//       .split("; ")
//       .find((c) => c.startsWith("userId="))
//       ?.split("=")[1]

//     if (!userId) {
//       logger.warn("userId cookie missing")
//       return NextResponse.json({ user: null }, { status: 401 })
//     }

//     const db = getDB()
//     if (!db) throw new Error("DB not available")

//     const [rows]: any = await db.query(
//       "SELECT id, email, role FROM users WHERE id = ? LIMIT 1",
//       [userId]
//     )

//     return NextResponse.json({ user: rows[0] || null })
//   } catch (error: any) {
//     logger.error("Me API error", {
//       message: error.message,
//       stack: error.stack,
//     })

//     return NextResponse.json(
//       { success: false },
//       { status: 500 }
//     )
//   }
// }
