"use server";

import { getDB } from "@/lib/db"// Assuming you have a MySQL db instance
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth-server";

import { logger } from "@/lib/logger"; // Assuming this is your logger import

const db = getDB();

if (!db) {
  throw new Error("Database not initialized");
}

// Helper to format time ago
function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

// ===============================
// getAdminStats equivalent in MySQL
export async function getAdminStats() {
  try {
    const [studentsCountRows]: any = await db!.query(
      `SELECT COUNT(*) AS count FROM users WHERE role = ?`,
      ["student"]
    );

    const totalStudents = studentsCountRows[0]?.count || 0;

    const [testsCountRows]: any = await db!.query(
      `SELECT COUNT(*) AS count FROM tests`
    );
    const totalTests = testsCountRows[0]?.count || 0;

    const [attemptsCountRows]: any = await db!.query(
      `SELECT COUNT(*) AS count FROM test_attempts`
    );
    const totalAttempts = attemptsCountRows[0]?.count || 0;

    const [recentStudents]: any = await db!.query(
      `SELECT * FROM users WHERE role = ? ORDER BY created_at DESC LIMIT 5`,
      ["student"]
    );

    return {
      totalStudents,
      activeStudents: Math.floor(totalStudents * 0.7),
      totalTests,
      totalAttempts,
      recentStudents,
    };
  } catch (error: any) {
    logger.error("getAdminStats failed", {
      message: error.message,
      stack: error.stack,
    });
    return null;
  }
}


// ===============================
// getAllStudents with test_results join
// export async function getAllStudents() {
//   try {
//     // Get all students
//     const [students] = await db!.query(`SELECT * FROM users WHERE role = ? ORDER BY created_at DESC`, [
//       "student",
//     ]);

//     if (!(students as any[]).length) return [];

//     // For each student, get their test_results
//     const studentList = [];

//     for (const student of students as any[]) {
//       const [results] = await db!.query(
//         `SELECT score, total_questions, time_taken, created_at FROM test_results WHERE user_id = ?`,
//         [student.id]
//       );

//       const testsAttempted = (results as any[]).length;
//       const averageScore =
//         testsAttempted > 0
//           ? Math.round(
//               (results as any[]).reduce(
//                 (sum, r) => sum + ((r.score || 0) / (r.total_questions || 1)) * 100,
//                 0
//               ) / testsAttempted
//             )
//           : 0;
//       const totalTime = (results as any[]).reduce((sum, r) => sum + (r.time_taken || 0), 0);

//       let lastActive;
//       if (results.length > 0) {
//         lastActive = results
//           .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
//           .created_at;
//       } else {
//         lastActive = student.created_at;
//       }

//       studentList.push({
//         ...student,
//         name: student.full_name,
//         testsAttempted,
//         averageScore,
//         totalTime: `${Math.floor(totalTime / 3600)}h ${Math.floor((totalTime % 3600) / 60)}m`,
//         lastActive: formatTimeAgo(lastActive),
//         progress: Math.min(100, testsAttempted * 5),
//       });
//     }

//     return studentList;
//   } catch (error) {
//     logger.error("Error fetching all students:", error);
//     return [];
//   }
// }

