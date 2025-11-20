import type { Station } from "@/types";
import axios from "axios";
import { create } from "zustand";

interface DataStoreType {
  isLoading: boolean;
  error: string | null;
  data: Station[] | null;
  lastFetchedAt: Date | null;
  canFetch: boolean;

  getData: () => Promise<void>;
}

export const useDataStore = create<DataStoreType>((set, get) => ({
  isLoading: false,
  error: null,
  data: null,
  lastFetchedAt: null,
  canFetch: true,

  getData: async () => {
    if (get().isLoading) return; // Don't fetch again if already loading
    const timeDelta = Date.now() - (get().lastFetchedAt?.getTime() ?? 0);

    if (timeDelta < 10000) {
      set(() => ({ error: "Too many requests. Try again in a few seconds." }));
      return;
    }

    try {
      set(() => ({ isLoading: true, canFetch: false }));

      const res = await axios.get("/v1/data", {
        baseURL: "https://api.duckcross.com",
      });

      set(() => ({ data: res.data as Station[], lastFetchedAt: new Date() }));
      setTimeout(() => set(() => ({ canFetch: true })), 10000);
    } catch (err) {
      set(() => ({ error: err as string }));
    } finally {
      set(() => ({ isLoading: false }));
    }
  },
}));
