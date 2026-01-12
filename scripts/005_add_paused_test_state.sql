-- Add columns to test_attempts for storing paused state
ALTER TABLE test_attempts ADD COLUMN IF NOT EXISTS answers jsonb DEFAULT '{}';
ALTER TABLE test_attempts ADD COLUMN IF NOT EXISTS flagged jsonb DEFAULT '[]';
ALTER TABLE test_attempts ADD COLUMN IF NOT EXISTS current_question integer DEFAULT 0;
ALTER TABLE test_attempts ADD COLUMN IF NOT EXISTS time_remaining integer;

-- Update status to allow 'paused' value
-- Status can be: 'in_progress', 'paused', 'completed'
