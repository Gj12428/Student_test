import { cookies } from "next/headers";
import { getBaseUrl } from "@/lib/getBaseUrl";

export async function getCurrentUser() {
  try {
    // ✅ Next.js 14+: cookies() is ASYNC
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    if (!cookieHeader) {
      return null;
    }

    const res = await fetch(`${getBaseUrl()}/api/me`, {
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data.user || null;
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}
