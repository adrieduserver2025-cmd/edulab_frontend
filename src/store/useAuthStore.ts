import { create } from "zustand";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";

interface UserProfile {
  id: number | string;
  email: string;
  role: "student" | "admin" | "reviewer" | "organization" | "organization_pending";
  is_active: boolean;
  displayName?: string | null;
  photoURL?: string | null;
  uid?: string; // Firebase raw UID for frontend display
  created_at?: string | null;
  last_login?: string | null;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean; // Satisfy both loading & isLoading naming
  
  // Actions
  login: (token: string, user: UserProfile) => void;
  logout: () => Promise<void>;
  setToken: (token: string | null) => void;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  clearUser: () => Promise<void>;
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

  logout: async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Firebase SignOut Error:", err);
    }
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
  clearUser: async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Firebase SignOut Error:", err);
    }
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

