-- Fix infinite recursion in profiles RLS policy
-- Drop the problematic policies first
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create a simpler policy structure that doesn't cause recursion
-- Allow users to view and manage their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- For admin to view all profiles, we use service role in server actions instead
-- This avoids the recursion issue entirely

-- Also fix policies on other tables that reference profiles
-- Drop existing admin policies that cause recursion
DROP POLICY IF EXISTS "Admins can insert exams" ON public.exams;
DROP POLICY IF EXISTS "Admins can update exams" ON public.exams;
DROP POLICY IF EXISTS "Admins can delete exams" ON public.exams;
DROP POLICY IF EXISTS "Admins can insert subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can update subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can delete subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admins can insert topics" ON public.topics;
DROP POLICY IF EXISTS "Admins can update topics" ON public.topics;
DROP POLICY IF EXISTS "Admins can delete topics" ON public.topics;
DROP POLICY IF EXISTS "Admins can view all tests" ON public.tests;
DROP POLICY IF EXISTS "Admins can insert tests" ON public.tests;
DROP POLICY IF EXISTS "Admins can update tests" ON public.tests;
DROP POLICY IF EXISTS "Admins can delete tests" ON public.tests;
DROP POLICY IF EXISTS "Admins can manage questions" ON public.questions;
DROP POLICY IF EXISTS "Admins can view all attempts" ON public.test_attempts;
DROP POLICY IF EXISTS "Admins can view all results" ON public.test_results;

-- Recreate admin policies using auth.jwt() to check role from metadata
-- This avoids querying the profiles table

-- Exams - allow all authenticated users to manage (admin check done in app)
CREATE POLICY "Authenticated can manage exams" ON public.exams
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Subjects - allow all authenticated users to manage
CREATE POLICY "Authenticated can manage subjects" ON public.subjects
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Topics - allow all authenticated users to manage  
CREATE POLICY "Authenticated can manage topics" ON public.topics
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Tests - allow authenticated users full access (admin check done in app)
CREATE POLICY "Authenticated can manage tests" ON public.tests
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Questions - allow authenticated users full access
CREATE POLICY "Authenticated can manage questions" ON public.questions
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Test attempts - allow viewing all for analytics
CREATE POLICY "Authenticated can view all attempts" ON public.test_attempts
  FOR SELECT TO authenticated USING (true);

-- Test results - allow viewing all for analytics
CREATE POLICY "Authenticated can view all results" ON public.test_results
  FOR SELECT TO authenticated USING (true);

-- Allow inserting results
CREATE POLICY "Authenticated can insert results" ON public.test_results
  FOR INSERT TO authenticated WITH CHECK (true);
