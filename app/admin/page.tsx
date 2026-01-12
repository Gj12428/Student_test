import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import AdminDashboard from "./dashboard";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/");

  return <AdminDashboard />;
}
