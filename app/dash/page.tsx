"use client";

import { useAuthStore } from "@/store/useAuthStore";

export default function DashPage() {
  const auth = useAuthStore();

  return (
    <div>
      <p>Auth? {auth.authenticated.toString()}</p>
      <p>ID: {auth.id}</p>
    </div>
  );
}
