export interface Profile {
  id: string
  name: string
  email: string
  phone: string | null
  role: "admin" | "student"
  plan: "free" | "basic" | "pro"
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Exam {
  id: string
  name: string
  description: string | null
  created_at: string
}

export interface Subject {
  id: string
  name: string
  exam_id: string
  created_at: string
  exam?: Exam
}

export interface Topic {
  id: string
  name: string
  subject_id: string
  created_at: string
  subject?: Subject
}

export interface Test {
  id: string
  title: string
  description: string | null
  category: "exam" | "subject" | "topic"
  exam_id: string | null
  subject_id: string | null
  topic_id: string | null
  duration: number
  difficulty: "easy" | "medium" | "hard"
  is_active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
  exam?: Exam
  subject?: Subject
  topic?: Topic
  questions_count?: number
  attempts_count?: number
  avg_score?: number
}

export interface Question {
  id: string
  test_id: string
  question_number: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: "a" | "b" | "c" | "d"
  explanation: string | null
  exam_source: string | null
  created_at: string
}

export interface TestAttempt {
  id: string
  test_id: string
  user_id: string
  started_at: string
  completed_at: string | null
  time_taken: number | null
  status: "in_progress" | "completed" | "abandoned"
  test?: Test
}

export interface UserAnswer {
  id: string
  attempt_id: string
  question_id: string
  selected_answer: "a" | "b" | "c" | "d" | null
  is_correct: boolean | null
  time_spent: number | null
  created_at: string
  question?: Question
}

export interface TestResult {
  id: string
  attempt_id: string
  user_id: string
  test_id: string
  total_questions: number
  correct_answers: number
  wrong_answers: number
  unattempted: number
  score: number
  time_taken: number | null
  rank: number | null
  percentile: number | null
  created_at: string
  test?: Test
  user?: Profile
}

export interface StudentWithStats extends Profile {
  tests_attempted: number
  average_score: number
  total_time: number
  last_active: string | null
}

export interface User {
  id: number;
  email: string;
  role: "admin" | "student";
  full_name?: string 
}

