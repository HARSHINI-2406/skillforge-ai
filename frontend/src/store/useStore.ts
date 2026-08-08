import { create } from "zustand";
import { apiRequest, loginRequest } from "../utils/api";

// ================= TYPES =================

export interface User {
  id: number;
  full_name: string;
  email: string;
  college?: string;
  department?: string;
  year?: string;
  career_goal?: string;
  weekly_hours?: number;
  is_onboarded?: boolean;
}

export interface UserSkill {
  name: string;
  proficiency: number;
}

export interface SkillGap {
  target_role: string;
  match_percentage: number;

  current_skills: {
    name: string;
    proficiency: number;
  }[];

  missing_skills: {
    name: string;
    proficiency: number;
  }[];

  ai_explanation: string;
}

export interface RoadmapTask {
  id: number;
  week_number: number;
  day_number: number;
  title: string;
  description: string;
  task_type: string;
  difficulty: string;
  time_estimate_mins: number;
  is_completed: boolean;
  completed_at?: string;
  xp_value: number;

  // Backend should return an array
  practice_problems?: string[];

  mini_project?: {
    name: string;
  };
}

export interface Roadmap {
  id: number;
  target_role: string;
  duration_days: number;
  generated_at: string;
  is_active: boolean;
  ai_summary?: string;

  // IMPORTANT: array
  tasks: RoadmapTask[];
}

export interface Resume {
  id: number;
  filename: string;
  ats_score: number;
  missing_keywords: string[];
  weak_sections: string[];
  project_suggestions: string[];
  improved_bullets: {
    original: string;
    improved: string;
  }[];
  analyzed_at: string;
}

export interface AnalyticsSummary {
  streak: number;
  total_xp: number;
  badges: string[];
  completion_rate: number;
  completed_tasks: number;
  total_tasks: number;
  current_readiness_score: number;
  current_skill_growth: number;
  latest_mock_test_score: number;
  total_study_hours: number;

  trend_history: {
    date: string;
    study_hours: number;
    skill_growth: number;
    readiness_score: number;
    mock_test: number;
  }[];
}

export interface Comment {
  id: number;
  post_id: number;
  author_name: string;
  content: string;
  created_at: string;
}

export interface CommunityPost {
  id: number;
  content: string;
  author_name: string;
  author_role?: string;
  likes_count: number;
  created_at: string;

  // IMPORTANT: array
  comments: Comment[];
}

export interface ChatMessage {
  sender: "user" | "mentor";
  text: string;
}

// ================= STORE TYPE =================

interface AppState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;

  skillGap: SkillGap | null;

  activeRoadmap: Roadmap | null;

  resumeHistory: Resume[];
  latestResume: Resume | null;

  analytics: AnalyticsSummary | null;

  posts: CommunityPost[];

  chatMessages: ChatMessage[];

  // AUTH
  login: (
    email: string,
    password: string
  ) => Promise<void>;

  register: (payload: any) => Promise<void>;

  logout: () => void;

  checkAuth: () => Promise<void>;

  onboardUser: (payload: any) => Promise<void>;

  // SKILLS
  fetchSkillGap: () => Promise<void>;

  updateSkillProficiency: (
    name: string,
    proficiency: number
  ) => Promise<void>;

  // ROADMAP
  fetchActiveRoadmap: () => Promise<void>;

  generateRoadmap: (
    role: string,
    days: number
  ) => Promise<void>;

  completeTask: (
    id: number
  ) => Promise<void>;

  // RESUME
  uploadResume: (
    file: File
  ) => Promise<void>;

  fetchResumeHistory: () => Promise<void>;

  // ANALYTICS
  fetchAnalytics: () => Promise<void>;

  // COMMUNITY
  fetchPosts: () => Promise<void>;

  createPost: (
    content: string
  ) => Promise<void>;

  likePost: (
    id: number
  ) => Promise<void>;

  addComment: (
    id: number,
    content: string
  ) => Promise<void>;

  // CHAT
  sendChatMessage: (
    message: string
  ) => Promise<void>;

  clearChat: () => void;
}

// ================= CREATE STORE =================

