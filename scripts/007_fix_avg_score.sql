-- Check if there are any test_results with score > 100 (which would be wrong percentages)
-- and see what the actual data looks like
SELECT COUNT(*) as total_results, 
       COUNT(*) FILTER (WHERE score > 100) as wrong_scores,
       COUNT(*) FILTER (WHERE score <= 100) as correct_scores,
       AVG(score) as avg_score,
       AVG(total_questions) as avg_questions,
       MAX(score) as max_score,
       MIN(score) as min_score
FROM test_results;
