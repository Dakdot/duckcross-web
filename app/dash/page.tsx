"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuthStore } from "@/store/useAuthStore";
import { Station, useDataStore } from "@/store/useDataStore";
import useProfileStore from "@/store/useProfileStore";
import { Minus, Plus } from "lucide-react";
import { useEffect } from "react";

export default function DashPage() {
  const profileStore = useProfileStore();
  const dataStore = useDataStore();

  useEffect(() => {
    dataStore.fetchData();
    dataStore.startAutoRefresh();
  }, []);

  useEffect(() => {
    console.log(JSON.stringify(profileStore.profile));
  }, [profileStore.profile]);

  const favorites = [...dataStore.data]
    .sort((a, b) => {
      const order: Record<Station["status"], number> = {
        DELAY: 0,
        WARN: 1,
        OK: 2,
      };
      return order[a.status] - order[b.status];
    })
    .filter((e) => {
      const favs = profileStore.profile?.favoriteStations ?? [];
      return favs.includes(e.id);
    });

  const others = [...dataStore.data]
    .sort((a, b) => {
      const order: Record<Station["status"], number> = {
        DELAY: 0,
        WARN: 1,
        OK: 2,
      };
      return order[a.status] - order[b.status];
    })
    .filter((e) => {
      const favs = profileStore.profile?.favoriteStations ?? [];
      return !favs.includes(e.id);
    });

  return (
    <div className="flex flex-col gap-4 p-8">
      <h1 className="text-2xl">Welcome!</h1>

      <p>My Favorites</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {favorites.map((e) => (
          <Card key={e.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full ${
                    e.status === "OK"
                      ? "bg-green-500"
                      : e.status === "WARN"
                      ? "bg-amber-400"
                      : "bg-red-500"
                  }`}
                />
                {e.name}
              </CardTitle>
              <CardAction>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"outline"}
                      disabled={profileStore.loading}
                      onClick={() => profileStore.toggleFavoriteStation(e.id)}
                    >
                      <Minus />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remove from favorites</TooltipContent>
                </Tooltip>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p>{e.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <p>Other Stations</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {others.map((e) => (
          <Card key={e.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full ${
                    e.status === "OK"
                      ? "bg-green-500"
                      : e.status === "WARN"
                      ? "bg-amber-400"
                      : "bg-red-500"
                  }`}
                />
                {e.name}
              </CardTitle>
              <CardAction>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"outline"}
                      disabled={profileStore.loading}
                      onClick={() => profileStore.toggleFavoriteStation(e.id)}
                    >
                      <Plus />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Add to favorites</TooltipContent>
                </Tooltip>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p>{e.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
