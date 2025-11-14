"use client";

import { FavoriteStationsCard } from "@/components/favorite-stations-card";
import { useAuthFlowStore } from "@/store/useAuthFlowStore";

export default function Home() {
  const authFlow = useAuthFlowStore();

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-[#fdb415]">
      {authFlow.welcomeStage === "nowelcome" ||
        (authFlow.welcomeStage === "info" && <p>No welcome.</p>)}
      {/* {authFlow.welcomeStage === "favorites" && <FavoriteStationsCard />} */}
      {/* {authFlow.welcomeStage === "schedule" && <></>} */}
      <FavoriteStationsCard />
    </div>
  );
}