export async function getAllStudents() {
  try {
    if (!db) {
      logger.error("❌ DB not initialized in getAllStudents");
      return [];
    }

    logger.info("➡️ Fetching all students");

    // 1️⃣ Fetch all students
    const [studentsResult] = await db.query(
      `SELECT * FROM users WHERE role = ? ORDER BY created_at DESC`,
      ["student"]
    );

    const students = studentsResult as any[];

    if (!students.length) {
      logger.info("ℹ️ No students found");
      return [];
    }

    const studentList = [];

    // 2️⃣ For each student, fetch test results
    for (const student of students) {
      const [resultsResult] = await db.query(
        `SELECT score, total_questions, time_taken, created_at
         FROM test_results
         WHERE user_id = ?`,
        [student.id]
      );

      const results = resultsResult as any[];

      const testsAttempted = results.length;

      const averageScore =
        testsAttempted > 0
          ? Math.round(
              results.reduce(
                (sum, r) =>
                  sum +
                  ((r.score || 0) / (r.total_questions || 1)) * 100,
                0
              ) / testsAttempted
            )
          : 0;

      const totalTimeSeconds = results.reduce(
        (sum, r) => sum + (r.time_taken || 0),
        0
      );

      const lastActive =
        results.length > 0
          ? results.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )[0].created_at
          : student.created_at;

      studentList.push({
        ...student,
        name: student.full_name,
        testsAttempted,
        averageScore,
        totalTime: `${Math.floor(totalTimeSeconds / 3600)}h ${Math.floor(
          (totalTimeSeconds % 3600) / 60
        )}m`,
        lastActive: formatTimeAgo(lastActive),
        progress: Math.min(100, testsAttempted * 5),
      });
    }

    logger.info("✅ getAllStudents completed", {
      totalStudents: studentList.length,
    });

    return studentList;
  } catch (error: any) {
    logger.error("🔥 Error in getAllStudents", {
      message: error.message,
      stack: error.stack,
    });
    return [];
  }
}

export async function getAdminAnalytics() {
  try {
    // Example analytics: count of students by month in last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const [rows] = await db!.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS student_count
       FROM users
       WHERE role = ? AND created_at >= ?
       GROUP BY month
       ORDER BY month ASC`,
      ["student", sixMonthsAgo.toISOString()]
    );

    logger.info("Fetched admin analytics data");

    return rows;
  } catch (error) {
    logger.error("Error in getAdminAnalytics:", error);
    return null;
  }
}

// ===============================
// getStudentDetails (with nested joins)
export async function getStudentDetails(studentId: string) {
  try {
    // Fetch student data
    const [students] = await db!.query(`SELECT * FROM users WHERE id = ? LIMIT 1`, [studentId]);
    if ((students as any[]).length === 0) return null;
    const student = (students as any)[0];

    // Fetch test_results with test, subject, topic info
    const [testResults] = await db!.query(
      `SELECT tr.*, t.title, t.test_type, s.name AS subject_name, top.name AS topic_name
       FROM test_results tr
       LEFT JOIN tests t ON tr.test_id = t.id
       LEFT JOIN subjects s ON t.subject_id = s.id
       LEFT JOIN topics top ON t.topic_id = top.id
       WHERE tr.user_id = ?`,
      [studentId]
    );

    student.test_results = testResults;

    return student;
  } catch (error) {
    logger.error("Error fetching student details:", error);
    return null;
  }
}

// ===============================
// getAllTests with related counts
export async function getAllTests() {
  try {
    // Get tests with joined exams, subjects, topics
    const [tests] = await db!.query(
      `SELECT t.*, e.name AS exam_name, s.name AS subject_name, top.name AS topic_name,
        (SELECT COUNT(*) FROM questions q WHERE q.test_id = t.id) AS questions_count,
        (SELECT COUNT(*) FROM test_attempts ta WHERE ta.test_id = t.id) AS attempts_count,
        (SELECT GROUP_CONCAT(CONCAT(score, '/', total_questions)) FROM test_results tr WHERE tr.test_id = t.id) AS scores
      FROM tests t
      LEFT JOIN exams e ON t.exam_id = e.id
      LEFT JOIN subjects s ON t.subject_id = s.id
      LEFT JOIN topics top ON t.topic_id = top.id
      ORDER BY t.created_at DESC`
    );

    // Process average scores
    const processedTests = (tests as any[]).map((test) => {
      let avg_score = 0;
      if (test.scores) {
        const scorePairs = test.scores.split(",");
        const percentages = scorePairs.map((pair: string) => {
          const [score, total] = pair.split("/");
          return (parseFloat(score) / parseFloat(total)) * 100 || 0;
        });
        const sum = percentages.reduce((a: number, b: number) => a + b, 0);
        avg_score = Math.round(sum / percentages.length);
      }
      return {
        ...test,
        questions_count: test.questions_count || 0,
        attempts_count: test.attempts_count || 0,
        avg_score,
      };
    });

    return processedTests;
  } catch (error) {
    logger.error("Error fetching all tests:", error);
    return [];
  }
}

// ===============================
// createTest (inserts test and questions)
export async function createTest(testData: any) {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "Not authenticated" };

  const connection = await db!.getConnection();

  try {
    await connection.beginTransaction();

    const [result]: any = await connection.query(
      `INSERT INTO tests 
      (title, description, test_type, exam_id, subject_id, topic_id, duration, difficulty, total_questions, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        testData.title,
        testData.description || null,
        testData.test_type,
        testData.exam_id || null,
        testData.subject_id || null,
        testData.topic_id || null,
        testData.duration,
        testData.difficulty,
        testData.questions.length,
        user.id,
      ]
    );

    const testId = result.insertId;

    const questionValues = testData.questions.map((q: any, i: number) => [
      testId,
      i + 1,
      q.question_text,
      q.option_a,
      q.option_b,
      q.option_c,
      q.option_d,
      q.correct_answer.toLowerCase(),
      q.explanation || null,
      q.exam_source || null,
    ]);

    await connection.query(
      `INSERT INTO questions
      (test_id, question_order, question_text, option_a, option_b, option_c, option_d, correct_answer, explanation, exam_source)
      VALUES ?`,
      [questionValues]
    );

    await connection.commit();
    revalidatePath("/admin/tests");

    return { success: true, testId };
  } catch (error: any) {
    await connection.rollback();
    logger.error("❌ createTest failed", {
      message: error.message,
      stack: error.stack,
    });
    return { success: false, error: error.message };
  } finally {
    connection.release();
  }
}


