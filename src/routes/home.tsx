import iconUrl from "@/assets/icon.png";

import { useEffect } from "react";
import { LineSpinner } from "ldrs/react";

import { StationCard } from "@/components/station-card";
import { Button } from "@/components/ui/button";
import { ErrorCard } from "@/components/error-card";
import { MdRefresh } from "react-icons/md";
import { useDataStore } from "@/stores/useDataStore";

export const HomePage = () => {
  const { isLoading, error, data, lastFetchedAt, canFetch, getData } =
    useDataStore();

  useEffect(() => {
    getData();
    const handle = setInterval(() => getData(), 60 * 1000);
    return clearInterval(handle);
  }, []);

  return (
    <div className="dark:bg-stone-800 dark:text-white space-y-4 p-4 sm:p-8">
      <div className="flex gap-4 items-center">
        <img src={iconUrl} width={50} />
        <div>
          <p className="font-bold text-lg">FlapBoard</p>
          <p className="text-sm text-black/60 dark:text-white/60">
            A derivative of DuckCross
          </p>
        </div>
        {lastFetchedAt && (
          <div className="flex flex-col gap-2 ml-auto">
            <p className="text-sm text-black/60 dark:text-white/60">
              Last fetched at {lastFetchedAt.toLocaleTimeString()}
            </p>
            <Button
              variant={"outline"}
              size={"sm"}
              disabled={isLoading || !canFetch}
              onClick={getData}
              className="dark:bg-white/15 dark:border-white/20"
            >
              <MdRefresh />
              {isLoading ? "Fetching..." : "Fetch Now"}
            </Button>
          </div>
        )}
      </div>
      <h1 className="text-2xl">Welcome!</h1>
      {!isLoading && error && (
        <div>
          <ErrorCard
            title="Failed to fetch."
            message={error}
            severity="CRITICAL"
          />
        </div>
      )}
      {/* <h1>My Favorites</h1>
      <p className="italic text-sm text-neutral-500">No favorites to show.</p> */}
      <h1>All Stations</h1>
      {isLoading && !data && (
        <div className=" flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 p-4">
            <LineSpinner />
            <p className="text-neutral-500 text-sm">Fetching latest data...</p>
          </div>
        </div>
      )}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {data.map((e) => (
            <StationCard key={e.id} station={e} />
          ))}
        </div>
      )}
    </div>
  );
};
