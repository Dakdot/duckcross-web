import type { Station } from "@/types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

import RedUrl from "@/assets/red.png";
import AmberUrl from "@/assets/amber.png";
import GreenUrl from "@/assets/green.png";

interface StationCardProps {
  station: Station;
}

export const StationCard = ({ station }: StationCardProps) => {
  const statusColorMap: Record<string, string> = {
    OK: GreenUrl,
    WARN: AmberUrl,
    DELAY: RedUrl,
  };

  const statusDescriptionMap = new Map([
    ["OK", "No delays indicated"],
    ["WARN", "Possible delays"],
    ["DELAY", "Probable delays"],
  ]);

  return (
    <Card className="dark:bg-white/10 dark:border-white/20 dark:text-white/85">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="rounded-full overflow-hidden shadow">
                <img
                  src={statusColorMap[station.status]}
                  className="w-4 h-4 aspect-square"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {statusDescriptionMap.get(station.status)}
            </TooltipContent>
          </Tooltip>
          <p className="font-medium">{station.name}</p>
        </div>
      </CardHeader>
      <CardContent>{station.message}</CardContent>
    </Card>
  );
};
