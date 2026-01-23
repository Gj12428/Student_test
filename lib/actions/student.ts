"use server";

import { getDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth-server";
import { logger } from "@/lib/logger";
import { Question } from "@/lib/types/question"

const db = getDB();

/* =========================
   STUDENT DASHBOARD
========================= */
export async function getStudentDashboard() {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const [results]: any = await db!.query(
      `
      SELECT tr.*, t.title, t.test_type,
             s.name AS subject_name,
             tp.name AS topic_name
      FROM test_results tr
      JOIN tests t ON t.id = tr.test_id
      LEFT JOIN subjects s ON s.id = t.subject_id
      LEFT JOIN topics tp ON tp.id = t.topic_id
      WHERE tr.user_id = ?
      ORDER BY tr.created_at DESC
      `,
      [user.id]
    );

    const testsAttempted = results.length;

    const averageScore = testsAttempted
      ? Math.round(
          results.reduce(
            (s: number, r: any) =>
              s + (r.total_questions ? (r.score / r.total_questions) * 100 : 0),
            0
          ) / testsAttempted
        )
      : 0;

    const bestScore = testsAttempted
      ? Math.max(
          ...results.map((r: any) =>
            r.total_questions ? (r.score / r.total_questions) * 100 : 0
          )
        )
      : 0;

    const totalTime = results.reduce(
      (s: number, r: any) => s + (r.time_taken || 0),
      0
    );

    return {
      user,
      stats: {
        testsAttempted,
        averageScore,
        bestScore,
        totalTime,
      },
      recentResults: results.slice(0, 3),
    };
  } catch (error) {
    logger.error("[getStudentDashboard] failed", error);
    return null;
  }
}

/* =========================
   STUDENT RESULTS
========================= */
export async function getStudentResults() {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const [rows]: any = await db!.query(
      `
      SELECT tr.*, t.title, t.test_type
      FROM test_results tr
      JOIN tests t ON t.id = tr.test_id
      WHERE tr.user_id = ?
      ORDER BY tr.created_at DESC
      `,
      [user.id]
    );

    return rows;
  } catch (error) {
    logger.error("[getStudentResults] failed", error);
    return [];
  }
}

/* =========================
   SUBJECTS & TOPICS
========================= */
export async function getSubjectsAndTopics() {
  try {
    const [subjects]: any = await db!.query(
      `SELECT id, name FROM subjects ORDER BY name`
    );
    const [topics]: any = await db!.query(
      `SELECT id, name, subject_id FROM topics ORDER BY name`
    );

    return { subjects, topics };
  } catch (error) {
    logger.error("[getSubjectsAndTopics] failed", error);
    return { subjects: [], topics: [] };
  }
}

/* =========================
   AVAILABLE TESTS
========================= */
export async function getAvailableTests() {
  try {
    const [tests]: any = await db!.query(`
      SELECT t.*,
        (SELECT COUNT(*) FROM questions q WHERE q.test_id = t.id) AS questions_count
      FROM tests t
      WHERE t.is_active = 1
      ORDER BY t.created_at DESC
    `);

    return tests;
  } catch (error) {
    logger.error("[getAvailableTests] failed", error);
    return [];
  }
}

/* =========================
   START TEST
========================= */
export async function startTestAttempt(testId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false };

    const [[existing]]: any = await db!.query(
      `SELECT * FROM test_attempts WHERE test_id=? AND user_id=? AND status='in_progress'`,
      [testId, user.id]
    );

    if (existing) return { success: true, attempt: existing };

    const [res]: any = await db!.query(
      `INSERT INTO test_attempts (test_id, user_id, status)
       VALUES (?, ?, 'in_progress')`,
      [testId, user.id]
    );

    return { success: true, attempt: { id: res.insertId } };
  } catch (error) {
    logger.error("[startTestAttempt] failed", error);
    return { success: false };
  }
}

