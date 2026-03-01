import axiosClient from "../../config/axios";
import { Quiz } from "./types";

export interface QuizPayload {
  title: string;
  description: string;
  questions: string[];
}

export const getAllQuizzesAPI = async (): Promise<Quiz[]> => {
  const response = await axiosClient.get("/quizzes");
  return response as unknown as Quiz[];
};

export const getQuizByIdAPI = async (quizId: string): Promise<Quiz> => {
  const response = await axiosClient.get(`/quizzes/${quizId}`);
  return response as unknown as Quiz;
};

export const createQuizAPI = async (payload: QuizPayload): Promise<Quiz> => {
  const response = await axiosClient.post("/quizzes", payload);
  return response as unknown as Quiz;
};

export const updateQuizAPI = async (
  quizId: string,
  payload: QuizPayload,
): Promise<Quiz> => {
  const response = await axiosClient.put(`/quizzes/${quizId}`, payload);
  return response as unknown as Quiz;
};

export const deleteQuizAPI = async (
  quizId: string,
): Promise<{ message: string }> => {
  const response = await axiosClient.delete(`/quizzes/${quizId}`);
  return response as unknown as { message: string };
};
