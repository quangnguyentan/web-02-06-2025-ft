import useSWR, { mutate } from "swr";
import { createContext, useContext, useEffect, useState } from "react";
import { Match } from "@/types/match.types";
import { Replay } from "@/types/replay.types";
import { Sport } from "@/types/sport.types";

const production = "https://sv.hoiquan.live";
const development = "http://localhost:8080";
const API_BASE_URL =
  process.env.NODE_ENV === "production" ? production : development;

const fetcher = async (url: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const fullUrl = `${API_BASE_URL}${url}`;
    const res = await fetch(fullUrl, {
      signal: controller.signal,
      credentials: "include",
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    return await res.json();
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
  fetchMatches: () => Promise<void>;
  fetchReplays: () => Promise<void>;
  fetchSports: () => Promise<void>;
  isDataLoaded: boolean;
  error: Error | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Session storage keys
const STORAGE_KEYS = {
  MATCHES: "cached_matches",
  REPLAYS: "cached_replays",
  SPORTS: "cached_sports",
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [matchData, setMatchData] = useState<Match[]>([]);
  const [replayData, setReplayData] = useState<Replay[]>([]);
  const [sportData, setSportData] = useState<Sport[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Load cached data from sessionStorage on mount
  useEffect(() => {
    const loadCachedData = () => {
      try {
        const cachedMatches = sessionStorage.getItem(STORAGE_KEYS.MATCHES);
        const cachedReplays = sessionStorage.getItem(STORAGE_KEYS.REPLAYS);
        const cachedSports = sessionStorage.getItem(STORAGE_KEYS.SPORTS);

        if (cachedMatches) {
          setMatchData(JSON.parse(cachedMatches));
        }
        if (cachedReplays) {
          setReplayData(JSON.parse(cachedReplays));
        }
        if (cachedSports) {
          setSportData(JSON.parse(cachedSports));
        }

        if (cachedMatches || cachedReplays || cachedSports) {
          setIsDataLoaded(true);
        }
      } catch (err) {
        console.error("Error loading cached data:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to load cached data")
        );
      }
    };

    loadCachedData();
  }, []);

  // Fetch data only if cache is empty
  const {
    data: matches = [],
    error: matchError,
    isLoading: matchLoading,
  } = useSWR<Match[]>(
    !sessionStorage.getItem(STORAGE_KEYS.MATCHES) ? "/api/matches" : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
      shouldRetryOnError: false,
      refreshInterval: 60000, // Làm mới mỗi 60 giây
    }
  );

  const {
    data: replays = [],
    error: replayError,
    isLoading: replayLoading,
  } = useSWR<Replay[]>(
    !sessionStorage.getItem(STORAGE_KEYS.REPLAYS) ? "/api/replays" : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
      shouldRetryOnError: false,
      refreshInterval: 60000, // Làm mới mỗi 60 giây
    }
  );

  const {
    data: sports = [],
    error: sportError,
    isLoading: sportLoading,
  } = useSWR<Sport[]>(
    !sessionStorage.getItem(STORAGE_KEYS.SPORTS) ? "/api/sports" : null,
    fetcher,
    {
      revalidateOnMount: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 60000,
      shouldRetryOnError: false,
      refreshInterval: 60000, // Làm mới mỗi 60 giây
    }
  );

  // Update state and cache when new data is fetched
  useEffect(() => {
    if (matches.length) {
      setMatchData(matches);
      sessionStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
    }
    if (replays.length) {
      setReplayData(replays);
      sessionStorage.setItem(STORAGE_KEYS.REPLAYS, JSON.stringify(replays));
    }
    if (sports.length) {
      setSportData(sports);
      sessionStorage.setItem(STORAGE_KEYS.SPORTS, JSON.stringify(sports));
    }

    if (
      (matches.length || replays.length || sports.length) &&
      !matchLoading &&
      !replayLoading &&
      !sportLoading
    ) {
      setIsDataLoaded(true);
    }

    if (matchError || replayError || sportError) {
      setError(matchError || replayError || sportError);
      setIsDataLoaded(true);
    }
  }, [
    matches,
    replays,
    sports,
    matchLoading,
    replayLoading,
    sportLoading,
    matchError,
    replayError,
    sportError,
  ]);

  const fetchMatches = async () => {
    try {
      const matchRes = await fetcher("/api/matches");
      setMatchData(matchRes || []);
      sessionStorage.setItem(
        STORAGE_KEYS.MATCHES,
        JSON.stringify(matchRes || [])
      );
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch matches")
      );
      console.error("Error fetching matches:", err);
    }
  };

  const fetchReplays = async () => {
    try {
      const replayRes = await fetcher("/api/replays");
      setReplayData(replayRes || []);
      sessionStorage.setItem(
        STORAGE_KEYS.REPLAYS,
        JSON.stringify(replayRes || [])
      );
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch replays")
      );
      console.error("Error fetching replays:", err);
    }
  };

  const fetchSports = async () => {
    try {
      const sportRes = await fetcher("/api/sports");
      setSportData(sportRes || []);
      sessionStorage.setItem(
        STORAGE_KEYS.SPORTS,
        JSON.stringify(sportRes || [])
      );
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch sports")
      );
      console.error("Error fetching sports:", err);
    }
  };

  const fetchData = async () => {
    try {
      setIsDataLoaded(false);
      setError(null);

      await Promise.all([fetchMatches(), fetchReplays(), fetchSports()]);

      setIsDataLoaded(true);
      // toast.success("Dữ liệu đã được làm mới");
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to fetch data");
      setError(error);
      setIsDataLoaded(true);
      // toast.error("Lỗi khi làm mới dữ liệu");
      console.error("Error refreshing data:", error);
    }
  };

  const loading =
    !isDataLoaded && (matchLoading || replayLoading || sportLoading);

  return (
    <DataContext.Provider
      value={{
        matchData,
        replayData,
        sportData,
        loading,
        fetchData,
        fetchMatches,
        fetchReplays,
        fetchSports,
        isDataLoaded,
        error,
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

// import useSWR, { mutate } from "swr";
// import { createContext, useContext, useEffect, useState } from "react";
// import { Match } from "@/types/match.types";
// import { Replay } from "@/types/replay.types";
// import { Sport } from "@/types/sport.types";

// const production = "https://sv.hoiquan.live";
// const development = "http://localhost:8080";

// const fetcher = async (url: string) => {
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), 10000);
//   try {
//     const fullUrl = `${development}${url}`;
//     const res = await fetch(fullUrl, {
//       signal: controller.signal,
//       credentials: "include",
//     });
//     clearTimeout(timeoutId);
//     if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
//     const data = await res.json();
//     console.log(`Fetched data for ${url}:`, data);
//     return data;
//   } catch (error) {
//     clearTimeout(timeoutId);
//     throw error instanceof Error ? error : new Error("Unknown fetch error");
//   }
// };

// interface DataContextType {
//   matchData: Match[];
//   replayData: Replay[];
//   sportData: Sport[];
//   loading: boolean;
//   fetchData: () => Promise<void>;
//   isDataLoaded: boolean;
//   error: Error | null;
// }

// const DataContext = createContext<DataContextType | undefined>(undefined);

// export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const {
//     data: matches = [],
//     error: matchError,
//     isLoading: matchLoading,
//   } = useSWR<Match[]>("/api/matches", fetcher, {
//     revalidateOnMount: true,
//     revalidateOnFocus: false,
//     revalidateOnReconnect: false,
//     dedupingInterval: 60000,
//     shouldRetryOnError: false,
//   });

//   const {
//     data: replays = [],
//     error: replayError,
//     isLoading: replayLoading,
//   } = useSWR<Replay[]>("/api/replays", fetcher, {
//     revalidateOnMount: true,
//     revalidateOnFocus: false,
//     revalidateOnReconnect: false,
//     dedupingInterval: 60000,
//     shouldRetryOnError: false,
//   });

//   const {
//     data: sports = [],
//     error: sportError,
//     isLoading: sportLoading,
//   } = useSWR<Sport[]>("/api/sports", fetcher, {
//     revalidateOnMount: true,
//     revalidateOnFocus: false,
//     revalidateOnReconnect: false,
//     dedupingInterval: 60000,
//     shouldRetryOnError: false,
//   });

//   const [isDataLoaded, setIsDataLoaded] = useState(false);
//   const loading =
//     !isDataLoaded && (matchLoading || replayLoading || sportLoading);
//   const error = matchError || replayError || sportError;

//   const fetchData = async () => {
//     try {
//       await Promise.all([
//         mutate("/api/matches", undefined, { revalidate: true }),
//         mutate("/api/replays", undefined, { revalidate: true }),
//         mutate("/api/sports", undefined, { revalidate: true }),
//       ]);
//       setIsDataLoaded(true);
//     } catch (err) {
//       console.error("Error refreshing data:", err);
//       setIsDataLoaded(true);
//     }
//   };

//   useEffect(() => {
//     if (
//       !matchLoading &&
//       !replayLoading &&
//       !sportLoading &&
//       (matches.length ||
//         replays.length ||
//         sports.length ||
//         matchError ||
//         replayError ||
//         sportError)
//     ) {
//       setIsDataLoaded(true);
//     }
//     if (error) {
//       console.error("API error:", error);
//     }
//   }, [
//     matchLoading,
//     replayLoading,
//     sportLoading,
//     matches,
//     replays,
//     sports,
//     matchError,
//     replayError,
//     sportError,
//     error,
//   ]);

//   return (
//     <DataContext.Provider
//       value={{
//         matchData: matches,
//         replayData: replays,
//         sportData: sports,
//         loading,
//         fetchData,
//         isDataLoaded,
//         error,
//       }}
//     >
//       {children}
//     </DataContext.Provider>
//   );
// };

// export const useData = () => {
//   const context = useContext(DataContext);
//   if (!context) {
//     throw new Error("useData must be used within a DataProvider");
//   }
//   return context;
// };
