import { create } from "zustand";

export type Station = {
  id: string;
  name: string;
  status: "OK" | "WARN" | "DELAY";
  message: string;
};

type DataState = {
  data: Station[];
  fetched: number; // ms since epoch when data was last updated
  fetchData: () => Promise<void>;
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
};

const BASE_URL = "https://api.duckcross.com";

// hold interval id at module level so it survives hook recreations
let intervalId: number | null = null;

export const useDataStore = create<DataState>((set, get) => ({
  data: [],
  fetched: 0,

  // fetch data from /v1/data and store as typed Station[]
  fetchData: async () => {
    try {
      const res = await fetch(`${BASE_URL}/v1/data`);
      if (!res.ok) {
        // keep previous data on error and don't update timestamp
        console.error("useDataStore: failed to fetch /v1/data", res.status);
        return;
      }
      const json = await res.json();
      // Expecting an array of station objects. Be defensive: only set when we get an array.
      const payload: Station[] = Array.isArray(json) ? (json as Station[]) : [];
      set({ data: payload, fetched: Date.now() });
    } catch (err) {
      console.error("useDataStore: fetch error", err);
    }
  },

  // start periodic refresh every 60s (client-only)
  startAutoRefresh: () => {
    // only run intervals in the browser
    if (typeof window === "undefined") return;
    if (intervalId != null) return; // already running

    // initial fetch
    void get().fetchData();

    intervalId = window.setInterval(() => {
      void get().fetchData();
    }, 60_000);
  },

  stopAutoRefresh: () => {
    if (intervalId != null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  },
}));
