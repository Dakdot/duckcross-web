import { create } from "zustand";

type AuthFlowState = {
  state: "login" | "signup";
  welcomeStage: "nowelcome" | "info" | "favorites" | "schedule";
};

type AuthFlowActions = {
  setState: (state: AuthFlowState["state"]) => void;
  setWelcomeStage: (stage: AuthFlowState["welcomeStage"]) => void;
};

export const useAuthFlowStore = create<AuthFlowState & AuthFlowActions>(
  (set) => ({
    state: "login",
    welcomeStage: "nowelcome",

    setState: (state) => set(() => ({ state: state })),
    setWelcomeStage: (stage) => set(() => ({ welcomeStage: stage })),
  })
);
