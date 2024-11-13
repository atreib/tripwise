import "server-only";
import { Feedback, feedbackSchema } from "./types";
import { db } from "../db";
import { v4 } from "uuid";

async function createdFeedback(
  feedback: Omit<Feedback, "id" | "createdAt">
): Promise<Feedback> {
  const newFeedback = await db
    .insertInto("feedback")
    .values({
      ...feedback,
      id: v4(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
  return feedbackSchema.parse(newFeedback);
}

export function getFeedbackService() {
  return {
    createdFeedback,
  };
}
