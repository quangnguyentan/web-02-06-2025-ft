import useSWR, { mutate } from "swr";
import { createContext, useContext, useEffect, useState } from "react";
import { Match } from "@/types/match.types";
import { Replay } from "@/types/replay.types";

const BASE_URL = "http://localhost:8080";

const fetcher = async (url: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const fullUrl = `${BASE_URL}${url}`;
    const res = await fetch(fullUrl, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error("Không thể lấy dữ liệu");
    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

interface DataContextType {
  matchData: Match[];
  replayData: Replay[];
  loading: boolean;
  fetchData: () => Promise<void>;
  isDataLoaded: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data: matches,
    error: matchError,
    isLoading: matchLoading,
  } = useSWR("/api/matches", fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  const {
    data: replays,
    error: replayError,
    isLoading: replayLoading,
  } = useSWR("/api/replays", fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000,
  });

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const loading = matchLoading || replayLoading;

  const fetchData = async () => {
    try {
      await Promise.all([
        mutate("/api/matches", undefined, { revalidate: true }),
        mutate("/api/replays", undefined, { revalidate: true }),
      ]);
      setIsDataLoaded(true);
    } catch (error) {
      console.error("Lỗi khi làm mới dữ liệu:", error);
      setIsDataLoaded(true);
    }
  };

  useEffect(() => {
    if (!isDataLoaded && !loading && matches && replays) {
      setIsDataLoaded(true);
    }
    if (matchError || replayError) {
      console.error("Lỗi từ API:", matchError || replayError);
    }
  }, [isDataLoaded, loading, matches, replays, matchError, replayError]);

  return (
    <DataContext.Provider
      value={{
        matchData: matches || [],
        replayData: replays || [],
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
