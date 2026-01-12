// Mock data for the application

export interface Student {
  id: string
  name: string
  email: string
  phone: string
  enrolledDate: string
  plan: "free" | "basic" | "pro"
  testsAttempted: number
  averageScore: number
  totalTime: string
  lastActive: string
  progress: number
  subjects: {
    name: string
    score: number
    testsAttempted: number
  }[]
}

export interface Test {
  id: string
  title: string
  category: "exam" | "subject" | "topic"
  subject?: string
  topic?: string
  questions: number
  duration: string
  difficulty: "easy" | "medium" | "hard"
  attempts: number
  avgScore: number
}

export interface TestResult {
  id: string
  testId: string
  testTitle: string
  date: string
  score: number
  totalQuestions: number
  correctAnswers: number
  wrongAnswers: number
  unattempted: number
  timeTaken: string
  rank: number
  percentile: number
}

export interface Question {
  id: number
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  answer: string
}

export const mockStudents: Student[] = [
  {
    id: "s1",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 9876543210",
    enrolledDate: "2025-10-15",
    plan: "pro",
    testsAttempted: 45,
    averageScore: 78,
    totalTime: "128h 45m",
    lastActive: "2 hours ago",
    progress: 72,
    subjects: [
      { name: "General Studies", score: 82, testsAttempted: 15 },
      { name: "Reasoning", score: 75, testsAttempted: 12 },
      { name: "Mathematics", score: 68, testsAttempted: 10 },
      { name: "English", score: 85, testsAttempted: 8 },
    ],
  },
  {
    id: "s2",
    name: "Priya Singh",
    email: "priya.singh@example.com",
    phone: "+91 9876543211",
    enrolledDate: "2025-09-20",
    plan: "pro",
    testsAttempted: 62,
    averageScore: 85,
    totalTime: "156h 30m",
    lastActive: "30 minutes ago",
    progress: 88,
    subjects: [
      { name: "General Studies", score: 88, testsAttempted: 20 },
      { name: "Reasoning", score: 82, testsAttempted: 18 },
      { name: "Mathematics", score: 80, testsAttempted: 14 },
      { name: "English", score: 90, testsAttempted: 10 },
    ],
  },
  {
    id: "s3",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    phone: "+91 9876543212",
    enrolledDate: "2025-11-01",
    plan: "basic",
    testsAttempted: 28,
    averageScore: 65,
    totalTime: "72h 15m",
    lastActive: "1 day ago",
    progress: 45,
    subjects: [
      { name: "General Studies", score: 70, testsAttempted: 10 },
      { name: "Reasoning", score: 62, testsAttempted: 8 },
      { name: "Mathematics", score: 58, testsAttempted: 6 },
      { name: "English", score: 68, testsAttempted: 4 },
    ],
  },
  {
    id: "s4",
    name: "Sneha Verma",
    email: "sneha.verma@example.com",
    phone: "+91 9876543213",
    enrolledDate: "2025-08-10",
    plan: "pro",
    testsAttempted: 78,
    averageScore: 92,
    totalTime: "198h 20m",
    lastActive: "1 hour ago",
    progress: 95,
    subjects: [
      { name: "General Studies", score: 94, testsAttempted: 25 },
      { name: "Reasoning", score: 90, testsAttempted: 22 },
      { name: "Mathematics", score: 88, testsAttempted: 18 },
      { name: "English", score: 96, testsAttempted: 13 },
    ],
  },
  {
    id: "s5",
    name: "Vikash Yadav",
    email: "vikash.yadav@example.com",
    phone: "+91 9876543214",
    enrolledDate: "2025-12-05",
    plan: "free",
    testsAttempted: 12,
    averageScore: 55,
    totalTime: "24h 10m",
    lastActive: "3 days ago",
    progress: 18,
    subjects: [
      { name: "General Studies", score: 58, testsAttempted: 5 },
      { name: "Reasoning", score: 52, testsAttempted: 4 },
      { name: "Mathematics", score: 50, testsAttempted: 2 },
      { name: "English", score: 60, testsAttempted: 1 },
    ],
  },
  {
    id: "s6",
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    phone: "+91 9876543215",
    enrolledDate: "2025-07-22",
    plan: "pro",
    testsAttempted: 95,
    averageScore: 88,
    totalTime: "245h 55m",
    lastActive: "15 minutes ago",
    progress: 92,
    subjects: [
      { name: "General Studies", score: 90, testsAttempted: 30 },
      { name: "Reasoning", score: 86, testsAttempted: 28 },
      { name: "Mathematics", score: 85, testsAttempted: 22 },
      { name: "English", score: 92, testsAttempted: 15 },
    ],
  },
]

