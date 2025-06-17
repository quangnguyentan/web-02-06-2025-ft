import useSWR, { mutate } from "swr";
import { createContext, useContext, useEffect, useState } from "react";
import { Match } from "@/types/match.types";
import { Replay } from "@/types/replay.types";
import { apiGetAllMatches } from "@/services/match.services"; // Nếu có
import { apiGetAllReplays } from "@/services/replay.services"; // Nếu có

const BASE_URL = "http://localhost:8080"; // Định nghĩa URL cơ sở của server

const fetcher = async (url: string) => {
  const fullUrl = `${BASE_URL}${url}`; // Tạo URL đầy đủ
  const res = await fetch(fullUrl);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
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
    revalidateOnMount: true, // Chỉ fetch lần đầu
    revalidateOnFocus: false, // Không fetch khi focus
    revalidateOnReconnect: false, // Không fetch khi reconnect
  });

  const {
    data: replays,
    error: replayError,
    isLoading: replayLoading,
  } = useSWR("/api/replays", fetcher, {
    revalidateOnMount: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const loading = matchLoading || replayLoading;

  const fetchData = async () => {
    // Sử dụng mutate để làm mới dữ liệu
    await Promise.all([
      mutate("/api/matches"), // Làm mới dữ liệu matches
      mutate("/api/replays"), // Làm mới dữ liệu replays
    ]);
    setIsDataLoaded(true);
  };

  useEffect(() => {
    if (!isDataLoaded && !loading && matches && replays) {
      setIsDataLoaded(true);
    }
  }, [isDataLoaded, loading, matches, replays]);

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
