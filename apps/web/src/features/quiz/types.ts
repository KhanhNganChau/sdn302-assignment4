import { Question } from "../question/types";

export interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
}

export interface CreateQuizDTO {
  title: string;
  description: string;
  questions: string[];
}

export interface QuizState {
  quizzes: Quiz[];
  loading: boolean;
  error: string | null;
}
