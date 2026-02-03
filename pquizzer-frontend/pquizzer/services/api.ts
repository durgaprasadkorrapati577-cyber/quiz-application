
import { User, Quiz, Question, QuizResponse, LeaderboardEntry, WeeklyContest, UserStats } from '../types';

/**
 * PQUIZZER BACKEND CONFIGURATION
 * Port: 8081
 */
const BACKEND_URL = const API_BASE = "https://quizapp-backend.onrender.com";

const getHeaders = () => {
  const token = localStorage.getItem('pquizzer_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Authentication
  login: async (credentials: { email: string; password: string }): Promise<User> => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const responseText = await response.text();
      let data: any;

      try {
        data = JSON.parse(responseText);
      } catch (e) {
        if (response.ok && (responseText.includes('successful') || responseText.includes('Welcome'))) {
          data = {
            id: Date.now(),
            username: credentials.email.split('@')[0],
            email: credentials.email,
            token: 'mock-session-token-' + Math.random().toString(36).substr(2)
          };
        } else {
          throw new Error(responseText || 'Verification failed.');
        }
      }

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed. Please check your credentials.');
      }

      if (data.token) localStorage.setItem('pquizzer_token', data.token);
      return data;
    } catch (error: any) {
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        throw new Error('CONNECTION_ERROR: The quiz server is currently unreachable. Please ensure the backend is active.');
      }
      throw error;
    }
  },

  register: async (userData: { username: string; email: string; password: string }): Promise<User> => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const responseText = await response.text();
      let data: any;

      try {
        data = JSON.parse(responseText);
      } catch (e) {
        if (response.ok) {
          data = { ...userData, id: Date.now() };
        } else {
          throw new Error(responseText || 'Signup failed.');
        }
      }

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed. This email or username might be taken.');
      }
      return data;
    } catch (error: any) {
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        throw new Error('CONNECTION_ERROR: The signup service is temporarily offline.');
      }
      throw error;
    }
  },

  // User Data
  getUserStats: async (userId: number): Promise<UserStats> => {
    try {
      const response = await fetch(`${BACKEND_URL}/user/stats/${userId}`, { headers: getHeaders() });
      if (response.ok) return await response.json();
      throw new Error();
    } catch {
      return { totalQuizzes: 0, averageScore: 0, highestScore: 0, quizzesTaken: [] };
    }
  },

  // Quizzes
  getQuizzes: async (): Promise<Quiz[]> => {
    try {
      const response = await fetch(`${BACKEND_URL}/quiz/all`, { headers: getHeaders() });
      if (response.ok) return await response.json();
      throw new Error();
    } catch {
      return [
        { id: 1, title: 'Java Fundamentals', category: 'Programming', numQuestions: 10 },
        { id: 2, title: 'Spring Boot Advanced', category: 'Frameworks', numQuestions: 15 }
      ];
    }
  },

  getQuizQuestions: async (quizId: number): Promise<Question[]> => {
    try {
      const response = await fetch(`${BACKEND_URL}/quiz/get/${quizId}`, { headers: getHeaders() });
      if (!response.ok) throw new Error(`Quiz data could not be retrieved.`);
      return await response.json();
    } catch (error) {
      console.error('Quiz fetch error:', error);
      return [];
    }
  },

  /**
   * Submission handler for your Spring Boot calculateResults method.
   * Your backend returns a raw Integer (ResponseEntity<Integer>).
   */
  submitQuiz: async (quizId: number, responses: QuizResponse[]): Promise<{ score: number }> => {
    try {
      const response = await fetch(`${BACKEND_URL}/quiz/submit/${quizId}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(responses)
      });
      
      if (response.ok) {
        // Since backend returns raw Integer, we parse it and wrap it in an object for the frontend
        const score = await response.json();
        return { score: typeof score === 'number' ? score : 0 };
      }
      throw new Error('Submission failed');
    } catch (err) {
      console.error('Submission error:', err);
      // Fallback mock score in case of connection issues
      return { score: 0 };
    }
  },

  // Social
  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    try {
      const response = await fetch(`${BACKEND_URL}/leaderboard`, { headers: getHeaders() });
      if (response.ok) return await response.json();
      throw new Error();
    } catch {
      return [
        { id: 1, username: 'TopCoder', score: 2500, rank: 1 },
        { id: 2, username: 'JavaGuru', score: 2100, rank: 2 },
        { id: 3, username: 'SpringMaster', score: 1800, rank: 3 }
      ];
    }
  },

  getWeeklyContests: async (): Promise<WeeklyContest[]> => {
    try {
      const response = await fetch(`${BACKEND_URL}/weekly-contests/active`, { headers: getHeaders() });
      if (response.ok) return await response.json();
      throw new Error();
    } catch {
      return [{
        id: 1,
        title: 'Java Weekly Challenge',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        prizePool: '5000'
      }];
    }
  }
};
