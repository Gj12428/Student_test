"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { submitTestFeedback } from "@/lib/actions/contact";
import { Star, Loader2 } from "lucide-react";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  testId: string;
  attemptId: string;
  testTitle: string;
}

export function FeedbackModal({
  isOpen,
  onClose,
  userId,
  testId,
  attemptId,
  testTitle,
}: FeedbackModalProps) {
  const [rating, setRating] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [questionQuality, setQuestionQuality] = useState("good");
  const [timeSufficient, setTimeSufficient] = useState(true);
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const result = await submitTestFeedback({
        userId,
        testId,
        attemptId,
        rating,
        difficultyLevel: difficulty,
        questionQuality,
        timeSufficient,
        wouldRecommend,
        comments,
      });

      if (result.success) {
        onClose();
      } else {
        alert("Failed to submit feedback");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            Help us improve by sharing your experience with {testTitle}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Rating */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              How would you rate this test?
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <Label className="text-base font-semibold mb-2 block">
              Difficulty Level
            </Label>
            <RadioGroup value={difficulty} onValueChange={setDifficulty}>
              {[
                { value: "too_easy", label: "Too Easy" },
                { value: "easy", label: "Easy" },
                { value: "medium", label: "Medium" },
                { value: "hard", label: "Hard" },
                { value: "too_hard", label: "Too Hard" },
              ].map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Question Quality */}
          <div>
            <Label className="text-base font-semibold mb-2 block">
              Question Quality
            </Label>
            <RadioGroup
              value={questionQuality}
              onValueChange={setQuestionQuality}
            >
              {[
                { value: "poor", label: "Poor" },
                { value: "fair", label: "Fair" },
                { value: "good", label: "Good" },
                { value: "excellent", label: "Excellent" },
              ].map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Time Sufficient */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="time"
              checked={timeSufficient}
              onCheckedChange={(checked) =>
                setTimeSufficient(checked as boolean)
              }
            />
            <Label htmlFor="time" className="font-normal cursor-pointer">
              Time was sufficient to complete the test
            </Label>
          </div>

          {/* Would Recommend */}
          <div className="flex items-center gap-2">
            <Checkbox
              id="recommend"
              checked={wouldRecommend}
              onCheckedChange={(checked) =>
                setWouldRecommend(checked as boolean)
              }
            />
            <Label htmlFor="recommend" className="font-normal cursor-pointer">
              I would recommend this test to others
            </Label>
          </div>

          {/* Comments */}
          <div>
            <Label
              htmlFor="comments"
              className="text-base font-semibold mb-2 block"
            >
              Additional Comments (Optional)
            </Label>
            <Textarea
              id="comments"
              placeholder="Share any additional thoughts or suggestions..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Skip
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
