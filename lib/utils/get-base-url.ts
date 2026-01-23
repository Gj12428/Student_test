import { headers } from "next/headers";

export function getBaseUrl() {
  // Browser (client-side)
  if (typeof window !== "undefined") {
    return "";
  }

  // Server-side (SSR / Server Actions)
  const headersList = headers();
  const host = headersList.get("host");

  if (!host) {
    throw new Error("Host header is missing");
  }

  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  return `${protocol}://${host}`;
}
