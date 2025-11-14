import { create } from "zustand";
import useProfileStore from "./useProfileStore";

type AuthState = {
  id?: number;
  authenticated: boolean;
  accessToken?: string | null;

  // actions
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  getAuthHeader: () => { Authorization?: string };
  restoreFromStorage: () => Promise<void>;
};

const BASE_URL = "https://api.duckcross.com";

export const useAuthStore = create<AuthState>((set, get) => ({
  id: undefined,
  authenticated: false,
  accessToken: undefined,

  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    const data = await res.json();
    const accessToken = data?.accessToken ?? null;
    const id = typeof data?.id === "number" ? data.id : undefined;

    if (typeof window !== "undefined") {
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      } else {
        localStorage.removeItem("accessToken");
      }
      if (typeof id !== "undefined") {
        localStorage.setItem("userId", String(id));
      }
    }

    console.log("Logged in!", accessToken);

    set({ accessToken, id, authenticated: !!accessToken });
  },

  logout: async () => {
    try {
      await fetch(`${BASE_URL}/v1/auth/logout`, {
        method: "POST",
        headers: get().getAuthHeader(),
        credentials: "include",
      });
    } catch {
      // ignore network errors on logout
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
    }

    set({ accessToken: null, id: undefined, authenticated: false });
  },

  refresh: async () => {
    try {
      const res = await fetch(`${BASE_URL}/v1/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        set({ accessToken: null, id: undefined, authenticated: false });
        return false;
      }

      const data = await res.json();
      const accessToken = data?.accessToken ?? null;

      if (typeof window !== "undefined") {
        if (accessToken) localStorage.setItem("accessToken", accessToken);
        else localStorage.removeItem("accessToken");
      }

      set({ accessToken, authenticated: !!accessToken });
      return !!accessToken;
    } catch {
      set({ accessToken: null, id: undefined, authenticated: false });
      return false;
    }
  },

  getAuthHeader: () => {
    const token =
      get().accessToken ??
      (typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null);

    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  restoreFromStorage: async () => {
    if (typeof window === "undefined") {
      set({ accessToken: null, id: undefined, authenticated: false });
      return;
    }

    const token = localStorage.getItem("accessToken");
    const idStr = localStorage.getItem("userId");
    const id = idStr ? Number(idStr) : undefined;

    if (token) {
      set({ accessToken: token, id, authenticated: true });
      // try to refresh to validate token and obtain a fresh one
      await get().refresh();
    } else {
      set({ accessToken: null, id: undefined, authenticated: false });
    }
  },
}));
