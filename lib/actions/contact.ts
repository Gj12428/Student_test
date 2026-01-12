"use server";

import { getDB } from "@/lib/db";
import { logger } from "@/lib/logger";

interface ContactData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface TestFeedbackData {
  userId: string;
  testId: string;
  attemptId: string;
  rating: number;
  difficultyLevel: string;
  comments?: string;
  timeSufficient: boolean;
  questionQuality: string;
  wouldRecommend: boolean;
}
const db = getDB();

export async function submitContact(data: ContactData) {
  try {
    const [result] = await db!.query(
      `INSERT INTO contacts 
        (first_name, last_name, email, phone, subject, message, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.firstName,
        data.lastName,
        data.email,
        data.phone || null,
        data.subject,
        data.message,
        "new",
      ]
    );

    return { success: true, message: "Contact submitted successfully" };
  } catch (error) {
    logger.error("Error submitting contact:", error);
    return { success: false, message: "Failed to submit contact" };
  }
}

export async function submitTestFeedback(data: TestFeedbackData) {
  try {
    const [result] = await db!.query(
      `INSERT INTO test_feedback 
        (user_id, test_id, attempt_id, rating, difficulty_level, comments, time_sufficient, question_quality, would_recommend) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.userId,
        data.testId,
        data.attemptId,
        data.rating,
        data.difficultyLevel,
        data.comments || null,
        data.timeSufficient,
        data.questionQuality,
        data.wouldRecommend,
      ]
    );

    return { success: true, message: "Feedback submitted successfully" };
  } catch (error) {
    logger.error("Error submitting feedback:", error);
    return { success: false, message: "Failed to submit feedback" };
  }
}

export async function getContacts() {
  try {
    const [rows] = await db!.query(
      `SELECT * FROM contacts ORDER BY created_at DESC`
    );
    return rows || [];
  } catch (error) {
    logger.error("Error fetching contacts:", error);
    return [];
  }
}

export async function getTestFeedback() {
  try {
    // We need to join users and tests for the extra fields:
    const [rows] = await db!.query(
      `SELECT tf.*, u.full_name AS user_full_name, u.email AS user_email, t.title AS test_title, t.test_type 
       FROM test_feedback tf
       LEFT JOIN users u ON tf.user_id = u.id
       LEFT JOIN tests t ON tf.test_id = t.id
       ORDER BY tf.created_at DESC`
    );

    return rows || [];
  } catch (error) {
    logger.error("Error fetching test feedback:", error);
    return [];
  }
}
