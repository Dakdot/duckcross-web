"use client";

import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function AuthInitializer() {
  const restoreFromStorage = useAuthStore((s) => s.restoreFromStorage);

  useEffect(() => {
    // Attempt to restore auth from localStorage and refresh the token if needed
    void restoreFromStorage();
    // We intentionally run this only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
