-- Drop existing indexes if they exist (to avoid errors)
DROP INDEX IF EXISTS idx_contacts_email;
DROP INDEX IF EXISTS idx_contacts_status;
DROP INDEX IF EXISTS idx_contacts_created_at;
DROP INDEX IF EXISTS idx_feedback_user_id;
DROP INDEX IF EXISTS idx_feedback_test_id;
DROP INDEX IF EXISTS idx_feedback_created_at;

-- Create contacts table if not exists
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create test feedback table if not exists
CREATE TABLE IF NOT EXISTS test_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_id UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  attempt_id UUID NOT NULL REFERENCES test_attempts(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  difficulty_level TEXT CHECK (difficulty_level IN ('too_easy', 'easy', 'medium', 'hard', 'too_hard')),
  comments TEXT,
  time_sufficient BOOLEAN,
  question_quality TEXT CHECK (question_quality IN ('poor', 'fair', 'good', 'excellent')),
  would_recommend BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recreate indexes
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_created_at ON contacts(created_at DESC);
CREATE INDEX idx_feedback_user_id ON test_feedback(user_id);
CREATE INDEX idx_feedback_test_id ON test_feedback(test_id);
CREATE INDEX idx_feedback_created_at ON test_feedback(created_at DESC);
