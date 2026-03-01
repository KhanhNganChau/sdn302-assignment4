export interface Question {
  _id: string;
  text: string;
  options: string[];
  keywords: string[];
  correctAnswerIndex: number;
  author?: string;
}

export interface CreateQuestionDTO {
  text: string;
  options: string[];
  keywords: string[];
  correctAnswerIndex: number;
}

export interface QuestionState {
  questions: Question[];
  loading: boolean;
  error: string | null;
}