export const mockTests: Test[] = [
  // Full Length Exams
  {
    id: "t1",
    title: "HSSC CET Full Mock Test 1",
    category: "exam",
    questions: 100,
    duration: "90 min",
    difficulty: "hard",
    attempts: 2456,
    avgScore: 68,
  },
  {
    id: "t2",
    title: "HSSC CET Full Mock Test 2",
    category: "exam",
    questions: 100,
    duration: "90 min",
    difficulty: "hard",
    attempts: 1890,
    avgScore: 65,
  },
  {
    id: "t3",
    title: "HSSC CET Full Mock Test 3",
    category: "exam",
    questions: 100,
    duration: "90 min",
    difficulty: "hard",
    attempts: 1245,
    avgScore: 70,
  },
  {
    id: "t4",
    title: "Previous Year Paper 2024",
    category: "exam",
    questions: 100,
    duration: "90 min",
    difficulty: "hard",
    attempts: 3200,
    avgScore: 72,
  },
  {
    id: "t5",
    title: "Previous Year Paper 2023",
    category: "exam",
    questions: 100,
    duration: "90 min",
    difficulty: "hard",
    attempts: 2800,
    avgScore: 74,
  },

  // Subject-wise Tests
  {
    id: "t6",
    title: "General Studies Complete",
    category: "subject",
    subject: "General Studies",
    questions: 50,
    duration: "45 min",
    difficulty: "medium",
    attempts: 1567,
    avgScore: 72,
  },
  {
    id: "t7",
    title: "Reasoning Aptitude",
    category: "subject",
    subject: "Reasoning",
    questions: 40,
    duration: "40 min",
    difficulty: "medium",
    attempts: 1890,
    avgScore: 68,
  },
  {
    id: "t8",
    title: "Quantitative Aptitude",
    category: "subject",
    subject: "Mathematics",
    questions: 40,
    duration: "45 min",
    difficulty: "hard",
    attempts: 1456,
    avgScore: 62,
  },
  {
    id: "t9",
    title: "English Language",
    category: "subject",
    subject: "English",
    questions: 30,
    duration: "30 min",
    difficulty: "easy",
    attempts: 2100,
    avgScore: 78,
  },
  {
    id: "t10",
    title: "Hindi Language",
    category: "subject",
    subject: "Hindi",
    questions: 30,
    duration: "30 min",
    difficulty: "easy",
    attempts: 1800,
    avgScore: 80,
  },
  {
    id: "t11",
    title: "Computer Knowledge",
    category: "subject",
    subject: "Computer",
    questions: 25,
    duration: "25 min",
    difficulty: "medium",
    attempts: 1234,
    avgScore: 75,
  },
  {
    id: "t12",
    title: "Current Affairs 2025",
    category: "subject",
    subject: "Current Affairs",
    questions: 50,
    duration: "30 min",
    difficulty: "medium",
    attempts: 2567,
    avgScore: 70,
  },

  // Topic-wise Tests
  {
    id: "t13",
    title: "Indian History",
    category: "topic",
    subject: "General Studies",
    topic: "History",
    questions: 25,
    duration: "20 min",
    difficulty: "medium",
    attempts: 890,
    avgScore: 74,
  },
  {
    id: "t14",
    title: "Indian Geography",
    category: "topic",
    subject: "General Studies",
    topic: "Geography",
    questions: 25,
    duration: "20 min",
    difficulty: "medium",
    attempts: 756,
    avgScore: 72,
  },
  {
    id: "t15",
    title: "Indian Polity",
    category: "topic",
    subject: "General Studies",
    topic: "Polity",
    questions: 25,
    duration: "20 min",
    difficulty: "medium",
    attempts: 678,
    avgScore: 70,
  },
  {
    id: "t16",
    title: "Haryana GK",
    category: "topic",
    subject: "General Studies",
    topic: "Haryana GK",
    questions: 30,
    duration: "25 min",
    difficulty: "medium",
    attempts: 1456,
    avgScore: 68,
  },
  {
    id: "t17",
    title: "Blood Relations",
    category: "topic",
    subject: "Reasoning",
    topic: "Blood Relations",
    questions: 20,
    duration: "15 min",
    difficulty: "easy",
    attempts: 567,
    avgScore: 78,
  },
  {
    id: "t18",
    title: "Coding-Decoding",
    category: "topic",
    subject: "Reasoning",
    topic: "Coding-Decoding",
    questions: 20,
    duration: "15 min",
    difficulty: "medium",
    attempts: 489,
    avgScore: 72,
  },
  {
    id: "t19",
    title: "Number Series",
    category: "topic",
    subject: "Mathematics",
    topic: "Number Series",
    questions: 20,
    duration: "20 min",
    difficulty: "hard",
    attempts: 423,
    avgScore: 65,
  },
  {
    id: "t20",
    title: "Percentage & Profit Loss",
    category: "topic",
    subject: "Mathematics",
    topic: "Percentage",
    questions: 20,
    duration: "20 min",
    difficulty: "medium",
    attempts: 512,
    avgScore: 68,
  },
]

