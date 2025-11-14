"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import useProfileStore from "@/store/useProfileStore";

export default function AuthInitializer() {
  const authStore = useAuthStore();
  const profileStore = useProfileStore();

  useEffect(() => {
    // Attempt to restore auth from localStorage and refresh the token if needed
    void authStore.restoreFromStorage();
    if (authStore.authenticated) void profileStore.loadProfile();
    // We intentionally run this only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
