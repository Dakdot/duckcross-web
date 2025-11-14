"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import { Station, useDataStore } from "@/store/useDataStore";
import useProfileStore from "@/store/useProfileStore";
import { useEffect } from "react";

export default function DashPage() {
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const dataStore = useDataStore();

  useEffect(() => {
    dataStore.fetchData();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-8">
      <p>Auth Store: {JSON.stringify(authStore)}</p>

      <p>Profile Store: {JSON.stringify(profileStore)}</p>

      <p>My Favorites</p>

      <p>Other Stations</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...dataStore.data]
          .sort((a, b) => {
            const order: Record<Station["status"], number> = {
              DELAY: 0,
              WARN: 1,
              OK: 2,
            };
            return order[a.status] - order[b.status];
          })
          .map((e) => (
            <Card key={e.id}>
              <CardHeader>
                <CardTitle className="flex gap-3">
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
