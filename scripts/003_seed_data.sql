-- Seed initial exam types
INSERT INTO public.exams (name, description) VALUES
  ('HSSC CET', 'Haryana Staff Selection Commission Common Eligibility Test'),
  ('Group D', 'Group D Railway Recruitment'),
  ('Clerk', 'Clerk Level Examinations'),
  ('Police', 'Haryana Police Recruitment')
ON CONFLICT (name) DO NOTHING;

-- Seed subjects for HSSC CET
INSERT INTO public.subjects (name, exam_id)
SELECT s.name, e.id
FROM (VALUES 
  ('General Studies'),
  ('Reasoning'),
  ('Mathematics'),
  ('English'),
  ('Hindi'),
  ('Computer'),
  ('Current Affairs')
) AS s(name)
CROSS JOIN public.exams e
WHERE e.name = 'HSSC CET'
ON CONFLICT (name, exam_id) DO NOTHING;

-- Seed topics for General Studies
INSERT INTO public.topics (name, subject_id)
SELECT t.name, s.id
FROM (VALUES 
  ('History'),
  ('Geography'),
  ('Polity'),
  ('Economics'),
  ('Haryana GK'),
  ('Science')
) AS t(name)
CROSS JOIN public.subjects s
JOIN public.exams e ON s.exam_id = e.id
WHERE s.name = 'General Studies' AND e.name = 'HSSC CET'
ON CONFLICT (name, subject_id) DO NOTHING;

-- Seed topics for Reasoning
INSERT INTO public.topics (name, subject_id)
SELECT t.name, s.id
FROM (VALUES 
  ('Blood Relations'),
  ('Coding-Decoding'),
  ('Direction Sense'),
  ('Syllogism'),
  ('Analogy'),
  ('Series')
) AS t(name)
CROSS JOIN public.subjects s
JOIN public.exams e ON s.exam_id = e.id
WHERE s.name = 'Reasoning' AND e.name = 'HSSC CET'
ON CONFLICT (name, subject_id) DO NOTHING;

-- Seed topics for Mathematics
INSERT INTO public.topics (name, subject_id)
SELECT t.name, s.id
FROM (VALUES 
  ('Number System'),
  ('Percentage'),
  ('Profit & Loss'),
  ('Time & Work'),
  ('Time & Distance'),
  ('Algebra')
) AS t(name)
CROSS JOIN public.subjects s
JOIN public.exams e ON s.exam_id = e.id
WHERE s.name = 'Mathematics' AND e.name = 'HSSC CET'
ON CONFLICT (name, subject_id) DO NOTHING;
