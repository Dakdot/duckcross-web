import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

type NotificationSchedule = {
  id?: string;
  profileId?: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
};

export type Profile = {
  id: string;
  name?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  needsWelcome: boolean;
  favoriteStations: string[];
  favoriteLines: string[];
  notificationSchedule?: NotificationSchedule | null;
};

type ProfileState = {
  profile?: Profile | null;
  loading: boolean;
  error?: string | null;

  loadProfile: () => Promise<void>;
  saveProfile: (partial: Partial<Profile>) => Promise<void>;
  setNeedsWelcome: (value: boolean) => Promise<void>;
  toggleFavoriteStation: (stationId: string) => Promise<void>;
  toggleFavoriteLine: (lineId: string) => Promise<void>;
  setNotificationSchedule: (ns: NotificationSchedule | null) => Promise<void>;
  clearProfile: () => void;
};

const BASE_URL = "https://api.duckcross.com";

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: undefined,
  loading: false,
  error: null,

  loadProfile: async () => {
    set({ loading: true, error: null });
    try {
      const authHeader = useAuthStore.getState().getAuthHeader?.() ?? {};
      const res = await fetch(`${BASE_URL}/v1/profile`, {
        method: "GET",
        headers: { "Content-Type": "application/json", ...authHeader },
        credentials: "include",
      });

      if (!res.ok) {
        // 404 -> no profile yet
        if (res.status === 404) {
          set({ profile: null, loading: false });
          return;
        }
        throw new Error(`Failed to load profile: ${res.status}`);
      }

      const json = await res.json();
      set({ profile: json as Profile, loading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("useProfileStore.loadProfile error", err);
      set({ error: msg, loading: false });
    }
  },

  saveProfile: async (partial: Partial<Profile>) => {
    set({ loading: true, error: null });
    try {
      const authHeader = useAuthStore.getState().getAuthHeader?.() ?? {};
      const res = await fetch(`${BASE_URL}/v1/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeader },
        credentials: "include",
        body: JSON.stringify(partial),
      });

      if (!res.ok) {
        throw new Error(`Failed to save profile: ${res.status}`);
      }

      const json = await res.json();
      set({ profile: json as Profile, loading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("useProfileStore.saveProfile error", err);
      set({ error: msg, loading: false });
      throw err;
    }
  },

  setNeedsWelcome: async (value: boolean) => {
    const prev = get().profile;
    if (!prev) return;
    // optimistic update
    set({ profile: { ...prev, needsWelcome: value } });
    try {
      await get().saveProfile({ needsWelcome: value });
    } catch (err: unknown) {
      console.error("useProfileStore.setNeedsWelcome error", err);
      // revert on error
      set({ profile: prev });
    }
  },

  toggleFavoriteStation: async (stationId: string) => {
    const prev = get().profile;
    if (!prev) return;
    const setFavs = new Set(prev.favoriteStations || []);
    if (setFavs.has(stationId)) setFavs.delete(stationId);
    else setFavs.add(stationId);

    const next: Profile = { ...prev, favoriteStations: Array.from(setFavs) };
    set({ profile: next });
    try {
      const authHeader = useAuthStore.getState().getAuthHeader?.() ?? {};
      await fetch(`${BASE_URL}/v1/profile`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({
          favoriteStations: Array.from(setFavs),
        }),
      });
    } catch (err: unknown) {
      console.error("useProfileStore.toggleFavoriteStation error", err);
      set({ profile: prev });
    }
  },

  toggleFavoriteLine: async (lineId: string) => {
    const prev = get().profile;
    if (!prev) return;
    const setFavs = new Set(prev.favoriteLines || []);
    if (setFavs.has(lineId)) setFavs.delete(lineId);
    else setFavs.add(lineId);

    const next: Profile = { ...prev, favoriteLines: Array.from(setFavs) };
    set({ profile: next });
    try {
      await get().saveProfile({ favoriteLines: next.favoriteLines });
    } catch (err: unknown) {
      console.error("useProfileStore.toggleFavoriteLine error", err);
      set({ profile: prev });
    }
  },

  setNotificationSchedule: async (ns: NotificationSchedule | null) => {
    const prev = get().profile;
    if (!prev) return;
    const next: Profile = { ...prev, notificationSchedule: ns };
    set({ profile: next });
    try {
      await get().saveProfile({ notificationSchedule: ns });
    } catch (err: unknown) {
      console.error("useProfileStore.setNotificationSchedule error", err);
      set({ profile: prev });
    }
  },

  clearProfile: () => set({ profile: null, loading: false, error: null }),
}));

export default useProfileStore;
