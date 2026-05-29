import { create } from "zustand";

interface UserProfile {
  id: number | string;
  email: string;
  role: "student" | "admin" | "reviewer";
  is_active: boolean;
  displayName?: string | null;
  photoURL?: string | null;
  uid?: string; // Firebase raw UID for frontend display
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean; // Satisfy both loading & isLoading naming
  
  // Actions
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  setToken: (token: string | null) => void;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("edulab_token"), // Persistent token cache for initial reload
  isAuthenticated: !!localStorage.getItem("edulab_token"),
  isLoading: false,
  loading: false,

  login: (token, user) => {
    localStorage.setItem("edulab_token", token);
    set({
      token,
      user,
      isAuthenticated: true,
      isLoading: false,
      loading: false,
    });
  },

  logout: () => {
    localStorage.removeItem("edulab_token");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      loading: false,
    });
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem("edulab_token", token);
      set({ token, isAuthenticated: true });
    } else {
      localStorage.removeItem("edulab_token");
      set({ token: null, isAuthenticated: false });
    }
  },

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading, loading: isLoading }),
  clearUser: () => {
    localStorage.removeItem("edulab_token");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      loading: false,
    });
  },
}));
