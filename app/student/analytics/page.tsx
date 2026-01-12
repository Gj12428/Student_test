import { getStudentAnalytics } from "@/lib/actions/student"
import AnalyticsClient from "./analytics-client"

export default async function StudentAnalyticsPage() {
  const analytics = await getStudentAnalytics()

  if (!analytics) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No analytics data available yet.
      </div>
    )
  }

  return <AnalyticsClient analytics={analytics} />
}
