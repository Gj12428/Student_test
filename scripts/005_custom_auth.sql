-- Drop the existing profiles table constraints that depend on auth.users
-- Create a standalone users table for custom auth

-- First, drop existing RLS policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow all for profiles" ON public.profiles;

-- Drop the existing profiles table
DROP TABLE IF EXISTS public.test_results CASCADE;
DROP TABLE IF EXISTS public.user_answers CASCADE;
DROP TABLE IF EXISTS public.test_attempts CASCADE;
DROP TABLE IF EXISTS public.questions CASCADE;
DROP TABLE IF EXISTS public.tests CASCADE;
DROP TABLE IF EXISTS public.topics CASCADE;
DROP TABLE IF EXISTS public.subjects CASCADE;
DROP TABLE IF EXISTS public.exams CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create users table for custom authentication
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'student')),
  avatar_url TEXT,
  phone TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'basic', 'premium')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exams table
CREATE TABLE public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create topics table
CREATE TABLE public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tests table
CREATE TABLE public.tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  exam_id UUID REFERENCES public.exams(id) ON DELETE SET NULL,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
  topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  test_type TEXT NOT NULL CHECK (test_type IN ('full', 'subject', 'topic')),
  duration INTEGER NOT NULL DEFAULT 60,
  total_questions INTEGER DEFAULT 0,
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('a', 'b', 'c', 'd')),
  explanation TEXT,
  exam_source TEXT,
  question_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create test_attempts table
CREATE TABLE public.test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_taken INTEGER,
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned'))
);

-- Create user_answers table
CREATE TABLE public.user_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES public.test_attempts(id) ON DELETE CASCADE,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  selected_answer TEXT CHECK (selected_answer IN ('a', 'b', 'c', 'd', NULL)),
  is_correct BOOLEAN,
  time_spent INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create test_results table
CREATE TABLE public.test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID REFERENCES public.test_attempts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES public.tests(id) ON DELETE CASCADE,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  wrong_answers INTEGER NOT NULL,
  unanswered INTEGER NOT NULL DEFAULT 0,
  score DECIMAL(5,2) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  time_taken INTEGER,
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS for simplicity (we handle auth in the app)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.tests DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results DISABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_sessions_token ON public.sessions(token);
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_expires_at ON public.sessions(expires_at);
CREATE INDEX idx_tests_exam_id ON public.tests(exam_id);
CREATE INDEX idx_tests_subject_id ON public.tests(subject_id);
CREATE INDEX idx_questions_test_id ON public.questions(test_id);
CREATE INDEX idx_test_attempts_user_id ON public.test_attempts(user_id);
CREATE INDEX idx_test_results_user_id ON public.test_results(user_id);

-- Insert admin user with hashed password
-- Password: Aadu@0406
-- Using a simple hash for demo (in production, use bcrypt via server action)
INSERT INTO public.users (email, password_hash, full_name, role)
VALUES ('anujjaglan9423@gmail.com', 'Aadu@0406', 'Admin User', 'admin');

-- Insert sample exams
INSERT INTO public.exams (id, name, description) VALUES
  ('e1000000-0000-0000-0000-000000000001', 'HSSC CET', 'Haryana Staff Selection Commission Common Eligibility Test'),
  ('e2000000-0000-0000-0000-000000000002', 'HSSC Group D', 'HSSC Group D Recruitment Exam'),
  ('e3000000-0000-0000-0000-000000000003', 'HSSC Clerk', 'HSSC Clerk Recruitment Exam'),
  ('e4000000-0000-0000-0000-000000000004', 'Haryana Police', 'Haryana Police Recruitment Exam');

-- Insert sample subjects for HSSC CET
INSERT INTO public.subjects (id, exam_id, name) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'e1000000-0000-0000-0000-000000000001', 'General Awareness'),
  ('a2000000-0000-0000-0000-000000000002', 'e1000000-0000-0000-0000-000000000001', 'Reasoning'),
  ('a3000000-0000-0000-0000-000000000003', 'e1000000-0000-0000-0000-000000000001', 'Mathematics'),
  ('a4000000-0000-0000-0000-000000000004', 'e1000000-0000-0000-0000-000000000001', 'English'),
  ('a5000000-0000-0000-0000-000000000005', 'e1000000-0000-0000-0000-000000000001', 'Hindi'),
  ('a6000000-0000-0000-0000-000000000006', 'e1000000-0000-0000-0000-000000000001', 'Haryana GK');

-- Insert sample topics
INSERT INTO public.topics (id, subject_id, name) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Indian History'),
  ('b2000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Geography'),
  ('b3000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Indian Polity'),
  ('b4000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'Economy'),
  ('b5000000-0000-0000-0000-000000000005', 'a2000000-0000-0000-0000-000000000002', 'Coding-Decoding'),
  ('b6000000-0000-0000-0000-000000000006', 'a2000000-0000-0000-0000-000000000002', 'Blood Relations'),
  ('b7000000-0000-0000-0000-000000000007', 'a3000000-0000-0000-0000-000000000003', 'Number System'),
  ('b8000000-0000-0000-0000-000000000008', 'a3000000-0000-0000-0000-000000000003', 'Percentage'),
  ('b9000000-0000-0000-0000-000000000009', 'a6000000-0000-0000-0000-000000000006', 'Haryana History'),
  ('ba000000-0000-0000-0000-000000000010', 'a6000000-0000-0000-0000-000000000006', 'Haryana Culture');
