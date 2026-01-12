"use client"

import { useEffect, useState } from "react"
import { getTestFeedback } from "@/lib/actions/contact"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Loader2, User, BookOpen, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadFeedback() {
      const data = await getTestFeedback()
      setFeedback(data)
      setIsLoading(false)
    }
    loadFeedback()
  }, [])

  const getDifficultyColor = (level: string) => {
    const colors: Record<string, string> = {
      too_easy: "bg-green-100 text-green-800",
      easy: "bg-blue-100 text-blue-800",
      medium: "bg-yellow-100 text-yellow-800",
      hard: "bg-orange-100 text-orange-800",
      too_hard: "bg-red-100 text-red-800",
    }
    return colors[level] || "bg-gray-100 text-gray-800"
  }

  const getQualityColor = (quality: string) => {
    const colors: Record<string, string> = {
      poor: "bg-red-100 text-red-800",
      fair: "bg-orange-100 text-orange-800",
      good: "bg-blue-100 text-blue-800",
      excellent: "bg-green-100 text-green-800",
    }
    return colors[quality] || "bg-gray-100 text-gray-800"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Test Feedback</h1>
        <p className="text-muted-foreground mt-1">View feedback from students about their test experiences</p>
      </div>

      {feedback.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No feedback submissions yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {feedback.map((item) => (
            <Card key={item.id} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Student
                  </p>
                  <p className="font-semibold text-foreground">{item.user?.full_name || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    Test
                  </p>
                  <p className="font-semibold text-foreground">{item.test?.title || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${star <= item.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Date
                  </p>
                  <p className="text-sm text-foreground">
                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-muted-foreground">Difficulty</p>
                  <Badge className={getDifficultyColor(item.difficulty_level)}>
                    {item.difficulty_level.replace("_", " ").toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Question Quality</p>
                  <Badge className={getQualityColor(item.question_quality)}>
                    {item.question_quality.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time Sufficient</p>
                  <Badge variant="outline">{item.time_sufficient ? "Yes" : "No"}</Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Would Recommend</p>
                  <Badge variant="outline">{item.would_recommend ? "Yes" : "No"}</Badge>
                </div>
              </div>

              {item.comments && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Comments</p>
                  <p className="text-foreground bg-muted p-3 rounded whitespace-pre-wrap">{item.comments}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
