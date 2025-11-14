"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/useAuthStore";
import useProfileStore from "@/store/useProfileStore";

type Station = {
  id: string;
  name: string;
  status: "OK" | "WARN" | "DELAY";
  message: string;
};

const stations: Station[] = [
  {
    id: "newark-penn",
    name: "Newark Penn Station",
    status: "OK",
    message: "Regular service",
  },
  {
    id: "harrison",
    name: "Harrison",
    status: "DELAY",
    message: "Single-tracking due to signal work",
  },
  {
    id: "journal-square",
    name: "Journal Square",
    status: "OK",
    message: "Regular service",
  },
  {
    id: "grove-street",
    name: "Grove Street",
    status: "WARN",
    message: "Minor delays expected",
  },
  {
    id: "exchange-place",
    name: "Exchange Place",
    status: "OK",
    message: "Regular service",
  },
  {
    id: "pavonia-newport",
    name: "Pavonia-Newport",
    status: "OK",
    message: "Regular service",
  },
  {
    id: "hoboken-terminal",
    name: "Hoboken Terminal",
    status: "WARN",
    message: "Crowding during peak hours",
  },
  {
    id: "christopher-street",
    name: "Christopher Street",
    status: "OK",
    message: "Regular service",
  },
  {
    id: "world-trade-center",
    name: "World Trade Center",
    status: "OK",
    message: "Regular service",
  },
  {
    id: "33rd-street",
    name: "33rd Street",
    status: "OK",
    message: "Regular service",
  },
  {
    id: "23rd-street",
    name: "23rd Street",
    status: "DELAY",
    message: "Signal testing causing delays",
  },
  {
    id: "14th-street",
    name: "14th Street",
    status: "OK",
    message: "Regular service",
  },
];

export default function DashPage() {
  const profileStore = useProfileStore();

  return (
    <div className="flex flex-col gap-4 p-8">
      <p>Profile ID: {profileStore.profile?.id}</p>

      <p>My Favorites</p>

      <p>Other Stations</p>

      <div className="grid grid-cols-3 gap-4">
        {[...stations]
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
