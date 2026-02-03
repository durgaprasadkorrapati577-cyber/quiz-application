
export interface User {
  id: number;
  username: string;
  email: string;
  token?: string;
}

export interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  highestScore: number;
  quizzesTaken: {
    quizTitle: string;
    score: number;
    date: string;
  }[];
}

export interface Question {
  id: number;
  questionTitle?: string;
  question_title?: string; // Matches your Java QuestionWrapper
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export interface Quiz {
  id: number;
  title: string;
  category: string;
  numQuestions: number;
}

export interface QuizResponse {
  id: number;
  response: string;
}

export interface LeaderboardEntry {
  id: number;
  username: string;
  score: number;
  rank: number;
}

export interface WeeklyContest {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  prizePool: string;
}  