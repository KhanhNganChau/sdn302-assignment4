import axiosClient from "../../config/axios";
import { CreateQuestionDTO, Question } from "./types";

export const getAllQuestionsAPI = async (): Promise<Question[]> => {
  const response = await axiosClient.get("/questions");
  return response as unknown as Question[];
};

export const createQuestionAPI = async (
  payload: CreateQuestionDTO,
): Promise<Question> => {
  const response = await axiosClient.post("/questions", payload);
  return response as unknown as Question;
};

export const updateQuestionAPI = async (
  questionId: string,
  payload: CreateQuestionDTO,
): Promise<Question> => {
  const response = await axiosClient.put(`/questions/${questionId}`, payload);
  return response as unknown as Question;
};

export const deleteQuestionAPI = async (
  questionId: string,
): Promise<{ message: string }> => {
  const response = await axiosClient.delete(`/questions/${questionId}`);
  return response as unknown as { message: string };
};
