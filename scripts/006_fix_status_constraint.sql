-- Drop the existing check constraint and add a new one that includes 'paused'
ALTER TABLE test_attempts DROP CONSTRAINT IF EXISTS test_attempts_status_check;

-- Add new check constraint with 'paused' status
ALTER TABLE test_attempts ADD CONSTRAINT test_attempts_status_check 
CHECK (status IN ('in_progress', 'completed', 'paused'));