// ===============================
// deleteTest
export async function deleteTest(testId: string) {
  try {
    const [result] = await db!.query(`DELETE FROM tests WHERE id = ?`, [testId]);

    revalidatePath("/admin/tests");

    return { success: true };
  } catch (error) {
    logger.error("Error deleting test:", error);
     if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Unknown error occurred" };
  }
}

// ===============================
// getTestWithQuestions
export async function getTestWithQuestions(testId: string) {
  try {
    const [tests] = await db!.query(
      `SELECT t.*, e.name AS exam_name, s.name AS subject_name, top.name AS topic_name
       FROM tests t
       LEFT JOIN exams e ON t.exam_id = e.id
       LEFT JOIN subjects s ON t.subject_id = s.id
       LEFT JOIN topics top ON t.topic_id = top.id
       WHERE t.id = ? LIMIT 1`,
      [testId]
    );

    if ((tests as any[]).length === 0) return null;
    const test = (tests as any)[0];

    const [questions] = await db!.query(`SELECT * FROM questions WHERE test_id = ? ORDER BY question_order`, [testId]);

    return { ...test, questions };
  } catch (error) {
    logger.error("Error fetching test with questions:", error);
    return null;
  }
}

// ===============================
// updateQuestion
export async function updateQuestion(questionId: string, data: Record<string, any>) {
  try {
    const keys = Object.keys(data);
    const values = Object.values(data);

    if (keys.length === 0) return { success: false, error: "No data to update" };

    const setStr = keys.map((k) => `${k} = ?`).join(", ");

    const [result] = await db!.query(`UPDATE questions SET ${setStr} WHERE id = ?`, [...values, questionId]);

    revalidatePath("/admin/tests");

    return { success: true };
  } catch (error) {
    logger.error("Error updating question:", error);
     if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Unknown error occurred" };
    //return { success: false, error: error.message };
  }
}

// ===============================
// deleteQuestion
export async function deleteQuestion(questionId: string) {
  try {
    const [result] = await db!.query(`DELETE FROM questions WHERE id = ?`, [questionId]);

    revalidatePath("/admin/tests");

    return { success: true };
  } catch (error) {
    logger.error("Error deleting question:", error);
     if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Unknown error occurred" };
  }
}

