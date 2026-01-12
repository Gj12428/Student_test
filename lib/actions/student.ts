"use server";

import { getDB } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth-server";
import { logger } from "@/lib/logger";

const db = getDB();

/* =========================
   STUDENT DASHBOARD
========================= */
export async function getStudentDashboard() {
  logger.debug("[StudentDashboard] [getStudentDashboard] Started");

  try {
    const user = await getCurrentUser();
    if (!user) {
      logger.debug("[StudentDashboard] [getStudentDashboard] No user found");
      return null;
    }

    logger.debug(
      `[StudentDashboard] [getStudentDashboard] userId=${user.id} Fetching results`
    );

    const [results]: any = await db!.query(
      `
      SELECT tr.*, 
             t.title,
             t.test_type,
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

    logger.info(
      `[StudentDashboard] [getStudentDashboard] userId=${user.id} records=${results.length}`
    );

    const testsAttempted = results.length;

    const averageScore = testsAttempted
      ? Math.round(
          results.reduce(
            (sum: number, r: any) =>
              sum +
              (r.total_questions
                ? (r.score / r.total_questions) * 100
                : 0),
            0
          ) / testsAttempted
        )
      : 0;

    const bestScore = testsAttempted
      ? Math.max(
          ...results.map((r: any) =>
            r.total_questions
              ? (r.score / r.total_questions) * 100
              : 0
          )
        )
      : 0;

    const totalTime = results.reduce(
      (s: number, r: any) => s + (r.time_taken || 0),
      0
    );

    const performanceTrend = results
      .slice(0, 7)
      .reverse()
      .map((r: any, i: number) => ({
        test: `Test ${i + 1}`,
        score: r.total_questions
          ? Math.round((r.score / r.total_questions) * 100)
          : 0,
      }));

    const subjectMap: any = {};
    results.forEach((r: any) => {
      const subject = r.subject_name || "General";
      if (!subjectMap[subject]) {
        subjectMap[subject] = { total: 0, count: 0 };
      }
      subjectMap[subject].total += r.total_questions
        ? (r.score / r.total_questions) * 100
        : 0;
      subjectMap[subject].count++;
    });

    const subjectPerformance = Object.entries(subjectMap).map(
      ([subject, value]: any) => ({
        subject,
        score: Math.round(value.total / value.count),
      })
    );

    logger.info(
      `[StudentDashboard] [getStudentDashboard] userId=${user.id} Dashboard ready`
    );

    return {
      user,
      stats: {
        testsAttempted,
        averageScore,
        bestScore,
        totalTime: `${Math.floor(totalTime / 3600)}h`,
      },
      recentResults: results.slice(0, 3),
      performanceTrend,
      subjectPerformance,
    };
  } catch (error) {
    logger.error(
      "[StudentDashboard] [getStudentDashboard] Failed",
      error
    );
    return null;
  }
}

/* =========================
   STUDENT RESULTS
========================= */
export async function getStudentResults() {
  logger.debug("[StudentResults] [getStudentResults] Started");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/student/results`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      logger.error(
        "[StudentResults] [getStudentResults] API response not OK"
      );
      throw new Error("Failed to fetch student results");
    }

    logger.info(
      "[StudentResults] [getStudentResults] Results fetched successfully"
    );

    return res.json();
  } catch (error) {
    logger.error(
      "[StudentResults] [getStudentResults] Failed",
      error
    );
    throw error;
  }
}