/* =========================
   SUBMIT ANSWER
========================= */
export async function submitAnswer(
  attemptId: string,
  questionId: string,
  answer: string | null,
  timeSpent: number
) {
  try {
    const [[q]]: any = await db!.query(
      `SELECT correct_answer FROM questions WHERE id=?`,
      [questionId]
    );

    const isCorrect =
      answer?.toLowerCase() === q.correct_answer?.toLowerCase();

    const [[existing]]: any = await db!.query(
      `SELECT id FROM user_answers WHERE attempt_id=? AND question_id=?`,
      [attemptId, questionId]
    );

    if (existing) {
      await db!.query(
        `UPDATE user_answers
         SET selected_answer=?, is_correct=?, time_spent=?
         WHERE id=?`,
        [answer, isCorrect, timeSpent, existing.id]
      );
    } else {
      await db!.query(
        `INSERT INTO user_answers
         (attempt_id, question_id, selected_answer, is_correct, time_spent)
         VALUES (?, ?, ?, ?, ?)`,
        [attemptId, questionId, answer, isCorrect, timeSpent]
      );
    }

    return { success: true, isCorrect };
  } catch (error) {
    logger.error("[submitAnswer] failed", error);
    return { success: false };
  }
}

/* =========================
   COMPLETE TEST
========================= */
export async function completeTest(attemptId: string, timeTaken: number) {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false };

    const [[attempt]]: any = await db!.query(
      `SELECT * FROM test_attempts WHERE id=?`,
      [attemptId]
    );

    const [[count]]: any = await db!.query(
      `SELECT COUNT(*) AS total FROM questions WHERE test_id=?`,
      [attempt.test_id]
    );

    const [answers]: any = await db!.query(
      `SELECT * FROM user_answers WHERE attempt_id=?`,
      [attemptId]
    );

    const correct = answers.filter((a: any) => a.is_correct).length;
    const wrong = answers.filter(
      (a: any) => !a.is_correct && a.selected_answer
    ).length;

    const unanswered = count.total - answers.length;
    const percentage = count.total
      ? Math.round((correct / count.total) * 100)
      : 0;

    await db!.query(
      `UPDATE test_attempts SET status='completed', time_taken=? WHERE id=?`,
      [timeTaken, attemptId]
    );

    await db!.query(
      `INSERT INTO test_results
       (attempt_id, user_id, test_id, total_questions, correct_answers,
        wrong_answers, unanswered, score, percentage, time_taken)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        attemptId,
        user.id,
        attempt.test_id,
        count.total,
        correct,
        wrong,
        unanswered,
        correct,
        percentage,
        timeTaken,
      ]
    );

    revalidatePath("/student/results");

    return { success: true };
  } catch (error) {
    logger.error("[completeTest] failed", error);
    return { success: false };
  }
}

/* =========================
   EXAM CATEGORIES
========================= */
export async function getExamCategories() {
  try {
    const [rows]: any = await db!.query(
      `SELECT id, name, slug FROM exam_categories ORDER BY name`
    );
    return rows;
  } catch (error) {
    logger.error("[getExamCategories] failed", error);
    return [];
  }
}

export interface PracticeQuestion {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: "a" | "b" | "c" | "d"
  explanation: string | null
}

/**
 * REAL DB BASED PRACTICE QUESTIONS
 */
export async function getPracticeQuestions(
  examId: string,
  topicIds: string[],        // abhi use nahi ho raha
  questionCount: number,
  difficulty: string         // future use
): Promise<Question[]>{
  try {
    const limit = Number(questionCount) || 20

    const [rows] = await db!.query<any[]>(
      `
      SELECT
        q.id,
        q.question_text,
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d,
        q.correct_answer,
        q.explanation
      FROM questions q
      WHERE q.test_id = ?
      ORDER BY RAND()
      LIMIT ?
      `,
      [examId, limit]
    )

    return rows.map((q) => ({
      id: String(q.id),
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
    }))
  } catch (error) {
    console.error("getPracticeQuestions DB error:", error)
    return []
  }
}