// ===============================
// createExam
export async function createExam(name: string, description?: string) {
  try {
    const [data] = await db!.query(`INSERT INTO exams (name, description) VALUES (?, ?)`, [name, description || null]);

    revalidatePath("/admin/tests");

    return { success: true, data: { id: (data as any).insertId, name, description } };
  } catch (error) {
    logger.error("Error creating exam:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Unknown error occurred" };
  }
}

// ===============================
// createSubject
export async function createSubject(name: string, examId: string) {
  try {
    const [data] = await db!.query(`INSERT INTO subjects (name, exam_id) VALUES (?, ?)`, [name, examId]);

    revalidatePath("/admin/tests");

    return { success: true, data: { id: (data as any).insertId, name, exam_id: examId } };
  } catch (error) {
    logger.error("Error creating subject:", error);
     if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Unknown error occurred" };
  }
}

// ===============================
// createTopic
export async function createTopic(name: string, subjectId: string) {
  try {
    const [data] = await db!.query(`INSERT INTO topics (name, subject_id) VALUES (?, ?)`, [name, subjectId]);

    revalidatePath("/admin/tests");

    return { success: true, data: { id: (data as any).insertId, name, subject_id: subjectId } };
  } catch (error) {
    logger.error("Error creating topic:", error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return { success: false, error: "Unknown error occurred" };
  }
}

// ===============================
// getExamsSubjectsTopics
export async function getExamsSubjectsTopics() {
  try {
    if (!db) {
      throw new Error("DB not initialized");
    }

    // 1️⃣ Exams
    const [examsResult] = await db.query(
      `SELECT id, name FROM exams ORDER BY name ASC`
    );
    const exams = examsResult as any[];

    // 2️⃣ Subjects
    const [subjectsResult] = await db.query(
      `SELECT id, name, exam_id FROM subjects ORDER BY name ASC`
    );
    const subjects = subjectsResult as any[];

    // 3️⃣ Topics
    const [topicsResult] = await db.query(
      `SELECT id, name, subject_id FROM topics ORDER BY name ASC`
    );
    const topics = topicsResult as any[];

    return {
      exams,
      subjects,
      topics,
    };
  } catch (error: any) {
    logger.error("❌ getExamsSubjectsTopics failed", {
      message: error.message,
      stack: error.stack,
    });

    return {
      exams: [],
      subjects: [],
      topics: [],
    };
  }
}

// ===============================
// createCustomMockTest
export async function createCustomMockTest(payload: {
  title: string;
  duration: number;
  subjects: Array<{
    subject_id: number;
    questions_count: number;
  }>;
}) {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, message: "Not authenticated" };
  }

  const connection = await db!.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Create test
    const totalQuestions = payload.subjects.reduce(
      (sum, s) => sum + s.questions_count,
      0
    );

    const [testResult]: any = await connection.query(
      `INSERT INTO tests 
       (title, test_type, duration, total_questions, created_by)
       VALUES (?, ?, ?, ?, ?)`,
      [
        payload.title,
        "custom",
        payload.duration,
        totalQuestions,
        user.id,
      ]
    );

    const testId = testResult.insertId;

    let order = 1;

    // 2️⃣ Pick random questions per subject
    for (const subject of payload.subjects) {
      const [questions]: any = await connection.query(
        `SELECT id FROM questions
         WHERE subject_id = ?
         ORDER BY RAND()
         LIMIT ?`,
        [subject.subject_id, subject.questions_count]
      );

      for (const q of questions) {
        await connection.query(
          `INSERT INTO test_questions (test_id, question_id, question_order)
           VALUES (?, ?, ?)`,
          [testId, q.id, order++]
        );
      }
    }

    await connection.commit();
    revalidatePath("/admin/tests");

    return { success: true, testId };
  } catch (error: any) {
    await connection.rollback();
    logger.error("createCustomMockTest failed", error);
    return { success: false, message: error.message };
  } finally {
    connection.release();
  }
}




