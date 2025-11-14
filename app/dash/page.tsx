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
import useProfileStore, { Profile } from "@/store/useProfileStore";
import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashPage() {
  const [data, setData] = useState<Station[]>([]);
  const [profile, setProfile] = useState<Profile>();
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const authStore = useAuthStore();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("https://api.duckcross.com/v1/data");
        if (!res.ok) throw new Error("failed to fetch");
        const json = await res.json();
        setData(json as Station[]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const getProfile = async () => {
      try {
        setIsProfileLoading(true);
        if (!authStore.authenticated) return;
        const authHeader = authStore.getAuthHeader();
        const res = await fetch("https://api.duckcross.com/v1/profile", {
          credentials: "include",
          headers: { "Content-Type": "application/json", ...authHeader },
        });

        if (!res.ok) throw new Error("failed to get profile");

        const data = await res.json();

        setProfile(data as Profile);
      } catch (err) {
        console.error(err);
      } finally {
        setIsProfileLoading(false);
      }
    };

    getData();
    getProfile();

    const interval = setInterval(getData, 60000);

    return clearInterval(interval);
  }, [setData]);

  useEffect(() => {
    console.log("profile:", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    console.log("data:", JSON.stringify(data));
  }, [data]);

  const toggleFavoriteStation = async (stationId: string) => {
    console.log(JSON.stringify(profile));
    try {
      setIsProfileLoading(true);

      if (!profile) return;
      const setFavs = new Set(profile.favoriteStations || []);
      if (setFavs.has(stationId)) setFavs.delete(stationId);
      else setFavs.add(stationId);

      const next: Profile = {
        ...profile,
        favoriteStations: Array.from(setFavs),
      };
      setProfile(next);
      try {
        const authHeader = useAuthStore.getState().getAuthHeader?.() ?? {};
        await fetch(`https://api.duckcross.com/v1/profile`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json", ...authHeader },
          body: JSON.stringify({
            favoriteStations: Array.from(setFavs),
          }),
        });
      } catch (err: unknown) {
        console.error("useProfileStore.toggleFavoriteStation error", err);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const favorites = [...data]
    .sort((a, b) => {
      const order: Record<Station["status"], number> = {
        DELAY: 0,
        WARN: 1,
        OK: 2,
      };
      return order[a.status] - order[b.status];
    })
    .filter((e) => {
      const favs = profile?.favoriteStations ?? [];
      return favs.includes(e.id);
    });

  const others = [...data]
    .sort((a, b) => {
      const order: Record<Station["status"], number> = {
        DELAY: 0,
        WARN: 1,
        OK: 2,
      };
      return order[a.status] - order[b.status];
    })
    .filter((e) => {
      const favs = profile?.favoriteStations ?? [];
      return !favs.includes(e.id);
    });

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center gap-4">
        <img src={"/icon.png"} width={50} />
        <div>
          <p className="text-lg font-bold">FlapBoard</p>
          <p className="text-sm text-black/50">A derivative of DuckCross</p>
        </div>
      </div>

      <h1 className="text-2xl">Welcome!</h1>

      <p>My Favorites</p>

      {favorites.length < 1 && (
        <p className="text-sm italic text-zinc-700">No favorites to show.</p>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {favorites.map((e) => (
          <Card key={e.id}>
            <CardHeader>
              <div className="flex flex-col">
                <div className="flex gap-2 items-center font-medium">
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
                </div>
              </div>
              <CardAction>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"outline"}
                      disabled={isProfileLoading}
                      onClick={() => toggleFavoriteStation(e.id)}
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
              <div className="flex flex-col">
                <div className="flex gap-2 items-center font-medium">
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
                </div>
              </div>
              <CardTitle className="flex items-center gap-3"></CardTitle>
              <CardAction>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={"outline"}
                      disabled={isProfileLoading}
                      onClick={() => toggleFavoriteStation(e.id)}
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
