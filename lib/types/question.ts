export interface Question {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: "a" | "b" | "c" | "d"
  explanation: string | null
}
