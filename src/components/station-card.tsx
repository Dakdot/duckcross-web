import type { Station } from "@/types";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface StationCardProps {
  station: Station;
}

export const StationCard = ({ station }: StationCardProps) => {
  const colorMap = new Map([
    ["OK", "bg-[radial-gradient(ellipse_at_50%_100%,_#bbffaa,_#338800)]"],
    ["WARN", "bg-[radial-gradient(ellipse_at_50%_100%,_#ffff88,_#ee8800)]"],
    ["DELAY", "bg-[radial-gradient(ellipse_at_50%_100%,_#ffaaaa,_#cc2200)]"],
  ]);

  const statusDescriptionMap = new Map([
    ["OK", "No delays indicated"],
    ["WARN", "Possible delays"],
    ["DELAY", "Probable delays"],
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`w-4 h-4 relative aspect-square shadow-black/50 shadow rounded-full border border-black/20 ${colorMap.get(station.status)}`}
              />
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