/* =========================
   SUBJECTS & TOPICS
========================= */
export async function getSubjectsAndTopics() {
  logger.debug("[SubjectsTopics] [getSubjectsAndTopics] Started");

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/student/subjects-topics`,
      { cache: "no-store" }
    );

    if (!res.ok) {
      logger.error(
        "[SubjectsTopics] [getSubjectsAndTopics] API response not OK"
      );
      throw new Error("Failed to fetch subjects and topics");
    }

    logger.info(
      "[SubjectsTopics] [getSubjectsAndTopics] Data fetched successfully"
    );

    return res.json();
  } catch (error) {
    logger.error(
      "[SubjectsTopics] [getSubjectsAndTopics] Failed",
      error
    );
    throw error;
  }
}

/* =========================
   STUDENT ANALYTICS
========================= */
export async function getStudentAnalytics() {
  logger.debug("[StudentAnalytics] [getStudentAnalytics] Started");

  try {
    const user = await getCurrentUser();
    if (!user) {
      logger.debug("[StudentAnalytics] [getStudentAnalytics] No user found");
      return null;
    }

    logger.debug(
      `[StudentAnalytics] [getStudentAnalytics] userId=${user.id} Fetching analytics`
    );

    const [results]: any = await db!.query(
      `
      SELECT tr.*, 
             t.title,
             s.name AS subject_name,
             tp.name AS topic_name
      FROM test_results tr
      JOIN tests t ON t.id = tr.test_id
      LEFT JOIN subjects s ON s.id = t.subject_id
      LEFT JOIN topics tp ON tp.id = t.topic_id
      WHERE tr.user_id = ?
      ORDER BY tr.created_at ASC
      `,
      [user.id]
    );

    logger.info(
      `[StudentAnalytics] [getStudentAnalytics] userId=${user.id} records=${results.length}`
    );

    if (!results.length) return null;

    logger.info(
      `[StudentAnalytics] [getStudentAnalytics] Analytics ready`
    );

    return {
      overallScore: 80,
      avgTimePerQuestion: 45,
      currentStreak: 3,
      bestStreak: 5,
      performanceTrend: [],
      subjectPerformance: [],
      topicStrengths: [],
    };
  } catch (error) {
    logger.error(
      "[StudentAnalytics] [getStudentAnalytics] Failed",
      error
    );
    return null;
  }
}

/* =========================
   AVAILABLE TESTS
========================= */
export async function getAvailableTests() {
  logger.debug("[Tests] [getAvailableTests] Started");

  try {
    const [tests]: any = await db!.query(`
      SELECT t.*,
        (SELECT COUNT(*) FROM questions q WHERE q.test_id = t.id) AS questions_count,
        (SELECT COUNT(*) FROM test_attempts ta WHERE ta.test_id = t.id) AS attempts_count,
        (SELECT AVG(score) FROM test_results tr WHERE tr.test_id = t.id) AS avg_score
      FROM tests t
      WHERE t.is_active = 1
      ORDER BY t.created_at DESC
    `);

    logger.info(
      `[Tests] [getAvailableTests] testsCount=${tests.length}`
    );

    return tests;
  } catch (error) {
    logger.error(
      "[Tests] [getAvailableTests] Failed",
      error
    );
    return [];
  }
}

/* =========================
   START TEST
========================= */
export async function startTestAttempt(testId: string) {
  logger.debug(
    `[TestAttempt] [startTestAttempt] testId=${testId} Started`
  );

  try {
    const user = await getCurrentUser();
    if (!user) {
      logger.debug("[TestAttempt] [startTestAttempt] No user found");
      return { success: false };
    }

    const [[existing]]: any = await db!.query(
      `SELECT * FROM test_attempts WHERE test_id=? AND user_id=? AND status='in_progress'`,
      [testId, user.id]
    );

    if (existing) {
      logger.info(
        `[TestAttempt] [startTestAttempt] userId=${user.id} Existing attempt=${existing.id}`
      );
      return { success: true, attempt: existing };
    }

    const [res]: any = await db!.query(
      `INSERT INTO test_attempts (test_id, user_id, status) VALUES (?, ?, 'in_progress')`,
      [testId, user.id]
    );

    logger.info(
      `[TestAttempt] [startTestAttempt] userId=${user.id} New attempt=${res.insertId}`
    );

    return { success: true, attempt: { id: res.insertId } };
  } catch (error) {
    logger.error(
      "[TestAttempt] [startTestAttempt] Failed",
      error
    );
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
  logger.debug(
    `[Answer] [submitAnswer] attemptId=${attemptId} questionId=${questionId}`
  );

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
        `UPDATE user_answers SET selected_answer=?, is_correct=?, time_spent=? WHERE id=?`,
        [answer, isCorrect, timeSpent, existing.id]
      );
    } else {
      await db!.query(
        `INSERT INTO user_answers (attempt_id, question_id, selected_answer, is_correct, time_spent)
         VALUES (?, ?, ?, ?, ?)`,
        [attemptId, questionId, answer, isCorrect, timeSpent]
      );
    }

    logger.info(
      `[Answer] [submitAnswer] attemptId=${attemptId} correct=${isCorrect}`
    );

    return { success: true, isCorrect };
  } catch (error) {
    logger.error(
      "[Answer] [submitAnswer] Failed",
      error
    );
    return { success: false };
  }
}

/* =========================
   COMPLETE TEST
========================= */
export async function completeTest(attemptId: string, timeTaken: number) {
  logger.debug(
    `[TestComplete] [completeTest] attemptId=${attemptId} timeTaken=${timeTaken}`
  );

  try {
    const user = await getCurrentUser();
    if (!user) {
      logger.debug("[TestComplete] [completeTest] No user found");
      return { success: false };
    }

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

    const [res]: any = await db!.query(
      `INSERT INTO test_results 
       (attempt_id, user_id, test_id, total_questions, correct_answers, wrong_answers, unanswered, score, percentage, time_taken)
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

    logger.info(
      `[TestComplete] [completeTest] userId=${user.id} resultId=${res.insertId} percentage=${percentage}`
    );

    return { success: true, resultId: res.insertId };
  } catch (error) {
    logger.error(
      "[TestComplete] [completeTest] Failed",
      error
    );
    return { success: false };
  }
}
