import useSWR, { mutate } from "swr";
import { createContext, useContext, useEffect, useState } from "react";
import { Match } from "@/types/match.types";
import { Replay } from "@/types/replay.types";
import { Sport } from "@/types/sport.types";
import { apiGetAllSports } from "@/services/sport.services";

const BASE_URL = "http://localhost:8080";

const fetcher = async (url: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const fullUrl = `${BASE_URL}${url}`;
    const res = await fetch(fullUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    const data = await res.json();
    console.log(`Fetched data for ${url}:`, data); // Debug log
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error instanceof Error ? error : new Error("Unknown fetch error");
  }
};

interface DataContextType {
  matchData: Match[];
  replayData: Replay[];
  sportData: Sport[];
  loading: boolean;
  fetchData: () => Promise<void>;
  isDataLoaded: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data: matches = [],
    error: matchError,
    isLoading: matchLoading,
  } = useSWR<Match[]>("/api/matches", fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  const {
    data: replays = [],
    error: replayError,
    isLoading: replayLoading,
  } = useSWR<Replay[]>("/api/replays", fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  const {
    data: sports = [],
    error: sportError,
    isLoading: sportLoading,
  } = useSWR<Sport[]>(
    "/api/sports",
    async () => {
      const response = await apiGetAllSports();
      return response?.data || [];
    },
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
    }
  );

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const loading = matchLoading || replayLoading || sportLoading;

  const fetchData = async () => {
    try {
      await Promise.all([
        mutate("/api/matches", undefined, { revalidate: true }),
        mutate("/api/replays", undefined, { revalidate: true }),
        mutate("/api/sports", undefined, { revalidate: true }),
      ]);
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Error refreshing data:", error);
      setIsDataLoaded(true);
    }
  };

  useEffect(() => {
    if (
      !loading &&
      (matches.length ||
        replays.length ||
        sports.length ||
        matchError ||
        replayError ||
        sportError)
    ) {
      setIsDataLoaded(true);
    }
    if (matchError || replayError || sportError) {
      console.error("API error:", matchError || replayError || sportError);
    }
  }, [loading, matches, replays, sports, matchError, replayError, sportError]);

  return (
    <DataContext.Provider
      value={{
        matchData: matches,
        replayData: replays,
        sportData: sports,
        loading,
        fetchData,
        isDataLoaded,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
