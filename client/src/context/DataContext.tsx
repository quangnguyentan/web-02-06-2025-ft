import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { Match } from "@/types/match.types";
import { Replay } from "@/types/replay.types";
import { Sport } from "@/types/sport.types";
console.log("Vite NODE_ENV:", import.meta.env.VITE_NODE_ENV);
const production = "https://sv.hoiquan.live";
const development = "http://localhost:8080";
const API_BASE_URL =
  import.meta.env.VITE_NODE_ENV === "production" ? production : development;

const fetchData = async (url: string) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      signal: controller.signal,
      credentials: "include",
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    return res.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error instanceof Error ? error : new Error("Unknown fetch error");
  }
};

const fetchMatches = () => fetchData("/api/matches");
const fetchReplays = () => fetchData("/api/replays");
const fetchSports = () => fetchData("/api/sports");

interface DataContextType {
  matchData: Match[] | undefined;
  replayData: Replay[] | undefined;
  sportData: Sport[] | undefined;
  loading: boolean;
  error: Error | null;
  refetchData: () => Promise<void>;
  prefetchData: (endpoint: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const useMatches = () =>
  useQuery<Match[]>({
    queryKey: ["matches"],
    queryFn: fetchMatches,
  });

const useReplays = () =>
  useQuery<Replay[]>({
    queryKey: ["replays"],
    queryFn: fetchReplays,
  });

const useSports = () =>
  useQuery<Sport[]>({
    queryKey: ["sports"],
    queryFn: fetchSports,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

const DataProviderInner: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = useQueryClient();
  const {
    data: matchData = [],
    isLoading: matchLoading,
    error: matchError,
  } = useMatches();
  const {
    data: replayData = [],
    isLoading: replayLoading,
    error: replayError,
  } = useReplays();
  const {
    data: sportData = [],
    isLoading: sportLoading,
    error: sportError,
  } = useSports();
  const [ws, setWs] = useState<WebSocket | null>(null);

  const loading = matchLoading || replayLoading || sportLoading;
  const error = matchError || replayError || sportError;

  useEffect(() => {
    const wsUrl =
      process.env.NODE_ENV === "production"
        ? "wss://sv.hoiquan.live/ws"
        : "ws://localhost:8080/ws";
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log(
        "WebSocket connected at",
        new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
      );
    };

    websocket.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      console.log(
        "Received WebSocket message at",
        new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
        message
      );
      if (message.type === "data_updated") {
        queryClient.refetchQueries({ queryKey: [message.endpoint.slice(1)] });
      }
    };

    websocket.onclose = (event: CloseEvent) => {
      console.log(
        "WebSocket disconnected at",
        new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
        "Code:",
        event.code,
        "Reason:",
        event.reason
      );
      setTimeout(() => setWs(new WebSocket(wsUrl)), 5000);
    };

    websocket.onerror = (error: Event) => {
      console.error(
        "WebSocket error at",
        new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
        (error as ErrorEvent).message || "Unknown error"
      );
    };

    setWs(websocket);

    return () => {
      websocket.close();
      setWs(null);
    };
  }, [queryClient]);

  const refetchData = async () => {
    await queryClient.refetchQueries({
      queryKey: ["matches", "replays", "sports"],
    });
  };

  const prefetchData = (endpoint: string) => {
    const endpointMap: Record<string, () => Promise<any>> = {
      "/api/matches": fetchMatches,
      "/api/replays": fetchReplays,
      "/api/sports": fetchSports,
    };

    const queryFn = endpointMap[endpoint];
    if (typeof queryFn === "function") {
      queryClient.prefetchQuery({
        queryKey: [endpoint.slice(1)],
        queryFn,
      });
    } else {
      console.warn(`No prefetch function defined for endpoint: ${endpoint}`);
    }
  };

  return (
    <DataContext.Provider
      value={{
        matchData,
        replayData,
        sportData,
        loading,
        error: error instanceof Error ? error : null,
        refetchData,
        prefetchData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <DataProviderInner>{children}</DataProviderInner>
    </QueryClientProvider>
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
// const development = "http://localhost:8080"; // Đảm bảo khớp với server
// const API_BASE_URL =
//   process.env.NODE_ENV === "production" ? production : development;

// // Session storage keys
// const STORAGE_KEYS = {
//   MATCHES: "cached_matches",
//   REPLAYS: "cached_replays",
//   SPORTS: "cached_sports",
//   MATCHES_ETAG: "cached_matches_etag",
//   REPLAYS_ETAG: "cached_replays_etag",
//   SPORTS_ETAG: "cached_sports_etag",
//   MATCHES_TIMESTAMP: "cached_matches_timestamp",
//   REPLAYS_TIMESTAMP: "cached_replays_timestamp",
//   SPORTS_TIMESTAMP: "cached_sports_timestamp",
// };

// // Cache TTL (in milliseconds)
// const CACHE_TTL = {
//   MATCHES: 5 * 60 * 1000, // 5 minutes for matches
//   REPLAYS: 5 * 60 * 1000, // 5 minutes for replays
//   SPORTS: 60 * 60 * 1000, // 1 hour for sports
// };

// interface DataContextType {
//   matchData: Match[];
//   replayData: Replay[];
//   sportData: Sport[];
//   loading: boolean;
//   matchLoading: boolean;
//   replayLoading: boolean;
//   sportLoading: boolean;
//   fetchData: () => Promise<void>;
//   fetchMatches: () => Promise<void>;
//   fetchReplays: () => Promise<void>;
//   fetchSports: () => Promise<void>;
//   isDataLoaded: boolean;
//   error: Error | null;
// }

// const DataContext = createContext<DataContextType | undefined>(undefined);

// const fetcher = async (
//   url: string,
//   etagKey: string,
//   cacheKey: string
// ): Promise<{ data: any; etag: string | null }> => {
//   const maxRetries = 3;
//   let retries = 0;
//   let lastError: Error | null = null;

//   while (retries < maxRetries) {
//     const controller = new AbortController();
//     const timeoutId = setTimeout(() => controller.abort(), 10000);
//     try {
//       const cachedEtag = sessionStorage.getItem(etagKey);
//       const fullUrl = `${API_BASE_URL}${url}`;
//       const headers: HeadersInit = cachedEtag
//         ? { "If-None-Match": cachedEtag }
//         : {};
//       const res = await fetch(fullUrl, {
//         signal: controller.signal,
//         credentials: "include",
//         headers,
//       });
//       clearTimeout(timeoutId);

//       if (res.status === 304) {
//         const cachedData = sessionStorage.getItem(cacheKey);
//         return {
//           data: cachedData ? JSON.parse(cachedData) : [],
//           etag: cachedEtag,
//         };
//       }

//       if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
//       const data = await res.json();
//       const newEtag = res.headers.get("ETag");
//       if (newEtag) {
//         sessionStorage.setItem(etagKey, newEtag);
//         sessionStorage.setItem(cacheKey, JSON.stringify(data));
//         sessionStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
//       }
//       return { data, etag: newEtag };
//     } catch (error) {
//       clearTimeout(timeoutId);
//       lastError =
//         error instanceof Error ? error : new Error("Unknown fetch error");
//       retries++;
//       if (retries === maxRetries) {
//         throw lastError;
//       }
//       await new Promise((resolve) =>
//         setTimeout(resolve, 1000 * Math.pow(2, retries))
//       );
//     }
//   }
//   throw lastError || new Error("Failed after retries");
// };

// export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [matchData, setMatchData] = useState<Match[]>([]);
//   const [replayData, setReplayData] = useState<Replay[]>([]);
//   const [sportData, setSportData] = useState<Sport[]>([]);
//   const [isDataLoaded, setIsDataLoaded] = useState(false);
//   const [error, setError] = useState<Error | null>(null);
//   const [ws, setWs] = useState<WebSocket | null>(null);
//   const [isPollingActive, setIsPollingActive] = useState(false);

//   // Load cached data from sessionStorage on mount
//   useEffect(() => {
//     const loadCachedData = () => {
//       try {
//         const cachedMatches = sessionStorage.getItem(STORAGE_KEYS.MATCHES);
//         const cachedReplays = sessionStorage.getItem(STORAGE_KEYS.REPLAYS);
//         const cachedSports = sessionStorage.getItem(STORAGE_KEYS.SPORTS);
//         const matchesTimestamp = sessionStorage.getItem(
//           STORAGE_KEYS.MATCHES_TIMESTAMP
//         );
//         const replaysTimestamp = sessionStorage.getItem(
//           STORAGE_KEYS.REPLAYS_TIMESTAMP
//         );
//         const sportsTimestamp = sessionStorage.getItem(
//           STORAGE_KEYS.SPORTS_TIMESTAMP
//         );
//         const now = Date.now();

//         if (
//           cachedMatches &&
//           matchesTimestamp &&
//           now - parseInt(matchesTimestamp) < CACHE_TTL.MATCHES
//         ) {
//           setMatchData(JSON.parse(cachedMatches));
//         }
//         if (
//           cachedReplays &&
//           replaysTimestamp &&
//           now - parseInt(replaysTimestamp) < CACHE_TTL.REPLAYS
//         ) {
//           setReplayData(JSON.parse(cachedReplays));
//         }
//         if (
//           cachedSports &&
//           sportsTimestamp &&
//           now - parseInt(sportsTimestamp) < CACHE_TTL.SPORTS
//         ) {
//           setSportData(JSON.parse(cachedSports));
//         }

//         if (cachedMatches || cachedReplays || cachedSports) {
//           setIsDataLoaded(true);
//         }
//       } catch (err) {
//         console.error("Error loading cached data:", err);
//         setError(
//           err instanceof Error ? err : new Error("Failed to load cached data")
//         );
//       }
//     };

//     loadCachedData();
//   }, []);

//   // WebSocket setup with reconnect and fallback to polling
//   useEffect(() => {
//     let reconnectAttempts = 0;
//     const maxReconnectAttempts = 5;
//     const reconnectInterval = 5000;
//     const pollingInterval = 5 * 60 * 1000; // 5 minutes fallback polling
//     const pollingIntervalId = setInterval(() => {
//       // Sử dụng const thay let
//       if (isPollingActive && (!ws || ws.readyState !== 1)) {
//         console.log(
//           "Polling for updates at",
//           new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
//         );
//         mutate("/api/matches");
//         mutate("/api/replays");
//         mutate("/api/sports");
//       }
//     }, pollingInterval);

//     const connectWebSocket = () => {
//       const wsUrl =
//         process.env.NODE_ENV === "production"
//           ? "wss://sv.hoiquan.live/ws"
//           : "ws://localhost:8080/ws"; // Đảm bảo port là 8080
//       const websocket = new WebSocket(wsUrl);

//       websocket.onopen = () => {
//         console.log(
//           "WebSocket connected successfully at",
//           new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
//         );
//         reconnectAttempts = 0;
//         setIsPollingActive(false); // Tắt polling khi WebSocket kết nối
//         if (pollingIntervalId) clearInterval(pollingIntervalId); // Xóa polling nếu có
//       };

//       websocket.onmessage = (event: MessageEvent) => {
//         // Định nghĩa kiểu MessageEvent
//         const message = JSON.parse(event.data); // Truy cập event.data
//         console.log(
//           "Received WebSocket message at",
//           new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
//           message
//         );
//         if (message.type === "data_updated") {
//           if (message.endpoint === "/api/matches") {
//             mutate("/api/matches");
//           } else if (message.endpoint === "/api/replays") {
//             mutate("/api/replays");
//           } else if (message.endpoint === "/api/sports") {
//             mutate("/api/sports");
//           }
//         }
//       };

//       websocket.onerror = (error: Event) => {
//         // Định nghĩa kiểu Event
//         if (websocket.readyState < 2) {
//           console.error(
//             "WebSocket error at",
//             new Date().toLocaleString("en-US", {
//               timeZone: "Asia/Ho_Chi_Minh",
//             }),
//             (error as ErrorEvent).type, // Ép kiểu để lấy type
//             (error as ErrorEvent).message || "Unknown error" // Ép kiểu để lấy message
//           );
//         }
//       };

//       websocket.onclose = (event: CloseEvent) => {
//         // Định nghĩa kiểu CloseEvent
//         console.log(
//           "WebSocket disconnected at",
//           new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
//           "Code:",
//           event.code,
//           "Reason:",
//           event.reason
//         );
//         if (
//           reconnectAttempts < maxReconnectAttempts &&
//           websocket.readyState !== 1
//         ) {
//           setTimeout(() => {
//             reconnectAttempts++;
//             connectWebSocket();
//           }, reconnectInterval);
//         } else {
//           console.log(
//             "Max reconnect attempts reached, falling back to polling at",
//             new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
//           );
//           setIsPollingActive(true);
//         }
//       };

//       setWs(websocket);
//     };

//     connectWebSocket();

//     // Cleanup
//     return () => {
//       if (ws && ws.readyState < 2) {
//         ws.close(); // Đảm bảo đóng WebSocket nếu còn mở
//       }
//       if (pollingIntervalId) {
//         clearInterval(pollingIntervalId); // Xóa interval polling
//       }
//     };
//   }, []);

//   // Fetch data with ETag
//   const shouldFetchMatches =
//     !sessionStorage.getItem(STORAGE_KEYS.MATCHES) ||
//     (sessionStorage.getItem(STORAGE_KEYS.MATCHES_TIMESTAMP) &&
//       Date.now() -
//         parseInt(sessionStorage.getItem(STORAGE_KEYS.MATCHES_TIMESTAMP)!) >
//         CACHE_TTL.MATCHES);

//   const shouldFetchReplays =
//     !sessionStorage.getItem(STORAGE_KEYS.REPLAYS) ||
//     (sessionStorage.getItem(STORAGE_KEYS.REPLAYS_TIMESTAMP) &&
//       Date.now() -
//         parseInt(sessionStorage.getItem(STORAGE_KEYS.REPLAYS_TIMESTAMP)!) >
//         CACHE_TTL.REPLAYS);

//   const shouldFetchSports =
//     !sessionStorage.getItem(STORAGE_KEYS.SPORTS) ||
//     (sessionStorage.getItem(STORAGE_KEYS.SPORTS_TIMESTAMP) &&
//       Date.now() -
//         parseInt(sessionStorage.getItem(STORAGE_KEYS.SPORTS_TIMESTAMP)!) >
//         CACHE_TTL.SPORTS);

//   const {
//     data: matchesData,
//     error: matchError,
//     isLoading: matchLoading,
//   } = useSWR<{ data: Match[]; etag: string | null }>(
//     shouldFetchMatches ? "/api/matches" : null,
//     (url) => fetcher(url, STORAGE_KEYS.MATCHES_ETAG, STORAGE_KEYS.MATCHES),
//     {
//       revalidateOnMount: true,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: false,
//       dedupingInterval: 60000,
//       shouldRetryOnError: false,
//       refreshInterval: 0,
//     }
//   );

//   const {
//     data: replaysData,
//     error: replayError,
//     isLoading: replayLoading,
//   } = useSWR<{ data: Replay[]; etag: string | null }>(
//     shouldFetchReplays ? "/api/replays" : null,
//     (url) => fetcher(url, STORAGE_KEYS.REPLAYS_ETAG, STORAGE_KEYS.REPLAYS),
//     {
//       revalidateOnMount: true,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: false,
//       dedupingInterval: 60000,
//       shouldRetryOnError: false,
//       refreshInterval: 0,
//     }
//   );

//   const {
//     data: sportsData,
//     error: sportError,
//     isLoading: sportLoading,
//   } = useSWR<{ data: Sport[]; etag: string | null }>(
//     shouldFetchSports ? "/api/sports" : null,
//     (url) => fetcher(url, STORAGE_KEYS.SPORTS_ETAG, STORAGE_KEYS.SPORTS),
//     {
//       revalidateOnMount: true,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: false,
//       dedupingInterval: 60000,
//       shouldRetryOnError: false,
//       refreshInterval: 0,
//     }
//   );

//   // Update state and cache
//   useEffect(() => {
//     if (matchesData?.data) {
//       setMatchData(matchesData.data);
//       sessionStorage.setItem(
//         STORAGE_KEYS.MATCHES,
//         JSON.stringify(matchesData.data)
//       );
//       sessionStorage.setItem(
//         STORAGE_KEYS.MATCHES_TIMESTAMP,
//         Date.now().toString()
//       );
//     }
//     if (replaysData?.data) {
//       setReplayData(replaysData.data);
//       sessionStorage.setItem(
//         STORAGE_KEYS.REPLAYS,
//         JSON.stringify(replaysData.data)
//       );
//       sessionStorage.setItem(
//         STORAGE_KEYS.REPLAYS_TIMESTAMP,
//         Date.now().toString()
//       );
//     }
//     if (sportsData?.data) {
//       setSportData(sportsData.data);
//       sessionStorage.setItem(
//         STORAGE_KEYS.SPORTS,
//         JSON.stringify(sportsData.data)
//       );
//       sessionStorage.setItem(
//         STORAGE_KEYS.SPORTS_TIMESTAMP,
//         Date.now().toString()
//       );
//     }

//     if (
//       (matchesData?.data?.length ||
//         replaysData?.data?.length ||
//         sportsData?.data?.length) &&
//       !matchLoading &&
//       !replayLoading &&
//       !sportLoading
//     ) {
//       setIsDataLoaded(true);
//     }

//     if (matchError || replayError || sportError) {
//       setError(matchError || replayError || sportError);
//       setIsDataLoaded(true);
//     }
//   }, [
//     matchesData,
//     replaysData,
//     sportsData,
//     matchLoading,
//     replayLoading,
//     sportLoading,
//     matchError,
//     replayError,
//     sportError,
//   ]);

//   // Clear cache on logout
//   useEffect(() => {
//     const handleStorageChange = (e: StorageEvent) => {
//       if (e.key === "auth_token" && !e.newValue) {
//         sessionStorage.removeItem(STORAGE_KEYS.MATCHES);
//         sessionStorage.removeItem(STORAGE_KEYS.REPLAYS);
//         sessionStorage.removeItem(STORAGE_KEYS.SPORTS);
//         sessionStorage.removeItem(STORAGE_KEYS.MATCHES_ETAG);
//         sessionStorage.removeItem(STORAGE_KEYS.REPLAYS_ETAG);
//         sessionStorage.removeItem(STORAGE_KEYS.SPORTS_ETAG);
//         sessionStorage.removeItem(STORAGE_KEYS.MATCHES_TIMESTAMP);
//         sessionStorage.removeItem(STORAGE_KEYS.REPLAYS_TIMESTAMP);
//         sessionStorage.removeItem(STORAGE_KEYS.SPORTS_TIMESTAMP);
//         setMatchData([]);
//         setReplayData([]);
//         setSportData([]);
//         setIsDataLoaded(false);
//       }
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const fetchMatches = async () => {
//     try {
//       const { data } = await fetcher(
//         "/api/matches",
//         STORAGE_KEYS.MATCHES_ETAG,
//         STORAGE_KEYS.MATCHES
//       );
//       setMatchData(data || []);
//     } catch (err) {
//       setError(
//         err instanceof Error ? err : new Error("Failed to fetch matches")
//       );
//       console.error("Error fetching matches:", err);
//     }
//   };

//   const fetchReplays = async () => {
//     try {
//       const { data } = await fetcher(
//         "/api/replays",
//         STORAGE_KEYS.REPLAYS_ETAG,
//         STORAGE_KEYS.REPLAYS
//       );
//       setReplayData(data || []);
//     } catch (err) {
//       setError(
//         err instanceof Error ? err : new Error("Failed to fetch replays")
//       );
//       console.error("Error fetching replays:", err);
//     }
//   };

//   const fetchSports = async () => {
//     try {
//       const { data } = await fetcher(
//         "/api/sports",
//         STORAGE_KEYS.SPORTS_ETAG,
//         STORAGE_KEYS.SPORTS
//       );
//       setSportData(data || []);
//     } catch (err) {
//       setError(
//         err instanceof Error ? err : new Error("Failed to fetch sports")
//       );
//       console.error("Error fetching sports:", err);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       setIsDataLoaded(false);
//       setError(null);
//       await Promise.all([fetchMatches(), fetchReplays(), fetchSports()]);
//       setIsDataLoaded(true);
//     } catch (err) {
//       const error =
//         err instanceof Error ? err : new Error("Failed to fetch data");
//       setError(error);
//       setIsDataLoaded(true);
//       console.error("Error refreshing data:", error);
//     }
//   };

//   const loading =
//     !isDataLoaded && (matchLoading || replayLoading || sportLoading);

//   return (
//     <DataContext.Provider
//       value={{
//         matchData,
//         replayData,
//         sportData,
//         loading,
//         matchLoading,
//         replayLoading,
//         sportLoading,
//         fetchData,
//         fetchMatches,
//         fetchReplays,
//         fetchSports,
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
// import useSWR, { mutate } from "swr";
// import { createContext, useContext, useEffect, useState } from "react";
// import { Match } from "@/types/match.types";
// import { Replay } from "@/types/replay.types";
// import { Sport } from "@/types/sport.types";

// const production = "https://sv.hoiquan.live";
// const development = "http://localhost:8080";
// const API_BASE_URL =
//   process.env.NODE_ENV === "production" ? production : development;

// const fetcher = async (url: string) => {
//   const controller = new AbortController();
//   const timeoutId = setTimeout(() => controller.abort(), 10000);
//   try {
//     const fullUrl = `${API_BASE_URL}${url}`;
//     const res = await fetch(fullUrl, {
//       signal: controller.signal,
//       credentials: "include",
//     });
//     clearTimeout(timeoutId);
//     if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
//     return await res.json();
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
//   fetchMatches: () => Promise<void>;
//   fetchReplays: () => Promise<void>;
//   fetchSports: () => Promise<void>;
//   isDataLoaded: boolean;
//   error: Error | null;
// }

// const DataContext = createContext<DataContextType | undefined>(undefined);

// // Session storage keys
// const STORAGE_KEYS = {
//   MATCHES: "cached_matches",
//   REPLAYS: "cached_replays",
//   SPORTS: "cached_sports",
// };

// export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [matchData, setMatchData] = useState<Match[]>([]);
//   const [replayData, setReplayData] = useState<Replay[]>([]);
//   const [sportData, setSportData] = useState<Sport[]>([]);
//   const [isDataLoaded, setIsDataLoaded] = useState(false);
//   const [error, setError] = useState<Error | null>(null);

//   // Load cached data from sessionStorage on mount
//   useEffect(() => {
//     const loadCachedData = () => {
//       try {
//         const cachedMatches = sessionStorage.getItem(STORAGE_KEYS.MATCHES);
//         const cachedReplays = sessionStorage.getItem(STORAGE_KEYS.REPLAYS);
//         const cachedSports = sessionStorage.getItem(STORAGE_KEYS.SPORTS);

//         if (cachedMatches) {
//           setMatchData(JSON.parse(cachedMatches));
//         }
//         if (cachedReplays) {
//           setReplayData(JSON.parse(cachedReplays));
//         }
//         if (cachedSports) {
//           setSportData(JSON.parse(cachedSports));
//         }

//         if (cachedMatches || cachedReplays || cachedSports) {
//           setIsDataLoaded(true);
//         }
//       } catch (err) {
//         console.error("Error loading cached data:", err);
//         setError(
//           err instanceof Error ? err : new Error("Failed to load cached data")
//         );
//       }
//     };

//     loadCachedData();
//   }, []);

//   // Fetch data only if cache is empty
//   const {
//     data: matches = [],
//     error: matchError,
//     isLoading: matchLoading,
//   } = useSWR<Match[]>(
//     !sessionStorage.getItem(STORAGE_KEYS.MATCHES) ? "/api/matches" : null,
//     fetcher,
//     {
//       revalidateOnMount: true,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: false,
//       dedupingInterval: 60000,
//       shouldRetryOnError: false,
//       refreshInterval: 60000, // Làm mới mỗi 60 giây
//     }
//   );

//   const {
//     data: replays = [],
//     error: replayError,
//     isLoading: replayLoading,
//   } = useSWR<Replay[]>(
//     !sessionStorage.getItem(STORAGE_KEYS.REPLAYS) ? "/api/replays" : null,
//     fetcher,
//     {
//       revalidateOnMount: true,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: false,
//       dedupingInterval: 60000,
//       shouldRetryOnError: false,
//       refreshInterval: 60000, // Làm mới mỗi 60 giây
//     }
//   );

//   const {
//     data: sports = [],
//     error: sportError,
//     isLoading: sportLoading,
//   } = useSWR<Sport[]>(
//     !sessionStorage.getItem(STORAGE_KEYS.SPORTS) ? "/api/sports" : null,
//     fetcher,
//     {
//       revalidateOnMount: true,
//       revalidateOnFocus: false,
//       revalidateOnReconnect: false,
//       dedupingInterval: 60000,
//       shouldRetryOnError: false,
//       refreshInterval: 60000, // Làm mới mỗi 60 giây
//     }
//   );

//   // Update state and cache when new data is fetched
//   useEffect(() => {
//     if (matches.length) {
//       setMatchData(matches);
//       sessionStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
//     }
//     if (replays.length) {
//       setReplayData(replays);
//       sessionStorage.setItem(STORAGE_KEYS.REPLAYS, JSON.stringify(replays));
//     }
//     if (sports.length) {
//       setSportData(sports);
//       sessionStorage.setItem(STORAGE_KEYS.SPORTS, JSON.stringify(sports));
//     }

//     if (
//       (matches.length || replays.length || sports.length) &&
//       !matchLoading &&
//       !replayLoading &&
//       !sportLoading
//     ) {
//       setIsDataLoaded(true);
//     }

//     if (matchError || replayError || sportError) {
//       setError(matchError || replayError || sportError);
//       setIsDataLoaded(true);
//     }
//   }, [
//     matches,
//     replays,
//     sports,
//     matchLoading,
//     replayLoading,
//     sportLoading,
//     matchError,
//     replayError,
//     sportError,
//   ]);

//   const fetchMatches = async () => {
//     try {
//       const matchRes = await fetcher("/api/matches");
//       setMatchData(matchRes || []);
//       sessionStorage.setItem(
//         STORAGE_KEYS.MATCHES,
//         JSON.stringify(matchRes || [])
//       );
//     } catch (err) {
//       setError(
//         err instanceof Error ? err : new Error("Failed to fetch matches")
//       );
//       console.error("Error fetching matches:", err);
//     }
//   };

//   const fetchReplays = async () => {
//     try {
//       const replayRes = await fetcher("/api/replays");
//       setReplayData(replayRes || []);
//       sessionStorage.setItem(
//         STORAGE_KEYS.REPLAYS,
//         JSON.stringify(replayRes || [])
//       );
//     } catch (err) {
//       setError(
//         err instanceof Error ? err : new Error("Failed to fetch replays")
//       );
//       console.error("Error fetching replays:", err);
//     }
//   };

//   const fetchSports = async () => {
//     try {
//       const sportRes = await fetcher("/api/sports");
//       setSportData(sportRes || []);
//       sessionStorage.setItem(
//         STORAGE_KEYS.SPORTS,
//         JSON.stringify(sportRes || [])
//       );
//     } catch (err) {
//       setError(
//         err instanceof Error ? err : new Error("Failed to fetch sports")
//       );
//       console.error("Error fetching sports:", err);
//     }
//   };

//   const fetchData = async () => {
//     try {
//       setIsDataLoaded(false);
//       setError(null);

//       await Promise.all([fetchMatches(), fetchReplays(), fetchSports()]);

//       setIsDataLoaded(true);
//       // toast.success("Dữ liệu đã được làm mới");
//     } catch (err) {
//       const error =
//         err instanceof Error ? err : new Error("Failed to fetch data");
//       setError(error);
//       setIsDataLoaded(true);
//       // toast.error("Lỗi khi làm mới dữ liệu");
//       console.error("Error refreshing data:", error);
//     }
//   };

//   const loading =
//     !isDataLoaded && (matchLoading || replayLoading || sportLoading);

//   return (
//     <DataContext.Provider
//       value={{
//         matchData,
//         replayData,
//         sportData,
//         loading,
//         fetchData,
//         fetchMatches,
//         fetchReplays,
//         fetchSports,
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

// // import useSWR, { mutate } from "swr";
// // import { createContext, useContext, useEffect, useState } from "react";
// // import { Match } from "@/types/match.types";
// // import { Replay } from "@/types/replay.types";
// // import { Sport } from "@/types/sport.types";

// // const production = "https://sv.hoiquan.live";
// // const development = "http://localhost:8080";

// // const fetcher = async (url: string) => {
// //   const controller = new AbortController();
// //   const timeoutId = setTimeout(() => controller.abort(), 10000);
// //   try {
// //     const fullUrl = `${development}${url}`;
// //     const res = await fetch(fullUrl, {
// //       signal: controller.signal,
// //       credentials: "include",
// //     });
// //     clearTimeout(timeoutId);
// //     if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
// //     const data = await res.json();
// //     console.log(`Fetched data for ${url}:`, data);
// //     return data;
// //   } catch (error) {
// //     clearTimeout(timeoutId);
// //     throw error instanceof Error ? error : new Error("Unknown fetch error");
// //   }
// // };

// // interface DataContextType {
// //   matchData: Match[];
// //   replayData: Replay[];
// //   sportData: Sport[];
// //   loading: boolean;
// //   fetchData: () => Promise<void>;
// //   isDataLoaded: boolean;
// //   error: Error | null;
// // }

// // const DataContext = createContext<DataContextType | undefined>(undefined);

// // export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
// //   children,
// // }) => {
// //   const {
// //     data: matches = [],
// //     error: matchError,
// //     isLoading: matchLoading,
// //   } = useSWR<Match[]>("/api/matches", fetcher, {
// //     revalidateOnMount: true,
// //     revalidateOnFocus: false,
// //     revalidateOnReconnect: false,
// //     dedupingInterval: 60000,
// //     shouldRetryOnError: false,
// //   });

// //   const {
// //     data: replays = [],
// //     error: replayError,
// //     isLoading: replayLoading,
// //   } = useSWR<Replay[]>("/api/replays", fetcher, {
// //     revalidateOnMount: true,
// //     revalidateOnFocus: false,
// //     revalidateOnReconnect: false,
// //     dedupingInterval: 60000,
// //     shouldRetryOnError: false,
// //   });

// //   const {
// //     data: sports = [],
// //     error: sportError,
// //     isLoading: sportLoading,
// //   } = useSWR<Sport[]>("/api/sports", fetcher, {
// //     revalidateOnMount: true,
// //     revalidateOnFocus: false,
// //     revalidateOnReconnect: false,
// //     dedupingInterval: 60000,
// //     shouldRetryOnError: false,
// //   });

// //   const [isDataLoaded, setIsDataLoaded] = useState(false);
// //   const loading =
// //     !isDataLoaded && (matchLoading || replayLoading || sportLoading);
// //   const error = matchError || replayError || sportError;

// //   const fetchData = async () => {
// //     try {
// //       await Promise.all([
// //         mutate("/api/matches", undefined, { revalidate: true }),
// //         mutate("/api/replays", undefined, { revalidate: true }),
// //         mutate("/api/sports", undefined, { revalidate: true }),
// //       ]);
// //       setIsDataLoaded(true);
// //     } catch (err) {
// //       console.error("Error refreshing data:", err);
// //       setIsDataLoaded(true);
// //     }
// //   };

// //   useEffect(() => {
// //     if (
// //       !matchLoading &&
// //       !replayLoading &&
// //       !sportLoading &&
// //       (matches.length ||
// //         replays.length ||
// //         sports.length ||
// //         matchError ||
// //         replayError ||
// //         sportError)
// //     ) {
// //       setIsDataLoaded(true);
// //     }
// //     if (error) {
// //       console.error("API error:", error);
// //     }
// //   }, [
// //     matchLoading,
// //     replayLoading,
// //     sportLoading,
// //     matches,
// //     replays,
// //     sports,
// //     matchError,
// //     replayError,
// //     sportError,
// //     error,
// //   ]);

// //   return (
// //     <DataContext.Provider
// //       value={{
// //         matchData: matches,
// //         replayData: replays,
// //         sportData: sports,
// //         loading,
// //         fetchData,
// //         isDataLoaded,
// //         error,
// //       }}
// //     >
// //       {children}
// //     </DataContext.Provider>
// //   );
// // };

// // export const useData = () => {
// //   const context = useContext(DataContext);
// //   if (!context) {
// //     throw new Error("useData must be used within a DataProvider");
// //   }
// //   return context;
// // };
