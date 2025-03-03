// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the store state type
interface AuthState {
  // State
  username: string | null;
  email: string | null;
  password: string | null;
  isAuthenticated: boolean;

  // Actions
  login: (username: string, email: string, password: string) => void;
  logout: () => void;
  updateUsername: (username: string) => void;
  updateEmail: (email: string) => void;
  updatePassword: (password: string) => void;
}

// Create the store with persistence
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      username: null,
      email: null,
      password: null,
      isAuthenticated: false,

      // Actions
      login: (username, email, password) =>
        set({ username, email, password, isAuthenticated: true }),

      logout: () =>
        set({
          username: null,
          email: null,
          password: null,
          isAuthenticated: false,
        }),

      updateUsername: (username) => set({ username }),

      updateEmail: (email) => set({ email }),

      updatePassword: (password) => set({ password }),
    }),
    {
      name: "auth-storage", // unique name for storage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