export const useStore = create<AppState>((set, get) => ({
  // ================= INITIAL STATE =================

  user: null,

  token: localStorage.getItem(
    "skillforge_token"
  ),

  isAuthenticated: false,

  isLoading: false,

  authError: null,

  skillGap: null,

  activeRoadmap: null,

  resumeHistory: [],

  latestResume: null,

  analytics: null,

  posts: [],

  chatMessages: [
    {
      sender: "mentor",
      text:
        "Hello! I am your SkillForge AI Career Mentor. Ask me anything about careers, skills, resumes or learning.",
    },
  ],

  // ================= AUTH =================

  login: async (email, password) => {
    try {
      set({
        isLoading: true,
        authError: null,
      });

      const data = await loginRequest(
        email,
        password
      );

      localStorage.setItem(
        "skillforge_token",
        data.access_token
      );

      const user = await apiRequest(
        "/api/auth/me"
      );

      set({
        token: data.access_token,
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        authError:
          error?.message ||
          "Login failed",
        isLoading: false,
      });

      throw error;
    }
  },

  register: async (payload) => {
    try {
      set({
        isLoading: true,
        authError: null,
      });

      await apiRequest(
        "/api/auth/register",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      set({
        isLoading: false,
      });
    } catch (error: any) {
      set({
        authError:
          error?.message ||
          "Registration failed",
        isLoading: false,
      });

      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(
      "skillforge_token"
    );

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      skillGap: null,
      activeRoadmap: null,
      resumeHistory: [],
      latestResume: null,
      analytics: null,
      posts: [],
    });
  },

  checkAuth: async () => {
    const token =
      localStorage.getItem(
        "skillforge_token"
      );

    if (!token) {
      set({
        isAuthenticated: false,
        user: null,
        token: null,
      });

      return;
    }

    try {
      const user = await apiRequest(
        "/api/auth/me"
      );

      set({
        token,
        user,
        isAuthenticated: true,
      });
    } catch {
      localStorage.removeItem(
        "skillforge_token"
      );

      set({
        token: null,
        user: null,
        isAuthenticated: false,
      });
    }
  },

  onboardUser: async (payload) => {
    const user = await apiRequest(
      "/api/auth/onboard",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    set({
      user,
    });
  },

  // ================= SKILLS =================

  fetchSkillGap: async () => {
    const data = await apiRequest(
      "/api/skills/gap"
    );

    set({
      skillGap: data,
    });
  },

  updateSkillProficiency: async (
    name,
    proficiency
  ) => {
    await apiRequest(
      `/api/skills/update-proficiency?skill_name=${encodeURIComponent(
        name
      )}&proficiency=${proficiency}`,
      {
        method: "POST",
      }
    );

    await get().fetchSkillGap();
  },

  // ================= ROADMAP =================

  fetchActiveRoadmap: async () => {
    try {
      set({
        isLoading: true,
      });

      const data = await apiRequest(
        "/api/roadmap/active"
      );

      set({
        activeRoadmap: data,
        isLoading: false,
      });
    } catch (error) {
      set({
        activeRoadmap: null,
        isLoading: false,
      });
    }
  },

  generateRoadmap: async (
    role,
    days
  ) => {
    try {
      set({
        isLoading: true,
      });

      const roadmap =
        await apiRequest(
          "/api/roadmap/generate",
          {
            method: "POST",

            body: JSON.stringify({
              target_role: role,
              duration_days: days,
            }),
          }
        );

      set({
        activeRoadmap: roadmap,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
      });

      throw error;
    }
  },

  completeTask: async (id) => {
    await apiRequest(
      `/api/roadmap/complete-task/${id}`,
      {
        method: "POST",
      }
    );

    await get().fetchActiveRoadmap();

    try {
      await get().fetchAnalytics();
    } catch {
      // Analytics failure should not break task completion
    }
  },

  // ================= RESUME =================

  uploadResume: async (file) => {
    const formData = new FormData();

    formData.append(
      "file",
      file
    );

    const result =
      await apiRequest(
        "/api/resume/analyze",
        {
          method: "POST",
          body: formData,
        }
      );

    set({
      latestResume: result,
    });
  },

  fetchResumeHistory: async () => {
    const data =
      await apiRequest(
        "/api/resume/history"
      );

    set({
      resumeHistory: Array.isArray(data)
        ? data
        : [],

      latestResume:
        Array.isArray(data) &&
        data.length > 0
          ? data[0]
          : null,
    });
  },

  // ================= ANALYTICS =================

  fetchAnalytics: async () => {
    const data =
      await apiRequest(
        "/api/analytics/summary"
      );

    set({
      analytics: data,
    });
  },

  // ================= COMMUNITY =================

  fetchPosts: async () => {
    const data =
      await apiRequest(
        "/api/community/posts"
      );

    set({
      posts: Array.isArray(data)
        ? data
        : [],
    });
  },

  createPost: async (
    content
  ) => {
    await apiRequest(
      "/api/community/posts",
      {
        method: "POST",

        body: JSON.stringify({
          content,
        }),
      }
    );

    await get().fetchPosts();
  },

  likePost: async (id) => {
    await apiRequest(
      `/api/community/posts/${id}/like`,
      {
        method: "POST",
      }
    );

    await get().fetchPosts();
  },

  addComment: async (
    id,
    content
  ) => {
    await apiRequest(
      `/api/community/posts/${id}/comments`,
      {
        method: "POST",

        body: JSON.stringify({
          content,
        }),
      }
    );

    await get().fetchPosts();
  },

  // ================= CHAT =================

  sendChatMessage: async (
    message
  ) => {
    set((state) => ({
      chatMessages: [
        ...state.chatMessages,

        {
          sender: "user",
          text: message,
        },
      ],
    }));

    try {
      const data =
        await apiRequest(
          "/api/chat/message",
          {
            method: "POST",

            body: JSON.stringify({
              message,
            }),
          }
        );

      set((state) => ({
        chatMessages: [
          ...state.chatMessages,

          {
            sender: "mentor",
            text:
              data.response ||
              "I could not generate a response.",
          },
        ],
      }));
    } catch {
      set((state) => ({
        chatMessages: [
          ...state.chatMessages,

          {
            sender: "mentor",
            text:
              "Unable to connect with AI mentor.",
          },
        ],
      }));
    }
  },

  clearChat: () => {
    set({
      chatMessages: [
        {
          sender: "mentor",
          text:
            "Hello! I am your SkillForge AI Career Mentor.",
        },
      ],
    });
  },
}));