export const mockTestResults: TestResult[] = [
  {
    id: "r1",
    testId: "t1",
    testTitle: "HSSC CET Full Mock Test 1",
    date: "2025-12-28",
    score: 78,
    totalQuestions: 100,
    correctAnswers: 78,
    wrongAnswers: 15,
    unattempted: 7,
    timeTaken: "85 min",
    rank: 156,
    percentile: 92,
  },
  {
    id: "r2",
    testId: "t6",
    testTitle: "General Studies Complete",
    date: "2025-12-26",
    score: 82,
    totalQuestions: 50,
    correctAnswers: 41,
    wrongAnswers: 6,
    unattempted: 3,
    timeTaken: "42 min",
    rank: 89,
    percentile: 94,
  },
  {
    id: "r3",
    testId: "t7",
    testTitle: "Reasoning Aptitude",
    date: "2025-12-24",
    score: 75,
    totalQuestions: 40,
    correctAnswers: 30,
    wrongAnswers: 8,
    unattempted: 2,
    timeTaken: "38 min",
    rank: 234,
    percentile: 88,
  },
  {
    id: "r4",
    testId: "t13",
    testTitle: "Indian History",
    date: "2025-12-22",
    score: 88,
    totalQuestions: 25,
    correctAnswers: 22,
    wrongAnswers: 2,
    unattempted: 1,
    timeTaken: "18 min",
    rank: 45,
    percentile: 96,
  },
  {
    id: "r5",
    testId: "t2",
    testTitle: "HSSC CET Full Mock Test 2",
    date: "2025-12-20",
    score: 72,
    totalQuestions: 100,
    correctAnswers: 72,
    wrongAnswers: 20,
    unattempted: 8,
    timeTaken: "88 min",
    rank: 289,
    percentile: 85,
  },
]

export const analyticsData = {
  totalStudents: 12456,
  activeStudents: 8934,
  totalTests: 156,
  totalAttempts: 89234,
  revenue: 1245600,
  averageScore: 72,
  passRate: 78,
  completionRate: 85,

  monthlySignups: [
    { month: "Jul", count: 1200 },
    { month: "Aug", count: 1450 },
    { month: "Sep", count: 1890 },
    { month: "Oct", count: 2100 },
    { month: "Nov", count: 2456 },
    { month: "Dec", count: 2890 },
  ],

  testAttemptsByCategory: [
    { category: "Full Exams", attempts: 35000 },
    { category: "Subject Tests", attempts: 32000 },
    { category: "Topic Tests", attempts: 22234 },
  ],

  subjectPerformance: [
    { subject: "General Studies", avgScore: 74 },
    { subject: "Reasoning", avgScore: 70 },
    { subject: "Mathematics", avgScore: 65 },
    { subject: "English", avgScore: 78 },
    { subject: "Hindi", avgScore: 80 },
    { subject: "Current Affairs", avgScore: 72 },
  ],

  recentActivity: [
    { type: "signup", message: "New student Rohit Kumar enrolled", time: "5 min ago" },
    { type: "test", message: "156 students attempted Mock Test 1", time: "1 hour ago" },
    { type: "payment", message: "Pro plan subscription by Ankit Singh", time: "2 hours ago" },
    { type: "signup", message: "New student Kavita Devi enrolled", time: "3 hours ago" },
    { type: "test", message: "89 students completed Reasoning Test", time: "4 hours ago" },
  ],
}
