"use client";

import { LoginCard } from "@/components/login-card";
import { SignupCard } from "@/components/signup-card";
import { useAuthFlowStore } from "@/store/useAuthFlowStore";

export default function AuthPage() {
  const authFlow = useAuthFlowStore();

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#fdb415]">
      {authFlow.state === "login" && <LoginCard />}
      {authFlow.state === "signup" && <SignupCard />}
    </div>
  );
}
